import re
from typing import Dict, List, Optional, Tuple


# =====================================================
# 1️⃣ INTENT PHRASES (Natural Language Coverage)
# =====================================================

PREFERENCE_INTENTS = [
    # like / love
    "i like", "i love", "i enjoy", "i really like", "i really love",
    "i like to", "i love to", "i enjoy",
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


# =====================================================
# 2️⃣ CATEGORY VOCABULARY (700–1000+ EFFECTIVE TERMS)
# =====================================================

CATEGORY_KEYWORDS: Dict[str, List[str]] = {

    # 🎵 MUSIC
    "music": [
        "music", "song", "songs", "singer", "band", "album", "playlist",
        "spotify", "soundtrack", "lyrics", "melody", "beats",
        "pop", "rock", "rap", "hip hop", "classical", "jazz",
        "lofi", "edm", "electronic", "indie", "metal", "folk",
        "instrumental", "violin", "guitar", "piano", "drums",
        "bollywood songs", "english songs", "hindi songs",
        "arijit", "taylor swift", "eminem"
    ],

    # ⚽ SPORTS & FITNESS
    "sports": [
        "sport", "sports", "cricket", "football", "soccer", "basketball",
        "tennis", "badminton", "hockey", "volleyball",
        "ipl", "world cup", "champions league",
        "f1", "formula 1", "motogp", "wwe", "ufc",
        "gym", "workout", "fitness", "training",
        "running", "jogging", "cycling", "swimming",
        "yoga", "stretching", "calisthenics"
    ],

    # 💻 TECH / PROGRAMMING
    "tech": [
        "tech", "technology", "programming", "coding", "software",
        "developer", "engineer",
        "python", "java", "javascript", "typescript",
        "node", "nodejs", "express",
        "react", "nextjs", "vue", "angular",
        "html", "css", "tailwind",
        "fastapi", "django", "flask",
        "api", "backend", "frontend", "full stack",
        "database", "postgres", "mysql", "mongodb", "redis",
        "docker", "kubernetes", "devops",
        "aws", "azure", "gcp",
        "ai", "machine learning", "deep learning", "llm", "chatbot"
    ],

    # 🎬 MOVIES / SERIES
    "movies": [
        "movie", "movies", "film", "films",
        "series", "tv series", "web series", "show",
        "netflix", "prime", "hotstar", "hulu",
        "anime", "cartoon", "drama", "thriller",
        "action", "comedy", "romance", "horror",
        "hollywood", "bollywood", "tollywood",
        "marvel", "dc", "avengers", "batman"
    ],

    # 🍕 FOOD
    "food": [
        "food", "foods", "meal", "meals",
        "pizza", "burger", "biryani", "pasta",
        "noodles", "rice", "roti", "chapati",
        "paneer", "tofu", "dal", "sabzi",
        "vegetarian", "vegan", "salad",
        "street food", "junk food", "healthy food",
        "dessert", "sweet", "chocolate", "ice cream",
        "indian food", "italian food", "chinese food"
    ],

    # 🧘 LIFESTYLE / HEALTH
    "lifestyle": [
        "health", "healthy", "wellness",
        "routine", "habits", "discipline",
        "sleep", "early morning", "morning routine",
        "meditation", "mindfulness", "breathing",
        "self improvement", "productivity",
        "journaling", "reading", "writing",
        "focus", "consistency"
    ],

    # 📚 LEARNING / CAREER
    "learning": [
        "learning", "studying", "study",
        "course", "courses", "tutorial",
        "books", "reading books",
        "career", "job", "interview",
        "preparation", "practice",
        "dsa", "algorithms", "data structures",
        "system design"
    ],

    # 🎮 GAMES
    "gaming": [
        "game", "games", "gaming",
        "pc games", "mobile games",
        "bgmi", "pubg", "cod", "call of duty",
        "valorant", "csgo", "minecraft",
        "chess", "ludo"
    ],
}


# =====================================================
# 3️⃣ NORMALIZATION UTILITIES
# =====================================================

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# =====================================================
# 4️⃣ CORE EXTRACTION LOGIC
# =====================================================

def extract_user_preference(
    message: str,
) -> Tuple[Optional[str], Optional[dict]]:
    """
    Returns:
        ("preferences", structured_data) OR (None, None)
    """

    msg = normalize(message)

    # 1️⃣ intent detection
    if not any(intent in msg for intent in PREFERENCE_INTENTS):
        return None, None

    matched_categories: List[str] = []

    # 2️⃣ category detection
    for category, keywords in CATEGORY_KEYWORDS.items():
        for word in keywords:
            if word in msg:
                matched_categories.append(category)
                break

    if not matched_categories:
        return None, None

    # 3️⃣ structured memory output
    return "preferences", {
        "raw_text": message,
        "categories": matched_categories,
        "confidence": min(1.0, 0.3 + 0.2 * len(matched_categories)),
    }
