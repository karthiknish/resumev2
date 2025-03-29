import { motion } from "framer-motion";

const benefits = [
  {
    title: "Cost-Effectiveness",
    description:
      "Freelancers typically have lower overhead costs compared to agencies, allowing for more competitive pricing without compromising quality.",
    delay: 0.4,
  },
  {
    title: "Personalized Attention",
    description:
      "Working with a freelancer means direct communication and a single point of contact, ensuring your vision is understood and implemented accurately.",
    delay: 0.6,
  },
  {
    title: "Flexibility and Speed",
    description:
      "Freelancers can adapt quickly to changing project requirements and typically deliver faster turnaround times due to streamlined processes.",
    delay: 0.8,
  },
];

export default function WhyFreelancerSection() {
  return (
    <motion.section
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-black py-16" // Removed mt-24, handle spacing in parent
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl text-center font-bold sm:text-4xl mb-12 text-white font-calendas"
        >
          Why Choose a Freelancer Over an Agency?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: benefit.delay }}
              viewport={{ once: true }}
              className="bg-black/50 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-2 font-calendas">
                {benefit.title}
              </h3>
              <p className="text-gray-400 font-calendas">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
