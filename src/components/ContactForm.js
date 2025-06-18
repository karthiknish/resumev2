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
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-16 bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border-2 border-purple-200 relative overflow-hidden"
    >
      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 right-10 text-4xl opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        ✉️
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-10 text-3xl opacity-15"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        💌
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-5xl md:text-6xl font-black mb-8 text-center flex items-center justify-center gap-6"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        <motion.span
          animate={{
            rotate: [0, 20, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-4xl"
        >
          📝
        </motion.span>
        <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Get in Touch
        </span>
        <motion.span
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="text-4xl"
        >
          ✨
        </motion.span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
      >
        Have a project in mind? Drop me a message and let's create something amazing together!
      </motion.p>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 mb-6 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl text-center font-medium"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-3 text-lg">
              Your Name
              <span className="ml-2 text-2xl inline-block">👤</span>
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="w-full px-6 py-4 text-gray-800 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 font-medium text-lg"
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
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-3 text-lg">
              Your Email
              <span className="ml-2 text-2xl inline-block">📧</span>
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-6 py-4 text-gray-800 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 font-medium text-lg"
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
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-3 text-lg">
              Your Message
              <span className="ml-2 text-2xl inline-block">💬</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-6 py-4 text-gray-800 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300 font-medium text-lg resize-none"
              placeholder="Tell me about your amazing project idea..."
              rows={6}
              required
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-5 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-2xl"
                  >
                    ⏳
                  </motion.span>
                  Sending your message...
                </>
              ) : (
                <>
                  <motion.span
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-2xl"
                  >
                    🚀
                  </motion.span>
                  Send Message
                  <span className="text-2xl">→</span>
                </>
              )}
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={{ x: [-200, 200] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1,
              }}
            />
          </motion.button>
        </div>
      </form>
    </motion.section>
  );
}
