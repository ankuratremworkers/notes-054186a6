import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { useCallback, useEffect, useState } from 'react';

import { notesApi, type Note } from './api';
import { ConfirmDialog } from './components/ConfirmDialog';
import { NoteEditor } from './components/NoteEditor';
import { NoteList } from './components/NoteList';

type View =
  | { kind: 'list' }
  | { kind: 'new' }
  | { kind: 'edit'; note: Note };

export function App() {
  const [view, setView] = useState<View>({ kind: 'list' });
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notesApi.list();
      setNotes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const handleSave = async (input: { title: string; body: string }) => {
    setSaving(true);
    try {
      if (view.kind === 'new') {
        await notesApi.create(input);
      } else if (view.kind === 'edit') {
        await notesApi.update(view.note.id, input);
      }
      await reload();
      setView({ kind: 'list' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await notesApi.remove(target.id);
      // If we were editing this note, return to the list.
      if (view.kind === 'edit' && view.note.id === target.id) {
        setView({ kind: 'list' });
      }
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete note');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {view.kind === 'list' ? (
        <NoteList
          notes={notes}
          loading={loading}
          onNew={() => setView({ kind: 'new' })}
          onOpen={(id) => {
            const note = notes.find((n) => n.id === id);
            if (note) setView({ kind: 'edit', note });
          }}
          onDelete={(note) => setPendingDelete(note)}
        />
      ) : view.kind === 'new' ? (
        <NoteEditor
          initial={null}
          saving={saving}
          onSave={handleSave}
          onCancel={() => setView({ kind: 'list' })}
        />
      ) : (
        <NoteEditor
          initial={view.note}
          saving={saving}
          onSave={handleSave}
          onCancel={() => setView({ kind: 'list' })}
          onDelete={() => setPendingDelete(view.note)}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this note?"
        message={
          pendingDelete
            ? `“${(pendingDelete.title.trim() || 'Untitled')}” will be permanently removed.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <Snackbar
        open={error !== null}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
