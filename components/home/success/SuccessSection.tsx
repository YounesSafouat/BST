"use client"

import { Quote } from "lucide-react"

export default function SuccessSection() {
  return (
    <section className="relative z-10 py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 scroll-fade-up">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gray-50 border border-gray-200 mb-12">
            <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-700 tracking-wide">CHAPITRE 5 : SUCCÈS</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
            Histoires de <span className="text-black">Réussite</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chaque transformation raconte une histoire unique. Voici quelques-unes de nos plus belles réussites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Ahmed Mansouri",
              role: "CEO, TechCorp",
              quote:
                "Notre transformation digitale a révolutionné notre approche commerciale. Résultats exceptionnels.",
              result: "+900% Leads",
              avatar: "AM",
            },
            {
              name: "Salma Benali",
              role: "Directrice, InnovateMA",
              quote: "L'intégration Odoo a unifié tous nos processus. Une efficacité opérationnelle remarquable.",
              result: "-70% Temps Gestion",
              avatar: "SB",
            },
            {
              name: "Youssef Kadiri",
              role: "CTO, GlobalTrade",
              quote: "Accompagnement exceptionnel et résultats au-delà de nos espérances. Partenaire de confiance.",
              result: "+150% ROI",
              avatar: "YK",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-105 hover:shadow-2xl scroll-fade-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-3xl"></div>
              <Quote className="w-8 h-8 text-gray-300 mb-6" />
              <p className="text-gray-700 mb-8 leading-relaxed italic">"{testimonial.quote}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-black">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-black">{testimonial.result}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 