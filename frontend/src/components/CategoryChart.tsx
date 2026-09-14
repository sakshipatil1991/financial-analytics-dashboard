import { Paper, Typography } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { CategoryBreakdown } from "../types";
import EmptyState from "./EmptyState";

// A small, fixed color set cycled across categories - keeps the chart
// legible without needing a per-category color mapping from the backend.
const COLORS = ["#1F9D6C", "#123A34", "#C4573D", "#5B6B66", "#8FA89E", "#D8AA3A"];

const CategoryChart = ({ data }: { data: CategoryBreakdown[] }) => {
  return (
    <Paper sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Category breakdown
      </Typography>

      {data.length === 0 ? (
        <EmptyState title="Not enough data yet" description="Import transactions to see this chart." />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8E5" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#5B6B66" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 12, fill: "#5B6B66" }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#E2E8E5", fontSize: 13 }} />
            <Bar dataKey="total" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default CategoryChart;
