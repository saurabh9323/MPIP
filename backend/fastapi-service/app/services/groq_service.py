import os
from groq import Groq  # type: ignore

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_global_reply(message: str) -> str:
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": message},
            ],
        )

        if not completion or not completion.choices:
            return "⚠️ AI returned no response."

        choice = completion.choices[0]
        if not choice.message or not choice.message.content:
            return "⚠️ AI response was empty."

        return choice.message.content

    except Exception as e:
        print("🔥 GROQ ERROR:", repr(e))
        return "⚠️ AI service temporarily unavailable."
