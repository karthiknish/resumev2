import { motion } from "framer-motion";
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
      className="bg-gradient-to-b from-gray-900 via-black to-gray-900 py-16 md:py-24" // Added gradient background
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl text-center font-bold sm:text-4xl mb-12 md:mb-16 text-white font-calendas"
        >
          The Freelancer Advantage
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
              className="relative group flex flex-col items-center text-center p-8 bg-black/50 rounded-2xl border border-white/10 shadow-xl overflow-hidden" // Enhanced styling
            >
              {/* Subtle Glow Effect */}
              <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${
                    benefit.title === "Direct Collaboration"
                      ? "50% 300px"
                      : index % 2 === 0
                      ? "100px -50px"
                      : "calc(100% - 100px) -50px"
                  }, rgba(56, 189, 248, 0.1), transparent 80%)`, // Example dynamic glow position
                }}
              ></div>

              <div className="relative z-10 mb-5 p-4 bg-gray-800/70 rounded-full border border-white/15">
                {" "}
                {/* Icon container */}
                {benefit.icon}
              </div>
              <h3 className="relative z-10 text-xl font-semibold text-white mb-3 font-calendas">
                {benefit.title}
              </h3>
              <p className="relative z-10 text-gray-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
