import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ArrowRight,
  Minimize2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { chatService, type ChatMessage } from "@/services/chatService";
import type { ApiProperty } from "@/services/propertyService";

/* ─── Mini Property Card ──────────────────────────────────────── */
function MiniPropertyCard({ property }: { property: ApiProperty }) {
  const image =
    property.images?.[0] && property.images[0] !== "/placeholder.svg"
      ? property.images[0]
      : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop";

  return (
    <Link
      to={`/property/${property._id}`}
      className="group flex gap-3 rounded-xl border border-border/60 bg-background/80 p-2.5 transition-all duration-200 hover:border-primary/40 hover:shadow-sm"
    >
      <img
        src={image}
        alt={property.title}
        className="h-16 w-16 shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
          {property.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{property.location || "Egypt"}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-primary">
            ${property.price?.toLocaleString()}
            {property.priceType === "rent" && (
              <span className="text-[10px] font-normal text-muted-foreground">
                /mo
              </span>
            )}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Bed className="h-3 w-3" />
              {property.bedrooms}
            </span>
            <span className="flex items-center gap-0.5">
              <Bath className="h-3 w-3" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-0.5">
              <Maximize className="h-3 w-3" />
              {property.area}m²
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Chat Message Bubble ──────────────────────────────────────── */
function MessageBubble({
  msg,
  properties,
}: {
  msg: ChatMessage & { properties?: ApiProperty[] };
  properties?: ApiProperty[];
}) {
  const isUser = msg.role === "user";
  const props = properties || msg.properties || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-[0_2px_8px_hsl(250_80%_55%_/_0.3)]"
        }`}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Content */}
      <div
        className={`max-w-[85%] space-y-2 rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-md bg-primary text-primary-foreground"
            : "rounded-tl-md border border-border/60 bg-card text-foreground shadow-sm"
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.content}</p>

        {/* Property results */}
        {props.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {props.length} {props.length === 1 ? "result" : "results"} found
            </p>
            {props.slice(0, 5).map((p) => (
              <MiniPropertyCard key={p._id} property={p} />
            ))}
            {props.length > 5 && (
              <Link
                to="/properties"
                className="flex items-center justify-center gap-1 rounded-lg border border-primary/30 bg-primary/5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                View all {props.length} results
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Suggestion Chips ──────────────────────────────────────── */
const suggestions = [
  "شقة 3 أوض في المعادي إيجار",
  "Villa for sale",
  "Studio near downtown",
  "شقة أقل من 10000",
];

/* ─── Main Chat Widget ──────────────────────────────────────── */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    (ChatMessage & { properties?: ApiProperty[]; suggestions?: string[] })[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage & { properties?: ApiProperty[]; suggestions?: string[] } = {
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Build history for context (last 10 messages)
      const history = [...messages, userMsg].slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await chatService.search(text.trim(), history);

      const assistantMsg: ChatMessage & { properties?: ApiProperty[]; suggestions?: string[] } = {
        role: "assistant",
        content: response.message,
        properties: response.properties || [],
        suggestions: response.suggestions || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      // Extract message from API error response if available
      let errorMsg = "عذراً، حصل مشكلة. حاول تاني بعد شوية 🙏";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          errorMsg = axiosErr.response.data.message;
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: errorMsg,
          properties: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* ── Floating Button ────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-[0_8px_30px_hsl(250_80%_55%_/_0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_40px_hsl(250_80%_55%_/_0.5)]"
            aria-label="Open AI Search Assistant"
          >
            <MessageCircle className="h-6 w-6" />

            {/* Pulse ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-violet-500/30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[0_20px_60px_-10px_hsl(250_50%_30%_/_0.3),_0_0_0_1px_hsl(250_50%_50%_/_0.05)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Makany AI
                  </h3>
                  <p className="text-[11px] text-white/70">
                    Smart Property Search
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/25 hover:text-white"
                aria-label="Close chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-4"
            >
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-[0_2px_8px_hsl(250_80%_55%_/_0.3)]">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-border/60 bg-card px-4 py-2.5 text-sm leading-relaxed text-foreground shadow-sm">
                      <p>
                        مرحباً! 👋 أنا <strong>Makany AI</strong>
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        اكتبلي اللي بتدور عليه وهلاقيهولك فوراً. جرب حاجة زي:
                      </p>
                    </div>
                  </div>

                  {/* Suggestion chips */}
                  <div className="flex flex-wrap gap-2 pl-9">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Chat messages */}
              {messages.map((msg, i) => (
                <div key={i}>
                  <MessageBubble msg={msg} />
                  {/* Suggestion chips after the last assistant message */}
                  {msg.role === "assistant" &&
                    msg.suggestions &&
                    msg.suggestions.length > 0 &&
                    i === messages.length - 1 &&
                    !loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 flex flex-wrap gap-1.5 pl-9"
                      >
                        {msg.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-medium text-violet-700 transition-all duration-200 hover:border-violet-400 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/50"
                          >
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-border/60 bg-card px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                    <span className="text-xs text-muted-foreground">
                      بدور ليك...
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border/60 bg-card/80 px-3 py-2.5 backdrop-blur-sm"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب اللي بتدور عليه..."
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
                dir="auto"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-40 disabled:shadow-none"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
