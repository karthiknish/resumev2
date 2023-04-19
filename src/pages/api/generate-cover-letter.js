const dotenv = require("dotenv");
import fetch from "node-fetch";
import { getSession } from "next-auth/react";
import dbConnect from "../../lib/dbConnect";
dotenv.config();
import ResumeExtract from "../../models/ResumeExtract";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CUSTOM_SEARCH_ENGINE_ID = process.env.CUSTOM_SEARCH_ENGINE_ID;
const GOOGLE_SEARCH_API_URL = "https://www.googleapis.com/customsearch/v1";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
async function fetchJobDescription(companyName, role) {
  const query = `job description for ${role} at ${companyName} based in UK`;
  const url = `${GOOGLE_SEARCH_API_URL}?key=${GOOGLE_API_KEY}&cx=${CUSTOM_SEARCH_ENGINE_ID}&q=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    console.log(data.items[0].snippet);
    return data.items[0].snippet;
  }
  return "";
}
export default async function handler(req, res) {
  await dbConnect();
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userEmail = session.user.email;
  switch (req.method) {
    case "GET":
      try {
        const resumeExtract = await ResumeExtract.findOne({
          userEmail,
        });
        if (resumeExtract) {
          res.status(200).json({
            success: true,
            extracted_text: resumeExtract.extractedText,
          });
        } else {
          res.status(404).json({ error: "Extracted text not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch extracted text" });
        return;
      }
      break;

    case "POST":
      const { companyName, role, extractedText } = req.body;
      let jobDescription;
      try {
        jobDescription = await fetchJobDescription(companyName, role);
      } catch (error) {
        console.error("Failed to fetch job description:", error);
        res.status(500).json({ error: "Failed to fetch job description" });
        return;
      }
      try {
        await ResumeExtract.findOneAndUpdate(
          { userEmail },
          { userEmail, extractedText },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (error) {
        console.error("Failed to save extracted text:", error);
        res.status(500).json({ error: "Failed to save extracted text" });
        return;
      }
      if (jobDescription !== "") {
        const prompt = `As an applicant who is highly interested in the role of ${role} at ${companyName}, I believe my skills and experience make me a valuable addition to the team. Create a compelling cover letter with atleast 400 words that will convince the hiring manager of my potential based on the following job description:\n${jobDescription}\nExplain the Resume summary:\n${extractedText} in the context of the posting.`;
        try {
          const response = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
              max_tokens: 800,
              n: 1,
              stop: null,
              temperature: 0.8,
            }),
          });

          const data = await response.json();
          const coverLetter = data.choices[0].message.content.trim();
          res.status(200).json({ success: true, cover_letter: coverLetter });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to generate cover letter" });
          return;
        }
      } else {
        res.status(404).json({ error: "Job description not found" });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}
