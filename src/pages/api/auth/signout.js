import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Clear the session cookie
    res.setHeader("Set-Cookie", [
      `next-auth.session-token=; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Max-Age=0`,
      `next-auth.csrf-token=; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Max-Age=0`,
      `next-auth.callback-url=; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Max-Age=0`,
    ]);

    return res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    console.error("Signout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};