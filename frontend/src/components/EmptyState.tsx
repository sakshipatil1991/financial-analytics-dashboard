import { Box, Typography } from "@mui/material";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";

const EmptyState = ({
  title = "No transactions found",
  description = "Try adjusting your search or filters.",
}: {
  title?: string;
  description?: string;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 6,
      color: "text.secondary",
    }}
  >
    <InboxRoundedIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
    <Typography variant="subtitle1" sx={{ color: "text.primary" }}>
      {title}
    </Typography>
    <Typography variant="body2">{description}</Typography>
  </Box>
);

export default EmptyState;
