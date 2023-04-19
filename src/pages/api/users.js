import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getSession } from "next-auth/react";
export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  try {
    await dbConnect();
    const users = await User.find({});

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, data: "An error occurred while fetching users" });
  }
}
