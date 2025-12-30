
const SESSION_KEY_MAP = {
  GLOBAL: "chat_global_session_id",
  SYSTEM: "chat_system_session_id",
} as const;

export function getChatSessionId(type: "GLOBAL" | "SYSTEM") {
  if (typeof window === "undefined") {
    // Server-side fallback (no localStorage)
    return crypto.randomUUID();
  }

  const key = SESSION_KEY_MAP[type];
  let sessionId = localStorage.getItem(key);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }

  return sessionId;
}