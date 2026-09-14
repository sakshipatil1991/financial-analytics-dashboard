import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

// Connect to MySQL, then start the Express server.
// We only start listening after the DB connection succeeds so we
// never serve requests that would fail because the DB isn't ready.
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
