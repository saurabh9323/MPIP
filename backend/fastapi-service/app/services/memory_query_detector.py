MEMORY_QUESTIONS = [
    "what i love",
    "what do i love",
    "what i like",
    "what are my favorites",
    "tell me my preferences"
]

def is_memory_question(message: str) -> bool:
    msg = message.lower()
    return any(q in msg for q in MEMORY_QUESTIONS)
