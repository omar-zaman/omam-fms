import bcrypt from "bcrypt";
import User from "@/backend/src/models/User";

export async function seedAdmin() {
  const existingAdmin = await User.findOne({ username: "admin" });

  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    username: "admin",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin user auto-created");
}
