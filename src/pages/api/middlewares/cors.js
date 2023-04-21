import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD", "POST", "OPTIONS"], // Allowed methods
  origin: "https://images.unsplash.com", // Allowed origin(s), set your own domain or specific domains here
});

// Helper method to run middleware manually
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};

export default runMiddleware(cors);
