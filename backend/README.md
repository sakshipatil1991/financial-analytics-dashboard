# Backend — Financial Analytics Dashboard API

Node.js + Express + TypeScript + MySQL (via Sequelize) REST API. See the **root
`README.md`** for full setup instructions, complete API documentation, and Postman
testing steps.

## Quick start

```bash
# 1. Create an empty database first:
#    mysql -u root -p
#    CREATE DATABASE financial_analytics_dashboard;

npm install
cp .env.example .env      # then fill in your MySQL credentials
npm run seed               # creates tables, imports data/transactions.json, creates demo user
npm run dev                 # starts the API on http://localhost:5000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the API with nodemon (auto-restarts on file changes) |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm start` | Runs the compiled build (`dist/server.js`) |
| `npm run seed` | Creates tables if needed, imports `data/transactions.json`, creates the demo user |

## Folder structure

```
src/
├── config/db.ts            MySQL connection (Sequelize)
├── models/                 Sequelize models (User, Transaction)
├── middleware/              JWT auth guard + centralized error handler
├── controllers/             Route handlers (auth, transactions, dashboard)
├── routes/                  Express routers
├── utils/                   Token generation, CSV builder, async wrapper
├── app.ts                   Express app (middleware + routes)
└── server.ts                Entry point (connects DB, starts server)
scripts/seed.ts               Database seed script
data/transactions.json        Sample transaction data
```

## Notes on the database layer

- Tables are created automatically on startup via `sequelize.sync()` — fine for an
  assignment project, but a real production app would use proper migrations instead.
- `transactions.id` is the same business id from the sample JSON (1, 2, 3, ...) and is
  used directly as the primary key, so re-running the seed script first clears the table
  to avoid duplicate-id errors.
