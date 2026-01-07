const API_BASE = process.env.NEXT_PUBLIC_FASTAPI_URL;

export async function sendChatMessage(payload: {
  user_id: string;
  session_id: string;
  chat_type: "GLOBAL" | "SYSTEM";
  message: string;
}) {
  const res = await fetch(`${API_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}

export async function fetchChatHistory(
  userId: string,
  sessionId: string
) {
  const res = await fetch(
    `${API_BASE}/chat/history/${userId}/${sessionId}`
  );

  if (!res.ok) {
    throw new Error("Failed to load history");
  }

  return res.json();
}
