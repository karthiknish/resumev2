import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFeedback({ message: "Thank you for contacting!", isError: false });
      e.target.reset();
    } else {
      setFeedback({
        message: "There was a problem submitting your form.",
        isError: true,
      });
    }
  }

  return (
    <>
      <Head>
        <title>Contact - Karthik Nishanth</title>
        <meta
          name="description"
          content="Get in touch with Karthik Nishanth, Full Stack Developer based in Liverpool, UK."
        />
      </Head>
      <div className="bg-gray-100 min-h-screen font-sans">
        <main className="container mx-auto px-6 py-8">
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
              Get in Touch
            </h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <motion.p
                className="text-gray-600 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                I'm always open to new opportunities and exciting projects.
                Whether you have a question or just want to say hi, I'll try my
                best to get back to you!
              </motion.p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Message:
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <motion.button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send Message
                  </motion.button>
                  {feedback.message && (
                    <p
                      className={`mt-4 ${
                        feedback.isError ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {feedback.message}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </motion.section>
        </main>
      </div>
    </>
  );
};

export default Contact;
