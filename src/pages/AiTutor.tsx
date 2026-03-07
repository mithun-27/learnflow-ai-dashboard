import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";

type Message = { role: "user" | "assistant"; content: string };

const initialMessages: Message[] = [
  { role: "assistant", content: "Hi! I'm your AI tutor. Ask me anything about the topic you're learning. I'll help explain concepts, provide examples, and guide your understanding." },
];

const mockResponses = [
  "Great question! Machine Learning is essentially teaching computers to learn from data. Instead of writing explicit rules, we provide data and let the algorithm find patterns.\n\nThink of it like teaching a child to recognize cats — you show them many pictures of cats, and eventually they learn to identify one on their own.",
  "Linear regression finds the best-fitting straight line through your data points. The formula is:\n\n**y = mx + b**\n\nWhere:\n- **y** is the predicted value\n- **m** is the slope (how much y changes per unit of x)\n- **b** is the y-intercept\n- **x** is the input feature",
  "Neural networks are inspired by the human brain. They consist of layers of interconnected nodes (neurons). Each connection has a weight that gets adjusted during training.\n\nThe key components:\n1. **Input layer** — receives the data\n2. **Hidden layers** — process the data\n3. **Output layer** — produces the result",
];

const AiTutor = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim() || typing) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const resp = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages(prev => [...prev, { role: "assistant", content: resp }]);
      setTyping(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="gradient-bg rounded-lg p-2 h-8 w-8 shrink-0 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="bg-muted rounded-lg p-2 h-8 w-8 shrink-0 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="gradient-bg rounded-lg p-2 h-8 w-8 shrink-0 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse-soft" />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 bg-card">
            <div className="flex gap-3 max-w-3xl mx-auto">
              <Input
                placeholder="Ask your AI tutor about this topic..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                className="flex-1"
              />
              <Button onClick={send} disabled={!input.trim() || typing} className="gradient-bg border-0 text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Context Panel */}
        <aside className="w-72 border-l border-border p-6 hidden lg:block bg-card">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Context</h3>
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Current Topic</span>
            </div>
            <p className="text-sm text-muted-foreground">Machine Learning</p>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Current Lesson</p>
              <p>What is Machine Learning?</p>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default AiTutor;
