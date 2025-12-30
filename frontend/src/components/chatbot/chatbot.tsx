/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Globe, Settings, Send, Loader2 } from "lucide-react";

import { sendChatMessage, fetchChatHistory } from "@/src/lib/chatApi";
import { getChatSessionId } from "../utils/chatSession";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

type ChatType = "GLOBAL" | "SYSTEM";

export default function ChatModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<ChatType>("GLOBAL");
  
  const [globalMessages, setGlobalMessages] = useState<Message[]>([]);
  const [systemMessages, setSystemMessages] = useState<Message[]>([]);
  
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  
  const [globalSessionId, setGlobalSessionId] = useState<string | null>(null);
  const [systemSessionId, setSystemSessionId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const userId = "u-123";

  const currentMessages = activeTab === "GLOBAL" ? globalMessages : systemMessages;
  const setCurrentMessages = activeTab === "GLOBAL" ? setGlobalMessages : setSystemMessages;
  const currentSessionId = activeTab === "GLOBAL" ? globalSessionId : systemSessionId;

  useEffect(() => {
    if (!open) return;

    const globalId = getChatSessionId("GLOBAL");
    const systemId = getChatSessionId("SYSTEM");
    
    setGlobalSessionId(globalId);
    setSystemSessionId(systemId);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const sessionId = activeTab === "GLOBAL" ? globalSessionId : systemSessionId;
    if (!sessionId) return;

    const messages = activeTab === "GLOBAL" ? globalMessages : systemMessages;
    
    if (messages.length > 0) return;

    fetchChatHistory(userId, sessionId)
      .then((res) => {
        const history = res.history || [];

        const formatted = history.map((h: any, i: number) => ({
          id: i + 1,
          role: h.role,
          content: h.message,
          timestamp: h.timestamp ? new Date(h.timestamp) : undefined,
        }));

        const initialMessages = formatted.length
          ? formatted
          : [
              {
                id: 1,
                role: "assistant",
                content: `Hi 👋 This is the ${activeTab === "GLOBAL" ? "Global" : "System"} chat. How can I help you?`,
              },
            ];

        if (activeTab === "GLOBAL") {
          setGlobalMessages(initialMessages);
        } else {
          setSystemMessages(initialMessages);
        }
      })
      .catch(() => {
        const fallbackMsg = [
          {
            id: 1,
            role: "assistant" as const,
            content: `Hi 👋 This is the ${activeTab === "GLOBAL" ? "Global" : "System"} chat. How can I help you?`,
          },
        ];

        if (activeTab === "GLOBAL") {
          setGlobalMessages(fallbackMsg);
        } else {
          setSystemMessages(fallbackMsg);
        }
      });
  }, [activeTab, globalSessionId, systemSessionId, open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);

    return () => clearTimeout(timer);
  }, [currentMessages, typing]);

  const sendMessage = async () => {
    if (!input.trim() || typing || !currentSessionId) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setCurrentMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await sendChatMessage({
        user_id: userId,
        session_id: currentSessionId,
        chat_type: activeTab,
        message: userMsg.content,
      });

      setCurrentMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: res.reply,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setCurrentMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "⚠️ Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => {
    if (activeTab === "GLOBAL") {
      setGlobalMessages([
        {
          id: 1,
          role: "assistant",
          content: "Hi 👋 This is the Global chat. How can I help you?",
        },
      ]);
    } else {
      setSystemMessages([
        {
          id: 1,
          role: "assistant",
          content: "Hi 👋 This is the System chat. How can I help you?",
        },
      ]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0 bg-background">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">AI Assistant</DialogTitle>
            <Button variant="ghost" size="sm" onClick={clearChat}>
              Clear Chat
            </Button>
          </div>
        </DialogHeader>

        {/* Tabs Container */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ChatType)}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          {/* Tab Headers */}
          <div className="px-6 pt-4 pb-3 shrink-0 bg-background border-b">
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="GLOBAL" className="gap-2">
                <Globe className="w-4 h-4" />
                Global Chat
                {globalMessages.length > 1 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {globalMessages.length - 1}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="SYSTEM" className="gap-2">
                <Settings className="w-4 h-4" />
                System Chat
                {systemMessages.length > 1 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {systemMessages.length - 1}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Global Chat Tab */}
          <TabsContent
            value="GLOBAL"
            className="flex-1 min-h-0 m-0 overflow-hidden data-[state=active]:animate-in data-[state=active]:fade-in-50"
          >
            <div className="h-full overflow-y-auto px-6 py-4 h-[500px]">
              <ChatMessages
                messages={globalMessages}
                typing={typing}
                bottomRef={bottomRef}
              />
            </div>
          </TabsContent>

          {/* System Chat Tab */}
          <TabsContent
            value="SYSTEM"
            className="flex-1 min-h-0 m-0 overflow-hidden data-[state=active]:animate-in data-[state=active]:fade-in-50"
          >
            <div className="h-full overflow-y-auto px-6 py-4 h-[500px]">
              <ChatMessages
                messages={systemMessages}
                typing={typing}
                bottomRef={bottomRef}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Input Area */}
        <div className="px-6 pb-6 pt-4 border-t bg-background shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder={`Ask anything in ${activeTab === "GLOBAL" ? "Global" : "System"} chat...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                disabled={typing}
                className="pr-10 h-11"
              />
              {typing && (
                <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              )}
            </div>
            <Button
              onClick={sendMessage}
              disabled={typing || !input.trim()}
              size="icon"
              className="shrink-0 h-11 w-11"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Chat Messages Component */
function ChatMessages({
  messages,
  typing,
  bottomRef,
}: {
  messages: Message[];
  typing: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="space-y-4 pb-2">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
              m.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words word-break">
              {m.content}
            </p>
            {m.timestamp && (
              <p className="text-xs opacity-70 mt-2 pt-1.5 border-t border-current/10">
                {m.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
      ))}

      {typing && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
