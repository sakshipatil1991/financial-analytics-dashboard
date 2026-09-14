// This script loads the sample transactions.json into MySQL
// and creates a demo user you can log in with.
//
// Run it with: npm run seed
// (make sure your .env file exists and MySQL is running first)

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { connectDB, sequelize } from "../src/config/db";
import Transaction from "../src/models/Transaction";
import User from "../src/models/User";

const seed = async () => {
  await connectDB();

  try {
    // 1. Load the sample JSON file from /data
    const dataPath = path.join(__dirname, "..", "data", "transactions.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const transactions = JSON.parse(rawData);

    // 2. Clear any existing transactions so the seed is repeatable
    await Transaction.destroy({ where: {}, truncate: true });
    console.log("Cleared existing transactions");

    // 3. Insert the sample transactions
    await Transaction.bulkCreate(transactions);
    console.log(`Inserted ${transactions.length} transactions`);

    // 4. Create (or reuse) a demo user for logging in
    const demoEmail = process.env.DEMO_USER_EMAIL || "demo@example.com";
    const demoPassword = process.env.DEMO_USER_PASSWORD || "Demo@1234";

    const existingUser = await User.findOne({ where: { email: demoEmail } });

    if (existingUser) {
      console.log(`Demo user already exists: ${demoEmail}`);
    } else {
      await User.create({
        name: "Demo User",
        email: demoEmail,
        password: demoPassword,
      });
      console.log(`Created demo user: ${demoEmail} / ${demoPassword}`);
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

seed();
