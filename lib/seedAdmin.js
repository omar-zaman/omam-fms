import connectDB from "@/lib/db";
import User from "@/backend/src/models/User";

export async function seedAdmin() {
  await connectDB();

  const adminUsername = "admin";
  const adminPassword = "admin123";

  const existingAdmin = await User.findOne({ username: adminUsername });

  if (existingAdmin) {
    return;
  }

  await User.create({
    username: adminUsername,
    password: adminPassword,
    role: "admin",
  });

  console.log("✅ Admin user created successfully");
}
