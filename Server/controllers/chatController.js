const Groq = require("groq-sdk");
const Property = require("../models/Property");

// ──────────────────────────────────────────
// Groq client (lazy-initialised)
// ──────────────────────────────────────────
let groq = null;

function getGroq() {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

// ──────────────────────────────────────────
// Simple in-memory rate limiter for chat
// ──────────────────────────────────────────
const chatRateMap = new Map();
const CHAT_RATE_LIMIT = 15;
const CHAT_RATE_WINDOW = 60 * 1000;

function checkChatRateLimit(ip) {
  const now = Date.now();
  const entry = chatRateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    chatRateMap.set(ip, { count: 1, resetAt: now + CHAT_RATE_WINDOW });
    return true;
  }

  if (entry.count >= CHAT_RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// ──────────────────────────────────────────
// Helper: build a live snapshot of the DB
// ──────────────────────────────────────────
async function getPropertySnapshot() {
  try {
    const total = await Property.countDocuments({ status: "approved" });

    const byType = await Property.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const byLocation = await Property.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const priceRange = await Property.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$priceType",
          min: { $min: "$price" },
          max: { $max: "$price" },
          avg: { $avg: "$price" },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      total,
      types: byType.map((t) => `${t._id} (${t.count})`).join(", "),
      locations: byLocation.map((l) => `${l._id} (${l.count})`).join(", "),
      priceRanges: priceRange
        .map(
          (p) =>
            `${p._id}: ${p.min.toLocaleString()}-${p.max.toLocaleString()} EGP (${p.count} properties, avg ${Math.round(p.avg).toLocaleString()} EGP)`
        )
        .join(" | "),
    };
  } catch {
    return { total: 0, types: "unknown", locations: "unknown", priceRanges: "unknown" };
  }
}

// ──────────────────────────────────────────
// System prompt
// ──────────────────────────────────────────
function buildSystemPrompt(snapshot) {
  return `You are Makany AI — a smart, friendly real-estate assistant for the "Makany" platform in Egypt. You speak Arabic (Egyptian dialect) and English fluently.

## CURRENT INVENTORY (LIVE DATA):
- Total approved properties: ${snapshot.total}
- Types available: ${snapshot.types}
- Locations: ${snapshot.locations}
- Price ranges: ${snapshot.priceRanges}

## WHAT YOU CAN DO:
1. **Search properties** — Parse the user's request into filters and find matching properties from the database.
2. **Answer questions** — About the platform, how to list a property, how to contact owners, etc.
3. **Give advice** — Tips about areas in Egypt, what to look for when renting/buying, price expectations.
4. **Guide users** — Help them navigate the platform (e.g., "go to Add Property page to list yours").
5. **Suggest alternatives** — If no results match, suggest tweaking the search or nearby areas.

## RESPONSE FORMAT:
ALWAYS respond with valid JSON in this exact shape:
{
  "action": "search" | "info" | "greeting",
  "filters": { ... },
  "message": "Your helpful response here",
  "suggestions": ["suggestion 1", "suggestion 2"]
}

### action types:
- "search": User wants to find properties. Extract filters and search the DB.
- "info": User is asking a question, wants advice, or needs help. No DB search needed.
- "greeting": User is greeting you or chatting casually. No DB search needed.

### filters (ONLY when action = "search"):
- "type": one of "apartment", "villa", "studio", "penthouse", "house", "loft" (omit if not mentioned)
- "minPrice": minimum price as number (omit if not mentioned)
- "maxPrice": maximum price as number (omit if not mentioned)
- "bedrooms": minimum bedrooms as number (omit if not mentioned)
- "priceType": "rent" or "sale" (omit if not mentioned)
- "query": location/keyword search string (omit if not mentioned)

### suggestions:
- 2-3 short follow-up suggestions the user might want to try next.
- Always in the SAME LANGUAGE the user used.
- Examples: "شقق في الزمالك", "فلل للبيع", "Show me cheaper options"

## RULES:
1. Respond in the SAME LANGUAGE the user used (Arabic or English).
2. For Arabic, use Egyptian dialect (مصري).
3. "أوضة/أوض/غرفة/غرف" = bedrooms.
4. Currency = EGP. "ألف" or "k" = multiply by 1000. "مليون" = multiply by 1,000,000.
5. "إيجار/للإيجار" → priceType = "rent". "بيع/للبيع/شراء" → priceType = "sale".
6. When searching by location, use flexible matching — include English AND Arabic variations. For example "اكتوبر" should also match "October", "6 October". Add the most likely English equivalent to the query.
7. Be warm, helpful, and proactive. Don't just say "I found apartments" — describe what you found briefly.
8. If the user's search returned 0 results, be helpful: suggest modifications (different area, higher budget, different type).
9. Keep messages concise but useful (2-4 sentences max).
10. Do NOT include markdown, code fences, or extra text — ONLY the JSON object.
11. If you're not sure what the user wants, ASK a clarifying question. Don't guess wrong.

## PLATFORM INFO (for answering questions):
- Makany is a real estate platform for Egypt (rent & sale).
- Users can browse, search, and filter properties on the Properties page or Map page.
- To list a property: go to "Add Property" page (requires login).
- Users can save favorites, contact owners via enquiry forms.
- Properties must be approved by admin before appearing publicly.`;
}

// Fallback models
const FALLBACK_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];

