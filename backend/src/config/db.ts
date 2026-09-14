import { Sequelize } from "sequelize";

// Read MySQL connection details from .env
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_NAME = process.env.DB_NAME || "financial_analytics_dashboard";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";

// This single Sequelize instance is imported by every model file
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false, // set to console.log if you want to see every SQL query
});

// Connects to MySQL and creates any missing tables based on our models.
// `sync()` is fine for an assignment project - in a real production app
// you would use proper migrations instead.
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");

    await sequelize.sync();
    console.log("Database tables are ready");
  } catch (error) {
    console.error("MySQL connection failed:", error);
    // Stop the app if we cannot connect to the database
    process.exit(1);
  }
};
