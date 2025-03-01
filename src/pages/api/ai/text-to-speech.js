// src/pages/api/ai/text-to-speech.js
// API endpoint to convert text to speech using Google Cloud Text-to-Speech API

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import fs from "fs";
import path from "path";
import util from "util";
import crypto from "crypto";

// Create a client for Google Cloud Text-to-Speech
let textToSpeechClient;

try {
  // Check if Google Cloud credentials are provided as environment variable
  if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    textToSpeechClient = new TextToSpeechClient({ credentials });
  } else {
    // Fallback to default authentication (Application Default Credentials)
    textToSpeechClient = new TextToSpeechClient();
  }
} catch (error) {
  console.error("Error initializing Text-to-Speech client:", error);
}

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "public", "uploads", "audio");
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.error("Error creating upload directory:", error);
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!textToSpeechClient) {
      return res
        .status(500)
        .json({ error: "Text-to-Speech service is not configured" });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text content is required" });
    }

    // Generate a unique ID for the audio file
    const hash = crypto.createHash("md5").update(text).digest("hex");
    const fileName = `blog-summary-${hash}.mp3`;
    const filePath = path.join(uploadDir, fileName);

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      // Return the existing file URL
      return res.status(200).json({
        audioUrl: `/uploads/audio/${fileName}`,
      });
    }

    // Set up the request parameters
    const request = {
      input: { text },
      voice: {
        languageCode: "en-GB",
        name: "en-GB-Neural2-B", // A UK English male voice
        ssmlGender: "MALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.0,
        pitch: 0,
        volumeGainDb: 0,
      },
    };

    // Make the API call
    const [response] = await textToSpeechClient.synthesizeSpeech(request);

    // Write the audio content to a file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, response.audioContent, "binary");

    // Return the audio file URL
    return res.status(200).json({
      audioUrl: `/uploads/audio/${fileName}`,
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return res.status(500).json({
      error: "Error generating speech",
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
