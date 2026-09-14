import { Response } from "express";
import { Op, QueryTypes } from "sequelize";
import Transaction from "../models/Transaction";
import { sequelize } from "../config/db";
import { AuthRequest } from "../middleware/auth";

// GET /api/dashboard/summary
// Returns the top-level summary card numbers
export const getSummary = async (req: AuthRequest, res: Response) => {
  const [revenueTotal, expenseTotal, totalCount, paidCount, pendingCount] = await Promise.all([
    Transaction.sum("amount", { where: { category: "Revenue" } }),
    Transaction.sum("amount", { where: { category: { [Op.ne]: "Revenue" } } }),
    Transaction.count(),
    Transaction.count({ where: { status: "Paid" } }),
    Transaction.count({ where: { status: "Pending" } }),
  ]);

  const totalRevenue = revenueTotal || 0;
  const totalExpenses = expenseTotal || 0;

  res.status(200).json({
    success: true,
    data: {
      totalRevenue,
      totalExpenses,
      netBalance: totalRevenue - totalExpenses,
      totalTransactions: totalCount,
      paidTransactions: paidCount,
      pendingTransactions: pendingCount,
    },
  });
};

// GET /api/dashboard/trends
// Returns revenue vs expenses grouped by month, for the trend chart
export const getTrends = async (req: AuthRequest, res: Response) => {
  // Raw SQL is the simplest, clearest way to do a "group by month" query in MySQL
  const rows = await sequelize.query<{ month: string; revenue: string; expenses: string }>(
    `
    SELECT
      DATE_FORMAT(date, '%Y-%m') AS month,
      SUM(CASE WHEN category = 'Revenue' THEN amount ELSE 0 END) AS revenue,
      SUM(CASE WHEN category != 'Revenue' THEN amount ELSE 0 END) AS expenses
    FROM transactions
    GROUP BY DATE_FORMAT(date, '%Y-%m')
    ORDER BY month ASC
    `,
    { type: QueryTypes.SELECT }
  );

  const trends = rows.map((row) => ({
    month: row.month,
    revenue: Number(row.revenue) || 0,
    expenses: Number(row.expenses) || 0,
  }));

  res.status(200).json({ success: true, data: trends });
};

// GET /api/dashboard/categories
// Returns transaction totals grouped by category, for the breakdown chart
export const getCategoryBreakdown = async (req: AuthRequest, res: Response) => {
  const rows = await sequelize.query<{ category: string; total: string; count: string }>(
    `
    SELECT category, SUM(amount) AS total, COUNT(*) AS count
    FROM transactions
    GROUP BY category
    ORDER BY total DESC
    `,
    { type: QueryTypes.SELECT }
  );

  const data = rows.map((row) => ({
    category: row.category,
    total: Number(row.total) || 0,
    count: Number(row.count) || 0,
  }));

  res.status(200).json({ success: true, data });
};
