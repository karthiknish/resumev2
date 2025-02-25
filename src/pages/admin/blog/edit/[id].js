import { useEffect, useState } from "react";
import Head from "next/head";
import Markdown from "../../../../components/Markdown";
import { useRouter } from "next/router";
import {
  AiOutlineFormatPainter,
  AiOutlineLoading3Quarters,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineClose,
} from "react-icons/ai";
import ReactMarkdown from "react-markdown";

function Edit() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState([]);
  const [jsonInput, setJsonInput] = useState("");
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatSuccess, setFormatSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const router = useRouter();

  const handleJsonSubmit = () => {
    setShowJsonInput(false);
  };

  const toggleJsonInput = () => {
    setShowJsonInput((prevState) => !prevState);
  };

  const togglePreview = () => {
    setShowPreview((prevState) => !prevState);
  };

  useEffect(() => {
    const jsonData = {
      title,
      imageUrl,
      content,
    };
    setJsonInput(JSON.stringify(jsonData, null, 2));
  }, [title, imageUrl, content]);

  const handleJsonInput = (e) => {
    const input = e.target.value;
    setJsonInput(input);
    try {
      const json = JSON.parse(input);
      setTitle(json.title || "");
      setImageUrl(json.imageUrl || "");
      setContent(json.content || "");
    } catch (error) {
      console.error("Invalid JSON input");
    }
  };

  useEffect(() => {
    const { id } = router.query;
    const getData = async () => {
      if (id) {
        try {
          const res = await fetch(`/api/blog?id=${id}`);
          const d = await res.json();
          if (d?.success) {
            setTitle(d?.data?.title);
            setImageUrl(d?.data?.imageUrl);
            setContent(d?.data?.content);
            const jsonData = {
              title: d?.data?.title,
              imageUrl: d?.data?.imageUrl,
              content: d?.data?.content,
            };
            setJsonInput(JSON.stringify(jsonData, null, 2));
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
        }
      }
    };
    getData();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { id } = router.query;
    const data = { id, title, imageUrl, content };

    try {
      const res = await fetch(`/api/blog?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        setSubmitStatus([true, "Blog post submitted successfully!"]);
      } else {
        setSubmitStatus([false, result.error || "Failed to update blog post"]);
      }
    } catch (error) {
      setSubmitStatus([false, "Network error occurred"]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = async () => {
    if (!content.trim()) {
      setSubmitStatus([false, "Content is required for formatting"]);
      return;
    }

    setIsFormatting(true);
    setSubmitStatus([]);

    try {
      const response = await fetch("/api/ai/format-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to format content");
      }

      setContent(result.data);
      setFormatSuccess(true);
      setSubmitStatus([true, "Content formatted successfully!"]);

      // Update JSON input
      const jsonData = {
        title,
        imageUrl,
        content: result.data,
      };
      setJsonInput(JSON.stringify(jsonData, null, 2));

      // Hide success message after 3 seconds
      setTimeout(() => {
        setFormatSuccess(false);
        setSubmitStatus([]);
      }, 3000);
    } catch (error) {
      console.error("Error formatting content:", error);
      setSubmitStatus([false, error.message || "Failed to format content"]);
    } finally {
      setIsFormatting(false);
    }
  };

  const BlogPreview = () => (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-80 flex items-start justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl my-8 overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Blog Preview</h2>
          <button
            onClick={togglePreview}
            className="text-gray-400 hover:text-white"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[80vh]">
          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-6">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto rounded-lg object-cover max-h-[400px]"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>

          {/* Content */}
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:my-1">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Edit Blog</title>
      </Head>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white font-calendas text-center mb-8">
            Edit Blog
          </h1>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-white">
                Title
              </label>
              <input
                id="title"
                value={title || ""}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-white">
                Image URL
              </label>
              <input
                id="imageUrl"
                value={imageUrl || ""}
                type="text"
                onChange={(e) => setImageUrl(e.target.value)}
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter image URL"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-white">Content</label>
                <div className="flex space-x-2">
                  <button
                    onClick={formatContent}
                    disabled={isFormatting || !content.trim()}
                    className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {isFormatting ? (
                      <>
                        <AiOutlineLoading3Quarters className="animate-spin mr-1" />
                        Formatting...
                      </>
                    ) : (
                      <>
                        <AiOutlineFormatPainter className="mr-1" />
                        Format Content
                      </>
                    )}
                  </button>
                  <button
                    onClick={togglePreview}
                    disabled={!content.trim()}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <AiOutlineEye className="mr-1" />
                    Preview
                  </button>
                </div>
              </div>
              <Markdown
                key={content}
                content={content || ""}
                setContent={setContent}
              />
            </div>

            {submitStatus.length > 0 && (
              <div
                className={`p-4 rounded-lg ${
                  submitStatus[0]
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {submitStatus[1]}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                className="w-full bg-blue-500 px-4 py-2 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>

              <button
                className="w-full bg-yellow-500 px-4 py-2 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                onClick={toggleJsonInput}
              >
                {showJsonInput ? "Hide JSON Editor" : "Show JSON Editor"}
              </button>
            </div>

            {showJsonInput && (
              <div className="space-y-4">
                <label htmlFor="jsonInput" className="block text-white">
                  Edit JSON
                </label>
                <textarea
                  id="jsonInput"
                  value={jsonInput}
                  onChange={handleJsonInput}
                  className="block w-full h-48 px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  placeholder='{"title": "Example Title", "imageUrl": "https://example.com/image.jpg", "content": "Example Content"}'
                />
                <button
                  className="w-full bg-green-500 px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors"
                  onClick={handleJsonSubmit}
                >
                  Apply JSON Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPreview && <BlogPreview />}
    </>
  );
}

export default Edit;
