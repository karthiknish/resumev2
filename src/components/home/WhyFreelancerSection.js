import { motion } from "framer-motion";
import Link from "next/link";
import { Coins, UserCheck, Zap } from "lucide-react"; // Using different icons

const benefits = [
  {
    icon: <Coins className="w-10 h-10 text-emerald-400" />,
    title: "Cost-Effectiveness",
    description:
      "Get high-quality results without agency overhead. Direct collaboration means your investment goes straight into the work, maximizing value.",
    delay: 0.2,
  },
  {
    icon: <UserCheck className="w-10 h-10 text-blue-400" />,
    title: "Direct Collaboration",
    description:
      "Work directly with me, the developer building your project. This ensures clear communication, personalized attention, and a deep understanding of your vision.",
    delay: 0.4,
  },
  {
    icon: <Zap className="w-10 h-10 text-purple-400" />,
    title: "Flexibility & Speed",
    description:
      "Benefit from agile processes and faster turnaround times. I adapt quickly to your needs and changing requirements, keeping your project moving forward efficiently.",
    delay: 0.6,
  },
];

export default function WhyFreelancerSection() {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2, // Use delay from data or calculate based on index
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16 md:py-24 relative overflow-hidden" // Modern light gradient background
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-200/20 to-pink-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 space-y-12 relative z-10">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl text-center font-bold sm:text-4xl mb-12 md:mb-16 font-calendas"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            The Freelancer Advantage
          </span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              custom={index} // Pass index for stagger calculation
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={cardVariants}
              className="relative group flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-purple-200 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all duration-300 overflow-hidden" // Enhanced styling
            >
              {/* Subtle Glow Effect */}
              <div
                className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${
                    benefit.title === "Direct Collaboration"
                      ? "50% 300px"
                      : index % 2 === 0
                      ? "100px -50px"
                      : "calc(100% - 100px) -50px"
                  }, rgba(139, 92, 246, 0.1), transparent 80%)`, // Purple glow instead of blue
                }}
              ></div>

              <div className="relative z-10 mb-5 p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full border-2 border-purple-200 group-hover:border-purple-300 transition-colors duration-300">
                {/* Icon container */}
                {benefit.icon}
              </div>
              <h3 className="relative z-10 text-xl font-semibold text-gray-800 mb-3 font-calendas" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                {benefit.title}
              </h3>
              <p className="relative z-10 text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Let's Build Together →
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
