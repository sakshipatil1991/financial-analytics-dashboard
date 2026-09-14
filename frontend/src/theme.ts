import { createTheme } from "@mui/material/styles";

// A deliberately non-default palette for this financial dashboard:
// deep ledger-navy sidebar, emerald for revenue/positive figures,
// muted rust for expenses/negative figures, cool neutral surfaces.
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#123A34", // deep ledger navy-teal
      contrastText: "#F4F7F5",
    },
    secondary: {
      main: "#1F9D6C", // emerald - revenue / positive
    },
    error: {
      main: "#C4573D", // muted rust - expenses / negative
    },
    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#16241F",
      secondary: "#5B6B66",
    },
    divider: "#E2E8E5",
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #E2E8E5",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #E2E8E5",
        },
      },
    },
  },
});
