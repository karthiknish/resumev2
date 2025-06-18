import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import PageContainer from "@/components/PageContainer";
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

      <PageContainer className="overflow-hidden">
        <div className="min-h-screen relative" style={{ fontFamily: "Inter, sans-serif" }}>
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>
          
          {/* Decorative Color Splashes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-88 h-88 bg-gradient-to-tl from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          {/* Hero Section */}
          <div className="relative z-10 py-20 md:py-32">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-8 shadow-lg"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
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

                <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Direct. Fast. Cost-Effective.
                  </span>
                  <br />
                  <span className="text-gray-800">
                    Why Freelancers Build Better Websites
                  </span>
                </h1>

                <div className="w-32 h-2 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-10 rounded-full shadow-lg"></div>

                <p className="text-xl text-gray-700 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
                  Skip the agency markup and connect directly with the talent
                  building your website. Get faster turnarounds, personalized
                  attention, and exceptional results at a fraction of the cost.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.button
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContactClick}
                  >
                    <span className="text-xl">🚀</span>
                    Get Started Today
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      →
                    </motion.span>
                  </motion.button>

                  <motion.a
                    href="#benefits"
                    className="px-10 py-4 bg-white/90 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">💡</span>
                    Learn More
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Benefits Section */}
          <div id="benefits" className="relative py-20">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
            <div className="relative z-10 container mx-auto px-4">
              <motion.div
                className="text-center mb-16"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-6 shadow-lg"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-xl"
                  >
                    ⚡
                  </motion.span>
                  <span>Key Benefits</span>
                </motion.div>
                
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Why Choose a{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Freelancer
                  </span>{" "}
                  Over an Agency?
                </h2>
                <div className="w-32 h-2 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8 rounded-full shadow-lg"></div>
                <p className="text-xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
                  Make the smart choice for your business website by going direct
                  to the source.
                </p>
              </motion.div>

              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {/* Benefit Card 1 */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm border-2 border-green-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                    <FaDollarSign className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Lower Costs
                  </h3>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Freelancers have minimal overhead and no agency markup fees.
                    You're paying for the talent, not the fancy office or project
                    managers.
                  </p>
                </motion.div>

                {/* Benefit Card 2 */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                    <FaComments className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Direct Communication
                  </h3>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    No more message relay through account managers. Speak directly
                    with the person building your website for clearer
                    communication.
                  </p>
                </motion.div>

                {/* Benefit Card 3 */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                    <FaRocket className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Faster Delivery
                  </h3>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Freelancers don't have agency bureaucracy. Decisions and
                    changes happen quickly, cutting project time by weeks or even
                    months.
                  </p>
                </motion.div>

                {/* Benefit Card 4 */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                    <FaHandshake className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Personal Attention
                  </h3>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Freelancers take on fewer clients than agencies, ensuring your
                    project gets the focused attention it deserves.
                  </p>
                </motion.div>

                {/* Benefit Card 5 */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                    <FaLightbulb className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Creative Freedom
                  </h3>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Freelancers aren't bound by rigid agency processes, allowing
                    for more creative approaches and innovative solutions to your
                    challenges.
                  </p>
                </motion.div>

                {/* Benefit Card 6 */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm border-2 border-cyan-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                    <FaBullseye className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Specialized Expertise
                  </h3>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Choose a freelancer with the exact skill set your project
                    needs, rather than getting assigned whoever is available at an
                    agency.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Pricing Comparison Section */}
        <div className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                The Cost Advantage
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how working with a freelancer can save you money while
                delivering superior results.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {pricingData.map((plan, index) => (
                <motion.div
                  key={plan.type}
                  className={`relative rounded-2xl overflow-hidden ${
                    plan.recommended
                      ? "border-2 border-blue-500"
                      : "border border-gray-800"
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

                  <div className="bg-gray-900 p-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <span
                            className={`mr-2 mt-1 ${
                              plan.recommended
                                ? "text-blue-400"
                                : "text-gray-500"
                            }`}
                          >
                            {plan.recommended ? "✓" : "•"}
                          </span>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Common Questions
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to know about working with a freelance web
                developer.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-8">
              <motion.div
                className="bg-gray-900 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  Is a single freelancer reliable enough for my business
                  website?
                </h3>
                <p className="text-gray-300">
                  Professional freelancers build their entire career on
                  reliability and reputation. They're often more dependable than
                  agencies, where your project may be just one of dozens. Top
                  freelancers maintain long-term relationships with their
                  clients and prioritize communication and deadlines.
                </p>
              </motion.div>

              <motion.div
                className="bg-gray-900 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  What if my project needs multiple skills or specialties?
                </h3>
                <p className="text-gray-300">
                  Many successful freelancers are full-stack developers with a
                  broad range of skills. For specialized needs, experienced
                  freelancers maintain networks of trusted colleagues they can
                  bring in as needed—giving you the best of both worlds: the
                  direct communication of a freelancer with the diverse skill
                  set of a team, without the agency overhead.
                </p>
              </motion.div>

              <motion.div
                className="bg-gray-900 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  How do I know I'm hiring a quality freelancer?
                </h3>
                <p className="text-gray-300">
                  Look for a strong portfolio, client testimonials, and examples
                  of work similar to your project. Quality freelancers will be
                  transparent about their process, provide clear timelines and
                  milestones, and be willing to discuss their approach in
                  detail. They should ask thoughtful questions about your
                  business goals, not just technical requirements.
                </p>
              </motion.div>

              <motion.div
                className="bg-gray-900 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  What about ongoing maintenance and updates?
                </h3>
                <p className="text-gray-300">
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
        </div>

        {/* Contact Section */}
        <div
          id="contact-section"
          className="py-20 bg-black/80 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Work With Me
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Let's create something amazing together. Reach out to discuss
                your project and how I can help.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* About Me Section */}
              <motion.div
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-gray-800 shadow-xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
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
                    <h3 className="text-2xl font-bold text-white">
                      Karthik Nishanth
                    </h3>
                    <p className="text-blue-400 text-lg">
                      Full Stack Developer
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">
                      My Approach
                    </h4>
                    <p className="text-gray-300">
                      I believe in creating clean, efficient, and user-focused
                      websites that deliver real business results. My hands-on
                      approach ensures your project gets my undivided attention
                      from concept to launch.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">
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
                          className="px-3 py-1 bg-blue-900/40 text-blue-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">
                      Experience
                    </h4>
                    <p className="text-gray-300">
                      With over 5 years of experience building websites and web
                      applications for clients across industries, I understand
                      what it takes to deliver high-quality results on time and
                      within budget.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-xl font-semibold text-white mb-3">
                      My Process
                    </h4>
                    <ol className="space-y-2">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                          1
                        </span>
                        <span className="text-gray-300">
                          Discovery: Understanding your business and goals
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                          2
                        </span>
                        <span className="text-gray-300">
                          Planning: Mapping the project and setting clear
                          milestones
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                          3
                        </span>
                        <span className="text-gray-300">
                          Development: Building with best practices and regular
                          updates
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                          4
                        </span>
                        <span className="text-gray-300">
                          Deployment: Launching your project with thorough
                          testing
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                          5
                        </span>
                        <span className="text-gray-300">
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
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
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
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
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
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
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
                className="bg-gradient-to-br from-blue-900/40 to-gray-900/40 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-blue-500/20 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Get In Touch
                  </h3>
                  <p className="text-gray-300">
                    Fill out the form below and I'll get back to you within 24
                    hours to discuss how I can help with your project.
                  </p>
                </div>

                {formStatus.submitted ? (
                  <motion.div
                    className={`rounded-lg p-6 text-center ${
                      formStatus.success
                        ? "bg-green-900/50 border border-green-600"
                        : "bg-red-900/50 border border-red-600"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h4 className="text-xl font-semibold mb-2 text-white">
                      {formStatus.success
                        ? "Message Sent!"
                        : "Something went wrong"}
                    </h4>
                    <p className="text-gray-300">{formStatus.message}</p>

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
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-gray-300 mb-2"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-gray-300 mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-gray-300 mb-2"
                      >
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="block text-gray-300 mb-2"
                      >
                        Timeline
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="block text-gray-300 mb-2"
                      >
                        Project Details
                      </label>
                      <textarea
                        id="project"
                        name="project"
                        value={formData.project}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell me about your project goals, target audience, and any specific features you need..."
                        required
                      ></textarea>
                    </div>

                    <div>
                      <motion.button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg py-4 text-white font-semibold shadow-xl hover:shadow-blue-500/20 transition duration-300 flex justify-center items-center"
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
                          "Let's Connect"
                        )}
                      </motion.button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>

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
      </PageContainer>
    </>
  );
}
