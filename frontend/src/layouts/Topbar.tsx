"use client";

import { Button } from "@/src/components/ui/button";
import { ThemeToggle } from "@/src/components/theme/theme-toggle";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/api";

export default function Topbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      router.replace("/login"); // 🔥 important
    }
  };

  return (
    <header className="h-14 border-b bg-background px-6 flex items-center justify-between">
      {/* Left */}
      <span className="text-sm text-muted-foreground">
        Dashboard
      </span>

      {/* Right */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
