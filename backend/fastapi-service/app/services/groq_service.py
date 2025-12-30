import os
from groq import Groq # type: ignore

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_global_reply(message: str) -> str:
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": message
            }
        ],
    )

    return completion.choices[0].message.content
