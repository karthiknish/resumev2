import React, { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { useRouter } from "next/router";
import Services from "@/components/Services";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

export default function Contact() {
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
    <>
      <Head>
        <title>Contact - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Get in touch with me for any inquiries, collaborations, or project discussions. Based in Liverpool, UK."
        />
      </Head>
      <PageContainer>
        <div className="min-h-screen p-8 md:p-16 max-w-6xl mx-auto relative">
          <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />

          <FadeIn>
            <div className="text-center mb-10">
              <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Contact Me
              </h1>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-gray-300 mb-8 max-w-3xl mx-auto text-lg">
                Have a project in mind or want to discuss a potential
                collaboration? I'm always open to new opportunities and
                interesting conversations.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            {/* Services Section */}
            <Services />
          </FadeIn>

          <FadeIn delay={0.4}>
            {/* Contact Form Section */}
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
                    <label
                      htmlFor="message"
                      className="block text-gray-300 mb-2"
                    >
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
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="mt-16 bg-gradient-to-br from-blue-900 to-black p-8 rounded-lg shadow-xl">
              <h2 className="text-white text-3xl font-bold mb-4">
                Let's Build Something Amazing
              </h2>
              <p className="text-gray-300 mb-4">
                Whether you need a new website, a complex web application, or
                technical consultation, I'm here to help turn your vision into
                reality.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-4 rounded-lg bg-black bg-opacity-50">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    Quick Response
                  </h4>
                  <p className="text-gray-300">
                    I typically respond to all inquiries within 24 hours.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-black bg-opacity-50">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    Flexible Collaboration
                  </h4>
                  <p className="text-gray-300">
                    Available for both short-term projects and long-term
                    partnerships.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-black bg-opacity-50">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    UK-Based
                  </h4>
                  <p className="text-gray-300">
                    Located in Liverpool, available for both remote and local
                    work.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}
