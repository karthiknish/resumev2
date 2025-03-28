import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import { getSession } from "next-auth/react"; // To check for admin session

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  // Check for admin session - IMPORTANT for security
  const session = await getSession({ req });
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        const deletedContact = await Contact.deleteOne({ _id: id });
        if (!deletedContact || deletedContact.deletedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Contact not found" });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        console.error("API Delete Error:", error);
        res
          .status(400)
          .json({ success: false, message: error.message || "Server Error" });
      }
      break;

    /* Potential GET handler for fetching a single contact if needed later
    case 'GET':
      try {
        const contact = await Contact.findById(id);
        if (!contact) {
          return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.status(200).json({ success: true, data: contact });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    */

    default:
      res.setHeader("Allow", ["DELETE"]); // Add GET if implemented
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
