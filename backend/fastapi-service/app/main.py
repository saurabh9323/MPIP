from dotenv import load_dotenv  # type: ignore
load_dotenv()  # 👈 REQUIRED before reading env vars

from fastapi import FastAPI  # type: ignore
from app.routers import health, chat
from app.database.postgres import init_db_pool

app = FastAPI(title="MPIP FastAPI Service")



# Routers
app.include_router(health.router)
app.include_router(chat.router)



@app.get("/")
def root():
    return {"message": "FastAPI service running 🚀"}


# ✅ CORRECT EVENT NAME
@app.on_event("startup")
def startup_event():
    init_db_pool()
