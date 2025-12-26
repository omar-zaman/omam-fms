# Omam FMS

A full-stack factory management system built with Next.js and MongoDB.

## Features

- **Items Management**: Create, read, update, and delete items
- **Materials Management**: Track materials with supplier information
- **Suppliers & Customers**: Manage supplier and customer data
- **Sales Orders**: Create and manage sales orders with inventory tracking
- **Purchase Orders**: Manage purchase orders with material stock updates
- **Payments**: Track customer and supplier payments
- **Inventory**: Real-time inventory tracking with reserved and available stock
- **Reports**: Generate sales, purchase, and payment reports with filters

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- JavaScript

### Backend
- Next.js API Routes
- MongoDB with Mongoose
- NextAuth (credentials provider)
- bcrypt for password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://omarzaman1010_db_user:<OmarFmsPass54321>@cluster0.dijzgqg.mongodb.net/omam-fms?appName=Cluster0

# NextAuth secret
NEXTAUTH_SECRET=replace_with_strong_secret
```

**Important**: Change `NEXTAUTH_SECRET` to a secure random string in production.

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod
```

Or use MongoDB Atlas and update `MONGODB_URI` in `.env`.

### 4. Create Admin User

Create a default admin user:

```bash
node backend/src/scripts/createAdmin.js [username] [password]
```

Example:
```bash
node backend/src/scripts/createAdmin.js admin admin123
```

If no arguments are provided, it defaults to `admin` / `admin123`.

### 5. Run the Application

#### Start the App

```bash
npm run dev
```

Next.js will serve both the frontend and API routes from `http://localhost:3000`.

## Project Structure

```
omam-fms/
├── app/                    # Next.js app directory (frontend)
│   ├── dashboard/
│   ├── items/
│   ├── materials/
│   ├── suppliers/
│   ├── customers/
│   ├── sales-orders/
│   ├── purchase-orders/
│   ├── payments/
│   ├── inventory/
│   └── reports/
├── components/             # React components
├── lib/                    # Frontend utilities and API client
├── backend/                # Shared backend logic (models, controllers, scripts)
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose models
│   │   ├── controllers/    # Business logic used by API routes
│   │   └── scripts/        # Utility scripts
└── package.json
```

## API Endpoints

All API endpoints are prefixed with `/api` and require an authenticated NextAuth session. They are served directly by Next.js API routes.

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth credential sign-in
- `GET /api/auth/session` - NextAuth session lookup

### Items
- `GET /api/items` - Get all items (with optional `?search=term`)
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Materials, Suppliers, Customers
Similar CRUD endpoints as Items.

### Sales Orders
- `GET /api/sales-orders` - Get all orders (with filters)
- `POST /api/sales-orders` - Create order
- `PUT /api/sales-orders/:id` - Update order
- `DELETE /api/sales-orders/:id` - Delete order

### Purchase Orders
Similar endpoints as Sales Orders.

### Payments
- `GET /api/payments` - Get all payments (with filters)
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Inventory
- `GET /api/inventory` - Get all inventory records
- `GET /api/inventory/item/:itemId` - Get inventory for specific item

### Reports
- `GET /api/reports/sales-orders` - Sales order report (with date range, customer filters)
- `GET /api/reports/purchase-orders` - Purchase order report
- `GET /api/reports/customer-payments` - Customer payment report

## Authentication

The app uses NextAuth with a credentials provider. Sessions are stored in HTTP-only cookies, so API calls automatically include credentials on the same origin.

- Use the `/login` page to sign in with a username/password (default admin credentials: `admin` / `admin123`).
- The NextAuth session is available through `useSession()` in client components and `getServerSession` in server contexts.

## Development Notes

- The backend uses MongoDB ObjectIds, but the frontend API client transforms them to `id` for compatibility.
- Inventory is automatically updated when sales orders are created/updated/deleted.
- Material stock is updated when purchase orders are completed.
- All routes require an active NextAuth session.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity if using MongoDB Atlas

### CORS Errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check that backend is running on the correct port

### Authentication Errors
- Ensure you've created an admin user
- Check that `NEXTAUTH_SECRET` is set in `.env`
- Verify that your browser has a valid NextAuth session (clear cookies and sign in again)

## Production Deployment

1. Set secure environment variables
2. Use a production MongoDB instance
3. Set up proper CORS origins
4. Use HTTPS
5. Implement rate limiting
6. Add input validation and sanitization
7. Set up error logging and monitoring

## License

Private - All rights reserved
