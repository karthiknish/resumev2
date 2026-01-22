import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FormError from "@/components/ui/FormError";
import { FORM_ERRORS } from "@/lib/formErrors";

interface FormData {
  name: string;
  email: string;
  message: string;
  _honeypot: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    _honeypot: "",
  });
  const [formLoadTime, setFormLoadTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormLoadTime(Date.now());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _honeypot: formData._honeypot,
          _timestamp: formLoadTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || FORM_ERRORS.CONTACT_FAILED);
      }

      setFormData({
        name: "",
        email: "",
        message: "",
        _honeypot: "",
      });

      if (typeof window !== "undefined") {
        window.location.href = "/success";
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : FORM_ERRORS.GENERIC_ERROR;
      setError(errorMessage);
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

      <FormError message={error} />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 sm:space-y-6 max-w-2xl mx-auto"
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            opacity: 0,
            height: 0,
            overflow: "hidden",
          }}
        >
          <label htmlFor="_honeypot">Leave this field empty</label>
          <input
            type="text"
            id="_honeypot"
            name="_honeypot"
            value={formData._honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

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
              className="form-input sm:px-5 sm:py-4 text-base"
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
              className="form-input sm:px-5 sm:py-4 text-base"
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
              className="form-input sm:px-5 sm:py-4 text-base resize-none"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
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
