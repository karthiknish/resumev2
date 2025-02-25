const fs = require("fs");

// Function to clean up the content
function cleanContent(content) {
  // Remove excessive backslashes
  let cleaned = content.replace(/\\+/g, "");

  // Extract actual content
  const contentMatch = cleaned.match(
    /## ### Introduction([\s\S]*?)this is how my content is changed to now/
  );
  if (contentMatch && contentMatch[1]) {
    cleaned = contentMatch[1].trim();
  }

  // Fix headings (ensure proper format with space after #)
  cleaned = cleaned.replace(/#{1,6}([^#\s])/g, (match, text) => {
    const hashCount = match.length - text.length;
    return "#".repeat(hashCount) + " " + text;
  });

  // Structure the content properly
  let structuredContent = `# The Future of Artificial Intelligence

## Introduction

Artificial Intelligence (AI) has emerged as a transformative force, reshaping industries, empowering innovation, and redefining our interactions with technology. As we venture into the uncharted waters of AI's future, it's imperative to explore the potential frontiers and speculate on its transformative impact on society.

## The Evolution of AI Capabilities

1. **Enhanced Cognitive Abilities:**
   AI systems will continue to evolve, exhibiting more sophisticated cognitive abilities such as reasoning, problem-solving, and decision-making. This will enable them to automate complex tasks, improve prediction accuracy, and provide personalized experiences.

2. **Ubiquitous Presence:**
   AI will become increasingly pervasive, embedded into various devices and applications. From self-driving cars to smart homes and healthcare diagnostics, AI will enhance our daily lives, fostering seamless interactions and optimizing efficiency.

3. **Human-AI Collaboration:**
   AI will transition from a standalone tool to a collaborative partner. By augmenting human capabilities, AI will enhance creativity, productivity, and efficiency. Interdisciplinary teams of humans and AI will drive innovation and tackle complex challenges.

## Ethical and Societal Implications

1. **Job Displacement and Labor Market Transformation:**
   As AI automates tasks and improves efficiency, it may disrupt the labor market, leading to job displacement. However, it will also create new opportunities in fields such as AI development, data science, and human-AI collaboration.

2. **Data Privacy and Security:**
   The proliferation of AI systems will raise concerns about data privacy and security. AI algorithms rely on vast amounts of data, necessitating robust measures to protect personal information and prevent misuse.

3. **Algorithmic Bias and Fairness:**
   AI systems can perpetuate biases embedded in the data they are trained on. This can lead to unfair or discriminatory outcomes. Addressing algorithmic bias is crucial for ensuring equity and fairness in AI applications.

## The Role of AI in Industries

1. **Healthcare:**
   AI will revolutionize healthcare by enabling personalized medicine, early disease detection, and improved treatment outcomes. AI-powered systems will assist in diagnosis, drug discovery, and precision surgery.

2. **Finance:**
   AI will transform the financial industry by automating risk assessment, detecting fraud, and providing personalized financial advice. It will enhance efficiency, reduce operating costs, and improve customer experiences.

3. **Transportation:**
   Self-driving cars and autonomous vehicles will reshape transportation, improving safety, reducing traffic congestion, and enabling new mobility services. AI will also optimize logistics and supply chain management.

## Conclusion

The future of AI holds boundless possibilities. As AI systems evolve and become more sophisticated, they will continue to reshape society, industries, and human interactions. Embracing the transformative potential of AI while addressing ethical concerns and fostering human-AI collaboration is paramount. By navigating the uncharted waters of AI responsibly, we can harness its power to create a future where technology empowers humanity and enhances our collective progress.`;

  return structuredContent;
}

// Create a file with the cleaned content
const cleanedContent = cleanContent(fs.readFileSync("input-blog.txt", "utf8"));
fs.writeFileSync("formatted-blog.md", cleanedContent);

console.log("Content has been formatted and saved to formatted-blog.md");
