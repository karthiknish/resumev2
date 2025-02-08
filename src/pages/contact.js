import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = () => {
  const [feedback, setFeedback] = useState({ message: "", isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!captchaValue) {
      setFeedback({
        message: "Please complete the CAPTCHA verification",
        isError: true,
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
      captchaToken: captchaValue,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFeedback({ message: "Thank you for contacting!", isError: false });
        e.target.reset();
        setCaptchaValue(null);
      } else {
        const data = await response.json();
        setFeedback({
          message: data.error || "There was a problem submitting your form.",
          isError: true,
        });
      }
    } catch (error) {
      setFeedback({
        message: "There was a problem connecting to the server.",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Contact - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Get in touch with Karthik Nishanth, Full Stack Developer based in Liverpool, UK."
        />
      </Head>
      <div className="min-h-screen bg-black/95 p-8 relative">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="border-none bg-black/60 backdrop-blur-sm">
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="p-6"
            >
              <h1 className="text-4xl font-bold text-white mb-6 text-center">
                Get in Touch
              </h1>
              <motion.p
                className="text-gray-300 mb-8 text-xl"
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
                    className="block text-gray-300 font-semibold mb-2"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                    required
                    maxLength={100}
                    pattern="[A-Za-z\s]+"
                    title="Please enter a valid name (letters and spaces only)"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-300 font-semibold mb-2"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                    required
                    maxLength={254}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-gray-300 font-semibold mb-2"
                  >
                    Message:
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                    rows="4"
                    required
                    maxLength={1000}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={setCaptchaValue}
                    theme="dark"
                    className="mb-4"
                  />
                  <motion.button
                    type="submit"
                    className={`bg-blue-600 text-white px-6 py-2 rounded text-lg font-semibold transition duration-300 flex items-center justify-center ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
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
            </motion.section>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Contact;
