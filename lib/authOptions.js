import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";

// Try different import paths - use the correct one for your setup
import User from "@/models/User"; // Most common
// OR import User from "@/lib/models/User";
// OR import User from "@/app/models/User";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          // Connect to DB
          await connectDB();

          // Find user
          const normalizedUsername = credentials.username.trim().toLowerCase();
          
          // Debug log
          console.log("Looking for user:", normalizedUsername);

          const user = await User.findOne({
            username: normalizedUsername,
          });

          console.log("User found:", !!user);

          if (!user) {
            throw new Error("User not found");
          }

          // Debug - check password hash
          console.log("Comparing password...");
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("Password correct:", isPasswordCorrect);

          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            username: user.username,
            role: user.role || "admin",
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development", // Enable debug mode
};