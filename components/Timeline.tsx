'use client';

import { motion } from 'motion/react';

const events = [
  {
    date: "December 25",
    title: "The Inception",
    description: "Sedhom begins planning the attack. 'Mission Mode' activates, characterized by obsessive focus and hypervigilance.",
    icon: "🎄"
  },
  {
    date: "January - February",
    title: "The Surveillance",
    description: "A GPS tracking device is covertly attached to the victim's vehicle. Daily routines are logged with forensic precision.",
    icon: "📍"
  },
  {
    date: "February 13",
    title: "The Catalyst",
    description: "Thermostat dispute escalates. Ambient temperature rises, triggering severe orexin dysfunction and sympathetic arousal.",
    icon: "🌡️"
  },
  {
    date: "February 13, PM",
    title: "The Ambush",
    description: "Sedhom lies in wait. The victim returns home. The attack is executed with a high-tension crossbow.",
    icon: "🏹"
  }
];

export function Timeline() {
  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-serif font-bold text-white">Forensic Timeline</h2>
          <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Reconstruction of Events</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-800" />

          <div className="space-y-12">
            {events.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className="flex-1 ml-16 md:ml-0">
                  <div className={`bg-slate-900/50 border border-slate-800 p-6 rounded-lg hover:border-slate-700 transition-colors ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="font-mono text-red-500 text-sm mb-2">{event.date}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{event.description}</p>
                  </div>
                </div>

                {/* Center Marker */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 z-10 text-lg">
                  {event.icon}
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
