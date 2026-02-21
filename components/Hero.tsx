'use client';

import { motion } from 'motion/react';

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 py-24 overflow-hidden border-b border-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80" />
      
      <div className="relative z-10 max-w-4xl w-full space-y-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-block border border-slate-700 bg-slate-900/50 px-3 py-1 text-xs font-mono text-slate-400 uppercase tracking-[0.2em]">
            Case File: Lawrence, NY
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white leading-[0.9]">
            The Thermostat <br />
            <span className="text-red-500">Murders</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            A forensic analysis of how a 92°F room triggered a dormant biological anomaly, turning a brother into a predator.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-4 border-b border-slate-800 pb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Audio Evidence: Case Overview</span>
          </div>
          <audio controls className="w-full h-10 opacity-80 hover:opacity-100 transition-opacity">
            <source src="https://res.cloudinary.com/dw3lf8roj/video/upload/v1771642226/How_Heat_Intolerance_Triggered_Attempted_Murder_wdllnr.mp4" type="audio/mp4" />
            Your browser does not support the audio element.
          </audio>
        </motion.div>
      </div>
    </section>
  );
}
