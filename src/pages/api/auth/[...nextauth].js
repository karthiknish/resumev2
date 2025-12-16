import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getCollection } from "@/lib/firebase";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const emailLower = credentials.email.toLowerCase();
          console.log("[NextAuth] Attempting login for:", emailLower);
          
          // Fetch users from Firebase
          const result = await getCollection("users");
          const users = result.documents || [];
          console.log("[NextAuth] Found users count:", users.length);
          console.log("[NextAuth] User emails:", users.map(u => u.email));
          
          const user = users.find(u => u.email === emailLower);

          if (!user) {
            console.log("[NextAuth] No user found with email:", emailLower);
            throw new Error("No user found with this email");
          }

          console.log("[NextAuth] Found user:", user.email, "Role:", user.role);
          console.log("[NextAuth] Password hash exists:", !!user.password);

          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log("[NextAuth] Password valid:", isValid);
          
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("[NextAuth] Auth error:", error.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
};

export default NextAuth(authOptions);
