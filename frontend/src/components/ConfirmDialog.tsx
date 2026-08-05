import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 2, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary' }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} sx={{ color: 'text.secondary' }}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={destructive ? 'error' : 'primary'}
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
