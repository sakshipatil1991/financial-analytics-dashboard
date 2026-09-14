import { Router } from "express";
import {
  getSummary,
  getTrends,
  getCategoryBreakdown,
} from "../controllers/dashboardController";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(protect);

router.get("/summary", asyncHandler(getSummary));
router.get("/trends", asyncHandler(getTrends));
router.get("/categories", asyncHandler(getCategoryBreakdown));

export default router;
