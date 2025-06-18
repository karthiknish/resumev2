import React, { useEffect } from "react"; // Removed useState
import Head from "next/head";
import { motion } from "framer-motion";
import Cal, { getCalApi } from "@calcom/embed-react"; // Import Cal.com component
import Services from "@/components/Services";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import ContactForm from "@/components/ContactForm"; // <-- Import the new component

export default function Contact() {
  // Add useEffect for Cal.com API interaction
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi({ namespace: "15min" });
        if (cal) {
          cal("ui", {
            hideEventTypeDetails: false,
            layout: "month_view",
            theme: "light",
            // Optional: Add theme and styles if needed
            // theme: "dark",
            // styles: { branding: { brandColor: "#000000" } }
          });
        }
      } catch (e) {
        console.error("Failed to load Cal.com API", e);
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Contact - Karthik Nishanth | Cross Platform Developer</title>
        <meta
          name="description"
          content="Get in touch with me for any inquiries, collaborations, or project discussions. Based in Liverpool, UK."
        />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <PageContainer>
        <div
          className="min-h-screen mt-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 md:p-16 max-w-6xl mx-auto relative"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <FadeIn>
            <div className="text-center mb-16">
              {/* Animated Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-8 shadow-lg"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-xl"
                >
                  👋
                </motion.span>
                <span>Ready to create something amazing?</span>
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="text-xl"
                >
                  💬
                </motion.span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Get In Touch
                </span>
                <motion.span
                  animate={{
                    rotate: [0, 20, -20, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="inline-block ml-4 text-yellow-400"
                >
                  🚀
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
              >
                Have a{" "}
                <motion.span
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  brilliant idea
                </motion.span>{" "}
                or want to discuss a potential collaboration? Let's turn your
                vision into reality!
                <motion.span
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block ml-2"
                >
                  ✨
                </motion.span>
              </motion.p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            {/* Services Section */}
            <Services />
          </FadeIn>

          {/* --- Booking Section Start --- */}
          <FadeIn delay={0.3}>
            <section className="mt-16 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-purple-200">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-black mb-6 flex items-center justify-center gap-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-4xl"
                >
                  📅
                </motion.span>
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Schedule a Consultation
                </span>
                <motion.span
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="text-4xl"
                >
                  ☕
                </motion.span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-gray-600 mb-8 text-xl max-w-3xl mx-auto text-center leading-relaxed font-medium"
              >
                Ready to discuss your project? Pick a time that works best for
                you using the scheduler below. Let's grab a virtual coffee and
                chat about your vision!
              </motion.p>
              <div className="min-h-[400px] bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl flex items-center justify-center border-2 border-purple-200 shadow-inner">
                {/* Cal.com Embed */}
                <Cal
                  namespace="15min"
                  calLink="karthik-nish/15min"
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "scroll",
                    minHeight: "500px",
                  }} // Added minHeight
                  config={{ layout: "month_view" }}
                />
              </div>
            </section>
          </FadeIn>
          {/* --- Booking Section End --- */}

          <FadeIn delay={0.4}>
            {/* Render the ContactForm component instead of the inline form */}
            <ContactForm />
          </FadeIn>

          <FadeIn delay={0.6}>
            <section className="mt-16 bg-gradient-to-br from-purple-600 to-blue-600 p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden">
              {/* Floating Elements */}
              <motion.div
                className="absolute top-10 left-10 text-4xl opacity-30"
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🌟
              </motion.div>
              <motion.div
                className="absolute bottom-10 right-20 text-3xl opacity-25"
                animate={{
                  x: [0, 20, 0],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                ✨
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-black mb-8 flex items-center justify-center gap-6 relative z-10 text-center"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-5xl"
                >
                  🚀
                </motion.span>
                Let's Build Something Amazing
                <motion.span
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 25, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="text-5xl"
                >
                  🎉
                </motion.span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium text-center relative z-10"
              >
                Whether you need a stunning website, a complex web application,
                or technical consultation, I'm here to help turn your wildest
                vision into reality. Let's make magic happen!
              </motion.p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10">
                {[
                  {
                    icon: "⚡",
                    title: "Quick Response",
                    desc: "I typically respond to all inquiries within 24 hours.",
                  },
                  {
                    icon: "🤝",
                    title: "Flexible Collaboration",
                    desc: "Available for both short-term projects and long-term partnerships.",
                  },
                  {
                    icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
                    title: "UK-Based",
                    desc: "Located in Liverpool, available for both remote and local work.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl border border-white/30 text-center hover:bg-white/30 transition-all duration-300"
                  >
                    <motion.div
                      className="text-4xl mb-4"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    <h4
                      className="text-xl font-bold text-white mb-3"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-purple-100 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}
