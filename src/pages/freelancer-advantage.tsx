import Head from "next/head";
import { useState, useEffect } from "react";
import HeroSection from "./freelancer-advantage/HeroSection";
import BenefitsSection from "./freelancer-advantage/BenefitsSection";
import PricingSection from "./freelancer-advantage/PricingSection";
import FAQSection from "./freelancer-advantage/FAQSection";
import ContactSection from "./freelancer-advantage/ContactSection";

export default function FreelancerAdvantage(): React.ReactElement {
  const [isClient, setIsClient] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setCtaVisible(true);
      } else {
        setCtaVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactClick = (): void => {
    const element = document.getElementById("contact-section");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Why Hire a Freelancer? | Direct, Fast & Cost-Effective Web Development</title>
        <meta name="description" content="Discover why hiring a freelance web developer provides better value, faster results, and more personalized service than traditional agencies." />
        <meta name="keywords" content="freelance web developer, hire freelancer, web development, agency alternative" />
        <meta property="og:title" content="Why Hire a Freelancer? | Direct, Fast & Cost-Effective Web Development" />
        <meta property="og:description" content="Discover why hiring a freelance web developer provides better value, faster results, and more personalized service than traditional agencies." />
        <meta property="og:type" content="website" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-slate-50 overflow-hidden">
        <HeroSection onContactClick={handleContactClick} />
        <BenefitsSection />
        <PricingSection />
        <FAQSection />
        <ContactSection />

        {ctaVisible && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={handleContactClick}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
            >
              <span>Let's Talk</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
