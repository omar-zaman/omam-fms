# Backend Setup

All backend logic is served directly through the Next.js API routes in this repository. No separate Express server is required—the app connects to MongoDB, authenticates with NextAuth, and exposes the controllers under `/api/*`.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `MONGODB_URI`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` for your environment.

3. **Start MongoDB**
   - Run `mongod` locally **or** use MongoDB Atlas with a valid connection string.

4. **Create an admin user**
   ```bash
   npm run create-admin [username] [password]
   ```
   Defaults to `admin` / `admin123` when arguments are omitted.

5. **Run the application**
   ```bash
   npm run dev
   ```
   The frontend and API routes are served together at `http://localhost:3000`.

## Authentication

- Login is handled by NextAuth credentials at `/login`.
- API handlers use `getServerSession(authOptions)` to require an active session by default.
- Sessions are JWT-based and stored in HTTP-only cookies; browser requests automatically include them.

## Backend Structure

```
backend/
├── src/
│   ├── config/          # MongoDB connection helper for scripts
│   ├── models/          # Mongoose models (Item, Material, Supplier, Customer, SalesOrder, PurchaseOrder, Payment, InventoryRecord, User)
│   ├── controllers/     # Business logic shared with API routes
│   └── scripts/
│       └── createAdmin.js  # Seed admin utility
```

## Feature Coverage

- CRUD for items, materials, suppliers, customers
- Sales orders with automatic inventory adjustments
- Purchase orders that restock materials
- Payments for customers and suppliers
- Inventory summaries and per-item records
- Reporting endpoints for sales, purchases, and customer payments
- Credential-based authentication via NextAuth

## Troubleshooting

- **MongoDB connection**: verify `MONGODB_URI` and that your database is reachable. Use `npm run test-db` for a quick check.
- **Authentication**: ensure `NEXTAUTH_SECRET` is set and that cookies are allowed in the browser. Recreate the admin user if needed.
- **Sessions in API calls**: keep requests on the same origin as the app (`/api`) so cookies are forwarded automatically.
