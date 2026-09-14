import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendPoint } from "../types";
import EmptyState from "./EmptyState";

const TrendChart = ({ data }: { data: TrendPoint[] }) => {
  return (
    <Paper sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Revenue vs expenses
      </Typography>

      {data.length === 0 ? (
        <EmptyState title="Not enough data yet" description="Import transactions to see this chart." />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8E5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5B6B66" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#5B6B66" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: "#E2E8E5", fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#1F9D6C"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#C4573D"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default TrendChart;
