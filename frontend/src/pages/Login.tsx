import { useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { useAuth } from "../hooks/useAuth";
import * as authService from "../services/authService";

const Login = () => {
  const { isAuthenticated, loginUser } = useAuth();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("Demo@1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      loginUser(response.user, response.token);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Could not log in. Check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "primary.main",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{ maxWidth: 400, width: "100%", p: 4, borderRadius: 3 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "secondary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InsightsRoundedIcon sx={{ color: "#fff" }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              Ledgerline
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Financial Analytics Dashboard
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sign in to view your transactions and reports.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            disabled={loading}
            sx={{ mt: 2, py: 1.2 }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Log in"}
          </Button>
        </form>

        <Alert severity="info" sx={{ mt: 3 }}>
          Demo login: <strong>demo@example.com</strong> / <strong>Demo@1234</strong>
          <br />
          (created by running the backend seed script)
        </Alert>
      </Paper>
    </Box>
  );
};

export default Login;
