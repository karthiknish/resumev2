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
    coverImage: null,
    isPublished: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [pexelsPhotos, setPexelsPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPexelsModal, setShowPexelsModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else if (type === "checkbox") {
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

  const searchPexels = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get(
        `/api/pexels?query=${encodeURIComponent(query)}`
      );
      if (response.data && response.data.photos) {
        setPexelsPhotos(response.data.photos);
      } else {
        setError("No images found");
        setPexelsPhotos([]);
      }
    } catch (error) {
      console.error("Error fetching Pexels images:", error);
      setError("Failed to fetch images from Pexels");
      setPexelsPhotos([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectPexelsImage = async (imageUrl) => {
    try {
      setIsLoading(true);
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const file = new File([blob], `pexels-image-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      setFormData((prev) => ({
        ...prev,
        coverImage: file,
      }));
      setPreview(imageUrl);
      setShowPexelsModal(false);
    } catch (error) {
      console.error("Error selecting Pexels image:", error);
      setError("Failed to select image");
    } finally {
      setIsLoading(false);
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

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("/api/blog", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        router.push("/admin/blog/edit");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error creating blog post");
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

                  <div className="flex space-x-2">
                    <label className="flex items-center space-x-2 text-white font-calendas">
                      <input
                        type="file"
                        name="coverImage"
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700"
                      >
                        Upload Cover Image
                      </motion.span>
                    </label>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPexelsModal(true)}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 text-white font-calendas"
                    >
                      Search Pexels
                    </motion.button>
                  </div>
                </div>

                {showPexelsModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
                      <div className="flex mb-4">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              searchPexels(searchQuery);
                            }
                          }}
                          placeholder="Search images..."
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white mr-2"
                        />
                        <button
                          onClick={() => searchPexels(searchQuery)}
                          disabled={isSearching}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
                        >
                          {isSearching ? "Searching..." : "Search"}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {pexelsPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="cursor-pointer hover:opacity-80 relative group"
                            onClick={() => selectPexelsImage(photo.src.large)}
                          >
                            <img
                              src={photo.src.medium}
                              alt={photo.photographer}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                              <span className="text-white">
                                Click to select
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowPexelsModal(false)}
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {preview && (
                  <div className="relative w-full h-48">
                    <img
                      src={preview}
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFormData((prev) => ({ ...prev, coverImage: null }));
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
                  disabled={isLoading || !formData.title || !formData.content}
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
