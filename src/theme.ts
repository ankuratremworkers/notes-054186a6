import { createTheme } from '@mui/material/styles';

// Clean, minimal, light. White background, one restrained accent, generous
// spacing. System font stack — no heavy chrome.
export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    primary: {
      main: '#111827', // near-black accent
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2563eb', // subtle blue for the rare colored accent
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: '#e5e7eb',
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
  },
});
