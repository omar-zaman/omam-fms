require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const connectDB = require("../config/database");

async function createAdmin() {
  try {
    await connectDB();

    const username = process.argv[2] || "admin";
    const password = process.argv[3] || "admin123";

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`User "${username}" already exists.`);
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      username,
      password,
      role: "admin",
    });

    await admin.save();
    console.log(`Admin user "${username}" created successfully!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();

