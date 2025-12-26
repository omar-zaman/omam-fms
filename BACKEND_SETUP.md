# Backend Setup Complete! 🎉

The MongoDB backend is now served directly from the Next.js API routes.

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
   This starts the Next.js app (frontend + API routes) on port `3000`.

## Important Notes

### Authentication

All API endpoints (except `/api/auth/login` and `/api/auth/register`) require authentication via JWT token.

**For development/testing**, you have two options:

#### Option 1: Add a Login Page (Recommended)
Create a login page in your Next.js app that calls the `/api/auth/login` endpoint and stores the token.

#### Option 2: Temporarily Disable Auth (Development Only)
If you need to bypass auth for debugging, you can adjust the `handleController` helper in `lib/apiHandler.js` to set `requireAuth: false` for specific routes. Remember to undo these changes before production.

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
app/api/                     # Next.js API routes exposing the backend
backend/
├── src/
│   ├── config/              # Database configuration
│   ├── models/              # Mongoose models
│   ├── controllers/         # Business logic
│   └── scripts/             # Utility scripts
└── server.js                # Legacy Express entry point (no longer needed)
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
   curl http://localhost:3000/api/health
   ```

2. **Login (get token):**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

3. **Get Items (with token):**
   ```bash
   curl http://localhost:3000/api/items \
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
- With the API served from Next.js, calls are same-origin by default. If you host the API separately, ensure the client uses `NEXT_PUBLIC_API_URL`.

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Update `NEXT_PUBLIC_API_URL` in frontend if needed

## Support

If you encounter any issues, check:
1. MongoDB connection
2. Environment variables
3. Node modules installed (`npm install`)
4. Next.js dev server running

Happy coding! 🚀
