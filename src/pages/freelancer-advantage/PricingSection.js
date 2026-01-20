import React from "react";
import { motion } from "framer-motion";
import { pricingData } from "./constants";

const PricingSection = () => (
  <section className="py-20 md:py-32 bg-white text-slate-900">
    <div className="container mx-auto px-4">
      <div className="text-center mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
          <h2 className="font-heading text-5xl md:text-6xl text-slate-900 mb-6 flex items-center justify-center gap-6">
            The Cost Advantage
          </h2>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
            See how working with a freelancer can save you money while delivering superior results
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {pricingData.map((plan, index) => (
          <motion.div
            key={plan.type}
            className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
              plan.recommended ? "border-2 border-slate-900" : "border border-slate-200"
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                RECOMMENDED
              </div>
            )}

            <div className={`bg-slate-50 p-8 border-b border-slate-200`}>
              <h3 className="font-heading text-2xl text-slate-900 mb-2">{plan.type}</h3>
              <p className="text-4xl font-bold text-slate-900">{plan.price}</p>
            </div>

            <div className="bg-white p-8">
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className={`mr-2 mt-1 ${plan.recommended ? "text-slate-900" : "text-slate-400"}`}>
                      {plan.recommended ? "✓" : "•"}
                    </span>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
