import { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Collapse,
  Grid,
  MenuItem,
  Paper,
  Chip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { TransactionFilters } from "../types";

const STATUS_OPTIONS = ["Paid", "Pending", "Failed"];

interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  onOpenExport: () => void;
}

// Controlled filter bar. Keeps a local draft of the advanced filters so
// typing doesn't trigger a request on every keystroke - only "Apply" does.
const FilterBar = ({ filters, onChange, onOpenExport }: Props) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [draft, setDraft] = useState<TransactionFilters>(filters);

  const updateDraft = (patch: Partial<TransactionFilters>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const applyAdvanced = () => {
    onChange({ ...draft, page: 1 });
  };

  const clearAdvanced = () => {
    const cleared: TransactionFilters = {
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: 1,
      limit: filters.limit,
    };
    setDraft(cleared);
    onChange(cleared);
  };

  const activeAdvancedCount = [
    filters.category,
    filters.status,
    filters.user_id,
    filters.startDate,
    filters.endDate,
    filters.minAmount,
    filters.maxAmount,
  ].filter(Boolean).length;

  return (
    <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          placeholder="Search category, status, or user"
          size="small"
          value={filters.search || ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          sx={{ flex: 1, minWidth: 240 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="outlined"
          size="small"
          startIcon={<TuneRoundedIcon fontSize="small" />}
          onClick={() => setShowAdvanced((prev) => !prev)}
          sx={{ borderColor: "divider", color: "text.primary" }}
        >
          Filters
          {activeAdvancedCount > 0 && (
            <Chip
              label={activeAdvancedCount}
              size="small"
              color="secondary"
              sx={{ ml: 1, height: 18, fontSize: 11 }}
            />
          )}
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<FileDownloadRoundedIcon fontSize="small" />}
          onClick={onOpenExport}
        >
          Export CSV
        </Button>
      </Box>

      <Collapse in={showAdvanced}>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Category"
              size="small"
              fullWidth
              value={draft.category || ""}
              onChange={(e) => updateDraft({ category: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Revenue">Revenue</MenuItem>
              <MenuItem value="Software">Software</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Travel">Travel</MenuItem>
              <MenuItem value="Office Supplies">Office Supplies</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Status"
              size="small"
              fullWidth
              value={draft.status || ""}
              onChange={(e) => updateDraft({ status: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="User ID"
              size="small"
              fullWidth
              placeholder="user_001"
              value={draft.user_id || ""}
              onChange={(e) => updateDraft({ user_id: e.target.value })}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              label="Min amount"
              size="small"
              type="number"
              fullWidth
              value={draft.minAmount || ""}
              onChange={(e) => updateDraft({ minAmount: e.target.value })}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              label="Max amount"
              size="small"
              type="number"
              fullWidth
              value={draft.maxAmount || ""}
              onChange={(e) => updateDraft({ maxAmount: e.target.value })}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              label="Start date"
              size="small"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={draft.startDate || ""}
              onChange={(e) => updateDraft({ startDate: e.target.value })}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              label="End date"
              size="small"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={draft.endDate || ""}
              onChange={(e) => updateDraft({ endDate: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button size="small" onClick={clearAdvanced}>
              Clear filters
            </Button>
            <Button size="small" variant="contained" color="secondary" onClick={applyAdvanced}>
              Apply filters
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default FilterBar;
