import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import {
  FaRocket,
  FaHandshake,
  FaDollarSign,
  FaBullseye,
  FaComments,
  FaLightbulb,
} from "react-icons/fa";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Pricing data
const pricingData = [
  {
    type: "Freelancer",
    price: "$50-100/hr",
    features: [
      "Direct communication with your developer",
      "Faster turnaround times",
      "Personalized attention",
      "Lower overhead costs",
      "Flexible working hours",
      "No agency markup fees",
    ],
    color: "from-blue-600 to-cyan-500",
    recommended: true,
  },
  {
    type: "Agency",
    price: "$150-300/hr",
    features: [
      "Communication through project managers",
      "Longer approval processes",
      "Split attention on multiple projects",
      "Higher overhead costs",
      "Fixed business hours",
      "Additional management fees",
    ],
    color: "from-gray-700 to-gray-900",
    recommended: false,
  },
];

// Testimonial data
const testimonials = [
  {
    name: "Sarah Johnson",
    company: "Fashion Boutique Owner",
    text: "Working with a freelance developer gave me direct access to the person building my website. No middlemen, no delays—just fast, personalized service that saved me thousands.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Michael Chen",
    company: "Tech Startup Founder",
    text: "After switching from an agency to a freelancer, our development costs dropped by 40% while our site performance improved dramatically. The direct collaboration made all the difference.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Emma Rodriguez",
    company: "Restaurant Chain Manager",
    text: "Our freelancer understood our vision immediately and implemented features in days that our previous agency would have taken weeks to deliver. The personal touch and accountability are unmatched.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
];

export default function FreelancerAdvantage() {
  const [isClient, setIsClient] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    timeline: "",
    project: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Show CTA after user has scrolled a bit
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

  const handleContactClick = () => {
    // Smooth scroll to contact form
    document.getElementById("contact-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/landing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({
          submitted: true,
          success: true,
          message: "Message sent successfully!",
        });
        setFormData({
          name: "",
          email: "",
          budget: "",
          timeline: "",
          project: "",
        });
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          message: "Failed to send message. Please try again later.",
        });
      }
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          Why Hire a Freelancer? | Direct, Fast & Cost-Effective Web Development
        </title>
        <meta
          name="description"
          content="Discover why hiring a freelance web developer provides better value, faster results, and more personalized service than traditional agencies."
        />
        <meta
          name="keywords"
          content="freelance web developer, hire freelancer, web development, agency alternative"
        />
        <meta
          property="og:title"
          content="Why Hire a Freelancer? | Direct, Fast & Cost-Effective Web Development"
        />
        <meta
          property="og:description"
          content="Discover why hiring a freelance web developer provides better value, faster results, and more personalized service than traditional agencies."
        />
        <meta property="og:type" content="website" />
        
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

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
        {/* Hero Section with animated background */}
        <section className="relative py-28 min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
          {/* Animated Background Blobs - matching homepage */}
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-green-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />

          {/* Floating Tech Icons */}
          <motion.div
            className="absolute top-32 left-32 text-6xl opacity-70"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            
          </motion.div>
          <motion.div
            className="absolute top-20 right-40 text-5xl opacity-60"
            animate={{
              y: [0, 20, 0],
              x: [0, 15, 0],
              rotate: [0, -15, 15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            
          </motion.div>
          <motion.div
            className="absolute bottom-40 left-40 text-4xl opacity-50"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            ⚛️
          </motion.div>
          <motion.div
            className="absolute bottom-32 right-32 text-5xl opacity-60"
            animate={{
              scale: [1, 1.3, 1],
              y: [0, -15, 0],
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            📱
          </motion.div>

          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
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
                  💼
                </motion.span>
                <span>Freelancer Advantage</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Direct. Fast.
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  Cost-Effective.
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
                  
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium"
              >
                Skip the agency markup and connect{" "}
                <motion.span
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  directly with the talent
                </motion.span>{" "}
                building your website.
                <motion.span
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block ml-2"
                >
                  
                </motion.span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg text-gray-600 mb-12 flex items-center justify-center gap-3"
              >
                <span>Get faster turnarounds, personalized attention, and exceptional results</span>
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-2xl"
                >
                  
                </motion.span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              >
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 border-0 flex items-center gap-3"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContactClick}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-2xl"
                  >
                    
                  </motion.span>
                  Let's build something amazing
                </motion.button>

                <motion.a
                  href="#benefits"
                  className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 px-10 py-5 text-xl font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-3"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-2xl"
                  >
                    👀
                  </motion.span>
                  See the advantages
                </motion.a>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-4xl"
                >
                  👇
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Benefits Section */}
        <section id="benefits" className="py-20 md:py-32 bg-gradient-to-br from-white to-purple-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black text-gray-900 mb-6 flex items-center justify-center gap-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-4xl"
                  >
                    🔮
                  </motion.span>
                  Why Choose a Freelancer?
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
                    className="text-4xl"
                  >
                    💫
                  </motion.span>
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Make the smart choice for your business website by going direct to the source
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Benefit Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="h-full p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl bg-green-50 border-green-200 hover:bg-green-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    💰
                  </motion.div>
                  <motion.div
                    className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    💵
                  </motion.div>
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Lower Costs
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Freelancers have minimal overhead and no agency markup fees.
                  You're paying for the talent, not the fancy office or project
                  managers.
                </p>
              </motion.div>

              {/* Benefit Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="h-full p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl bg-blue-50 border-blue-200 hover:bg-blue-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    
                  </motion.div>
                  <motion.div
                    className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🗣️
                  </motion.div>
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Direct Communication
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  No more message relay through account managers. Speak directly
                  with the person building your website for clearer
                  communication.
                </p>
              </motion.div>

              {/* Benefit Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="h-full p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl bg-purple-50 border-purple-200 hover:bg-purple-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    
                  </motion.div>
                  <motion.div
                    className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    💨
                  </motion.div>
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Faster Delivery
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Freelancers don't have agency bureaucracy. Decisions and
                  changes happen quickly, cutting project time by weeks or even
                  months.
                </p>
              </motion.div>

              {/* Benefit Card 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="h-full p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl bg-orange-50 border-orange-200 hover:bg-orange-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    💎
                  </motion.div>
                  <motion.div
                    className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    👥❤️
                  </motion.div>
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Personal Attention
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Freelancers take on fewer clients than agencies, ensuring your
                  project gets the focused attention it deserves.
                </p>
              </motion.div>

              {/* Benefit Card 5 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="h-full p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    
                  </motion.div>
                  <motion.div
                    className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🌈
                  </motion.div>
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Creative Freedom
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Freelancers aren't bound by rigid agency processes, allowing
                  for more creative approaches and innovative solutions to your
                  challenges.
                </p>
              </motion.div>

              {/* Benefit Card 6 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="h-full p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl bg-cyan-50 border-cyan-200 hover:bg-cyan-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    🔧
                  </motion.div>
                  <motion.div
                    className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🏆💯
                  </motion.div>
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Specialized Expertise
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Choose a freelancer with the exact skill set your project
                  needs, rather than getting assigned whoever is available at an
                  agency.
                </p>
              </motion.div>
      
            </div>
          </div>
        </section>

        {/* Pricing Comparison Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black text-gray-900 mb-6 flex items-center justify-center gap-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-4xl"
                  >
                    💰
                  </motion.span>
                  The Cost Advantage
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
                    className="text-4xl"
                  >
                    
                  </motion.span>
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  See how working with a freelancer can save you money while
                  delivering superior results
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {pricingData.map((plan, index) => (
                <motion.div
                  key={plan.type}
                  className={`relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    plan.recommended
                      ? "border-2 border-blue-400"
                      : "border-2 border-gray-300"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      RECOMMENDED
                    </div>
                  )}

                  <div className={`bg-gradient-to-br ${plan.color} p-8`}>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.type}
                    </h3>
                    <p className="text-4xl font-bold text-white">
                      {plan.price}
                    </p>
                  </div>

                  <div className="bg-white p-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <span
                            className={`mr-2 mt-1 ${
                              plan.recommended
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          >
                            {plan.recommended ? "✓" : "•"}
                          </span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-pink-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black text-gray-900 mb-6 flex items-center justify-center gap-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-4xl"
                  >
                    ❓
                  </motion.span>
                  Common Questions
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
                    className="text-4xl"
                  >
                    
                  </motion.span>
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Everything you need to know about working with a freelance web developer
                </p>
              </motion.div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <motion.div
                className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Is a single freelancer reliable enough for my business
                  website?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Professional freelancers build their entire career on
                  reliability and reputation. They're often more dependable than
                  agencies, where your project may be just one of dozens. Top
                  freelancers maintain long-term relationships with their
                  clients and prioritize communication and deadlines.
                </p>
              </motion.div>

              <motion.div
                className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  What if my project needs multiple skills or specialties?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Many successful freelancers are full-stack developers with a
                  broad range of skills. For specialized needs, experienced
                  freelancers maintain networks of trusted colleagues they can
                  bring in as needed—giving you the best of both worlds: the
                  direct communication of a freelancer with the diverse skill
                  set of a team, without the agency overhead.
                </p>
              </motion.div>

              <motion.div
                className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  How do I know I'm hiring a quality freelancer?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Look for a strong portfolio, client testimonials, and examples
                  of work similar to your project. Quality freelancers will be
                  transparent about their process, provide clear timelines and
                  milestones, and be willing to discuss their approach in
                  detail. They should ask thoughtful questions about your
                  business goals, not just technical requirements.
                </p>
              </motion.div>

              <motion.div
                className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  What about ongoing maintenance and updates?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Professional freelancers typically offer maintenance packages
                  or retainer arrangements for ongoing support. Many clients
                  find that the same freelancer who built their site can
                  maintain it more efficiently than an agency, where different
                  team members might cycle through your maintenance tasks
                  without understanding the full context of your project.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact-section"
          className="py-20 md:py-32 bg-gradient-to-br from-cyan-50 to-blue-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black text-gray-900 mb-6 flex items-center justify-center gap-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-4xl"
                  >
                    
                  </motion.span>
                  Work With Me
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
                    className="text-4xl"
                  >
                    
                  </motion.span>
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Let's create something amazing together. Reach out to discuss
                  your project and how I can help.
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* About Me Section */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-8">
                  <div className="relative w-24 h-24 overflow-hidden rounded-full border-4 border-blue-500 mr-6">
                    <img
                      src="/profile-photo.jpg"
                      alt="Karthik Nishanth"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://ui-avatars.com/api/?name=Karthik+Nishanth&background=0062cc&color=fff&size=150";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      Karthik Nishanth
                    </h3>
                    <p className="text-blue-600 text-lg font-semibold">
                      Full Stack Developer
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      My Approach
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      I believe in creating clean, efficient, and user-focused
                      websites that deliver real business results. My hands-on
                      approach ensures your project gets my undivided attention
                      from concept to launch.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "Next.js",
                        "Node.js",
                        "TypeScript",
                        "Tailwind CSS",
                        "MongoDB",
                        "AWS",
                        "UI/UX Design",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      Experience
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      With over 5 years of experience building websites and web
                      applications for clients across industries, I understand
                      what it takes to deliver high-quality results on time and
                      within budget.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      My Process
                    </h4>
                    <ol className="space-y-2">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                          1
                        </span>
                        <span className="text-gray-700">
                          Discovery: Understanding your business and goals
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                          2
                        </span>
                        <span className="text-gray-700">
                          Planning: Mapping the project and setting clear
                          milestones
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                          3
                        </span>
                        <span className="text-gray-700">
                          Development: Building with best practices and regular
                          updates
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                          4
                        </span>
                        <span className="text-gray-700">
                          Deployment: Launching your project with thorough
                          testing
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">
                          5
                        </span>
                        <span className="text-gray-700">
                          Support: Ongoing maintenance and updates as needed
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <a
                    href="https://github.com/karthiknish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-full text-blue-700 hover:text-blue-800 transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>

                  <a
                    href="https://linkedin.com/in/karthiknishanth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-full text-blue-700 hover:text-blue-800 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>

                  <a
                    href="https://twitter.com/karthiknish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-full text-blue-700 hover:text-blue-800 transition-colors"
                    aria-label="Twitter Profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm border-2 border-cyan-200 p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Get In Touch
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Fill out the form below and I'll get back to you within 24
                    hours to discuss how I can help with your project.
                  </p>
                </div>

                {formStatus.submitted ? (
                  <motion.div
                    className={`rounded-lg p-6 text-center ${
                      formStatus.success
                        ? "bg-green-100 border-2 border-green-400"
                        : "bg-red-100 border-2 border-red-400"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h4 className="text-xl font-semibold mb-2 text-gray-900" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      {formStatus.success
                        ? "Message Sent!"
                        : "Something went wrong"}
                    </h4>
                    <p className="text-gray-700">{formStatus.message}</p>

                    {formStatus.success && (
                      <motion.button
                        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                        onClick={() =>
                          setFormStatus({
                            submitted: false,
                            success: false,
                            message: "",
                          })
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Send Another Message
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-gray-700 mb-2 font-medium"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-gray-700 mb-2 font-medium"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-gray-700 mb-2 font-medium"
                      >
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select budget range</option>
                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                        <option value="$5,000 - $10,000">
                          $5,000 - $10,000
                        </option>
                        <option value="$10,000 - $20,000">
                          $10,000 - $20,000
                        </option>
                        <option value="$20,000+">$20,000+</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="timeline"
                        className="block text-gray-700 mb-2 font-medium"
                      >
                        Timeline
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select timeline</option>
                        <option value="Less than 1 month">
                          Less than 1 month
                        </option>
                        <option value="1-2 months">1-2 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="project"
                        className="block text-gray-700 mb-2 font-medium"
                      >
                        Project Details
                      </label>
                      <textarea
                        id="project"
                        name="project"
                        value={formData.project}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell me about your project goals, target audience, and any specific features you need..."
                        required
                      ></textarea>
                    </div>

                    <div>
                      <motion.button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-2xl py-4 text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex justify-center items-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <span className="mr-2 text-xl"></span>
                            Let's Connect
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Floating CTA Button */}
        {isClient && (
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: ctaVisible ? 1 : 0,
              scale: ctaVisible ? 1 : 0.8,
              y: ctaVisible ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full p-4 shadow-xl hover:shadow-blue-500/30 transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleContactClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </div>
    </>
  );
}
