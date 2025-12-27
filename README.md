# Omam FMS

A factory management system built entirely with the Next.js App Router and MongoDB. The app ships with authenticated dashboards for items, materials, suppliers, customers, inventory, payments, sales orders, purchase orders, and reporting.

## Features

- **Secure authentication**: NextAuth credentials provider with hashed passwords and cookie-based sessions
- **Dashboard experience**: Sidebar navigation, global search, and contextual page headers
- **Core records**: CRUD for items, materials, suppliers, and customers
- **Order flows**: Sales and purchase orders that update inventory and material stock automatically
- **Financials**: Customer and supplier payments with running totals
- **Inventory**: Reserved/available stock tracking and per-item drill-down
- **Reporting**: Sales, purchase, and payment reports with filters

## Tech Stack

- Next.js 16 (App Router) + React 19
- NextAuth.js (credentials provider, JWT sessions)
- MongoDB with Mongoose
- bcrypt for password hashing

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy the example file and update values as needed:

```bash
cp .env.example .env
```

Set at minimum:

- `MONGODB_URI` – your MongoDB connection string (local or Atlas)
- `NEXTAUTH_SECRET` – a long random string
- `NEXTAUTH_URL` – usually `http://localhost:3000` in development

### 3) Seed an admin user

Create an initial admin account (defaults to `admin` / `admin123` if no args are passed):

```bash
npm run create-admin [username] [password]
```

### 4) Run the app

```bash
npm run dev
```

Next.js serves the UI and API from `http://localhost:3000`.

## Authentication

- The `/login` page uses NextAuth's credentials provider.
- Sessions are JWT-based and stored in HTTP-only cookies, so browser API calls automatically include credentials.
- Client components read the session with `useSession()`, and API route handlers validate requests with `getServerSession(authOptions)`.
- Protected routes redirect unauthenticated users to `/login` via the `AuthGuard` wrapper.

## API Overview

All endpoints live under `/api` and expect an active NextAuth session unless noted.

- `POST /api/auth/[...nextauth]` – credentials sign-in handled by NextAuth
- `GET /api/auth/session` – session lookup
- CRUD endpoints for `/api/items`, `/api/materials`, `/api/suppliers`, `/api/customers`
- Order flows at `/api/sales-orders` and `/api/purchase-orders`
- Payments via `/api/payments`
- Inventory data at `/api/inventory` and `/api/inventory/item/:itemId`
- Reports under `/api/reports/*` (sales orders, purchase orders, customer payments)
- `GET /api/health` – unauthenticated health check

## Project Structure

```
omam-fms/
├── app/                    # Next.js app directory (routes & UI)
│   ├── api/                # Route handlers that wrap backend controllers
│   ├── dashboard/          # Home dashboard tiles
│   ├── items/, materials/, suppliers/, customers/ ...
│   └── login/              # NextAuth-powered login page
├── components/             # Shared UI (layout, navbar, sidebar, data table, auth guard)
├── lib/                    # DB connection, API client, controller adapter, NextAuth options
├── backend/src/            # Mongoose models, controllers, and utility scripts
│   └── scripts/createAdmin.js
└── public/                 # Static assets
```

## MongoDB Notes

- Use the `MONGODB_URI` from your Atlas cluster or local MongoDB instance.
- For Atlas, remember to whitelist your IP and URL-encode any special characters in the password.
- Restart the dev server after changing environment variables.

## Scripts

- `npm run dev` – start the Next.js dev server
- `npm run build` / `npm run start` – production build and start
- `npm run create-admin [user] [pass]` – seed an admin account
- `npm run test-db` – simple connection test to MongoDB

## Troubleshooting

- **Authentication**: ensure `NEXTAUTH_SECRET` is set and cookies are not blocked. Clear cookies and sign in again if needed.
- **Database**: verify `MONGODB_URI` and that MongoDB is reachable. Run `npm run test-db` to confirm connectivity.
- **Sessions in API calls**: keep the frontend and API on the same origin (default `/api`) so cookies are sent automatically.

## License

This project is provided as-is for demonstration purposes.
