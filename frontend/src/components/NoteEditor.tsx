import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import type { Note } from '../api';

interface Props {
  initial?: Note | null; // undefined/null = new note
  saving: boolean;
  onSave: (input: { title: string; body: string }) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function NoteEditor({ initial, saving, onSave, onCancel, onDelete }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');

  useEffect(() => {
    setTitle(initial?.title ?? '');
    setBody(initial?.body ?? '');
  }, [initial]);

  const isNew = !initial;
  const canSave = title.trim().length > 0 || body.trim().length > 0;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 3, sm: 4 }, py: { xs: 4, sm: 6 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            aria-label="Back to notes"
            onClick={onCancel}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            {isNew ? 'New note' : 'Edit note'}
          </Typography>
        </Box>
        {!isNew && onDelete ? (
          <Button
            variant="text"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={onDelete}
            disabled={saving}
          >
            Delete
          </Button>
        ) : null}
      </Box>

      <TextField
        fullWidth
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="standard"
        InputProps={{ disableUnderline: true }}
        inputProps={{ 'aria-label': 'Note title', maxLength: 200 }}
        sx={{
          mb: 2,
          '& input': {
            fontSize: '1.6rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            padding: 0,
          },
        }}
      />

      <TextField
        fullWidth
        multiline
        minRows={12}
        placeholder="Start writing…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        variant="standard"
        InputProps={{ disableUnderline: true }}
        inputProps={{ 'aria-label': 'Note body' }}
        sx={{
          '& textarea': {
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'text.primary',
          },
        }}
      />

      <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave({ title, body })}
          disabled={!canSave || saving}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button
          variant="text"
          onClick={onCancel}
          disabled={saving}
          sx={{ color: 'text.secondary' }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
