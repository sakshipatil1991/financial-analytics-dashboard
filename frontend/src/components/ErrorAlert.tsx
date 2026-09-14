import { Snackbar, Alert } from "@mui/material";

interface Props {
  message: string;
  onClose: () => void;
}

// A simple snackbar for surfacing API/network errors without blocking the UI.
const ErrorAlert = ({ message, onClose }: Props) => (
  <Snackbar
    open={Boolean(message)}
    autoHideDuration={5000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert onClose={onClose} severity="error" variant="filled" sx={{ maxWidth: 380 }}>
      {message}
    </Alert>
  </Snackbar>
);

export default ErrorAlert;
