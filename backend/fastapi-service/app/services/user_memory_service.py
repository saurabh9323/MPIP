def get_user_memory(cursor, user_id):
    cursor.execute(
        """
        SELECT memory_key, value
        FROM user_memory
        WHERE user_id = %s
        """,
        (user_id,)
    )

    rows = cursor.fetchall()
    memory_instructions = []

    for row in rows:
        memory_key = str(row["memory_key"])
        value = str(row["value"])
        memory_instructions.append(
            f"User preference: {memory_key.replace('_', ' ')} = {value}"
        )

    return memory_instructions


def save_or_update_memory(cursor, user_id: str, memory_key: str, value: str):
    cursor.execute(
        """
        INSERT INTO user_memory (user_id, memory_key, value)
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id, memory_key)
        DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        """,
        (user_id, memory_key, value)
    )


def format_user_likes(cursor, user_id: str) -> str:
    cursor.execute(
        """
        SELECT value
        FROM user_memory
        WHERE user_id = %s
          AND memory_key LIKE 'favorite_%'
        """,
        (user_id,)
    )

    rows = cursor.fetchall()
    if not rows:
        return "I don’t have any preferences saved yet."

    response = "Here’s what you love:\n"
    for row in rows:
        response += f"• {row['value']}\n"

    return response
