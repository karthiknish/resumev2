import dbConnect from "../../lib/dbConnect";
import Contact from "../../models/Contact";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const contacts = await Contact.find();
        return res.status(200).json({ success: true, data: contacts });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    case "POST":
      try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
          return res
            .status(400)
            .json({ success: false, message: "All fields are required." });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        return res.status(201).json({ success: true, data: newContact });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    default:
      return res
        .status(400)
        .json({ success: false, message: "Invalid request method" });
  }
}
