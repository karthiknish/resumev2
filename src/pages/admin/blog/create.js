import { useState } from "react";
import Head from "next/head";
import Markdown from "../../../components/Markdown";
import axios from "axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

function Create() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: [],
    imageUrl: "",
    isPublished: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/blog/create", {
        ...formData,
        tags: formData.tags.filter((tag) => tag.length > 0),
      });

      if (response.data.success) {
        router.push("/admin/blog/edit");
      } else {
        setError(response.data.message || "Failed to create blog post");
      }
    } catch (error) {
      console.error("Blog creation error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error creating blog post"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Blog</title>
      </Head>
      <div className="min-h-screen bg-black relative">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <div className="max-w-4xl mx-auto p-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-medium text-white font-calendas text-center">
              Create Blog Post
            </h1>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-calendas"
                  placeholder="Title"
                  required
                />

                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-calendas"
                  placeholder="Brief excerpt (shown in blog list)"
                  rows={3}
                  required
                />

                <input
                  name="tags"
                  value={formData.tags.join(", ")}
                  onChange={handleTagsChange}
                  type="text"
                  className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-calendas"
                  placeholder="Tags (comma-separated)"
                />

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-white font-calendas">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-500"
                    />
                    <span>Publish immediately</span>
                  </label>
                </div>

                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  type="url"
                  className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-calendas"
                  placeholder="Cover Image URL"
                  required
                />

                {formData.imageUrl && (
                  <div className="relative w-full h-48">
                    <img
                      src={formData.imageUrl}
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, imageUrl: "" }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <Markdown
                    content={formData.content}
                    setContent={(content) =>
                      setFormData((prev) => ({ ...prev, content }))
                    }
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={
                    isLoading ||
                    !formData.title ||
                    !formData.content ||
                    !formData.imageUrl
                  }
                  className="w-full bg-blue-600 py-3 text-white rounded-lg font-calendas hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Post"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Create;
