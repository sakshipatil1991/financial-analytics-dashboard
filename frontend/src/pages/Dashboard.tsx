import { useEffect, useState, useCallback } from "react";
import { Box, Grid, Container } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import TrendChart from "../components/TrendChart";
import CategoryChart from "../components/CategoryChart";
import FilterBar from "../components/FilterBar";
import TransactionTable from "../components/TransactionTable";
import ExportModal from "../components/ExportModal";
import ErrorAlert from "../components/ErrorAlert";
import Loader from "../components/Loader";
import * as transactionService from "../services/transactionService";
import * as dashboardService from "../services/dashboardService";
import {
  CategoryBreakdown,
  DashboardSummary,
  Pagination,
  Transaction,
  TransactionFilters,
  TrendPoint,
} from "../types";

const DEFAULT_FILTERS: TransactionFilters = {
  page: 1,
  limit: 10,
  sortBy: "date",
  sortOrder: "desc",
};

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);

  const [summaryLoading, setSummaryLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [error, setError] = useState("");

  // Loads the three dashboard-summary endpoints (cards + both charts)
  const loadSummaryData = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const [summaryData, trendData, categoryData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getTrends(),
        dashboardService.getCategoryBreakdown(),
      ]);
      setSummary(summaryData);
      setTrends(trendData);
      setCategories(categoryData);
    } catch (err) {
      setError("Could not load dashboard summary. Please check your connection and try again.");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Loads the transaction table for the current filters/page/sort
  const loadTransactions = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await transactionService.getTransactions(filters);
      setTransactions(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError("Could not load transactions. Please check your connection and try again.");
    } finally {
      setTableLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSummaryData();
  }, [loadSummaryData]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleChangeSort = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const handleExport = async (columns: string[], scope: "filtered" | "all") => {
    const exportFilters = scope === "all" ? {} : filters;
    await transactionService.exportTransactionsCsv(exportFilters, columns);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Header />

        <Container maxWidth="xl" sx={{ py: 3 }}>
          {summaryLoading || !summary ? (
            <Loader label="Loading dashboard..." />
          ) : (
            <>
              <SummaryCards summary={summary} />

              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={7}>
                  <TrendChart data={trends} />
                </Grid>
                <Grid item xs={12} md={5}>
                  <CategoryChart data={categories} />
                </Grid>
              </Grid>
            </>
          )}

          <Box sx={{ mt: 3 }}>
            <FilterBar
              filters={filters}
              onChange={setFilters}
              onOpenExport={() => setExportOpen(true)}
            />

            <TransactionTable
              transactions={transactions}
              pagination={pagination}
              filters={filters}
              loading={tableLoading}
              onChangeSort={handleChangeSort}
              onChangePage={(page) => setFilters((prev) => ({ ...prev, page }))}
              onChangeLimit={(limit) => setFilters((prev) => ({ ...prev, limit, page: 1 }))}
            />
          </Box>
        </Container>
      </Box>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        filters={filters}
        previewRows={transactions}
        onExport={handleExport}
      />

      <ErrorAlert message={error} onClose={() => setError("")} />
    </Box>
  );
};

export default Dashboard;
