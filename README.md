# Financial Analytics Dashboard

A full-stack financial analytics application built as an assignment project. It has a
Node.js/Express/TypeScript/MySQL backend and a React/TypeScript/Vite frontend, with
JWT authentication, a dashboard with charts, a searchable/filterable/sortable transaction
table, and a configurable CSV export.

> **Note:** This is an assignment/learning project. It is functional and reasonably
> structured, but it has not been hardened for production use (e.g. no rate limiting,
> no refresh tokens, minimal automated tests).

---

## 1. Architecture overview

```
financial-analytics-dashboard/
├── backend/     Node.js + Express + TypeScript + MySQL (Sequelize) API
└── frontend/    React + TypeScript + Vite single-page app
```

**Backend** — `backend/src/`
- `config/db.ts` — MySQL connection setup via Sequelize
- `models/` — Sequelize models (`User`, `Transaction`)
- `middleware/` — JWT auth guard (`auth.ts`) and centralized error handling (`errorHandler.ts`)
- `controllers/` — request handlers for auth, transactions, and dashboard stats
- `routes/` — Express routers that wire URLs to controllers
- `utils/` — token generation, CSV building, async error wrapper
- `app.ts` / `server.ts` — Express app setup and server bootstrap
- `scripts/seed.ts` — imports `data/transactions.json` into MySQL and creates a demo user

**Frontend** — `frontend/src/`
- `pages/` — `Login.tsx`, `Dashboard.tsx`
- `components/` — Sidebar, Header, SummaryCards, TrendChart, CategoryChart, FilterBar,
  TransactionTable, ExportModal, and small shared pieces (Loader, EmptyState, ErrorAlert)
- `services/` — Axios wrappers for auth, transactions, dashboard stats
- `hooks/useAuth.tsx` — auth context (stores JWT + user in localStorage)
- `types/` — shared TypeScript interfaces
- `theme.ts` — MUI theme (custom palette/typography)

**Data flow:** Frontend → Axios (attaches JWT) → Express routes → `protect` middleware
verifies the token → Controller queries MySQL via Sequelize → JSON response → Frontend
renders it. There is no mock or hardcoded data — every number on the dashboard comes from
a live MySQL query.

---

## 2. Technology choices

| Layer      | Technology                                          |
|------------|------------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Material UI, Recharts, Axios, React Router |
| Backend    | Node.js, Express, TypeScript, Sequelize, JWT, bcryptjs |
| Database   | MySQL                                                |

---

## 3. Prerequisites

- **Node.js** v18 or later (`node -v` to check)
- **MySQL** Server 8.x running locally (or a hosted MySQL instance, e.g. on Railway/PlanetScale/RDS)
- **npm** (comes with Node.js)

---

## 4. Backend setup

### 4a. Create the database

Log into MySQL and create an empty database (the app will create the tables for you):

```bash
mysql -u root -p
```
```sql
CREATE DATABASE financial_analytics_dashboard;
EXIT;
```

### 4b. Configure and install

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your MySQL credentials:

```
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=financial_analytics_dashboard
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=change_this_to_a_long_random_secret_key
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
DEMO_USER_EMAIL=demo@example.com
DEMO_USER_PASSWORD=Demo@1234
```

### 4c. Import the sample data and create the demo login

```bash
npm run seed
```

