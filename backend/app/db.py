"""Database engine + session for the notes app.

SQLite by default (file next to the backend). Honours ``DATABASE_URL`` if the
deploy target sets it. Kept intentionally small — one engine, one session
factory, one dependency.
"""

from __future__ import annotations

import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./notes.db")

# ``check_same_thread`` only matters for SQLite; harmless to guard on the URL.
_connect_args: dict[str, object] = (
    {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

engine = create_engine(DATABASE_URL, connect_args=_connect_args, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    """Declarative base for ORM models."""


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency: yields a session, closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
