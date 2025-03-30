import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // Adjust path if needed

// Helper function to check admin status
async function isAdminUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  return (
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  // Admin check required for GET (listing) and potentially DELETE later
  if (req.method === "GET" || req.method === "DELETE") {
    const isAdmin = await isAdminUser(req, res);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Admin access required" });
    }
  }

  switch (method) {
    case "GET":
      try {
        // Check for countOnly query parameter
        if (req.query.countOnly === "true") {
          const filter =
            req.query.isRead === "false" ? { isRead: { $ne: true } } : {}; // Filter for unread if requested
          const count = await Contact.countDocuments(filter);
          return res.status(200).json({ success: true, count });
        }

        // Default: Fetch all contacts, sorted by creation date descending
        const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, data: contacts });
      } catch (error) {
        console.error("API Contacts GET Error:", error);
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch contacts" });
      }
      break;

    case "POST": // This was the original contact form submission logic
      try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
          return res
            .status(400)
            .json({ success: false, message: "Missing required fields" });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
          return res
            .status(400)
            .json({
              success: false,
              message: "Invalid email address provided.",
            });
        }

        // Save contact message using the service function (assuming it exists and handles validation)
        // If not using service, create directly:
        const newContact = await Contact.create({
          name,
          email,
          message,
          createdAt: new Date(),
          isRead: false, // Default to unread
        });

        // TODO: Consider moving email sending logic here if it wasn't moved to a service
        // For now, just save to DB

        res
          .status(201)
          .json({
            success: true,
            message: "Contact submission received.",
            data: newContact,
          });
      } catch (error) {
        console.error("Contact form submission error:", error);
        res
          .status(500)
          .json({
            success: false,
            message: "Error processing contact submission",
          });
      }
      break;

    // Add DELETE later if needed (using req.query.id)
    // case "DELETE": ...

    default:
      res.setHeader("Allow", ["GET", "POST"]); // Add other methods like DELETE later
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
