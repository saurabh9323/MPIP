"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";

type Message = {
  id: number;
  role: "user" | "bot";
  content: string;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      content: "Hi 👋 How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ------------------ Auto Scroll ------------------ */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ------------------ Send Message ------------------ */
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    // Dummy bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          content:
            "This is a dummy response 🤖. Later I’ll be connected to real AI.",
        },
      ]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Chatbot
        </h1>
        <Badge variant="secondary">Online</Badge>
      </div>

      {/* ================= CHAT AREA ================= */}
      <Card className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {typing && (
          <div className="text-sm text-muted-foreground">
            Bot is typing…
          </div>
        )}

        <div ref={bottomRef} />
      </Card>

      {/* ================= INPUT ================= */}
      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
}
