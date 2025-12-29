import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDB from "@/backend/src/config/database";
import User from "@/backend/src/models/User";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Connect to DB
        await connectDB();

        // Find user
        const user = await User.findOne({
          username: credentials.username,
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        // Return user object (stored in JWT)
        return {
          id: user._id.toString(),
          username: user.username,
          role: user.role || "admin",
        };
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
};
