import { useState } from "react";
import Head from "next/head";
import Markdown from "../../../components/Markdown";
import axios from "axios";

function Create() {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBlogPost = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post("/api/generate-blog", {
        title,
        context,
      });
      const {
        content: generatedContent,
        featuredImage,
        relatedImages,
      } = response.data;
      setContent(generatedContent);
      // You might want to handle featuredImage and relatedImages here
      // For example, you could insert them into the content at appropriate positions
    } catch (error) {
      console.error("Error generating blog post:", error);
    }
    setIsGenerating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, content };
    try {
      const response = await axios.post("/api/blog", data);
      if (response.data.success) {
        setTitle("");
        setContext("");
        setContent("");
      }
    } catch (error) {
      console.error("Error submitting blog post:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Create Blog</title>
      </Head>
      <div className="flex flex-col p-4 gap-4 mx-10">
        <h1 className="text-center text-4xl font-bold">Create Blog</h1>
        <input
          value={title}
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          placeholder="Title"
        />
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          placeholder="Enter a few lines of context for the blog post"
          rows={4}
        />
        <button
          className="bg-green-500 p-4 text-white rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400"
          onClick={generateBlogPost}
          disabled={isGenerating || !title || !context}
        >
          {isGenerating ? "Generating..." : "Generate Blog Post"}
        </button>
        <Markdown content={content} setContent={setContent} />
        <button
          className="bg-blue-500 p-4 text-white rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400"
          onClick={handleSubmit}
          disabled={!title || !content}
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default Create;
