import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  AiOutlineLoading3Quarters,
  AiOutlineRobot,
  AiOutlineEdit,
  AiOutlineSave,
  AiOutlineSearch,
  AiOutlineCheck,
  AiOutlinePicture,
  AiOutlineFormatPainter,
  AiOutlineBulb, // Icon for keyword suggestions
  AiOutlineTags, // Icon for topic suggestions
  AiOutlineGlobal, // Icon for trending news
} from "react-icons/ai";
import { FiRefreshCw, FiPlus } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import PageContainer from "@/components/PageContainer"; // Import PageContainer

export default function AICreateBlog() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("800");
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Pexels image search states
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pexelsDebounceRef = useRef();

  const [isFormatting, setIsFormatting] = useState(false);
  const [formatSuccess, setFormatSuccess] = useState(false);

  // Blog-from-link states
  const [articleUrl, setArticleUrl] = useState("");
  const [styleInstructions, setStyleInstructions] = useState("");
  const [isConvertingLink, setIsConvertingLink] = useState(false);

  // Keyword suggestion states
  const [isSuggestingKeywords, setIsSuggestingKeywords] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);

  // Outline generation states
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState(null); // { title: string, headings: string[] }

  // Topic suggestion states
  const [isSuggestingTopics, setIsSuggestingTopics] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState([]);

  // Trending news states
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [trendingNews, setTrendingNews] = useState([]); // Array of { headline: string, summary: string }

  const toneOptions = [
    "professional",
    "casual",
    "informative",
    "conversational",
    "enthusiastic",
    "technical",
  ];

  const lengthOptions = ["500", "800", "1200", "1500", "2000"];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Set initial image search query based on topic or keywords
  useEffect(() => {
    if (generatedContent && !imageSearchQuery) {
      if (keywords) {
        setImageSearchQuery(keywords.split(",")[0].trim());
      } else if (topic) {
        setImageSearchQuery(topic);
      }
    }
  }, [generatedContent, keywords, topic, imageSearchQuery]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setError("");
    setIsGenerating(true);
    setGeneratedContent(null); // Clear previous full content
    setSelectedImage(null);
    // Keep suggested keywords, but clear outline if generating full post directly
    // setSuggestedKeywords([]);
    // setGeneratedOutline(null); // Clear outline if generating full post without using outline first

    try {
      const keywordsArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);

      const response = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: generatedOutline?.title || topic, // Use outline title if available
          tone,
          length: parseInt(length),
          keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
          outline: generatedOutline, // Pass the generated outline
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to generate content");
      }

      setGeneratedContent(result.data);
      setEditedTitle(result.data.title);
      setEditedContent(result.data.content);

      // Auto-search for images based on the first keyword or topic
      if (keywordsArray.length > 0) {
        setImageSearchQuery(keywordsArray[0]);
      } else {
        setImageSearchQuery(topic);
      }
      // Suggest keywords based on the final topic/title used
      handleSuggestKeywords(generatedOutline?.title || topic);
    } catch (error) {
      console.error("Error generating content:", error);
      setError(error.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchImages = async (page = 1) => {
    if (!imageSearchQuery.trim()) {
      setError("Please enter an image search query");
      return;
    }

    setError("");
    setIsSearchingImages(true);

    try {
      // NOTE: Assuming you have a Pexels API endpoint set up
      const response = await fetch(
        `/api/pexels/search?query=${encodeURIComponent(
          imageSearchQuery
        )}&page=${page}&per_page=12`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to search for images");
      }

      setSearchResults(result.data.photos);
      setTotalPages(Math.ceil(result.data.total_results / 12));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching for images:", error);
      setError(error.message || "Failed to search for images");
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setShowImageSearch(false);
  };

  const handleSaveBlog = async () => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      setError("Title and content are required");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      // Extract a brief excerpt from the content
      const excerpt =
        editedContent
          .replace(/[#*_]/g, "") // Remove markdown formatting for excerpt
          .split("\n")
          .filter((line) => line.trim().length > 0)[0] // Get first non-empty line
          ?.substring(0, 150) + "..." || // Take first 150 chars
        editedTitle; // Fallback to title if content is empty

      // Use selected image URL or fallback to placeholder
      const imageUrl = selectedImage
        ? selectedImage.src.large
        : `https://source.unsplash.com/random/1200x630/?${encodeURIComponent(
            topic || "blog"
          )}`; // Use topic for random image

      const response = await fetch("/api/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
          excerpt,
          imageUrl,
          tags: keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
          isPublished: false, // Save as draft by default
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save blog post");
      }

      setSaveSuccess(true);

      // Redirect to edit page after a short delay
      setTimeout(() => {
        router.push(`/admin/blog/edit/${result.data._id}`); // Use correct edit path
      }, 1500);
    } catch (error) {
      console.error("Error saving blog post:", error);
      setError(error.message || "Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handler for converting article link to blog
  const handleConvertLink = async () => {
    if (!articleUrl.trim()) {
      setError("Please enter an article URL");
      return;
    }
    setError("");
    setIsConvertingLink(true);
    setGeneratedContent(null);
    setSelectedImage(null);

    try {
      const response = await fetch("/api/ai/blog-from-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: articleUrl.trim(),
          styleInstructions: styleInstructions.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        // Show a more user-friendly error for extraction/model issues
        if (
          result.error &&
          (result.error.includes("Prompt cannot be empty") ||
            result.error.includes(
              "Could not extract sufficient article content"
            ))
        ) {
          setError(
            "Could not extract enough content from the provided link. Please check the URL or try a different article."
          );
        } else {
          setError(result.error || "Failed to convert article link");
        }
        return;
      }
      setGeneratedContent({ title: result.title, content: result.content });
      setEditedTitle(result.title);
      setEditedContent(result.content);
      setArticleUrl("");
      setStyleInstructions("");
      // Optionally, auto-suggest keywords from the new content
      handleSuggestKeywords(result.title);
    } catch (error) {
      console.error("Error converting article link:", error);
      setError(error.message || "Failed to convert article link");
    } finally {
      setIsConvertingLink(false);
    }
  };

  // Function to suggest keywords
  const handleSuggestKeywords = async (currentTopic = topic) => {
    // Accept topic override
    if (!currentTopic.trim()) {
      // Don't show error if topic is empty, just don't suggest
      // setError("Please enter a topic first to suggest keywords.");
      return;
    }
    setError("");
    setIsSuggestingKeywords(true);
    setSuggestedKeywords([]);

    try {
      const response = await fetch("/api/ai/suggest-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentTopic,
          contentSnippet: editedContent
            ? editedContent.substring(0, 800)
            : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to suggest keywords");
      }
      setSuggestedKeywords(result.keywords || []);
    } catch (error) {
      console.error("Error suggesting keywords:", error);
      setError(error.message || "Failed to suggest keywords");
    } finally {
      setIsSuggestingKeywords(false);
    }
  };

  // Function to generate outline
  const handleGenerateOutline = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic first to generate an outline.");
      return;
    }
    setError("");
    setIsGeneratingOutline(true);
    setGeneratedOutline(null); // Clear previous outline

    try {
      const response = await fetch("/api/ai/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to generate outline");
      }
      setGeneratedOutline(result.outline);
      // Suggest keywords based on the new outline/topic
      handleSuggestKeywords(result.outline?.title || topic);
    } catch (error) {
      console.error("Error generating outline:", error);
      setError(error.message || "Failed to generate outline");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Function to add a suggested keyword to the input field
  const addKeyword = (keywordToAdd) => {
    const currentKeywords = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);
    if (!currentKeywords.includes(keywordToAdd)) {
      setKeywords([...currentKeywords, keywordToAdd].join(", "));
    }
    // Remove the keyword from suggestions after adding
    setSuggestedKeywords(suggestedKeywords.filter((k) => k !== keywordToAdd));
  };

  // Function to suggest topics
  const handleSuggestTopics = async () => {
    setError("");
    setIsSuggestingTopics(true);
    setSuggestedTopics([]);
    try {
      const response = await fetch("/api/ai/suggest-topics", {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to suggest topics");
      }
      setSuggestedTopics(result.topics || []);
    } catch (error) {
      console.error("Error suggesting topics:", error);
      setError(error.message || "Failed to suggest topics");
    } finally {
      setIsSuggestingTopics(false);
    }
  };

  // Function to use a suggested topic
  const useSuggestedTopic = (suggestedTopic) => {
    setTopic(suggestedTopic);
    setSuggestedTopics([]); // Clear suggestions after selection
    // Optionally clear other fields like keywords/outline
    setKeywords("");
    setSuggestedKeywords([]);
    setGeneratedOutline(null);
  };

  // Function to fetch trending news
  const handleFetchNews = async () => {
    setError("");
    setIsLoadingNews(true);
    setTrendingNews([]);
    try {
      const response = await fetch("/api/ai/get-trending-news", {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch trending news");
      }
      setTrendingNews(result.news || []);
    } catch (error) {
      console.error("Error fetching trending news:", error);
      setError(error.message || "Failed to fetch trending news");
    } finally {
      setIsLoadingNews(false);
    }
  };

  const formatContent = async () => {
    if (!editedContent.trim()) {
      setError("Content is required for formatting");
      return;
    }

    setIsFormatting(true);
    setError("");

    try {
      const response = await fetch("/api/ai/format-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to format content");
      }

      setEditedContent(result.data);

      // Show success message
      setFormatSuccess(true);
      setTimeout(() => setFormatSuccess(false), 2000);
    } catch (error) {
      console.error("Error formatting content:", error);
      setError(error.message || "Failed to format content");
    } finally {
      setIsFormatting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    // Should be redirected by useEffect, but good to have a fallback
    return null;
  }

  return (
    <>
      <Head>
        <title>{editedTitle || "AI Blog Creator"}</title>
      </Head>
      {/* Wrap content with PageContainer */}
      <PageContainer className="mt-10">
        <div className="max-w-6xl mx-auto">
          {" "}
          {/* Removed min-h-screen bg-black p-8 */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-medium text-white font-calendas">
              <span className="flex items-center">
                <AiOutlineRobot className="mr-3 text-blue-500" />
                {editedTitle ? editedTitle : "AI Blog Creator"}
              </span>
            </h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 text-red-500 rounded-lg">
              {error}
            </div>
          )}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500 text-green-500 rounded-lg">
              Blog post saved successfully! Redirecting to editor...
            </div>
          )}
          {formatSuccess && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500 text-green-500 rounded-lg">
              Content formatted successfully!
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-1 bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-medium mb-6 text-white font-calendas">
                Generate Blog Content
              </h2>

              {/* --- Convert Article Link to Blog --- */}
              <div className="mb-8 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Convert Article Link to Blog
                </h3>
                <label className="block text-gray-300 mb-1">Article URL*</label>
                <input
                  type="text"
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                  placeholder="Paste article link (https://...)"
                  className="w-full px-4 py-2 mb-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={
                    isConvertingLink || isGenerating || isGeneratingOutline
                  }
                />
                <label className="block text-gray-300 mb-1">
                  Style Instructions (optional)
                </label>
                <input
                  type="text"
                  value={styleInstructions}
                  onChange={(e) => setStyleInstructions(e.target.value)}
                  placeholder="e.g., Write in a casual, humorous tone"
                  className="w-full px-4 py-2 mb-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={
                    isConvertingLink || isGenerating || isGeneratingOutline
                  }
                />
                <button
                  onClick={handleConvertLink}
                  disabled={
                    isConvertingLink ||
                    !articleUrl.trim() ||
                    isGenerating ||
                    isGeneratingOutline
                  }
                  className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isConvertingLink ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                      Converting Link...
                    </>
                  ) : (
                    <>
                      <AiOutlineRobot className="mr-2" />
                      Convert Link to Blog
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Paste a link to any article and instantly convert it into a
                  blog post in your style.
                </p>
              </div>
              {/* --- End Convert Article Link to Blog --- */}

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Topic/Title*
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., The Future of Web Development"
                      className="flex-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={
                        isGenerating ||
                        isGeneratingOutline ||
                        isSuggestingTopics
                      }
                    />
                    <button
                      onClick={handleSuggestTopics}
                      disabled={
                        isSuggestingTopics ||
                        isGenerating ||
                        isGeneratingOutline
                      }
                      title="Suggest Topics"
                      className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      {isSuggestingTopics ? (
                        <AiOutlineLoading3Quarters className="animate-spin" />
                      ) : (
                        <AiOutlineTags /> // Using Tags icon for topic suggestion
                      )}
                    </button>
                  </div>
                  {/* Display Suggested Topics */}
                  {suggestedTopics.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-400">Suggestions:</p>
                      {suggestedTopics.map((suggestedTopic, index) => (
                        <button
                          key={index}
                          onClick={() => useSuggestedTopic(suggestedTopic)}
                          className="block w-full text-left text-sm bg-gray-700 text-gray-200 px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                        >
                          {suggestedTopic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating || isGeneratingOutline}
                  >
                    {toneOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Length (words)
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating || isGeneratingOutline}
                  >
                    {lengthOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} words
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Keywords (comma separated)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="e.g., react, nextjs, web design"
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={
                        isGenerating ||
                        isSuggestingKeywords ||
                        isGeneratingOutline
                      }
                    />
                    <button
                      onClick={() => handleSuggestKeywords()} // Trigger suggestion
                      disabled={
                        isSuggestingKeywords ||
                        !topic.trim() ||
                        isGenerating ||
                        isGeneratingOutline
                      }
                      title="Suggest Keywords based on Topic"
                      className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      {isSuggestingKeywords ? (
                        <AiOutlineLoading3Quarters className="animate-spin" />
                      ) : (
                        <AiOutlineBulb />
                      )}
                    </button>
                  </div>
                  {/* Display Suggested Keywords */}
                  {suggestedKeywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {suggestedKeywords.map((kw, index) => (
                        <button
                          key={index}
                          onClick={() => addKeyword(kw)}
                          className="flex items-center text-xs bg-teal-800/50 text-teal-300 px-2 py-1 rounded-full hover:bg-teal-700/60 transition-colors"
                          title={`Add "${kw}"`}
                        >
                          <FiPlus className="mr-1" size={12} /> {kw}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generate Outline Button */}
                <button
                  onClick={handleGenerateOutline}
                  disabled={
                    isGeneratingOutline || !topic.trim() || isGenerating
                  }
                  className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isGeneratingOutline ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                      Generating Outline...
                    </>
                  ) : (
                    "Generate Outline"
                  )}
                </button>

                {/* Generate Full Post Button */}
                <button
                  onClick={handleGenerate}
                  disabled={
                    isGenerating || !topic.trim() || isGeneratingOutline
                  }
                  className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                      Generating Full Post...
                    </>
                  ) : (
                    <>
                      <AiOutlineRobot className="mr-2" />
                      Generate Blog Post{" "}
                      {generatedOutline ? "(Using Outline)" : ""}
                    </>
                  )}
                </button>
              </div>

              {/* Display Generated Outline */}
              {generatedOutline && (
                <div className="mt-6 p-4 bg-gray-700 border border-gray-600 rounded-lg">
                  <h4 className="text-md font-semibold mb-2 text-gray-200">
                    Suggested Outline:
                  </h4>
                  <p className="text-sm text-gray-300 mb-1">
                    <strong>Title:</strong> {generatedOutline.title}
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {generatedOutline.headings.map((heading, index) => (
                      <li key={index} className="text-sm text-gray-300">
                        {heading}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mt-3">
                    Click "Generate Blog Post" to use this outline.
                  </p>
                </div>
              )}

              {/* Fetch Trending News Button */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-white">
                  Get Inspiration
                </h3>
                <button
                  onClick={handleFetchNews}
                  disabled={
                    isLoadingNews || isGenerating || isGeneratingOutline
                  }
                  className="w-full flex items-center justify-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isLoadingNews ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                      Fetching News...
                    </>
                  ) : (
                    <>
                      <AiOutlineGlobal className="mr-2" /> Fetch Trending Tech
                      News
                    </>
                  )}
                </button>
              </div>

              {/* Display Trending News */}
              {trendingNews.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="text-md font-semibold text-gray-200">
                    Trending Topics:
                  </h4>
                  {trendingNews.map((newsItem, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-700 border border-gray-600 rounded-lg"
                    >
                      <button
                        onClick={() => useSuggestedTopic(newsItem.headline)} // Reuse function to set topic
                        className="block w-full text-left font-medium text-blue-400 hover:underline mb-1"
                        title="Use this as topic"
                      >
                        {newsItem.headline}
                      </button>
                      <p className="text-xs text-gray-400">
                        {newsItem.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Featured Image Section */}
              {generatedContent && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-medium mb-4 text-white">
                    Featured Image
                  </h3>

                  {selectedImage ? (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={selectedImage.src.medium}
                          alt={selectedImage.alt || "Featured image"}
                          className="w-full h-auto"
                        />
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <IoMdClose />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Photo by{" "}
                        <a
                          href={selectedImage.photographer_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {selectedImage.photographer}
                        </a>{" "}
                        on Pexels
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowImageSearch(true)}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <AiOutlinePicture className="mr-2" />
                      Select Featured Image
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Generated Content */}
            <div className="lg:col-span-2">
              {generatedContent ? (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-white font-calendas">
                      {isEditing
                        ? "Edit Your Blog Post"
                        : "Generated Blog Post"}
                    </h2>
                    <div className="flex space-x-2">
                      {isEditing && (
                        <button
                          onClick={formatContent}
                          disabled={isFormatting}
                          className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                          {isFormatting ? (
                            <AiOutlineLoading3Quarters className="animate-spin mr-1" />
                          ) : (
                            <AiOutlineFormatPainter className="mr-1" />
                          )}
                          Format Content
                        </button>
                      )}
                      <button
                        onClick={toggleEditMode}
                        className="flex items-center px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        {isEditing ? (
                          "Preview"
                        ) : (
                          <>
                            <AiOutlineEdit className="mr-1" /> Edit
                          </>
                        )}
                      </button>
                      {!isEditing && (
                        <button
                          onClick={handleGenerate}
                          disabled={isGenerating}
                          className="flex items-center px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-800 disabled:text-gray-500"
                        >
                          <FiRefreshCw
                            className={`mr-1 ${
                              isGenerating ? "animate-spin" : ""
                            }`}
                          />
                          Regenerate
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Content (Markdown)
                        </label>
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full h-[500px] px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <h1 className="text-2xl font-bold mb-4 text-white">
                        {editedTitle}
                      </h1>
                      <div className="markdown-content overflow-auto max-h-[600px] pr-4 prose-headings:text-white prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:my-1">
                        <ReactMarkdown>{editedContent}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <button
                      onClick={handleSaveBlog}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <AiOutlineSave className="mr-2" />
                          Save as Draft
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
                  {isGenerating || isGeneratingOutline ? ( // Show loading if either is running
                    <div className="py-12">
                      <AiOutlineLoading3Quarters className="animate-spin text-5xl text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">
                        {isGeneratingOutline
                          ? "Generating outline..."
                          : "Generating your blog post..."}
                      </p>
                      <p className="text-gray-500 mt-2">
                        This may take a moment...
                      </p>
                    </div>
                  ) : (
                    <div className="py-12">
                      <AiOutlineRobot className="text-6xl text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl text-white mb-2">
                        Your AI-generated blog post will appear here
                      </h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Fill in the form on the left and click "Generate Blog
                        Post" to create content with Gemini AI.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>{" "}
      {/* Close PageContainer */}
      {/* Pexels Image Search Modal */}
      {showImageSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-medium text-white">
                Select an Image from Pexels
              </h3>
              <button
                onClick={() => setShowImageSearch(false)}
                className="text-gray-400 hover:text-white"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={imageSearchQuery}
                  onChange={(e) => {
                    setImageSearchQuery(e.target.value);
                    setCurrentPage(1);
                    if (pexelsDebounceRef.current) {
                      clearTimeout(pexelsDebounceRef.current);
                    }
                    const value = e.target.value;
                    pexelsDebounceRef.current = setTimeout(() => {
                      if (value.trim()) {
                        handleSearchImages(1);
                      }
                    }, 400);
                  }}
                  placeholder="Search for images..."
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchImages()}
                />
                <button
                  onClick={() => handleSearchImages()}
                  disabled={isSearchingImages || !imageSearchQuery.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
                >
                  {isSearchingImages ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    <AiOutlineSearch />
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isSearchingImages ? (
                <div className="flex items-center justify-center h-64">
                  <AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-500" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {searchResults.map((image) => (
                    <div
                      key={image.id}
                      className="relative group cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => handleSelectImage(image)}
                    >
                      <img
                        src={image.src.medium}
                        alt={image.alt || "Pexels image"}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200">
                        <div className="bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-200">
                          <AiOutlineCheck size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  {imageSearchQuery
                    ? "No images found. Try a different search term."
                    : "Search for images to display results."}
                </div>
              )}
            </div>

            {searchResults.length > 0 && totalPages > 1 && (
              <div className="p-4 border-t border-gray-700 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => {
                        const nextPage = Math.max(1, p - 1);
                        handleSearchImages(nextPage);
                        return nextPage;
                      });
                    }}
                    disabled={currentPage === 1 || isSearchingImages}
                    className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-800 disabled:text-gray-500"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 bg-gray-700 text-white rounded-lg">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentPage((p) => {
                        const nextPage = Math.min(totalPages, p + 1);
                        handleSearchImages(nextPage);
                        return nextPage;
                      });
                    }}
                    disabled={currentPage === totalPages || isSearchingImages}
                    className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-800 disabled:text-gray-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
