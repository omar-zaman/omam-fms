# MongoDB Connection Setup Guide

## Error: "bad auth : authentication failed"

This error means your MongoDB credentials are incorrect. Here's how to fix it:

## For MongoDB Atlas (Cloud)

### Step 1: Check Your Connection String

Your connection string should look like this:
```
mongodb+srv://username:password@cluster0.dijzgqg.mongodb.net/omam-fms?appName=Cluster0
```

**Important:**
- Replace `username` with your actual MongoDB Atlas username
- Replace `password` with your actual password (NO angle brackets `< >`)
- The password should be URL-encoded if it contains special characters

### Step 2: Verify Your MongoDB Atlas Credentials

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Go to **Database Access** (left sidebar)
4. Check your database user's username
5. If you forgot the password, click **Edit** and reset it

### Step 3: Check Network Access

1. In MongoDB Atlas, go to **Network Access** (left sidebar)
2. Make sure your IP address is whitelisted, OR
3. Click **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0) for development

### Step 4: Update Your .env File

In your `.env` file, make sure the connection string is correct:

```env
MONGODB_URI=mongodb+srv://omarzaman1010_db_user:OmarFmsPass54321@cluster0.dijzgqg.mongodb.net/omam-fms?appName=Cluster0
```

**Note:** Remove any angle brackets `< >` from the password!

### Step 5: URL-Encode Special Characters

If your password contains special characters, you need to URL-encode them:

- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `&` becomes `%26`
- `+` becomes `%2B`
- `=` becomes `%3D`
- `?` becomes `%3F`
- `/` becomes `%2F`

Example: If your password is `P@ssw0rd#123`, it should be `P%40ssw0rd%23123` in the connection string.

## For Local MongoDB

If you're using local MongoDB instead:

```env
MONGODB_URI=mongodb://localhost:27017/omam-fms
```

Make sure:
1. MongoDB is installed and running
2. No authentication is required (or update the connection string with credentials)

## Testing the Connection

After updating your `.env` file:

1. Make sure the `.env` file is in the root directory (`omam-fms/.env`)
2. Restart your backend server
3. Try creating the admin user again:
   ```bash
   npm run create-admin
   ```

## Common Issues

### Issue 1: Password has special characters
**Solution:** URL-encode the password in the connection string

### Issue 2: User doesn't have database access
**Solution:** In MongoDB Atlas → Database Access → Edit user → Make sure user has "Read and write to any database" or specific database access

### Issue 3: IP not whitelisted
**Solution:** In MongoDB Atlas → Network Access → Add your IP or allow from anywhere (0.0.0.0/0)

### Issue 4: Wrong database name
**Solution:** Make sure the database name in the connection string matches what you want to use (e.g., `omam-fms`)

## Getting a New Connection String from MongoDB Atlas

1. Go to MongoDB Atlas → **Clusters**
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password (no brackets)
6. Replace `<dbname>` with `omam-fms` (or your preferred database name)

Example:
```
mongodb+srv://username:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/omam-fms?retryWrites=true&w=majority
```

