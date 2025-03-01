// src/pages/api/ai/text-to-speech-fallback.js
// Fallback API endpoint to convert text to speech using a public TTS service

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text content is required" });
    }

    // Using Web Speech API compatible format
    // This approach allows the client to handle the TTS directly
    // without relying on backend services when Google Cloud is not available
    return res.status(200).json({
      useFallback: true,
      text: text,
      fallbackInstructions: "Using browser-based text-to-speech as fallback",
    });
  } catch (error) {
    console.error("Error in fallback TTS:", error);
    return res.status(500).json({
      error: "Error in fallback text-to-speech",
      message: error.message,
    });
  }
}

// Configure Next.js API to handle larger requests
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
