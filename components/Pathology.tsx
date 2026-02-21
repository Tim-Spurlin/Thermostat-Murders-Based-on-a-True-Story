'use client';

import { motion } from 'motion/react';

const pathologies = [
  {
    title: "Orexin Dysfunction",
    desc: "Synthesized in the hypothalamus, Orexin regulates arousal and thermoregulation. In FOH patients, this system fails, causing the body to misinterpret heat as a life-threatening crisis.",
    stat: "Hypothalamic Failure"
  },
  {
    title: "BDNF Expression",
    desc: "Altered Brain-Derived Neurotrophic Factor prevents fear extinction. The brain cannot habituate to stressors, trapping the patient in a permanent state of 'fight or flight'.",
    stat: "Fear Sensitization"
  },
  {
    title: "Glial Cell Toxicity",
    desc: "Heat stress triggers glial cells to release pro-inflammatory cytokines, causing neuroinflammation that aggressively targets the hippocampus and impairs impulse control.",
    stat: "Neuroinflammation"
  },
  {
    title: "Threat/Control-Override",
    desc: "The combination of thermal panic and executive dysfunction results in TCO symptoms: a complete loss of internal constraints against violence.",
    stat: "Loss of Control"
  }
];

export function Pathology() {
  return (
    <section className="py-24 px-6 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 space-y-6 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Medical Pathology</h2>
          <p className="text-xl text-slate-400 font-light leading-relaxed">
            Thermoregulatory Fear of Harm (FOH) Mood Disorder is not a psychological annoyance. 
            It is a structural failure of the body&apos;s survival systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathologies.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-red-900/30 transition-colors group"
            >
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2 group-hover:text-red-400 transition-colors">
                {item.stat}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-slate-950 border border-slate-800 p-8 rounded-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">The Ketamine Protocol</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Standard antipsychotics often fail FOH patients. However, intranasal ketamine has shown revolutionary results. 
                By acting as an NMDA receptor antagonist, it interrupts the pathological loops, resetting the thermoregulatory set point 
                and extinguishing fear sensitization.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="inline-flex items-center gap-2 text-green-400 font-mono text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  88% Efficacy in Clinical Trials
                </div>
                
                <a href="/simulation" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-phosphor-cyan/50 rounded text-xs font-mono text-slate-300 hover:text-phosphor-cyan uppercase tracking-widest transition-all group">
                  <span>Launch Diagnostic Terminal</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
            <div className="relative h-48 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center">
               {/* Abstract visualization of neural pathways */}
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_#ef4444_0%,_transparent_50%)]" />
               <div className="text-center space-y-2">
                 <div className="text-4xl font-mono text-white font-bold">NMDA</div>
                 <div className="text-xs font-mono text-slate-500 uppercase">Receptor Antagonist</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