This connects to MySQL, creates the `users` and `transactions` tables if they don't
already exist, loads `backend/data/transactions.json` (30 sample transactions matching
the assignment's data structure), and creates a demo user:

```
Email:    demo@example.com
Password: Demo@1234
```

### 4d. Start the backend in dev mode

```bash
npm run dev
```

You should see:
```
MySQL connected successfully
Database tables are ready
Server running on http://localhost:5000
```

Visit `http://localhost:5000/api/health` in a browser — you should see
`{"success":true,"message":"API is running"}`.

**Common errors & fixes**

| Error | Fix |
|---|---|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL isn't running — start the MySQL service |
| `Access denied for user 'root'@'localhost'` | `DB_USER`/`DB_PASSWORD` in `.env` are wrong |
| `Unknown database 'financial_analytics_dashboard'` | You skipped step 4a — create the database first |
| `ER_NOT_SUPPORTED_AUTH_MODE` | Your MySQL user uses `caching_sha2_password`; run `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';` in MySQL, or create a new user with that auth plugin |
| Seed script says "Demo user already exists" | That's fine — it only creates the user once, it won't duplicate it |

---

## 5. Frontend setup

Open a **second terminal** (keep the backend running in the first):

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`. Log in with the demo credentials above.

**Common errors & fixes**

| Error | Fix |
|---|---|
| Login fails with a network error | Make sure the backend is running on port 5000 and `VITE_API_BASE_URL` in `frontend/.env` matches |
| CORS error in the browser console | Make sure `CORS_ORIGIN` in `backend/.env` matches the frontend URL (`http://localhost:5173`) |
| Blank page after login | Open the browser console — usually a stale/invalid token; log out and log in again |

---

## 6. Running frontend and backend together

1. Terminal 1: `cd backend && npm run dev` (leave running)
2. Terminal 2: `cd frontend && npm run dev` (leave running)
3. Browser: `http://localhost:5173`

---

## 7. API documentation

All endpoints are prefixed with `/api`. Protected endpoints require an
`Authorization: Bearer <token>` header.

### Auth

**POST `/api/auth/register`**
Creates a new user.
```json
// Request body
{ "name": "Jane Doe", "email": "jane@example.com", "password": "Password123" }
```
```json
// 201 response
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": 2, "name": "Jane Doe", "email": "jane@example.com" }
}
```

**POST `/api/auth/login`**
```json
// Request body
{ "email": "demo@example.com", "password": "Demo@1234" }
```
```json
// 200 response
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "name": "Demo User", "email": "demo@example.com" }
}
```

**GET `/api/auth/me`** *(protected)*
Returns the logged-in user's profile.
```json
{ "success": true, "user": { "id": 1, "name": "Demo User", "email": "demo@example.com" } }
```

### Transactions *(all protected)*

**GET `/api/transactions`**

Query parameters (all optional):

| Param | Type | Example |
|---|---|---|
| `page` | number | `1` |
| `limit` | number | `10` |
| `search` | string | `Revenue` (matches category, status, or user_id) |
| `category` | string | `Revenue` |
| `status` | string | `Paid` |
| `user_id` | string | `user_001` |
| `startDate` | ISO date | `2024-01-01` |
| `endDate` | ISO date | `2024-06-30` |
| `minAmount` | number | `100` |
| `maxAmount` | number | `5000` |
| `sortBy` | string | `date`, `amount`, `category`, `status`, `user_id` |
| `sortOrder` | string | `asc` or `desc` |

Example: `GET /api/transactions?page=1&limit=10&search=Revenue&sortBy=amount&sortOrder=desc`

```json
{
  "success": true,
  "data": [
    { "id": 1, "date": "2024-01-15T08:34:12.000Z", "amount": "1500.00",
      "category": "Revenue", "status": "Paid", "user_id": "user_001",
      "user_profile": "https://thispersondoesnotexist.com/" }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 30, "totalPages": 3 }
}
```

**GET `/api/transactions/:id`** — fetch one transaction by its numeric `id`.

**GET `/api/transactions/export`** — same query params as above, plus:

| Param | Example |
|---|---|
| `columns` | `id,date,amount,category,status` (comma separated) |

Returns a `text/csv` file as an attachment (triggers a browser download).

### Dashboard *(all protected)*

**GET `/api/dashboard/summary`**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 27960, "totalExpenses": 8355.75, "netBalance": 19604.25,
    "totalTransactions": 30, "paidTransactions": 20, "pendingTransactions": 6
  }
}
```

**GET `/api/dashboard/trends`** — revenue vs expenses grouped by month.
```json
{ "success": true, "data": [{ "month": "2024-01", "revenue": 3700, "expenses": 320.5 }] }
```

**GET `/api/dashboard/categories`** — totals grouped by category.
```json
{ "success": true, "data": [{ "category": "Revenue", "total": 27960, "count": 15 }] }
```

### Error format

All errors follow the same shape:
```json
{ "success": false, "message": "Invalid email or password" }
```

---

## 8. Testing with Postman

1. Create a new Postman collection called **Financial Analytics Dashboard**.
2. Add a collection variable `baseUrl` = `http://localhost:5000/api`.
3. Add a collection variable `token` (leave empty for now).
4. **Login request:** `POST {{baseUrl}}/auth/login` with the demo credentials in the body.
   In the "Tests" tab, add:
   ```javascript
   const data = pm.response.json();
   pm.collectionVariables.set("token", data.token);
   ```
   This automatically saves the token after login.
5. For every protected request (transactions, dashboard), go to the **Authorization** tab,
   choose **Bearer Token**, and set the token field to `{{token}}`.
6. Try:
   - `GET {{baseUrl}}/transactions?page=1&limit=5`
   - `GET {{baseUrl}}/dashboard/summary`
   - `GET {{baseUrl}}/transactions/export?columns=id,date,amount` (use "Send and Download" in Postman to save the CSV)

---

## 9. Final testing checklist

- [ ] `npm run seed` completes and prints "Seeding complete!"
- [ ] Backend starts with no errors (`npm run dev` in `backend/`)
- [ ] Frontend starts with no errors (`npm run dev` in `frontend/`)
- [ ] Can log in with the demo user
- [ ] Dashboard cards show non-zero numbers after seeding
- [ ] Both charts render
- [ ] Search box filters the table
- [ ] Advanced filters (category, status, date range, amount range) work and combine correctly
- [ ] Clicking a column header sorts the table and toggles asc/desc
- [ ] Pagination changes the page and rows-per-page
- [ ] Export modal: selecting fewer columns changes the preview; downloaded CSV opens correctly in Excel/Sheets
- [ ] Logging out clears the session and redirects to `/login`
- [ ] An invalid/expired token redirects to `/login` automatically
- [ ] Resizing the browser down to a phone width keeps the UI usable

## 10. Submission checklist

- [ ] Remove `node_modules/` and `.env` files before zipping/sharing (they're already gitignored)
- [ ] Confirm `.env.example` files are present in both `backend/` and `frontend/`
- [ ] Confirm `backend/data/transactions.json` is included (needed for the seed script)
- [ ] Double check the demo credentials in this README match your `.env`
