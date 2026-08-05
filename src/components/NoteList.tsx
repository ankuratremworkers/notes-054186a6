import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { Note } from '../api';

import { NoteCard } from './NoteCard';

interface Props {
  notes: Note[];
  loading: boolean;
  onNew: () => void;
  onOpen: (id: number) => void;
  onDelete: (note: Note) => void;
}

export function NoteList({ notes, loading, onNew, onOpen, onDelete }: Props) {
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 3, sm: 4 }, py: { xs: 4, sm: 6 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Typography variant="h4">Notes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onNew}
        >
          New note
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={28} />
        </Box>
      ) : notes.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No notes yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Create your first note to get started.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={onNew}>
            New note
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} onOpen={onOpen} onDelete={onDelete} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
