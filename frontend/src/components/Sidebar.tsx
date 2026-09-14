import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

const SIDEBAR_WIDTH = 240;

// A simple, single-page sidebar. Only "Overview" is a real destination
// today, but it's structured so more pages could be added later.
const Sidebar = () => {
  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        bgcolor: "primary.main",
        color: "#EAF1EE",
        height: "100vh",
        position: "sticky",
        top: 0,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        py: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, mb: 4 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            bgcolor: "secondary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InsightsRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }}>
          Ledgerline
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        <ListItemButton
          selected
          sx={{
            borderRadius: 2,
            mb: 0.5,
            "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          <ListItemIcon sx={{ color: "#EAF1EE", minWidth: 36 }}>
            <SpaceDashboardRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItemButton>

        <ListItemButton
          sx={{ borderRadius: 2, mb: 0.5, opacity: 0.6, cursor: "default" }}
          disableRipple
        >
          <ListItemIcon sx={{ color: "#EAF1EE", minWidth: 36 }}>
            <ReceiptLongRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItemButton>
      </List>

      <Box sx={{ mt: "auto", px: 3 }}>
        <Typography variant="caption" sx={{ color: "rgba(234,241,238,0.6)" }}>
          Assignment project — not for production use
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
