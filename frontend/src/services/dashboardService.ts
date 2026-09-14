import { api } from "./api";
import { CategoryBreakdown, DashboardSummary, TrendPoint } from "../types";

export const getSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<{ success: boolean; data: DashboardSummary }>(
    "/dashboard/summary"
  );
  return response.data.data;
};

export const getTrends = async (): Promise<TrendPoint[]> => {
  const response = await api.get<{ success: boolean; data: TrendPoint[] }>("/dashboard/trends");
  return response.data.data;
};

export const getCategoryBreakdown = async (): Promise<CategoryBreakdown[]> => {
  const response = await api.get<{ success: boolean; data: CategoryBreakdown[] }>(
    "/dashboard/categories"
  );
  return response.data.data;
};
