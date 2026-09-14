import { Router } from "express";
import {
  getTransactions,
  getTransactionById,
  exportTransactions,
} from "../controllers/transactionController";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// All transaction routes require a valid JWT token
router.use(protect);

// IMPORTANT: /export must be declared before /:id so Express doesn't
// mistake the word "export" for an :id parameter
router.get("/export", asyncHandler(exportTransactions));
router.get("/", asyncHandler(getTransactions));
router.get("/:id", asyncHandler(getTransactionById));

export default router;
