import { useState } from "react";
import { Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { Link } from "react-router-dom";

interface Msg { id: string; from: "me" | "owner"; text: string; at: string; }

const Messages = () => {
  const { properties } = useProperties();

  const seedThreads = properties.slice(0, 4).map((p, i) => ({
  id: p.id,
  property: p,
  unread: i === 0 ? 2 : 0,
  preview: i === 0 ? "Yes, it's still available!" : "Thanks for your interest.",
  messages: [
    { id: "1", from: "me" as const, text: `Hi, is "${p.title}" still available?`, at: "10:24" },
    { id: "2", from: "owner" as const, text: i === 0 ? "Yes, it's still available!" : "Thanks for your interest.", at: "10:26" },
  ] as Msg[],
  }));

  const [activeId, setActiveId] = useState(seedThreads[0]?.id ?? "");
  const [threads, setThreads] = useState(seedThreads);
  const [draft, setDraft] = useState("");
  const active = threads.find((t) => t.id === activeId)!;

  const send = () => {
    if (!draft.trim()) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, messages: [...t.messages, { id: crypto.randomUUID(), from: "me", text: draft, at: "now" }] }
          : t,
      ),
    );
    setDraft("");
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 font-heading text-3xl font-bold">Messages</h1>
        <div className="grid gap-4 overflow-hidden rounded-2xl bg-card shadow-card md:grid-cols-[320px_1fr]">
          <aside className="border-r border-border md:max-h-[70vh] md:overflow-y-auto">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`flex w-full items-center gap-3 border-b border-border p-4 text-left transition hover:bg-muted ${
                  t.id === activeId ? "bg-accent/40" : ""
                }`}
              >
                <img src={t.property.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-sm">{t.property.owner.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.preview}</p>
                </div>
                {t.unread > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {t.unread}
                  </span>
                )}
              </button>
            ))}
          </aside>
          <section className="flex h-[70vh] flex-col">
            <Link
              to={`/property/${active.property.id}`}
              className="flex items-center gap-3 border-b border-border bg-gradient-soft p-4 transition hover:bg-muted"
            >
              <img src={active.property.images[0]} alt="" className="h-12 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{active.property.title}</p>
                <p className="text-xs text-muted-foreground">${active.property.price.toLocaleString()} · {active.property.location}</p>
              </div>
              <span className="text-sm font-semibold text-primary">View →</span>
            </Link>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {active.messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      m.from === "me"
                        ? "bg-gradient-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.text}
                    <div className={`mt-1 text-[10px] ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.at}</div>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" size="icon" className="rounded-xl"><Send className="h-4 w-4" /></Button>
            </form>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;