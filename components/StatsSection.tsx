import React from "react";
import { motion } from "framer-motion";

export default function StatsSection() {
     const stats = [
          {
               value: "3 ans",
               label: "d'expertise Odoo"
          },
          {
               value: "99%",
               label: "Satisfaction client"
          },
          {
               value: "100%",
               label: "Équipe certifiée Odoo"
          },
          {
               value: "+40%",
               label: "Gain de productivité moyen"
          }
     ];

     return (
          <section className="py-8 bg-[var(--color-teal-light)] w-full">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                         {stats.map((stat, index) => (
                              <motion.div
                                   key={index}
                                   initial={{ opacity: 0, y: 30 }}
                                   whileInView={{ opacity: 1, y: 0 }}
                                   viewport={{ once: true }}
                                   transition={{ delay: index * 0.1 }}
                                   className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                              >
                                   <div className="text-4xl font-bold text-[var(--color-secondary)] mb-2">{stat.value}</div>
                                   <div className="text-gray-700 font-medium">{stat.label}</div>
                              </motion.div>
                         ))}
                    </div>
               </div>
          </section>
     );
}