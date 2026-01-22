// Converted to TypeScript - migrated
import { getCollection } from "@/lib/firebase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
  }

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const result = await getCollection("users");
    const users = (result.documents || []).map((user: Record<string, unknown>) => {
      // Exclude password field
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    return res.status(200).json({ success: true, data: users });
  } catch (error: unknown) {
    console.error("API Users GET Error:", error);
    return res.status(400).json({ success: false, message: "Failed to fetch users" });
  }
}

