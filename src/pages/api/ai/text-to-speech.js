// src/pages/api/ai/text-to-speech.js
// API endpoint to convert text to speech using Google Cloud Text-to-Speech API

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import fs from "fs";
import path from "path";
import util from "util";
import crypto from "crypto";

// Create a client for Google Cloud Text-to-Speech
let textToSpeechClient;
let isServiceAvailable = false;

try {
  // Check if Google Cloud credentials are provided as environment variable
  if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    textToSpeechClient = new TextToSpeechClient({ credentials });
    isServiceAvailable = true;
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Try using Application Default Credentials from path
    textToSpeechClient = new TextToSpeechClient();
    isServiceAvailable = true;
  } else {
    console.warn(
      "Google Cloud credentials not found, TTS service will use fallback"
    );
  }
} catch (error) {
  console.error("Error initializing Text-to-Speech client:", error);
}

// Ensure uploads directory exists in environments where we have write access
const uploadDir = path.join(process.cwd(), "public", "uploads", "audio");
let canWriteFiles = false;

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  // Test file writing capability
  const testFile = path.join(uploadDir, ".test-write-access");
  fs.writeFileSync(testFile, "test", { flag: "w" });
  fs.unlinkSync(testFile);
  canWriteFiles = true;
} catch (error) {
  console.warn(
    "Cannot write to filesystem, TTS will use fallback:",
    error.message
  );
}

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

    // If the TTS service is not available or we can't write files, return early with error
    if (!isServiceAvailable || !canWriteFiles) {
      return res.status(503).json({
        error: "Text-to-Speech service unavailable",
        useFallback: true,
        reason: !isServiceAvailable
          ? "credentials_missing"
          : "filesystem_access",
        message: "Use browser-based speech synthesis instead.",
      });
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

    try {
      // Make the API call
      const [response] = await textToSpeechClient.synthesizeSpeech(request);

      // Write the audio content to a file
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(filePath, response.audioContent, "binary");

      // Return the audio file URL
      return res.status(200).json({
        audioUrl: `/uploads/audio/${fileName}`,
      });
    } catch (apiError) {
      console.error("Error calling Text-to-Speech API:", apiError);
      return res.status(503).json({
        error: "Text-to-Speech API call failed",
        useFallback: true,
        reason: "api_error",
        message: apiError.message,
      });
    }
  } catch (error) {
    console.error("Error in Text-to-Speech handler:", error);
    return res.status(500).json({
      error: "Error generating speech",
      message: error.message,
      useFallback: true,
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
