// Converted to TypeScript - migrated
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { runQuery, fieldFilter } from "@/lib/firebase";
import { IUser } from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const emailLower = credentials.email.toLowerCase();
          console.log("[NextAuth] Attempting login for:", emailLower);
          
          // Query users from Firebase by email
          const users = await runQuery(
            "users",
            [fieldFilter("email", "EQUAL", emailLower)],
            null,
            1
          );

          const user = users[0] as unknown as IUser;

          if (!user) {
            console.log("[NextAuth] No user found with email:", emailLower);
            throw new Error("No user found with this email");
          }

          console.log("[NextAuth] Found user:", user.email, "Role:", user.role);

          const isValid = await bcrypt.compare(credentials.password, user.password || "");
          console.log("[NextAuth] Password valid:", isValid);
          
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id || user.id || "",
            email: user.email,
            name: user.name,
            role: user.role,
          } as User;
        } catch (error) {
          console.error("[NextAuth] Auth error:", (error as Error).message);
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
        token.isAdmin = user.role === "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAdmin = (token.role === "admin") || !!token.isAdmin;
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

