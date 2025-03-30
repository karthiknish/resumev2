import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini"; // Assuming this handles model selection or uses a default

// Helper function to check admin status
async function isAdminUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  return (
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // Determine which model to test (default to gemini-pro if not specified)
  // Note: The actual model used depends on how `callGemini` is implemented.
  // This example assumes `callGemini` might internally use a default or handle different models.
  // For a true multi-model test, `callGemini` would need modification or separate test functions.
  const modelToTest = req.query.model || "gemini-1.5-flash-latest"; // Example: Default to flash, or get from query like ?model=gemini-pro
  const modelDisplayName = modelToTest.includes("pro")
    ? "Gemini Pro"
    : modelToTest.includes("flash")
    ? "Gemini Flash"
    : "Gemini (Default)";

  try {
    // Simple test prompt
    const testPrompt =
      "Briefly explain what a large language model is in one sentence.";
    const generationConfig = { temperature: 0.5, maxOutputTokens: 50 };

    // Assuming callGemini can handle different models or uses a configured default
    // If callGemini needs the model name passed explicitly, adjust here.
    const result = await callGemini(testPrompt, generationConfig);

    if (result && typeof result === "string" && result.length > 0) {
      console.log(`Gemini Test (${modelDisplayName}) successful:`, result);
      res
        .status(200)
        .json({
          success: true,
          message: `${modelDisplayName} Operational`,
          response: result,
        });
    } else {
      throw new Error("Received empty or invalid response from Gemini.");
    }
  } catch (error) {
    console.error(`Error testing Gemini model (${modelDisplayName}):`, error);
    res.status(500).json({
      success: false,
      message: `Error testing ${modelDisplayName}: ${error.message}`,
    });
  }
}
