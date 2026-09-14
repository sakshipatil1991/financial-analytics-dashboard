import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Transaction, TransactionFilters } from "../types";

const ALL_COLUMNS: { id: string; label: string }[] = [
  { id: "id", label: "ID" },
  { id: "date", label: "Date" },
  { id: "amount", label: "Amount" },
  { id: "category", label: "Category" },
  { id: "status", label: "Status" },
  { id: "user_id", label: "User ID" },
  { id: "user_profile", label: "User Profile URL" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  previewRows: Transaction[];
  onExport: (columns: string[], scope: "filtered" | "all") => Promise<void>;
}

// Lets the user pick which columns to export and whether to export just
// the current filtered view or every transaction, with a small live preview.
const ExportModal = ({ open, onClose, filters, previewRows, onExport }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.id)
  );
  const [scope, setScope] = useState<"filtered" | "all">("filtered");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const toggleColumn = (id: string) => {
    setSelectedColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.category ||
      filters.status ||
      filters.user_id ||
      filters.startDate ||
      filters.endDate ||
      filters.minAmount ||
      filters.maxAmount
  );

  const handleExport = async () => {
    setError("");

    if (selectedColumns.length === 0) {
      setError("Select at least one column to export.");
      return;
    }

    setExporting(true);
    try {
      await onExport(selectedColumns, scope);
      onClose();
    } catch (err) {
      setError("The export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export transactions to CSV</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Columns to include
        </Typography>
        <FormGroup row sx={{ mb: 2 }}>
          {ALL_COLUMNS.map((col) => (
            <FormControlLabel
              key={col.id}
              sx={{ width: "48%" }}
              control={
                <Checkbox
                  size="small"
                  checked={selectedColumns.includes(col.id)}
                  onChange={() => toggleColumn(col.id)}
                />
              }
              label={col.label}
            />
          ))}
        </FormGroup>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Rows to export
        </Typography>
        <RadioGroup
          value={scope}
          onChange={(e) => setScope(e.target.value as "filtered" | "all")}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="filtered"
            control={<Radio size="small" />}
            label={
              hasActiveFilters
                ? "Only transactions matching my current search/filters"
                : "All transactions (no filters are currently active)"
            }
          />
          <FormControlLabel
            value="all"
            control={<Radio size="small" />}
            label="All transactions (ignore current search/filters)"
          />
        </RadioGroup>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Preview
        </Typography>
        {previewRows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No rows to preview.
          </Typography>
        ) : (
          <Box sx={{ overflowX: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {selectedColumns.map((colId) => (
                    <TableCell key={colId}>
                      {ALL_COLUMNS.find((c) => c.id === colId)?.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {previewRows.slice(0, 3).map((row) => (
                  <TableRow key={row.id}>
                    {selectedColumns.map((colId) => (
                      <TableCell key={colId}>
                        {String((row as unknown as Record<string, unknown>)[colId] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={exporting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Download CSV"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;
