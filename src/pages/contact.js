import React, { useEffect } from "react"; // Removed useState
import Head from "next/head";
import Image from "next/image";
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
        <div className="min-h-screen overflow-hidden">
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 -z-30">
              <Image
                src="/hero-back.jpeg"
                alt="Abstract glass background"
                fill
                priority
                sizes="100vw"
                className="object-cover darken-[rgba(0,0,0,0.5)] object-center"
              />
            </div>
            <div className="absolute inset-0 -z-20 bg-white/85 backdrop-blur-sm" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_62%)]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(236,72,153,0.1),_transparent_58%)]" />

            <div className="relative max-w-5xl mx-auto px-6 sm:px-10 md:px-12 pt-24 pb-20 md:pt-32 md:pb-24 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-semibold mb-6 shadow-sm"
              >
                <span>Let’s collaborate</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight text-slate-900 mb-6"
              >
                Tell me about the product you’re building
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto"
              >
                Share the context, constraints, or ambition behind your idea. I’ll help map the next steps and assemble the right delivery plan.
              </motion.p>
            </div>
          </section>

          {/* Services */}
          <section className="bg-background">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
              <FadeIn>
                <Services />
              </FadeIn>
            </div>
          </section>

          {/* Booking */}
          <section className="py-16 md:py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-12">
              <FadeIn delay={0.1}>
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="font-heading text-3xl sm:text-4xl leading-snug text-slate-900 text-center"
                  >
                    Book a 15-minute consultation
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="mt-4 text-base text-slate-600 text-center max-w-2xl mx-auto"
                  >
                    Pick a time that works for you. We’ll talk through your goals, timelines, and the best way to move forward.
                  </motion.p>
                  <div className="mt-8 min-h-[400px] bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center">
                    <Cal
                      namespace="15min"
                      calLink="karthik-nish/15min"
                      style={{ width: "100%", height: "100%", minHeight: "450px", overflow: "scroll" }}
                      config={{ layout: "month_view" }}
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Final CTA */}
          <section className="relative overflow-hidden py-20 md:py-24 bg-gradient-to-br from-[#36C5F0] via-[#1DA1F2] to-[#2563EB]">
            <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.35),_transparent_70%)]" />

            <div className="relative max-w-5xl mx-auto px-6 sm:px-10 md:px-12 text-center text-white">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-heading text-3xl sm:text-4xl leading-snug"
              >
                Let’s outline your next release
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-base text-white/90 leading-relaxed max-w-2xl mx-auto"
              >
                Tell me about the audience, tech stack, and constraints. I’ll put together a clear plan covering scope, timelines, and collaboration cadence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              >
                <a
                  href="mailto:hello@karthiknish.com"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 px-6 py-3 font-semibold shadow-sm transition hover:bg-slate-100"
                >
                  Email me
                </a>
                <a
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/50 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
                >
                  Explore services
                </a>
              </motion.div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    title: "Response time",
                    desc: "I reply to most enquiries within 24 hours.",
                  },
                  {
                    title: "Collaboration",
                    desc: "Available for project-based or retained engagements.",
                  },
                  {
                    title: "Based in Liverpool",
                    desc: "Happy to work remotely across time zones.",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl border border-white/40 bg-white/15 p-5 text-left"
                  >
                    <h3 className="font-heading text-lg text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/85 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact form */}
          <section className="py-16 md:py-20 bg-background">
            <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-12">
              <FadeIn delay={0.1}>
                <ContactForm />
              </FadeIn>
            </div>
          </section>

        </div>
      </PageContainer>
    </>
  );
}
