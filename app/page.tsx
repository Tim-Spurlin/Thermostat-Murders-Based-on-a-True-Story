import { Disclaimer } from '@/components/Disclaimer';
import { Hero } from '@/components/Hero';
import { NarrativeSection } from '@/components/NarrativeSection';
import { Timeline } from '@/components/Timeline';
import { Pathology } from '@/components/Pathology';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-red-900/30">
      <Disclaimer />
      <Hero />
      
      <NarrativeSection 
        title="The Catalyst"
        subtitle="Thermoregulatory Failure"
        content={`The dispute began with a simple act: turning up the thermostat. For Samy Sedhom, this wasn't just about comfort—it was a biological assault.
        
        As the ambient temperature rose to 92°F, his dysfunctional hypothalamus failed to regulate his core temperature. The rising heat triggered a massive release of cortisol and pro-inflammatory cytokines, effectively poisoning his brain's executive centers.
        
        Trapped in a 'fight or flight' loop, the minor domestic disagreement was perceived by his amygdala as a life-threatening crisis.`}
        videoUrl="https://res.cloudinary.com/dw3lf8roj/video/upload/v1771636797/grok-video-fe66e43b-2ee6-48a5-bf95-4eb940628f33_6_ndl087.mp4"
        align="left"
        id="catalyst"
        evidenceId="01"
      />

      <Pathology />

      <NarrativeSection 
        title="The Ambush"
        subtitle="Mission Mode Execution"
        content={`Driven by 'Mission Mode'—a manic, hyper-focused state characteristic of FOH—Sedhom had been planning this moment for weeks.
        
        He lay in wait across the street, watching his sister's return via a covert GPS tracker he had installed on her vehicle. This was not a crime of passion in the traditional sense; it was a highly organized, predatory act driven by a brain that felt constantly under siege.
        
        When she arrived, the heat-induced psychosis stripped away his final inhibitions.`}
        videoUrl="https://res.cloudinary.com/dw3lf8roj/video/upload/v1771655099/grok-video-70f4d490-de76-43c6-a3cb-f374855e011c_3_a0z3uf.mp4"
        align="right"
        id="ambush"
        evidenceId="02"
        thumbnailUrl="https://res.cloudinary.com/dw3lf8roj/image/upload/v1771661274/Screenshot_20260221_020731_spnevm.png"
      />

      <Timeline />

      <NarrativeSection 
        title="The Aftermath"
        subtitle="Emergency Response"
        content={`The arrow struck his sister in the face. Miraculously, she survived to make the 911 call.
        
        The recording captures the raw chaos of the moment. While the victim fought for her life, Sedhom remained at the scene, the adrenaline of the 'mission' slowly fading as the biological reality of what he had done began to set in.`}
        videoUrl="https://res.cloudinary.com/dw3lf8roj/video/upload/v1771636619/grok-video-fe66e43b-2ee6-48a5-bf95-4eb940628f33_4_xdcaso.mp4"
        align="left"
        id="aftermath"
        evidenceId="03"
        thumbnailUrl="https://res.cloudinary.com/dw3lf8roj/image/upload/v1771648927/Screenshot_20260220_224101_ylu7ry.png"
      />

      <NarrativeSection 
        title="Jail & Clarity"
        subtitle="The Fog Lifts"
        content={`In the temperature-controlled environment of his jail cell, the physiological storm subsided.
        
        As his core temperature normalized, the 'fog' of the heat-induced psychosis lifted. The video shows a man confused by his own actions, struggling to reconcile the monster who fired the crossbow with the person he is when his brain isn't overheating.
        
        This stark contrast lies at the heart of the legal and medical debate: Is it premeditated murder, or a biological hijacking?`}
        videoUrl="https://res.cloudinary.com/dw3lf8roj/video/upload/v1771641921/5b26ce84-c88c-40b6-b6d3-54b1b79eba09_b61wzj.mp4"
        align="right"
        id="jail"
        evidenceId="04"
        thumbnailUrl="https://res.cloudinary.com/dw3lf8roj/video/upload/v1771641921/5b26ce84-c88c-40b6-b6d3-54b1b79eba09_b61wzj.jpg"
      />

      <footer className="py-12 border-t border-slate-800 bg-black text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <p className="text-slate-500 font-serif italic">
            &quot;The heat acts as a systemic, unavoidable stressor that lowers the threshold for conflict globally.&quot;
          </p>
          <div className="text-xs font-mono text-slate-600 uppercase tracking-widest">
            Forensic Analysis Report • Case #2026-FOH
          </div>
        </div>
      </footer>
    </main>
  );
}
