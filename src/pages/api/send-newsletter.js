import dbConnect from "../../lib/dbConnect";
import sendNewsletter from "../../lib/mailer";
import Subscriber from "../../models/Subscriber";
export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const { subject, content } = req.body;
    try {
      const subscribers = await Subscriber.find({});
      const emails = subscribers.map((subscriber) => subscriber.email);
      await sendNewsletter(subject, content, emails);
      res.status(200).json({ message: "Newsletter sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send newsletter" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
