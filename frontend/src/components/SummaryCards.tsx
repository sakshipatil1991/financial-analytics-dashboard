import { Grid, Paper, Typography, Box } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { DashboardSummary } from "../types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

interface CardDef {
  label: string;
  value: string;
  icon: JSX.Element;
  accent: string;
}

const SummaryCards = ({ summary }: { summary: DashboardSummary }) => {
  const cards: CardDef[] = [
    {
      label: "Total revenue",
      value: formatCurrency(summary.totalRevenue),
      icon: <TrendingUpRoundedIcon />,
      accent: "#1F9D6C",
    },
    {
      label: "Total expenses",
      value: formatCurrency(summary.totalExpenses),
      icon: <TrendingDownRoundedIcon />,
      accent: "#C4573D",
    },
    {
      label: "Net balance",
      value: formatCurrency(summary.netBalance),
      icon: <AccountBalanceWalletRoundedIcon />,
      accent: "#123A34",
    },
    {
      label: "Transactions",
      value: `${summary.totalTransactions} total`,
      icon: <ReceiptLongRoundedIcon />,
      accent: "#5B6B66",
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Paper sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: `${card.accent}1A`,
                color: card.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              {card.icon}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {card.label}
            </Typography>
            <Typography variant="h5" className="stat-figure" sx={{ mt: 0.5 }}>
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
          <Typography variant="caption" color="text.secondary">
            Paid vs pending
          </Typography>
          <Box sx={{ display: "flex", gap: 3, mt: 1.5 }}>
            <Box>
              <Typography variant="h6" className="stat-figure" sx={{ color: "#1F9D6C" }}>
                {summary.paidTransactions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Paid
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" className="stat-figure" sx={{ color: "#C4573D" }}>
                {summary.pendingTransactions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
