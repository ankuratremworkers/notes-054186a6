import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import type { Note } from '../api';

interface Props {
  note: Note;
  onOpen: (id: number) => void;
  onDelete: (note: Note) => void;
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? '' : 's'} ago`;
  return d.toLocaleDateString();
}

export function NoteCard({ note, onOpen, onDelete }: Props) {
  const title = note.title.trim() || 'Untitled';
  const snippet = note.body.trim().split('\n')[0] || 'No content';

  return (
    <Paper
      role="button"
      tabIndex={0}
      onClick={() => onOpen(note.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(note.id);
        }
      }}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'border-color 120ms ease, background-color 120ms ease',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        '&:hover': {
          borderColor: 'text.primary',
          backgroundColor: 'grey.50',
          '& .note-card-delete': { opacity: 1 },
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1,
          }}
        >
          {snippet}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatRelative(note.updated_at)}
        </Typography>
      </Box>
      <IconButton
        aria-label="Delete note"
        className="note-card-delete"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note);
        }}
        sx={{
          opacity: 0,
          transition: 'opacity 120ms ease',
          color: 'text.secondary',
          '&:hover': { color: 'error.main' },
        }}
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}
