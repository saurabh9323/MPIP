"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import ChatModal from "./chatbot";

export function ChatTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        Chat
      </Button>

      <ChatModal open={open} onOpenChange={setOpen} />
    </>
  );
}
