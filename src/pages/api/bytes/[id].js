import dbConnect from "@/lib/dbConnect";
import Byte from "@/models/Byte";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  // Check for admin session for all methods modifying a specific byte
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
    case "DELETE":
      try {
        const deletedByte = await Byte.deleteOne({ _id: id });
        if (!deletedByte || deletedByte.deletedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Byte not found" });
        }
        res.status(200).json({ success: true, data: {} }); // Indicate success with empty data
      } catch (error) {
        console.error("API Byte DELETE Error:", error);
        res
          .status(400)
          .json({ success: false, message: error.message || "Server Error" });
      }
      break;

    // Add PUT/PATCH for updates or GET for single fetch later if needed

    default:
      res.setHeader("Allow", ["DELETE"]); // Add other allowed methods here
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
