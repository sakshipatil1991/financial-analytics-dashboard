import { api } from "./api";
import { TransactionFilters, TransactionListResponse } from "../types";

// Converts our filters object into URL query params, skipping empty values
const buildParams = (filters: TransactionFilters) => {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = String(value);
    }
  });
  return params;
};

export const getTransactions = async (
  filters: TransactionFilters
): Promise<TransactionListResponse> => {
  const response = await api.get<TransactionListResponse>("/transactions", {
    params: buildParams(filters),
  });
  return response.data;
};

// Requests a CSV export from the backend and triggers a browser download.
export const exportTransactionsCsv = async (
  filters: TransactionFilters,
  columns: string[]
): Promise<void> => {
  const params = {
    ...buildParams(filters),
    columns: columns.join(","),
  };

  const response = await api.get("/transactions/export", {
    params,
    responseType: "blob",
  });

  // Create a temporary link to trigger the browser's file download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `transactions-export-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
