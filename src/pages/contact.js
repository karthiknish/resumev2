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
          className="min-h-screen mt-24 pt-4 bg-gradient-to-br from-primary/10 via-background to-brandSecondary/10 w-full relative"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <FadeIn>
            <div className="text-center mb-12 sm:mb-16 px-4 sm:px-8 md:px-16 lg:px-32 mt-8 sm:mt-12 md:mt-16">
              {/* Animated Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white border border-brandSecondary rounded-full text-brandSecondary text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-lg"
              >
                <span>Ready to get started?</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 sm:mb-8 leading-tight tracking-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-primary to-brandSecondary bg-clip-text text-transparent">
                  Get In Touch
                </span>
                {/* Emoji removed for a more professional look */}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium px-2"
              >
                Have a{" "}
                <span className="inline-block bg-gradient-to-r from-primary to-brandSecondary bg-clip-text text-transparent font-bold">
                  project in mind
                </span>{" "}
                or want to discuss a potential collaboration? Let's turn your
                vision into reality.
              </motion.p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            {/* Services Section */}
            <div className="px-4 sm:px-8 md:px-16 lg:px-32 mt-8 sm:mt-12 md:mt-16">
              <Services />
            </div>
          </FadeIn>

          {/* --- Booking Section Start --- */}
          <FadeIn delay={0.3}>
            <section className="mt-12 sm:mt-16 bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-brandSecondary px-4 sm:px-8 md:px-16 lg:px-32">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {/* Emoji removed for a more professional look */}
                <span className="bg-gradient-to-r from-primary to-brandSecondary bg-clip-text text-transparent text-center sm:text-left">
                  Schedule a Consultation
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-center leading-relaxed font-medium px-2"
              >
                Ready to discuss your project? Pick a time that works best for
                you using the scheduler below. Let's grab a virtual coffee and
                chat about your vision!
              </motion.p>
              <div className="min-h-[350px] sm:min-h-[400px] bg-white rounded-3xl flex items-center justify-center border-2 border-brandSecondary/30 shadow-inner">
                {/* Cal.com Embed */}
                <Cal
                  namespace="15min"
                  calLink="karthik-nish/15min"
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "scroll",
                    minHeight: "450px",
                  }} // Added minHeight
                  config={{ layout: "month_view" }}
                />
              </div>
            </section>
          </FadeIn>
          {/* --- Booking Section End --- */}

          <FadeIn delay={0.4}>
            {/* Render the ContactForm component instead of the inline form */}
            <div className="px-4 sm:px-8 md:px-16 lg:px-32 mt-8 sm:mt-12 md:mt-16">
              <ContactForm />
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <section className="mt-12 sm:mt-16 bg-gradient-to-br from-primary to-brandSecondary p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden px-4 sm:px-8 md:px-16 lg:px-32">
              {/* Floating Elements */}
              <motion.div
                className="absolute top-6 left-6 sm:top-10 sm:left-10 text-3xl sm:text-4xl opacity-30"
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.div>
              <motion.div
                className="absolute bottom-6 right-6 sm:bottom-10 sm:right-20 text-2xl sm:text-3xl opacity-25"
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
              ></motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 relative z-10 text-center"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Let's Build Something Amazing
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg sm:text-xl md:text-2xl text-purple-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium text-center relative z-10 px-2"
              >
                Whether you need a stunning website, a complex web application,
                or technical consultation, I'm here to help turn your wildest
                vision into reality. Let's make magic happen!
              </motion.p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 relative z-10">
                {[
                  {
                    title: "Quick Response",
                    desc: "I typically respond to all inquiries within 24 hours.",
                  },
                  {
                    title: "Flexible Collaboration",
                    desc: "Available for both short-term projects and long-term partnerships.",
                  },
                  {
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
                    className="bg-white/20 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-white/30 text-center hover:bg-white/30 transition-all duration-300"
                  >
                    <h4
                      className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-purple-100 leading-relaxed text-sm sm:text-base">
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
