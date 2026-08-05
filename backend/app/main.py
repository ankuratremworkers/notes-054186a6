"""FastAPI entry point. Deploy imports ``app.main:app`` — keep both names."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.routes import api_router
from app.seed import seed_if_empty

app = FastAPI(title=os.getenv("APP_NAME", "Notes"))

# Allowed origins come from the environment so the deployed app and local dev
# use the same code path. "*" only when nothing is configured (dev default).
_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _on_startup() -> None:
    # Create tables (idempotent) and seed a couple of example notes on first run.
    Base.metadata.create_all(bind=engine)
    seed_if_empty()


# The one place the /api prefix is applied. Route modules must not repeat it.
app.include_router(api_router, prefix="/api")
