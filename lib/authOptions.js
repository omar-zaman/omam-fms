import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { seedAdmin } from "@/lib/seedAdmin";
import User from "@/backend/src/models/User";

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
          // 1️⃣ Validate input
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          // 2️⃣ Connect to database
          await connectDB();

          // 3️⃣ Ensure admin exists (runs safely, only once)
          await seedAdmin();

          // 4️⃣ Normalize username (already consistent in your app)
          const normalizedUsername = credentials.username
            .trim()
            .toLowerCase();

          console.log("Looking for user:", normalizedUsername);

          // 5️⃣ Find user
          const user = await User.findOne({
            username: normalizedUsername,
          });

          console.log("User found:", !!user);

          if (!user) {
            throw new Error("User not found");
          }

          // 6️⃣ Compare password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("Password correct:", isPasswordCorrect);

          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          // 7️⃣ Return safe user object
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

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

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

  debug: process.env.NODE_ENV === "development",
};
