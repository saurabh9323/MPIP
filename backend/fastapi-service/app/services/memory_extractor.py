import re
from typing import Dict, List, Optional, Tuple


# =====================================================
# 1️⃣ INTENT PHRASES (POSITIVE + NEGATIVE)
# =====================================================

PREFERENCE_INTENTS = [
    "i like", "i love", "i enjoy", "i really like", "i really love",
    "i like to", "i love to",
    "i am into", "i’m into", "im into",
    "i am fond of", "i’m fond of",
    "i am obsessed with", "i’m obsessed with",
    "i am passionate about",
    "i am a fan of", "i’m a fan of",
    "i have interest in", "i have an interest in",
    "i prefer", "i usually prefer", "i mostly prefer",
    "i mostly like", "i mostly enjoy",
    "i care about", "i value",
    "i can’t live without",
    "i always choose",
    "i like watching", "i like listening to", "i like playing",
    "i love eating", "i love watching", "i love listening",
    "i’m interested in", "interested in",
    "my favorite", "my favourite", "my favorites",
    "my hobby is", "my hobbies are",
    "i spend time on", "i spend most time on",
]

NEGATIVE_INTENTS = [
    "i don't like", "i do not like", "i hate",
    "i dislike", "i avoid", "not into", "can't stand"
]


# =====================================================
# 2️⃣ GENERAL INFO / FACT INTENTS
# =====================================================

FACT_INTENTS = {
    "profession": ["i work as", "i am working as", "my job is", "i’m a", "i am a"],
    "organization": ["i work at", "my company is"],
    "location": ["i live in", "i stay in", "i am from"],
    "goal": ["i want to", "i plan to", "my goal is"],
    "habit": ["i usually", "i daily", "every day", "every morning"],
    "constraint": ["i am vegetarian", "i am vegan", "i can't", "i cannot"],
    "skill": ["i know", "i have experience in", "i am good at"],
}


# =====================================================
# 3️⃣ CATEGORY VOCABULARY
# =====================================================

CATEGORY_KEYWORDS: Dict[str, List[str]] = {
    "music": [
        "music", "song", "songs", "singer", "band", "playlist",
        "spotify", "pop", "rock", "rap", "classical", "lofi"
    ],
    "sports": [
        "cricket", "football", "gym", "workout", "running", "yoga"
    ],
    "tech": [
        "python", "fastapi", "node", "react", "nextjs",
        "postgres", "docker", "aws", "api", "backend", "frontend"
    ],
    "movies": [
        "movie", "series", "netflix", "anime", "action", "comedy"
    ],
    "food": [
        "food", "vegetarian", "vegan", "pizza", "biryani", "salad"
    ],
    "learning": [
        "dsa", "algorithms", "system design", "interview", "course"
    ],
    "gaming": [
        "game", "gaming", "bgmi", "pubg", "valorant", "chess"
    ],
}


# =====================================================
# 4️⃣ NORMALIZATION
# =====================================================

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# =====================================================
# 5️⃣ CORE EXTRACTION (BACKWARD COMPATIBLE)
# =====================================================

def extract_user_preference(
    message: str,
) -> Tuple[Optional[str], Optional[dict]]:
    """
    Returns:
      ("preferences", {...})
      ("fact", {...})
      OR (None, None)
    """

    if not message or len(message.strip()) < 5:
        return None, None

    msg = normalize(message)

    # -------------------------------------------------
    # 1️⃣ FACT DETECTION (GENERAL INFO)
    # -------------------------------------------------
    for fact_type, phrases in FACT_INTENTS.items():
        if any(p in msg for p in phrases):
            return "fact", {
                "raw_text": message,
                "fact_type": fact_type,
            }

    # -------------------------------------------------
    # 2️⃣ NEGATIVE PREFERENCES
    # -------------------------------------------------
    if any(intent in msg for intent in NEGATIVE_INTENTS):
        categories = [
            cat for cat, words in CATEGORY_KEYWORDS.items()
            if any(w in msg for w in words)
        ]
        return "preferences", {
            "raw_text": message,
            "type": "negative",
            "categories": categories,
            "confidence": 0.6,
        }

    # -------------------------------------------------
    # 3️⃣ POSITIVE PREFERENCES (YOUR ORIGINAL LOGIC)
    # -------------------------------------------------
    if not any(intent in msg for intent in PREFERENCE_INTENTS):
        return None, None

    matched_categories: List[str] = []
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(word in msg for word in keywords):
            matched_categories.append(category)

    if not matched_categories:
        return None, None

    confidence = min(1.0, 0.3 + 0.2 * len(matched_categories))

    return "preferences", {
        "raw_text": message,
        "type": "positive",
        "categories": matched_categories,
        "confidence": round(confidence, 3),
    }
