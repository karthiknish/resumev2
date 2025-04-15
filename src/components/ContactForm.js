import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Clear form data
      setFormData({
        name: "",
        email: "",
        message: "",
      });

      // Use router.push with await to ensure navigation completes
      await router.push("/success");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-16 bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-blue-500/20">
      <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Get in Touch
      </h2>

      {error && (
        <div className="p-4 mb-6 bg-red-500/10 border border-red-500 text-red-400 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Your Email
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-300 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Tell me about your project or inquiry"
              rows={5}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </motion.button>
        </div>
      </form>
    </section>
  );
}
