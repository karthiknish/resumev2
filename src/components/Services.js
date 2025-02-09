import { motion } from "framer-motion";
import { FaPaintBrush, FaStore, FaGlobe } from "react-icons/fa";

const services = [
  {
    icon: <FaPaintBrush className="w-8 h-8" />,
    title: "Website Reskin",
    description:
      "Give your existing website a fresh, modern look while maintaining its core functionality. Perfect for businesses looking to update their online presence.",
    features: [
      "Modern UI/UX redesign",
      "Mobile responsiveness",
      "Performance optimization",
      "Brand alignment",
    ],
  },
  {
    icon: <FaGlobe className="w-8 h-8" />,
    title: "Brochure Websites",
    description:
      "Professional, custom-built websites that effectively showcase your business, products, or services to potential customers.",
    features: [
      "Custom design & development",
      "SEO optimization",
      "Content management system",
      "Contact forms & integrations",
    ],
  },
  {
    icon: <FaStore className="w-8 h-8" />,
    title: "E-commerce Solutions",
    description:
      "Full-featured online stores that help you sell products or services directly to your customers with a seamless shopping experience.",
    features: [
      "Secure payment integration",
      "Inventory management",
      "Order processing",
      "Customer accounts",
    ],
  },
];

export default function Services() {
  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-medium text-white font-calendas text-center">
        My Services
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="text-blue-500 mb-4">{service.icon}</div>
            <h3 className="text-xl font-medium text-white mb-3 font-calendas">
              {service.title}
            </h3>
            <p className="text-gray-300 mb-4 text-sm">{service.description}</p>
            <ul className="space-y-2">
              {service.features.map((feature, i) => (
                <li key={i} className="text-gray-400 text-sm flex items-center">
                  <span className="text-blue-500 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
