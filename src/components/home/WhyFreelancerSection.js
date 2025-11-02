import { motion } from "framer-motion";
import Link from "next/link";
import { Coins, UserCheck, Zap } from "lucide-react"; // Using different icons

const benefits = [
  {
    icon: <Coins className="w-9 h-9 text-slate-700" />,
    title: "Cost effectiveness",
    description:
      "You work with the person doing the work—no agency overheads. Every hour invested lands directly in design, engineering, and launch momentum.",
    delay: 0.2,
  },
  {
    icon: <UserCheck className="w-9 h-9 text-slate-700" />,
    title: "Direct collaboration",
    description:
      "You have a single point of contact who understands context, leading to sharper decisions, faster feedback cycles, and fewer surprises.",
    delay: 0.4,
  },
  {
    icon: <Zap className="w-9 h-9 text-slate-700" />,
    title: "Flexible delivery",
    description:
      "Engagements flex between strategy, design, and implementation so we can respond quickly to product shifts without losing momentum.",
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative overflow-hidden py-20 md:py-24 bg-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.12),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(226,232,240,0.25),_transparent_70%)]" />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12 space-y-14">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="font-heading text-3xl sm:text-4xl text-center text-slate-900"
        >
          The freelancer advantage
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              custom={index} // Pass index for stagger calculation
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={cardVariants}
              className="flex flex-col items-center text-center p-7 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <div className="mb-5 p-4 rounded-full border border-slate-200 bg-slate-100">
                {benefit.icon}
              </div>
              <h3 className="font-heading text-lg text-slate-900 mb-2 leading-snug">
                {benefit.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
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
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-slate-100 px-7 py-3 text-base font-semibold shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            Let's build together →
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
