'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface NarrativeSectionProps {
  title: string;
  subtitle: string;
  content: string;
  videoUrl: string;
  align?: 'left' | 'right';
  id?: string;
  evidenceId?: string;
  thumbnailUrl?: string;
}

export function NarrativeSection({ 
  title, 
  subtitle, 
  content, 
  videoUrl, 
  align = 'left', 
  id, 
  evidenceId = "01",
  thumbnailUrl = "https://res.cloudinary.com/dw3lf8roj/image/upload/v1771647569/Screenshot_20260220_221901_rbiwk7.png"
}: NarrativeSectionProps) {
  return (
    <section id={id} className="py-24 px-6 border-b border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className={cn("space-y-8", align === 'right' && "lg:order-2")}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-red-500/50" />
              <span className="font-mono text-xs text-red-400 uppercase tracking-widest">{subtitle}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">{title}</h2>
          </div>
          
          <div className="prose prose-invert prose-lg text-slate-400 leading-relaxed font-light">
            {content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className={cn("relative group", align === 'right' && "lg:order-1")}
        >
          {/* Tech/Forensic Borders */}
          <div className="absolute -inset-[1px] bg-gradient-to-br from-red-500/20 via-slate-500/20 to-slate-800/20 rounded-lg opacity-70 group-hover:opacity-100 transition duration-500" />
          
          {/* Corner Accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t border-l border-red-500/30 group-hover:border-red-500/60 transition-colors duration-500" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b border-r border-red-500/30 group-hover:border-red-500/60 transition-colors duration-500" />
          
          {/* Inner Scanline Effect (subtle) */}
          <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(transparent_50%,_rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800/50 shadow-2xl z-10">
            {videoUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
              <Image 
                src={videoUrl} 
                alt={title} 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <video 
                controls 
                className="w-full h-full object-cover"
                poster={thumbnailUrl}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur border border-white/10 px-3 py-1 rounded text-[10px] font-mono text-white/70 uppercase tracking-widest">
              Evidence #{evidenceId}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
