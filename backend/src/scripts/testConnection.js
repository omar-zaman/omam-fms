require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    console.log("Connection string format:", process.env.MONGODB_URI ? "Set" : "NOT SET");
    
    if (!process.env.MONGODB_URI) {
      console.error("ERROR: MONGODB_URI is not set in .env file");
      process.exit(1);
    }

    // Extract username from connection string for debugging (without password)
    const uri = process.env.MONGODB_URI;
    const usernameMatch = uri.match(/mongodb\+srv:\/\/([^:]+):/);
    if (usernameMatch) {
      console.log("Username found in connection string:", usernameMatch[1]);
    }

    console.log("Attempting to connect...");
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log("✅ SUCCESS! MongoDB Connected");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collections found:", collections.length);
    
    await mongoose.disconnect();
    console.log("Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR connecting to MongoDB:");
    console.error("Error message:", error.message);
    
    if (error.message.includes("authentication failed")) {
      console.error("\n🔍 Authentication failed. Check:");
      console.error("1. Username is correct in MongoDB Atlas");
      console.error("2. Password is correct (no angle brackets < >)");
      console.error("3. Password special characters are URL-encoded");
      console.error("4. User has database access permissions");
      console.error("5. Your IP is whitelisted in Network Access");
    } else if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
      console.error("\n🔍 Network error. Check:");
      console.error("1. Internet connection");
      console.error("2. MongoDB Atlas cluster is running");
      console.error("3. Connection string hostname is correct");
    } else if (error.message.includes("timeout")) {
      console.error("\n🔍 Connection timeout. Check:");
      console.error("1. Your IP is whitelisted in MongoDB Atlas Network Access");
      console.error("2. Firewall is not blocking the connection");
    }
    
    process.exit(1);
  }
}

testConnection();

