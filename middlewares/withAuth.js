import { getSession } from "next-auth/react";

export default function withAuth(handler) {
  return async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.session = session;
    return handler(req, res);
  };
}
