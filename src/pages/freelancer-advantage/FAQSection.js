import React from "react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Is a single freelancer reliable enough for my business website?",
    answer: "Professional freelancers build their entire career on reliability and reputation. They're often more dependable than agencies, where your project may be just one of dozens. Top freelancers maintain long-term relationships with their clients and prioritize communication and deadlines.",
  },
  {
    question: "What if my project needs multiple skills or specialties?",
    answer: "Many successful freelancers are full-stack developers with a broad range of skills. For specialized needs, experienced freelancers maintain networks of trusted colleagues they can bring in as needed—giving you best of both worlds: direct communication of a freelancer with diverse skill set of a team, without agency overhead.",
  },
  {
    question: "How do I know I'm hiring a quality freelancer?",
    answer: "Look for a strong portfolio, client testimonials, and examples of work similar to your project. Quality freelancers will be transparent about their process, provide clear timelines and milestones, and be willing to discuss their approach in detail. They should ask thoughtful questions about your business goals, not just technical requirements.",
  },
  {
    question: "What about ongoing maintenance and updates?",
    answer: "Professional freelancers typically offer maintenance packages or retainer arrangements for ongoing support. Many clients find that same freelancer who built their site can maintain it more efficiently than an agency, where different team members might cycle through your maintenance tasks without understanding the full context of your project.",
  },
];

const FAQSection = () => (
  <section className="py-20 md:py-32 bg-slate-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
          <h2 className="font-heading text-5xl md:text-6xl text-slate-900 mb-6 flex items-center justify-center gap-6">
            Common Questions
          </h2>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to know about working with a freelance web developer
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <h3 className="font-heading text-xl text-slate-900 mb-3">{faq.question}</h3>
            <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FAQSection;
