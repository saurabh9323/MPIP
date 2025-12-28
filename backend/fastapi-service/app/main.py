from fastapi import FastAPI
from app.routers import health

app = FastAPI(title="MPIP FastAPI Service")

app.include_router(health.router)
