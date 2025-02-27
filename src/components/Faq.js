import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

export default function Faq() {
  return (
    <motion.section
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-black text-white py-12"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl text-center font-bold sm:text-4xl mb-8 font-calendas"
        >
          Frequently Asked Questions
        </motion.h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium font-calendas">
              What technologies do you specialize in?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 font-calendas">
              I specialize in modern web technologies including React, Next.js,
              Node.js, and TypeScript. I'm also experienced with cloud platforms
              like AWS and Azure, and have extensive knowledge of database
              systems including MongoDB and PostgreSQL.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium font-calendas">
              How do you approach new projects?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 font-calendas">
              I begin with a thorough analysis of your requirements and
              objectives. Then, I develop a strategic roadmap that outlines
              technical solutions, timelines, and deliverables. Throughout the
              project, I maintain clear communication and adapt to changing
              needs while ensuring high-quality code and optimal performance.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium font-calendas">
              What sets you apart from other developers?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 font-calendas">
              My unique combination of technical expertise and focus on client
              needs allows me to not just code solutions, but to truly
              understand and solve your challenges. I focus on delivering
              scalable, maintainable code while keeping your objectives at the
              forefront.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium font-calendas">
              How do you handle project deadlines and communication?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 font-calendas">
              I maintain transparent communication through regular updates and
              status reports. I use agile methodologies to ensure timely
              delivery and adapt quickly to changes. My project management
              skills help me balance multiple priorities while maintaining high
              quality standards.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.section>
  );
}
