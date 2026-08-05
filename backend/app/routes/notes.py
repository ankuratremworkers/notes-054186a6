"""Notes CRUD routes — the whole app's API surface (plus /health)."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Note
from app.schemas import NoteCreate, NoteOut, NoteUpdate

router = APIRouter()


@router.get("/notes", response_model=list[NoteOut])
def list_notes(db: Session = Depends(get_db)) -> list[Note]:
    stmt = select(Note).order_by(Note.updated_at.desc(), Note.id.desc())
    return list(db.execute(stmt).scalars().all())


@router.post("/notes", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(payload: NoteCreate, db: Session = Depends(get_db)) -> Note:
    note = Note(title=payload.title, body=payload.body)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/notes/{note_id}", response_model=NoteOut)
def get_note(note_id: int, db: Session = Depends(get_db)) -> Note:
    note = db.get(Note, note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put("/notes/{note_id}", response_model=NoteOut)
def update_note(
    note_id: int, payload: NoteUpdate, db: Session = Depends(get_db)
) -> Note:
    note = db.get(Note, note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    note.title = payload.title
    note.body = payload.body
    # Force-bump updated_at even if content is unchanged, so the list re-sorts.
    note.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db)) -> None:
    note = db.get(Note, note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
