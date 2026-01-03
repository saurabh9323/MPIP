from fastapi import APIRouter,Depends # type: ignore
from pydantic import BaseModel # type: ignore
from app.database.mysql import get_connection
from typing import Literal
from app.services.groq_service import generate_global_reply
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatMessage(BaseModel):
    user_id: str          # UUID
    session_id: str       # UUID (conversation)
    chat_type: Literal["GLOBAL", "SYSTEM"]
    message: str


@router.post("/message")
def send_message(data: ChatMessage, current_user=Depends(get_current_user)  ):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    user_id = current_user["user_id"]   # ✅ FROM JWT
    session_id = data.session_id
    chat_type = data.chat_type
    user_message = data.message

    # 1️⃣ Save user message
    cursor.execute(
        """
        INSERT INTO chat_history
        (user_id, session_id, chat_type, role, message)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (user_id, session_id, chat_type, "user", user_message)
    )

    # 2️⃣ Route AI by chat_type
    if chat_type == "GLOBAL":
        bot_reply = generate_global_reply(user_message)
    else:
        # SYSTEM chat (internal logic later)
        bot_reply = f"[SYSTEM] You said: {user_message}"

    # 3️⃣ Save assistant reply
    cursor.execute(
        """
        INSERT INTO chat_history
        (user_id, session_id, chat_type, role, message)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (user_id, session_id, chat_type, "assistant", bot_reply)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {
        "reply": bot_reply,
        "session_id": session_id,
        "chat_type": chat_type
    }


@router.get("/history/{session_id}")
def get_chat_history(
    session_id: str,
    current_user=Depends(get_current_user)
):
    user_id = current_user["user_id"]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT role, message, created_at
        FROM chat_history
        WHERE user_id = %s AND session_id = %s
        ORDER BY created_at ASC
        """,
        (user_id, session_id)
    )

    history = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "session_id": session_id,
        "history": history
    }

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT role, message, created_at
        FROM chat_history
        WHERE user_id = %s AND session_id = %s
        ORDER BY created_at ASC
        """,
        (user_id, session_id)
    )

    history = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "user_id": user_id,
        "session_id": session_id,
        "history": history
    }