// ──────────────────────────────────────────
// Helper: send message with fallback models
// ──────────────────────────────────────────
async function sendWithFallback(chatMessages, retries = 1) {
  const client = getGroq();
  let lastError = null;

  for (const modelName of FALLBACK_MODELS) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const completion = await client.chat.completions.create({
          model: modelName,
          messages: chatMessages,
          temperature: 0.3,
          max_tokens: 600,
          response_format: { type: "json_object" },
        });

        return completion.choices[0]?.message?.content?.trim() || "";
      } catch (err) {
        lastError = err;
        const status = err.status || err.statusCode || 0;

        if (status === 429 || status >= 500) {
          console.warn(
            `[Chat] ${modelName} attempt ${attempt + 1} failed (${status})`
          );
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, (attempt + 1) * 1000));
          }
          continue;
        }

        throw err;
      }
    }
    console.warn(`[Chat] All retries for ${modelName} exhausted, trying next...`);
  }

  throw lastError || new Error("All AI models are currently unavailable");
}

// ──────────────────────────────────────────
// Helper: build flexible search filter
// ──────────────────────────────────────────
function buildDbFilter(filters) {
  const dbFilter = { status: "approved" };

  if (filters.type) {
    dbFilter.type = filters.type;
  }

  if (filters.minPrice || filters.maxPrice) {
    dbFilter.price = {};
    if (filters.minPrice) dbFilter.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) dbFilter.price.$lte = Number(filters.maxPrice);
  }

  if (filters.bedrooms) {
    dbFilter.bedrooms = { $gte: Number(filters.bedrooms) };
  }

  if (filters.priceType) {
    dbFilter.priceType = filters.priceType;
  }

  // Handle both "query" and "location" — AI sometimes uses either
  const searchTerm = filters.query || filters.location;
  if (searchTerm) {
    const q = String(searchTerm).trim();
    const regex = new RegExp(q, "i");
    dbFilter.$or = [
      { title: regex },
      { location: regex },
      { description: regex },
    ];
  }

  return dbFilter;
}

// ──────────────────────────────────────────
// POST /api/chat/search
// ──────────────────────────────────────────
exports.chatSearch = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Rate limit
    const clientIp = req.ip || req.connection?.remoteAddress || "unknown";
    if (!checkChatRateLimit(clientIp)) {
      return res.status(429).json({
        error: "Too many chat requests",
        message: "استنى شوية قبل ما تبعت رسالة تانية. حاول تاني بعد دقيقة 🕐",
      });
    }

    // Get live DB snapshot for context
    const snapshot = await getPropertySnapshot();
    const systemPrompt = buildSystemPrompt(snapshot);

    // Build messages
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content: message.trim() },
    ];

    const responseText = await sendWithFallback(chatMessages);

    // Parse AI response
    let parsed;
    try {
      const cleaned = responseText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        action: "info",
        filters: {},
        message: responseText,
        suggestions: [],
      };
    }

    // Search properties if action is "search"
    let properties = [];
    if (parsed.action === "search" && Object.keys(parsed.filters || {}).length > 0) {
      const dbFilter = buildDbFilter(parsed.filters);
      properties = await Property.find(dbFilter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .limit(10);

      // If no results, try a broader search (remove type/bedroom filters)
      if (properties.length === 0 && parsed.filters.query) {
        const broadFilter = {
          status: "approved",
          $or: [
            { title: new RegExp(parsed.filters.query, "i") },
            { location: new RegExp(parsed.filters.query, "i") },
            { description: new RegExp(parsed.filters.query, "i") },
          ],
        };
        properties = await Property.find(broadFilter)
          .populate("owner", "name email")
          .sort({ createdAt: -1 })
          .limit(10);
      }
    }

    // Enhance message if search returned no results
    if (parsed.action === "search" && properties.length === 0 && !parsed.message.includes("مفيش") && !parsed.message.includes("no ")) {
      // Get all available locations for suggestion
      const availableLocations = await Property.distinct("location", { status: "approved" });
      const locationList = availableLocations.filter(l => l && l.length > 2).join("، ");
      
      if (locationList) {
        parsed.message += `\n\nللأسف مفيش نتايج مطابقة. الأماكن المتاحة حالياً: ${locationList}`;
      }
    }

    res.json({
      message: parsed.message,
      filters: parsed.filters || {},
      understood: parsed.action === "search",
      properties,
      count: properties.length,
      suggestions: parsed.suggestions || [],
    });
  } catch (err) {
    console.error("Chat error:", err.message);

    const msg = err.message || "";
    const isQuota = msg.includes("429") || msg.includes("rate");
    const isOverloaded = msg.includes("503") || msg.includes("overloaded");

    let userMessage = "عذراً، الخدمة غير متاحة حالياً. حاول تاني بعد شوية 🙏";
    let statusCode = 500;

    if (isQuota) {
      userMessage = "عذراً، تم الوصول للحد الأقصى. حاول تاني بعد شوية ⏳";
      statusCode = 429;
    } else if (isOverloaded) {
      userMessage = "السيرفر مشغول حالياً. حاول تاني بعد كام ثانية 🔄";
      statusCode = 503;
    }

    res.status(statusCode).json({
      error: "AI service error",
      message: userMessage,
    });
  }
};
