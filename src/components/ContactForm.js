import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
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

      // Redirect to success page using window.location
      if (typeof window !== "undefined") {
        window.location.href = "/success";
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-10 sm:mt-14 lg:mt-16 bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200"
    >
      {/* Removed floating emoji for professional tone */}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="font-heading text-3xl sm:text-4xl md:text-5xl text-slate-900 text-center mb-6"
      >
        Get in touch
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-base sm:text-lg text-slate-600 text-center mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
      >
        Have a project in mind? Drop me a message and let's create something
        valuable and reliable together.
      </motion.p>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 sm:p-4 mb-4 sm:mb-6 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl sm:rounded-2xl text-center font-medium text-sm sm:text-base"
        >
          {error}
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 sm:space-y-6 max-w-2xl mx-auto"
      >
        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <label
              htmlFor="name"
              className="block text-slate-800 font-semibold mb-2 text-sm sm:text-base"
            >
              Your Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-200 focus:outline-none transition-all duration-300 text-base"
              placeholder="John Doe"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <label
              htmlFor="email"
              className="block text-slate-800 font-semibold mb-2 text-sm sm:text-base"
            >
              Your Email
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-200 focus:outline-none transition-all duration-300 text-base"
              placeholder="john@example.com"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <label
              htmlFor="message"
              className="block text-slate-800 font-semibold mb-2 text-sm sm:text-base"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-200 focus:outline-none transition-all duration-300 text-base resize-none"
              placeholder="Tell me about your amazing project idea..."
              rows={5}
              required
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-700 py-3 sm:py-4 text-slate-100 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Sending your message...
                </>
              ) : (
                <>Send message</>
              )}
            </span>
          </motion.button>
        </div>
      </form>
    </motion.section>
  );
}
