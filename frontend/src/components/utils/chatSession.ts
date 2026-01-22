import { v4 as uuidv4 } from "uuid";

const SESSION_KEY_MAP = {
  GLOBAL: "chat_global_session_id",
  SYSTEM: "chat_system_session_id",
} as const;

export function getChatSessionId(type: "GLOBAL" | "SYSTEM") {
  // ✅ Always safe (server + client)
  const generateId = () => uuidv4();

  if (typeof window === "undefined") {
    // Server-side (no localStorage)
    return generateId();
  }

  const key = SESSION_KEY_MAP[type];
  let sessionId = localStorage.getItem(key);

  if (!sessionId) {
    sessionId = generateId();
    localStorage.setItem(key, sessionId);
  }

  return sessionId;
}
