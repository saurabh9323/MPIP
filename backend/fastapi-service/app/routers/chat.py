from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.database.postgres import get_connection, release_connection
from app.dependencies.auth import get_current_user
from app.services.groq_service import generate_global_reply
from app.services.user_memory_service import (
    get_user_memory,
    save_or_update_memory,
    format_user_likes,
)
from app.services.memory_extractor import extract_user_preference
from app.services.memory_query_detector import is_memory_question
from app.core.system_guard import SYSTEM_GUARD


router = APIRouter(prefix="/chat", tags=["Chat"])


# -----------------------------
# Request Model
# -----------------------------
class ChatMessage(BaseModel):
    session_id: str
    message: str


# -----------------------------
# Ensure chat session exists
# -----------------------------
def ensure_chat_session(cursor, session_id: str, user_id: int):
    cursor.execute(
        """
        INSERT INTO chat_sessions (id, user_id)
        VALUES (%s, %s)
        ON CONFLICT (id) DO NOTHING
        """,
        (session_id, user_id),
    )


# -----------------------------
# Build AI prompt
# -----------------------------
def build_prompt(messages):
    parts = []
    for m in messages:
        role = m.get("role")
        content = m.get("content")
        if isinstance(role, str) and isinstance(content, str):
            parts.append(f"{role.upper()}: {content}")
    return "\n".join(parts)


# -----------------------------
# Send Message
# -----------------------------
@router.post("/message")
def send_message(
    data: ChatMessage,
    current_user=Depends(get_current_user),
):
    conn = None
    cursor = None

    try:
        user_id = int(current_user["user_id"])

        # =====================================================
        # PHASE 1 — USER MESSAGE (DB)
        # =====================================================
        conn = get_connection()
        cursor = conn.cursor()

        # Ensure session exists
        ensure_chat_session(cursor, data.session_id, user_id)

        # Save user message
        cursor.execute(
            """
            INSERT INTO chat_messages (session_id, sender, message)
            VALUES (%s, %s, %s)
            """,
            (data.session_id, "user", data.message),
        )

        # ✅ COMMIT session + user message
        conn.commit()

        # -----------------------------
        # MEMORY QUESTION (FAST RETURN)
        # -----------------------------
        if is_memory_question(data.message):
            bot_reply = format_user_likes(cursor, user_id)

            cursor.execute(
                """
                INSERT INTO chat_messages (session_id, sender, message)
                VALUES (%s, %s, %s)
                """,
                (data.session_id, "assistant", bot_reply),
            )

            conn.commit()
            return {"reply": bot_reply}

        # -----------------------------
        # LOAD USER MEMORY
        # -----------------------------
        user_memory = get_user_memory(cursor, user_id)

        cursor.close()
        release_connection(conn)
        conn = None
        cursor = None

        # =====================================================
        # PHASE 2 — AI (NO DB)
        # =====================================================
        messages = [{"role": "system", "content": SYSTEM_GUARD}]

        for mem in user_memory:
            messages.append({"role": "system", "content": mem})

        messages.append({"role": "user", "content": data.message})

        prompt = build_prompt(messages)
        bot_reply = generate_global_reply(prompt)

        # =====================================================
        # PHASE 3 — ASSISTANT MESSAGE + MEMORY (DB)
        # =====================================================
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO chat_messages (session_id, sender, message)
            VALUES (%s, %s, %s)
            """,
            (data.session_id, "assistant", bot_reply),
        )

        memory_key, memory_value = extract_user_preference(data.message)
        if memory_key and memory_value:
            save_or_update_memory(cursor, user_id, memory_key, memory_value)

        conn.commit()
        return {"reply": bot_reply}

    except Exception as e:
        if conn:
            conn.rollback()
        print("❌ CHAT ERROR:", repr(e))
        raise HTTPException(status_code=500, detail="Chat failed")

    finally:
        if cursor:
            cursor.close()
        if conn:
            release_connection(conn)


# -----------------------------
# Get Chat History
# -----------------------------
@router.get("/history/{session_id}")
def get_chat_history(
    session_id: str,
    current_user=Depends(get_current_user),
):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT sender, message, created_at
            FROM chat_messages
            WHERE session_id = %s
            ORDER BY created_at ASC
            """,
            (session_id,),
        )

        return {
            "session_id": session_id,
            "history": cursor.fetchall(),
        }

    finally:
        cursor.close()
        release_connection(conn)
