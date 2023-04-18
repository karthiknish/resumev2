import dbConnect from "../../lib/dbConnect";
import Subscriber from "../../models/Subscriber";
export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const { email, name } = req.body;
    try {
      await Subscriber.create({ email, name });
      res.status(201).json({ message: "Successfully subscribed" });
    } catch (error) {
      res.status(400).json({ message: "Failed to subscribe" });
    }
  } else if (req.method === "GET") {
    try {
      const subscribers = await Subscriber.find({});
      res.status(200).json({ success: true, data: subscribers });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, data: "Failed to fetch subscribers" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    console.log(id);
    try {
      const deletedSubscriber = await Subscriber.findByIdAndDelete(id);
      if (!deletedSubscriber) {
        res.status(404).json({ message: "Subscriber not found" });
      } else {
        res.status(200).json({ message: "Subscriber deleted successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Failed to delete subscriber" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
