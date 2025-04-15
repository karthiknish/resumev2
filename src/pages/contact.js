import React, { useEffect } from "react"; // Removed useState
import Head from "next/head";
import { motion } from "framer-motion";
import Cal, { getCalApi } from "@calcom/embed-react"; // Import Cal.com component
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { useRouter } from "next/router";
import Services from "@/components/Services";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import ContactForm from "@/components/ContactForm"; // <-- Import the new component

export default function Contact() {
  const router = useRouter();

  // Add useEffect for Cal.com API interaction
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi({ namespace: "15min" });
        if (cal) {
          cal("ui", {
            hideEventTypeDetails: false,
            layout: "month_view",
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

          {/* --- Booking Section Start --- */}
          <FadeIn delay={0.3}>
            <section className="mt-16 bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-blue-500/20">
              <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Schedule a Consultation
              </h2>
              <p className="text-gray-300 mb-6">
                Ready to discuss your project? Pick a time that works best for
                you using the scheduler below.
              </p>
              <div className="min-h-[400px] bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700">
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
