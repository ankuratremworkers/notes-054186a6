"""Seed a few example notes so the app isn't empty on first load."""

from __future__ import annotations

from sqlalchemy import select

from app.db import SessionLocal
from app.models import Note

_SEED = [
    {
        "title": "Welcome 👋",
        "body": (
            "This is your shared notebook. Anyone with the link sees the same "
            "notes. Click a note to edit it, or press ‘New note’ to add one."
        ),
    },
    {
        "title": "Grocery list",
        "body": "• Milk\n• Bread\n• Coffee\n• Apples",
    },
    {
        "title": "Ideas",
        "body": "Weekend project: build a tiny notes app. ✅",
    },
]


def seed_if_empty() -> None:
    """Insert example notes only when the notes table is completely empty."""
    with SessionLocal() as db:
        existing = db.execute(select(Note.id).limit(1)).first()
        if existing is not None:
            return
        for row in _SEED:
            db.add(Note(title=row["title"], body=row["body"]))
        db.commit()
