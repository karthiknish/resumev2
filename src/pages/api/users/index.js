import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;

  // Check for authenticated admin session
  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Admin access required" });
  }

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // Fetch users, excluding password field
        const users = await User.find({}).select("-password");
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        console.error("API Users GET Error:", error);
        res
          .status(400)
          .json({ success: false, message: "Failed to fetch users" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
