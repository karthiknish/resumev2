import OpenAI from "openai";
import natural from "natural";
import { v4 as uuidv4 } from "uuid";
import Blog from "../../models/Blog";
import { paraphrase } from "text-paraphraser";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

export default async function handler(req, res) {
  console.log("Handler function started");
  if (req.method !== "POST") {
    console.log("Method not allowed");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { title, context } = req.body;
  console.log("Received title:", title);
  console.log("Received context:", context);

  if (!title || !context) {
    console.log("Title or context missing");
    return res.status(400).json({ message: "Title and context are required" });
  }

  try {
    console.log("Generating prompt");
    const prompt = `Write a blog post with the title "${title}". Use the following context as a guide: ${context}. The blog post should be well-structured, informative, and engaging. Include a featured image description and 2-3 related image descriptions.`;

    console.log("Calling OpenAI API");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0314",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log("Processing generated text");
    const generatedText = completion.choices[0].message.content.trim();

    const contentParts = generatedText.split("\n\n");
    let content = contentParts[0];
    const featuredImage = contentParts[1]?.replace("Featured Image: ", "");
    const relatedImages = contentParts
      .slice(2)
      .map((img) => img.replace("Related Image: ", ""));

    console.log("Running complex algorithms");
    const isHumanWritten = await runComplexAlgorithms(content);

    if (!isHumanWritten) {
      console.log("Content appears to be AI-generated. Rewriting content.");
      content = await rewriteContent(content);
    }

    console.log("Saving to database");
    const newBlog = new Blog({
      title,
      content,
      imageUrl: featuredImage, // Assuming the first image description is used as the main image
    });

    await newBlog.save();

    console.log("Sending successful response");
    res.status(200).json({
      content,
      featuredImage,
      relatedImages,
    });
  } catch (error) {
    console.error("Error generating blog post:", error);
    res.status(500).json({ message: "Error generating blog post" });
  }
}

async function runComplexAlgorithms(text) {
  console.log("Starting complex algorithms");
  const tfidf = new TfIdf();
  tfidf.addDocument(text);
  const uniqueWords = new Set(tokenizer.tokenize(text));
  const tfidfScore =
    Array.from(uniqueWords).reduce(
      (sum, word) => sum + tfidf.tfidf(word, 0),
      0
    ) / uniqueWords.size;
  console.log("TF-IDF score:", tfidfScore);

  console.log("Calculating perplexity");
  const perplexity = await calculatePerplexity(text);
  console.log("Perplexity:", perplexity);

  console.log("Calculating randomness score");
  const randomnessScore = calculateRandomness(text);
  console.log("Randomness score:", randomnessScore);

  console.log("Calculating sentence structure variety");
  const structureVarietyScore = calculateSentenceStructureVariety(text);
  console.log("Structure variety score:", structureVarietyScore);

  const totalScore =
    tfidfScore * 0.3 +
    perplexity * 0.3 +
    randomnessScore * 0.2 +
    structureVarietyScore * 0.2;
  console.log("Total score:", totalScore);

  return totalScore > 0.6; // Threshold for considering content as human-written
}

async function calculatePerplexity(text) {
  console.log("Calculating perplexity (placeholder)");
  // This is a placeholder. In a real implementation, you'd use a pre-trained language model to calculate perplexity.
  return Math.random(); // Returns a value between 0 and 1
}

function calculateRandomness(text) {
  console.log("Calculating randomness");
  const uniqueId = uuidv4();
  const textWithId = text + uniqueId;
  return new Set(textWithId).size / textWithId.length;
}

function calculateSentenceStructureVariety(text) {
  console.log("Calculating sentence structure variety");
  const sentences = text.split(/[.!?]+/);
  const structures = sentences.map((s) => s.trim().split(" ").length);
  return new Set(structures).size / sentences.length;
}

async function rewriteContent(content) {
  console.log("Rewriting AI-generated content");
  try {
    const rewrittenContent = await paraphrase(content);
    return rewrittenContent;
  } catch (error) {
    console.error("Error rewriting content:", error);
    // If rewriting fails, fall back to the original OpenAI method
    return alterContentWithOpenAI(content);
  }
}

async function alterContentWithOpenAI(content) {
  console.log("Altering content with OpenAI as fallback");
  const alterPrompt = `Rewrite the following content to make it more human-like, introducing more variety in sentence structure and vocabulary: "${content}"`;

  const alteredCompletion = await openai.chat.completions.create({
    model: "gpt-4-0314",
    messages: [{ role: "user", content: alterPrompt }],
    max_tokens: 1000,
    temperature: 0.9,
  });

  return alteredCompletion.choices[0].message.content.trim();
}
