import { Response } from "express";
import { Op, WhereOptions, Order } from "sequelize";
import Transaction from "../models/Transaction";
import { AuthRequest } from "../middleware/auth";
import { buildTransactionCsv } from "../utils/csvExport";
import { AppError } from "../middleware/errorHandler";

// Builds a Sequelize "where" object from the request's query parameters.
// Shared by both the list endpoint and the export endpoint so
// "export filtered results" matches exactly what the user is viewing.
const buildWhere = (query: AuthRequest["query"]): WhereOptions => {
  const where: Record<string, unknown> = {};

  const { search, category, status, user_id, startDate, endDate, minAmount, maxAmount } =
    query as Record<string, string | undefined>;

  if (category) where.category = category;
  if (status) where.status = status;
  if (user_id) where.user_id = user_id;

  if (startDate || endDate) {
    const dateRange: Record<symbol, Date> = {};
    if (startDate) dateRange[Op.gte] = new Date(startDate);
    if (endDate) dateRange[Op.lte] = new Date(endDate);
    where.date = dateRange;
  }

  if (minAmount || maxAmount) {
    const amountRange: Record<symbol, number> = {};
    if (minAmount) amountRange[Op.gte] = Number(minAmount);
    if (maxAmount) amountRange[Op.lte] = Number(maxAmount);
    where.amount = amountRange;
  }

  // Search across multiple text-ish fields (category, status, user_id)
  if (search) {
    where[Op.or as unknown as string] = [
      { category: { [Op.like]: `%${search}%` } },
      { status: { [Op.like]: `%${search}%` } },
      { user_id: { [Op.like]: `%${search}%` } },
    ];
  }

  return where as WhereOptions;
};

// GET /api/transactions
// Supports pagination, search, filtering, and sorting
export const getTransactions = async (req: AuthRequest, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const sortBy = (req.query.sortBy as string) || "date";
  const sortOrder = req.query.sortOrder === "asc" ? "ASC" : "DESC";

  // Only allow sorting on real, indexed columns to avoid errors/abuse
  const allowedSortFields = ["date", "amount", "category", "status", "user_id"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "date";
  const order: Order = [[safeSortBy, sortOrder]];

  const where = buildWhere(req.query);

  const { rows, count } = await Transaction.findAndCountAll({
    where,
    order,
    limit,
    offset: (page - 1) * limit,
  });

  res.status(200).json({
    success: true,
    data: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit) || 1,
    },
  });
};

// GET /api/transactions/:id
export const getTransactionById = async (req: AuthRequest, res: Response) => {
  const transaction = await Transaction.findByPk(Number(req.params.id));

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  res.status(200).json({ success: true, data: transaction });
};

// GET /api/transactions/export
// Generates a CSV file of transactions, respecting current filters
// and the columns the user chose in the export modal.
export const exportTransactions = async (req: AuthRequest, res: Response) => {
  const where = buildWhere(req.query);

  // columns comes in as a comma separated string, e.g. "id,date,amount"
  const columnsParam = (req.query.columns as string) || "";
  const columns = columnsParam
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const transactions = await Transaction.findAll({ where, order: [["date", "DESC"]] });

  const csv = buildTransactionCsv(transactions, columns);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="transactions-export-${Date.now()}.csv"`
  );
  res.status(200).send(csv);
};
