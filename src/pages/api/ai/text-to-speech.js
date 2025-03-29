import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { v2 as cloudinary } from "cloudinary";
import { Writable } from "stream";
import { v4 as uuidv4 } from "uuid";

// Configure Cloudinary (ensure environment variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Instantiate Google TTS Client
// Assumes GOOGLE_APPLICATION_CREDENTIALS environment variable is set
const ttsClient = new TextToSpeechClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { text, blogId } = req.body; // blogId is optional, used for filename

  if (!text || typeof text !== "string" || !text.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Text input is required." });
  }

  // --- Google TTS Request ---
  const request = {
    input: { text: text },
    // Select the language code and SSML voice gender (optional)
    // Recommended: Use a WaveNet voice for higher quality (might affect free tier usage)
    // Find voice names: https://cloud.google.com/text-to-speech/docs/voices
    voice: { languageCode: "en-US", name: "en-US-Standard-D" }, // Example standard voice
    // voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D' }, // Example WaveNet voice
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    console.log(
      `[Google TTS] Requesting TTS for text (first 100 chars): "${text.substring(
        0,
        100
      )}..."`
    );
    // Performs the text-to-speech request
    const [ttsResponse] = await ttsClient.synthesizeSpeech(request);
    const audioContent = ttsResponse.audioContent; // This is a Buffer

    if (!audioContent) {
      throw new Error("Google TTS returned empty audio content.");
    }
    console.log("[Google TTS] Audio content received from Google.");

    // --- Cloudinary Upload ---
    // Generate a unique public ID for Cloudinary
    const publicId = `blog_audio/${blogId || uuidv4()}_${Date.now()}`;

    console.log(`[Cloudinary] Uploading audio with public_id: ${publicId}`);

    // Use upload_stream to upload the buffer
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video", // Use 'video' for audio files in Cloudinary
          public_id: publicId,
          format: "mp3", // Specify the format
          // Optional: Add tags or other metadata
          // tags: ["blog-audio", blogId || "unknown-blog"],
        },
        (error, result) => {
          if (error) {
            console.error("[Cloudinary] Upload Error:", error);
            return reject(new Error("Failed to upload audio to Cloudinary."));
          }
          if (!result?.secure_url) {
            console.error(
              "[Cloudinary] Upload Error: No secure_url in result",
              result
            );
            return reject(
              new Error("Cloudinary upload result missing secure_url.")
            );
          }
          console.log(`[Cloudinary] Upload successful: ${result.secure_url}`);
          resolve(result);
        }
      );

      // Create a readable stream from the buffer and pipe it
      const readableAudioStream = new Writable({
        write(chunk, encoding, callback) {
          uploadStream.write(chunk, encoding, callback);
        },
        final(callback) {
          uploadStream.end(callback);
        },
      });
      readableAudioStream.write(audioContent);
      readableAudioStream.end();
    });

    const cloudinaryResult = await uploadPromise;

    // Return the secure URL from Cloudinary
    res
      .status(200)
      .json({ success: true, audioUrl: cloudinaryResult.secure_url });
  } catch (error) {
    console.error("[Google TTS/Cloudinary] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate or upload audio summary.",
      error: error.message,
    });
  }
}
