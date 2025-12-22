# Backend Setup Complete! 🎉

The Express + MongoDB backend has been successfully integrated into your Omam FMS.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if not already done)
   - Update `MONGODB_URI` with your MongoDB connection string
   - Set a secure `JWT_SECRET`

3. **Start MongoDB:**
   - Make sure MongoDB is running locally or use MongoDB Atlas

4. **Create admin user:**
   ```bash
   npm run create-admin
   ```
   Or with custom credentials:
   ```bash
   npm run create-admin admin mypassword
   ```

5. **Run the application:**
   ```bash
   npm run dev
   ```
   This starts both frontend (port 3000) and backend (port 5000).

## Important Notes

### Authentication

All API endpoints (except `/api/auth/login` and `/api/auth/register`) require authentication via JWT token.

**For development/testing**, you have two options:

#### Option 1: Add a Login Page (Recommended)
Create a login page in your Next.js app that calls the `/api/auth/login` endpoint and stores the token.

#### Option 2: Temporarily Disable Auth (Development Only)
To disable authentication temporarily for development, comment out the auth middleware in route files:

```javascript
// In backend/src/routes/itemRoutes.js (and other route files)
// router.use(auth);  // Comment this out temporarily
```

**⚠️ Remember to re-enable auth before production!**

### API Client

The frontend API client (`lib/apiClient.js`) automatically:
- Reads JWT token from `localStorage`
- Includes token in request headers
- Handles 401 errors (redirects to login)

To use authentication in your app:

```javascript
import { login, setToken } from "@/lib/api";

// Login
const response = await login("admin", "admin123");
setToken(response.token);

// Now all API calls will include the token
```

## Backend Structure

```
backend/
├── server.js                 # Main Express server
├── src/
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── models/              # Mongoose models
│   │   ├── Item.js
│   │   ├── Material.js
│   │   ├── Supplier.js
│   │   ├── Customer.js
│   │   ├── SalesOrder.js
│   │   ├── PurchaseOrder.js
│   │   ├── Payment.js
│   │   ├── InventoryRecord.js
│   │   └── User.js
│   ├── controllers/         # Business logic
│   │   ├── itemController.js
│   │   ├── materialController.js
│   │   ├── supplierController.js
│   │   ├── customerController.js
│   │   ├── salesOrderController.js
│   │   ├── purchaseOrderController.js
│   │   ├── paymentController.js
│   │   ├── inventoryController.js
│   │   ├── reportController.js
│   │   └── authController.js
│   ├── routes/              # API routes
│   │   ├── itemRoutes.js
│   │   ├── materialRoutes.js
│   │   ├── supplierRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── salesOrderRoutes.js
│   │   ├── purchaseOrderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── reportRoutes.js
│   │   └── authRoutes.js
│   ├── middlewares/
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js  # Error handling
│   └── scripts/
│       └── createAdmin.js   # Admin user creation script
```

## Features Implemented

✅ **All CRUD operations** for Items, Materials, Suppliers, Customers
✅ **Sales Orders** with automatic inventory updates
✅ **Purchase Orders** with material stock updates
✅ **Payments** tracking for customers and suppliers
✅ **Inventory** management with reserved/available stock
✅ **Reports** with filtering (sales, purchases, payments)
✅ **JWT Authentication** with bcrypt password hashing
✅ **Error handling** middleware
✅ **Data validation** using Mongoose schemas

## Testing the Backend

1. **Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Login (get token):**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

3. **Get Items (with token):**
   ```bash
   curl http://localhost:5000/api/items \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

## Next Steps

1. **Add Login UI** - Create a login page in your Next.js app
2. **Handle Authentication** - Store token and redirect on login
3. **Add Error Handling** - Show user-friendly error messages
4. **Test All Features** - Verify CRUD operations work correctly
5. **Production Setup** - Configure for production deployment

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running: `mongod` or check MongoDB Atlas
- Verify `MONGODB_URI` in `.env` is correct
- Check network connectivity

### Authentication Errors
- Ensure admin user is created: `npm run create-admin`
- Verify JWT token is being sent in headers
- Check `JWT_SECRET` is set in `.env`

### CORS Errors
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check backend is running on correct port (5000)

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Update `NEXT_PUBLIC_API_URL` in frontend if needed

## Support

If you encounter any issues, check:
1. MongoDB connection
2. Environment variables
3. Node modules installed (`npm install`)
4. Both servers running (frontend + backend)

Happy coding! 🚀

