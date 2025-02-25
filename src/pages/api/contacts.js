import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Connect to database
  await dbConnect();

  // Handle GET request to fetch all contacts
  if (req.method === "GET") {
    try {
      // Get pagination parameters
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const total = await Contact.countDocuments();

      // Fetch contacts with pagination and sort by newest first
      const contacts = await Contact.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Calculate total pages
      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        data: contacts,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching contacts",
      });
    }
  }

  // Handle DELETE request to delete a contact
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Contact ID is required",
        });
      }

      const deletedContact = await Contact.findByIdAndDelete(id);

      if (!deletedContact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Contact deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting contact",
      });
    }
  }

  // Return method not allowed for other request types
  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}
