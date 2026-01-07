from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Literal
from app.database.postgres import get_connection, release_connection
from app.dependencies.auth import get_current_user
from app.services.groq_service import generate_global_reply

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatMessage(BaseModel):
    session_id: str
    chat_type: Literal["GLOBAL", "SYSTEM"]
    message: str


@router.post("/message")
def send_message(
    data: ChatMessage,
    current_user=Depends(get_current_user)
):
    conn = get_connection()
    try:
        cursor = conn.cursor()

        user_id = current_user["user_id"]

        # Save user message
        cursor.execute(
            """
            INSERT INTO chat_history
            (user_id, session_id, chat_type, role, message)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (user_id, data.session_id, data.chat_type, "user", data.message)
        )

        # Generate reply
        if data.chat_type == "GLOBAL":
            bot_reply = generate_global_reply(data.message)
        else:
            bot_reply = f"[SYSTEM] You said: {data.message}"

        # Save assistant reply
        cursor.execute(
            """
            INSERT INTO chat_history
            (user_id, session_id, chat_type, role, message)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (user_id, data.session_id, data.chat_type, "assistant", bot_reply)
        )

        conn.commit()

        return {
            "reply": bot_reply,
            "session_id": data.session_id,
            "chat_type": data.chat_type,
        }

    except Exception as e:
        conn.rollback()
        print("❌ Chat error:", e)
        raise HTTPException(status_code=500, detail="Failed to send message")

    finally:
        cursor.close()
        release_connection(conn)


@router.get("/history/{session_id}")
def get_chat_history(
    session_id: str,
    current_user=Depends(get_current_user)
):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT role, message, created_at
            FROM chat_history
            WHERE user_id = %s AND session_id = %s
            ORDER BY created_at ASC
            """,
            (current_user["user_id"], session_id)
        )

        return {
            "session_id": session_id,
            "history": cursor.fetchall(),
        }

    finally:
        cursor.close()
        release_connection(conn)
