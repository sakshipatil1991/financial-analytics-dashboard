// Shared TypeScript types used across the frontend

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionListResponse {
  success: boolean;
  data: Transaction[];
  pagination: Pagination;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  totalTransactions: number;
  paidTransactions: number;
  pendingTransactions: number;
}

export interface TrendPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Filters that can be applied to the transaction list
export interface TransactionFilters {
  search?: string;
  category?: string;
  status?: string;
  user_id?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
