import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion"; // Assuming this is Shadcn UI Accordion
import { ChevronDown } from "lucide-react"; // Import icon for trigger

export default function Faq({ items = [] }) {
  // Accept items as a prop
  // Fallback if no items are passed (optional)
  const faqItems =
    items.length > 0
      ? items
      : [
          {
            id: "fallback-1",
            title: "Default Question 1?",
            content: "Default answer 1.",
          },
          {
            id: "fallback-2",
            title: "Default Question 2?",
            content: "Default answer 2.",
          },
        ];

  return (
    <motion.section
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-black text-white py-8"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl text-center font-bold sm:text-4xl mb-12 md:mb-16 font-calendas" // Increased bottom margin
        >
          Frequently Asked Questions
        </motion.h2>
        {/* Apply new styling to the Accordion container and items */}
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto space-y-4" // Added space between items
        >
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={`item-${item.id}`}
              className="bg-gradient-to-r from-gray-800/60 to-gray-900/80 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-blue-600/50" // Card-like styling
            >
              <AccordionTrigger className="flex justify-between items-center w-full px-6 py-4 text-left text-lg font-medium text-white hover:no-underline hover:bg-gray-700/30 transition-colors">
                <span className="font-calendas">{item.title}</span>
                {/* Custom icon - rotates on open */}
                {/* <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200" /> */}
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-4 text-gray-300 text-base leading-relaxed font-calendas">
                {" "}
                {/* Adjusted padding and text size */}
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}
