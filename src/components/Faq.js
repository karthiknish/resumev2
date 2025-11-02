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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-16 bg-background"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-12">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="font-heading text-3xl sm:text-4xl text-center text-slate-900 mb-10"
        >
          Frequently Asked Questions
        </motion.h2>
        {/* Apply new styling to the Accordion container and items */}
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
        >
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={`item-${item.id}`}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300"
            >
              <AccordionTrigger className="flex justify-between items-center w-full px-6 py-4 text-left text-base sm:text-lg font-semibold text-slate-900 hover:no-underline hover:bg-slate-50 rounded-2xl">
                <span className="font-heading text-slate-900">{item.title}</span>
                {/* Custom icon - rotates on open */}
                {/* <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200" /> */}
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-5 text-sm sm:text-base leading-relaxed text-slate-600">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}
