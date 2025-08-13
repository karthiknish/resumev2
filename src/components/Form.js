import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router"; // Import useRouter

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  // Removed submitSuccess state
  const [router, setRouter] = useState(null); // Initialize router state

  useEffect(() => {
    // Only set router in the browser
    if (typeof window !== "undefined") {
      setRouter(require("next/router").useRouter());
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    // Removed setSubmitSuccess(false);

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
        throw new Error(data.message || "Failed to submit contact form");
      }

      // Reset form fields (optional, as we redirect)
      setFormData({ name: "", email: "", message: "" });

      // Redirect to success page
      if (router) {
        router.push("/success");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitError(
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.main
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-black mx-auto px-4 pt-20"
    >
      <section id="contact" className="py-12">
        <div className="container mx-auto">
          <div className="text-center space-y-4">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold sm:text-4xl text-white font-calendas"
            >
              Contact Me
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-300 max-w-[700px] mx-auto font-calendas"
            >
              Ready to start your next project? Let's discuss how I can help
              bring your vision to life.
            </motion.p>

            {/* Display error message */}
            {submitError && (
              <div className="bg-red-500 text-white p-4 rounded-md text-center">
                {submitError}
              </div>
            )}

            {/* Removed success message div */}

            <motion.form
              onSubmit={handleSubmit}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 font-calendas"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded bg-gray-700 text-white font-calendas"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 font-calendas"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded bg-gray-700 text-white font-calendas"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 font-calendas"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 p-2 w-full border rounded bg-gray-700 text-white font-calendas"
                  required
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:text-base md:text-lg lg:text-xl font-calendas tracking-tight text-white bg-blue-500 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl hover:bg-blue-600 transition-colors"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default ContactForm;
