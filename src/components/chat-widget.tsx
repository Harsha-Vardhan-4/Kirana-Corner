import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { role: "user" | "bot"; text: string };

const replies = [
  "Yes, Aashirvaad Atta 5kg is available at ₹285. Would you like to add it to the cart?",
  "We have Parle-G, Britannia Good Day, and more biscuits in stock!",
  "Under ₹100 snacks: Lays Classic, Kurkure Masala Munch, Parle-G — want me to show all?",
  "We stock Lifebuoy, Dove and more. Tap 'Soaps' in categories to explore.",
  "Today's top offer: Up to 40% off on Summer Grocery Sale. Check the banner on home!",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm your shopping assistant. Ask me about products, offers or recipes." },
  ]);
  const send = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMsgs((m) => [...m, { role: "user", text: userText }]);
    setInput("");
    setTimeout(() => {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMsgs((m) => [...m, { role: "bot", text: reply }]);
    }, 600);
  };
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-hero text-primary-foreground shadow-soft hover:scale-105 transition-transform"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[480px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col rounded-2xl border bg-card shadow-soft animate-fade-in">
          <div className="flex items-center gap-2 border-b p-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-hero text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Shopping Assistant</div>
              <div className="text-[10px] text-muted-foreground">Powered by AI</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t p-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything…" onKeyDown={(e) => e.key === "Enter" && send()} />
            <Button size="icon" onClick={send}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
}
