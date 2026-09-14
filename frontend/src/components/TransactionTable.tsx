import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Avatar,
  Box,
  TablePagination,
  Typography,
} from "@mui/material";
import { Transaction, TransactionFilters, Pagination } from "../types";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

interface Column {
  id: keyof Transaction | "amount";
  label: string;
  sortable: boolean;
  align?: "left" | "right";
}

const COLUMNS: Column[] = [
  { id: "id", label: "ID", sortable: false },
  { id: "date", label: "Date", sortable: true },
  { id: "user_id", label: "User", sortable: true },
  { id: "category", label: "Category", sortable: true },
  { id: "status", label: "Status", sortable: true },
  { id: "amount", label: "Amount", sortable: true, align: "right" },
];

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
  Paid: "success",
  Pending: "warning",
  Failed: "error",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "USD" }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value)
  );

interface Props {
  transactions: Transaction[];
  pagination: Pagination | null;
  filters: TransactionFilters;
  loading: boolean;
  onChangeSort: (sortBy: string) => void;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
}

const TransactionTable = ({
  transactions,
  pagination,
  filters,
  loading,
  onChangeSort,
  onChangePage,
  onChangeLimit,
}: Props) => {
  return (
    <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  sx={{ fontWeight: 600, bgcolor: "background.paper" }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={filters.sortBy === col.id}
                      direction={filters.sortBy === col.id ? filters.sortOrder : "asc"}
                      onClick={() => onChangeSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length}>
                  <Loader label="Loading transactions..." />
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      #{tx.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(tx.date)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={tx.user_profile}
                        sx={{ width: 24, height: 24 }}
                        alt={tx.user_id}
                      />
                      <Typography variant="body2">{tx.user_id}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={tx.status}
                      size="small"
                      color={STATUS_COLORS[tx.status] || "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right" className="stat-figure">
                    {formatCurrency(tx.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={(_, newPage) => onChangePage(newPage + 1)}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={(e) => onChangeLimit(Number(e.target.value))}
          rowsPerPageOptions={[10, 25, 50]}
        />
      )}
    </Paper>
  );
};

export default TransactionTable;
