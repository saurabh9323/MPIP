from dotenv import load_dotenv # type: ignore

load_dotenv()  # 👈 THIS LINE IS REQUIRED
from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from app.routers import health, chat
app = FastAPI(title="MPIP FastAPI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "FastAPI service running 🚀"}
