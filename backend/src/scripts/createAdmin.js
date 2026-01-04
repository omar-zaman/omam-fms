// scripts/createAdmin.js
import bcrypt from "bcrypt";
import connectDB from "./lib/db";
import User from "./backend/src/models/User"; 

async function createAdminUser() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected!");

    // Get username and password from command line or use defaults
    const username = process.argv[2] || "admin";
    const password = process.argv[3] || "admin123";

    console.log(`Checking if user "${username}" exists...`);
    
    // Check if user already exists
    const existingUser = await User.findOne({ username: username.toLowerCase().trim() });
    
    if (existingUser) {
      console.log(`⚠️  User "${username}" already exists.`);
      console.log("You can reset the password with:");
      console.log(`node scripts/createAdmin.js ${username} newpassword123`);
      process.exit(0);
    }

    console.log("Creating admin user...");
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const adminUser = await User.create({
      username: username.toLowerCase().trim(),
      password: hashedPassword, // Store hashed password!
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("\n✅ Admin user created successfully!");
    console.log("=====================================");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Role: admin`);
    console.log(`User ID: ${adminUser._id}`);
    console.log("=====================================\n");
    console.log("⚠️  IMPORTANT: Save these credentials securely!");
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    console.error(error.message);
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.error("Duplicate username error. User might already exist.");
    }
    
    process.exit(1);
  }
}

// Check if running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser();
}

export default createAdminUser;