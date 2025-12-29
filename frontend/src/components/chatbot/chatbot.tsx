"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { askChatbot } from "@/src/components/chatbot/chat.service";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function ChatModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hi 👋 How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------------- Auto scroll ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ---------------- Send message ---------------- */
  const sendMessage = async () => {
    if (!input.trim() || typing) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const reply = await askChatbot(userMsg.content);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "⚠️ Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
        </DialogHeader>

        {/* ================= Messages ================= */}
        <div className="flex-1 overflow-y-auto space-y-3 text-sm pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {typing && (
            <p className="text-muted-foreground text-xs">
              Assistant is typing…
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ================= Input ================= */}
        <div className="flex gap-2 mt-3">
          <Input
            placeholder="Ask anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />
          <Button onClick={sendMessage} disabled={typing}>
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
