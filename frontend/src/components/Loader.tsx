import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({ label = "Loading..." }: { label?: string }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 6,
      gap: 1.5,
    }}
  >
    <CircularProgress size={28} color="secondary" />
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

export default Loader;
