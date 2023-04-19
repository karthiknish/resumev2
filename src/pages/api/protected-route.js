import withAuth from "../../../middlewares/withAuth";
async function handler(req, res) {
  // Your existing route handling code
  res.status(200).json({ message: "This is a protected route" });
}

export default withAuth(handler);
