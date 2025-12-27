# MongoDB Connection Setup Guide

## Common Authentication Error: "bad auth : authentication failed"

This indicates the username/password in your connection string are wrong or the user lacks access.

## For MongoDB Atlas (Cloud)

### 1) Connection string format
```
mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
```
- Replace `<username>` / `<password>` with your Atlas user credentials (no angle brackets in the final string)
- Replace `<cluster-host>` with your cluster host (e.g., `cluster0.xxxxx.mongodb.net`)
- Replace `<database>` with the database name, e.g., `omam-fms`

### 2) Verify database user
1. Open **Database Access** in Atlas
2. Confirm the username
3. Reset the password if necessary
4. Ensure the user has read/write access

### 3) Allow your IP
1. Go to **Network Access**
2. Add your IP or temporarily allow `0.0.0.0/0` for development

### 4) URL-encode special characters
If the password includes special characters, encode them (e.g., `P@ss#` → `P%40ss%23`).

### 5) Update `.env`
```
MONGODB_URI=mongodb+srv://<username>:<encoded_password>@<cluster-host>/omam-fms?retryWrites=true&w=majority
```

## For Local MongoDB

Use the default local connection string:
```
MONGODB_URI=mongodb://localhost:27017/omam-fms
```
Make sure MongoDB is installed and running locally.

## Testing the Connection

1. Ensure `.env` exists in the project root with your connection string
2. Restart the dev server after changing environment variables
3. Run the connection test:
   ```bash
   npm run test-db
   ```

## Quick fixes for common issues
- Encode special characters in the password
- Confirm the database user exists and has the correct role
- Whitelist your IP address in Atlas
- Verify the database name in the URI matches your target database
