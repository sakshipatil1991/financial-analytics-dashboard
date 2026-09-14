import { AppBar, Toolbar, Typography, Box, Button, Avatar } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user, logoutUser } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <AppBar position="sticky" color="inherit" sx={{ bgcolor: "background.paper" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6">Overview</Typography>
          <Typography variant="caption" color="text.secondary">
            Revenue, expenses, and transaction activity
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: 14 }}>
              {initials}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={logoutUser}
            size="small"
            startIcon={<LogoutRoundedIcon />}
            sx={{ color: "text.secondary" }}
          >
            Log out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
