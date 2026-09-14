import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import { notFound, errorHandler } from "./middleware/errorHandler";

const app: Application = express();

// Allow requests from our frontend (configured in .env)
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Simple health check route - useful for confirming the server is alive
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 + central error handler (must be registered last)
app.use(notFound);
app.use(errorHandler);

export default app;
