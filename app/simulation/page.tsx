'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, BarController, DoughnutController } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, BarController, DoughnutController);

// Custom styles for hardware elements
const styles = {
  metalTexture: {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
  },
  ventilationGrill: {
    backgroundImage: 'repeating-linear-gradient(to bottom, #000 0px, #000 4px, #1a1c23 4px, #1a1c23 8px)',
    borderRadius: '4px',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.8)',
  },
  screw: {
    width: '12px', height: '12px', borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #555, #111)',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.8)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    position: 'absolute' as const,
  },
  crtBezel: {
    background: '#111', padding: '10px', borderRadius: '8px',
    boxShadow: 'inset 0 5px 15px rgba(0,0,0,1), 0 1px 1px rgba(255,255,255,0.1)',
    position: 'relative' as const,
  },
  crtScreen: {
    position: 'relative' as const, overflow: 'hidden', backgroundColor: '#05120a',
    borderRadius: '8px', boxShadow: 'inset 0 0 30px rgba(0,0,0,1)',
    border: '1px solid #000',
  },
  crtScanlines: {
    position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
    backgroundSize: '100% 4px', zIndex: 5, pointerEvents: 'none' as const, opacity: 0.6,
  },
  faderTrackContainer: {
    position: 'relative' as const, height: '100px', width: '30px', display: 'flex', justifyContent: 'center',
    background: '#0f1014', borderRadius: '4px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,1)',
    border: '1px solid #2a2d37',
  },
};

const Screw = ({ className }: { className: string }) => (
  <div className={className} style={styles.screw}>
    <div className="absolute w-[6px] h-[1px] bg-black rotate-45" />
    <div className="absolute w-[6px] h-[1px] bg-black -rotate-45" />
  </div>
);

export default function SimulationPage() {
  // System State
  const [temp, setTemp] = useState(72.0);
  const [stress, setStress] = useState(0);
  const [isCritical, setIsCritical] = useState(false);
  
  const [oscMode, setOscMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [specMode, setSpecMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  
  const [oscParams, setOscParams] = useState({ freq: 0.05, gain: 30, noise: 0 });
  const [specParams, setSpecParams] = useState({ lowBand: 80, highBand: 10 });

  // Refs for Canvas
  const canvasOscRef = useRef<HTMLCanvasElement>(null);
  const canvasSpecRef = useRef<HTMLCanvasElement>(null);
  
  // Refs for animation loop to access latest state without re-renders breaking loop
  const sysRef = useRef({
    temp, stress, isCritical, oscMode, specMode, oscParams, specParams
  });

  // Update ref when state changes
  useEffect(() => {
    sysRef.current = { temp, stress, isCritical, oscMode, specMode, oscParams, specParams };
  }, [temp, stress, isCritical, oscMode, specMode, oscParams, specParams]);

  // Handle Temp Change
  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTemp = parseFloat(e.target.value);
    setTemp(newTemp);

    let newStress = 0;
    if (newTemp <= 80) newStress = (newTemp - 70) / 100;
    else if (newTemp <= 92) newStress = 0.1 + Math.pow((newTemp - 80) / 12, 2) * 0.4;
    else newStress = 0.5 + Math.min(1, Math.pow((newTemp - 92) / 8, 1.5) * 0.5);
    
    setStress(newStress);
    setIsCritical(newTemp >= 92);

    // Auto update params if in AUTO mode
    if (oscMode === 'AUTO') {
      setOscParams({
        freq: 0.05 + (newStress * 0.15),
        gain: 20 + (newStress * 60) + (newTemp >= 92 ? 50 : 0),
        noise: newStress > 0.4 ? (newStress * 80) : 0
      });
    }
    if (specMode === 'AUTO') {
      setSpecParams({
        lowBand: 80 - (newStress * 40),
        highBand: 10 + (Math.pow(newStress, 2) * 180)
      });
    }
  };

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let renderTime = 0;
    const waveHistory = new Array(150).fill(0);

    const renderLoop = () => {
      const sys = sysRef.current;
      const ctxOsc = canvasOscRef.current?.getContext('2d');
      const ctxSpec = canvasSpecRef.current?.getContext('2d');
      const canvasOsc = canvasOscRef.current;
      const canvasSpec = canvasSpecRef.current;

      if (ctxOsc && canvasOsc) {
        // Resize if needed
        if (canvasOsc.width !== canvasOsc.clientWidth * window.devicePixelRatio) {
          canvasOsc.width = canvasOsc.clientWidth * window.devicePixelRatio;
          canvasOsc.height = canvasOsc.clientHeight * window.devicePixelRatio;
        }

        ctxOsc.clearRect(0, 0, canvasOsc.width, canvasOsc.height);
        
        // Graticule
        ctxOsc.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        ctxOsc.lineWidth = 1;
        ctxOsc.beginPath();
        for (let x = 0; x <= canvasOsc.width; x += canvasOsc.width / 10) { ctxOsc.moveTo(x, 0); ctxOsc.lineTo(x, canvasOsc.height); }
        for (let y = 0; y <= canvasOsc.height; y += canvasOsc.height / 8) { ctxOsc.moveTo(0, y); ctxOsc.lineTo(canvasOsc.width, y); }
        ctxOsc.stroke();

        // Waveform
        const p = sys.oscParams;
        let currentWave = Math.sin(renderTime * p.freq) * p.gain + ((Math.random() - 0.5) * p.noise);
        if ((sys.oscMode === 'AUTO' && sys.isCritical) || (sys.oscMode === 'MANUAL' && p.gain > 120)) {
            if (Math.random() > 0.8) currentWave += (Math.random() > 0.5 ? 1 : -1) * (p.gain * 0.8);
        }

        waveHistory.push(currentWave);
        waveHistory.shift();

        let oscColor = '#39ff14'; // Green
        if (sys.oscMode === 'AUTO') {
            if (sys.temp < 85) oscColor = '#00ffff'; // Cyan
            else if (sys.temp < 92) oscColor = '#ffb000'; // Amber
            else oscColor = '#ff003c'; // Red
        }

        ctxOsc.beginPath();
        ctxOsc.lineWidth = 2 * window.devicePixelRatio;
        ctxOsc.strokeStyle = oscColor;
        ctxOsc.shadowBlur = 10;
        ctxOsc.shadowColor = oscColor;
        
        const sliceWidth = canvasOsc.width / 149;
        for (let i = 0; i < 150; i++) {
            const x = i * sliceWidth;
            const y = (canvasOsc.height / 2) + waveHistory[i];
            if (i === 0) ctxOsc.moveTo(x, y);
            else ctxOsc.lineTo(x, y);
        }
        ctxOsc.stroke();
        ctxOsc.shadowBlur = 0;
      }

      if (ctxSpec && canvasSpec) {
        if (canvasSpec.width !== canvasSpec.clientWidth * window.devicePixelRatio) {
            canvasSpec.width = canvasSpec.clientWidth * window.devicePixelRatio;
            canvasSpec.height = canvasSpec.clientHeight * window.devicePixelRatio;
        }

        ctxSpec.clearRect(0, 0, canvasSpec.width, canvasSpec.height);
        
        // Graticule
        ctxSpec.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        ctxSpec.lineWidth = 1;
        ctxSpec.beginPath();
        for (let x = 0; x <= canvasSpec.width; x += canvasSpec.width / 10) { ctxSpec.moveTo(x, 0); ctxSpec.lineTo(x, canvasSpec.height); }
        for (let y = 0; y <= canvasSpec.height; y += canvasSpec.height / 8) { ctxSpec.moveTo(0, y); ctxSpec.lineTo(canvasSpec.width, y); }
        ctxSpec.stroke();

        let specColor = '#39ff14';
        if (sys.specMode === 'AUTO') {
            if (sys.temp < 85) specColor = '#00ffff';
            else if (sys.temp < 92) specColor = '#ffb000';
            else specColor = '#ff003c';
        }

        ctxSpec.fillStyle = specColor;
        ctxSpec.shadowBlur = 15;
        ctxSpec.shadowColor = specColor;

        const numBars = 32;
        const barW = (canvasSpec.width / numBars) - 2;
        const p = sys.specParams;

        for (let i = 0; i < numBars; i++) {
            let normX = i / numBars;
            let targetH = ((1 - normX) * p.lowBand) + (normX * p.highBand) + (Math.random() * 5);
            
            if (normX > 0.5 && p.highBand > 100) targetH += Math.random() * (p.highBand * 0.4);

            let scaledH = Math.min(targetH * (canvasSpec.height / 200), canvasSpec.height);
            
            ctxSpec.globalAlpha = 0.8 + (Math.random() * 0.2);
            ctxSpec.fillRect(i * (barW + 2), canvasSpec.height - scaledH, barW, scaledH);
        }
        ctxSpec.globalAlpha = 1.0;
        ctxSpec.shadowBlur = 0;
      }

      renderTime++;
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Chart Data
  const chemData = {
    labels: ['Cortisol', 'Glutamate', 'Orexin', 'BDNF'],
    datasets: [{
      data: [
        Math.min(100, 20 + (stress * 80)),
        Math.min(100, 30 + (stress * 70)),
        Math.max(0, 80 - (Math.pow(stress, 2) * 80)),
        Math.max(0, 75 - (stress * 60))
      ],
      backgroundColor: ['#ffb000', '#ff003c', '#00ffff', '#39ff14'],
      borderWidth: 0,
      borderRadius: 2
    }]
  };

  const treatmentData = {
    labels: ['Response', 'No Response'],
    datasets: [{ 
        data: [88, 12], 
        backgroundColor: ['#39ff14', '#1a1c23'], 
        borderColor: ['#39ff14', '#111'],
        borderWidth: 1, 
    }]
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col gap-6">
        
        {/* Navigation Back */}
        <div className="flex justify-between items-center">
            <Link href="/" className="text-xs font-mono text-phosphor-cyan hover:text-white transition-colors flex items-center gap-2">
                ← RETURN TO CASE FILE
            </Link>
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                SIMULATION MODE // ACTIVE
            </div>
        </div>

        {/* HEADER UNIT */}
        <div className="bg-hw-panel border border-hw-border rounded-lg shadow-panel-out relative p-6" style={styles.metalTexture}>
            <Screw className="top-3 left-3" /><Screw className="top-3 right-3" />
            <Screw className="bottom-3 left-3" /><Screw className="bottom-3 right-3" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pl-6 pr-6">
                <div className="flex flex-col gap-2">
                    <div className="text-[10px] tracking-widest text-gray-500 font-bold uppercase">System ID // SEDHOM-01</div>
                    <h1 className="text-3xl font-black text-gray-100 tracking-tight uppercase drop-shadow-lg">Thermal Bio-Simulator</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <div className={`w-[10px] h-[10px] rounded-full shadow-[0_0_10px_currentColor] transition-all duration-200 ${
                            oscMode === 'MANUAL' || specMode === 'MANUAL' ? 'bg-phosphor-green text-phosphor-green' : 'bg-phosphor-cyan text-phosphor-cyan'
                        }`} />
                        <span className={`text-[10px] font-mono uppercase ${
                            oscMode === 'MANUAL' || specMode === 'MANUAL' ? 'text-phosphor-green' : 'text-phosphor-cyan'
                        }`}>
                            SYS.ONLINE / LINK: {oscMode === 'MANUAL' || specMode === 'MANUAL' ? 'OVERRIDE' : 'AUTO'}
                        </span>
                    </div>
                </div>

                <div className="flex-grow max-w-2xl bg-hw-bg p-4 rounded-lg border border-hw-border shadow-inner flex flex-col gap-4 w-full">
                    <div className="flex justify-between items-end">
                        <span className="text-xs text-gray-400 font-mono font-bold tracking-widest uppercase">Master Temp Drive</span>
                        <span className={`text-3xl font-mono transition-colors duration-300 ${
                            temp < 85 ? 'text-phosphor-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]' :
                            temp < 92 ? 'text-phosphor-amber drop-shadow-[0_0_10px_rgba(255,176,0,0.4)]' :
                            'text-phosphor-red drop-shadow-[0_0_15px_rgba(255,0,60,0.6)]'
                        }`}>
                            {temp.toFixed(1)}°F
                        </span>
                    </div>
                    
                    <div className="relative w-full pb-4">
                        <input 
                            type="range" 
                            className="w-full h-3 bg-black rounded-full appearance-none border border-gray-800 cursor-pointer"
                            min="70" max="100" step="0.1" 
                            value={temp}
                            onChange={handleTempChange}
                        />
                        <div className="absolute w-full flex justify-between px-2 mt-2 text-[9px] text-gray-600 font-mono pointer-events-none">
                            <span>| 70</span><span>| 80</span><span className="text-phosphor-amber">| 90</span><span className="text-phosphor-red">| 100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* INSTRUMENT UNITS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* UNIT 1: OSCILLOSCOPE */}
            <div className="bg-hw-panel border border-hw-border rounded-lg shadow-panel-out relative p-6 flex flex-col gap-4" style={styles.metalTexture}>
                <Screw className="top-3 left-3" /><Screw className="top-3 right-3" />
                <Screw className="bottom-3 left-3" /><Screw className="bottom-3 right-3" />

                <div className="flex justify-between items-center px-2">
                    <div className="text-sm tracking-widest text-gray-400 font-bold uppercase">OSC-7000 Neural Waveform</div>
                    <div className="flex items-center gap-2 bg-hw-bg px-2 py-1 rounded border border-hw-border shadow-inner">
                        <div className={`w-2 h-2 rounded-full transition-colors ${oscMode === 'AUTO' ? 'bg-phosphor-cyan shadow-[0_0_8px_#00ffff]' : 'bg-gray-800'}`} />
                        <span className="text-[9px] font-mono text-gray-400">AUTO</span>
                        <div className={`w-2 h-2 rounded-full ml-2 transition-colors ${oscMode === 'MANUAL' ? 'bg-phosphor-green shadow-[0_0_8px_#39ff14]' : 'bg-gray-800'}`} />
                        <span className="text-[9px] font-mono text-gray-400">MANUAL</span>
                        {oscMode === 'MANUAL' && (
                            <button onClick={() => { setOscMode('AUTO'); handleTempChange({ target: { value: temp.toString() } } as any); }} className="ml-3 text-[9px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-0.5 rounded border border-gray-600 transition-colors">RESET</button>
                        )}
                    </div>
                </div>

                <div style={styles.crtBezel}>
                    <div style={styles.crtScreen} className="h-56 w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10 rounded-lg" />
                        <div style={styles.crtScanlines} />
                        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none z-20" />
                        <canvas ref={canvasOscRef} className="absolute inset-0 w-full h-full z-0" />
                        <div className="absolute top-2 left-3 z-10 text-xs font-mono opacity-80" style={{ 
                            color: oscMode === 'MANUAL' ? '#39ff14' : (temp < 85 ? '#00ffff' : (temp < 92 ? '#ffb000' : '#ff003c')),
                            textShadow: '0 0 5px currentColor'
                        }}>
                            CH1: {oscParams.freq.toFixed(3)} Hz | GAIN: {oscParams.gain.toFixed(0)} V/div
                        </div>
                    </div>
                </div>

                <div className="bg-hw-panel-light p-4 rounded border border-hw-border shadow-inner flex justify-around items-center h-48">
                    {[
                        { label: 'TIME/DIV', id: 'freq', min: 0.01, max: 0.3, step: 0.001, val: oscParams.freq },
                        { label: 'V/DIV GAIN', id: 'gain', min: 10, max: 150, step: 1, val: oscParams.gain },
                        { label: 'NOISE INJ.', id: 'noise', min: 0, max: 100, step: 1, val: oscParams.noise }
                    ].map((ctrl) => (
                        <div key={ctrl.id} className="flex flex-col items-center gap-2 relative">
                            <div className="text-[9px] font-mono text-gray-400 mb-1 tracking-wider">{ctrl.label}</div>
                            <div style={styles.faderTrackContainer}>
                                <div className="absolute top-[5px] bottom-[5px] left-[14px] w-[2px] bg-black" />
                                <input 
                                    type="range" 
                                    className="absolute top-[35px] w-[100px] h-[30px] bg-transparent -rotate-90 origin-center outline-none z-10 cursor-pointer appearance-none"
                                    min={ctrl.min} max={ctrl.max} step={ctrl.step}
                                    value={ctrl.val}
                                    onChange={(e) => {
                                        setOscMode('MANUAL');
                                        setOscParams(prev => ({ ...prev, [ctrl.id]: parseFloat(e.target.value) }));
                                    }}
                                    style={{
                                        WebkitAppearance: 'none',
                                    }}
                                />
                                {/* Custom Thumb Style via CSS isn't easy inline, relying on standard range for now but styled via class if possible. 
                                    Since we can't easily inject pseudo-elements inline, we'll use a simple styled input or assume standard browser styling is acceptable for MVP, 
                                    or use a custom component. Let's stick to standard range for robustness in React.
                                */}
                            </div>
                        </div>
                    ))}
                    <div style={styles.ventilationGrill} className="w-16 h-32 ml-4 opacity-50 hidden md:block" />
                </div>
            </div>

            {/* UNIT 2: SPECTRUM ANALYZER */}
            <div className="bg-hw-panel border border-hw-border rounded-lg shadow-panel-out relative p-6 flex flex-col gap-4" style={styles.metalTexture}>
                <Screw className="top-3 left-3" /><Screw className="top-3 right-3" />
                <Screw className="bottom-3 left-3" /><Screw className="bottom-3 right-3" />

                <div className="flex justify-between items-center px-2">
                    <div className="text-sm tracking-widest text-gray-400 font-bold uppercase">SA-9900 EEG Spectrum</div>
                    <div className="flex items-center gap-2 bg-hw-bg px-2 py-1 rounded border border-hw-border shadow-inner">
                        <div className={`w-2 h-2 rounded-full transition-colors ${specMode === 'AUTO' ? 'bg-phosphor-cyan shadow-[0_0_8px_#00ffff]' : 'bg-gray-800'}`} />
                        <span className="text-[9px] font-mono text-gray-400">AUTO</span>
                        <div className={`w-2 h-2 rounded-full ml-2 transition-colors ${specMode === 'MANUAL' ? 'bg-phosphor-green shadow-[0_0_8px_#39ff14]' : 'bg-gray-800'}`} />
                        <span className="text-[9px] font-mono text-gray-400">MANUAL</span>
                        {specMode === 'MANUAL' && (
                            <button onClick={() => { setSpecMode('AUTO'); handleTempChange({ target: { value: temp.toString() } } as any); }} className="ml-3 text-[9px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-0.5 rounded border border-gray-600 transition-colors">RESET</button>
                        )}
                    </div>
                </div>

                <div style={styles.crtBezel}>
                    <div style={styles.crtScreen} className="h-56 w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10 rounded-lg" />
                        <div style={styles.crtScanlines} />
                        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none z-20" />
                        <canvas ref={canvasSpecRef} className="absolute inset-0 w-full h-full z-0" />
                        <div className="absolute bottom-2 right-3 z-10 text-[10px] font-mono text-gray-500 opacity-80 drop-shadow-md">FAST FOURIER TRANSFORM</div>
                        <div className="absolute bottom-1 w-full flex justify-between px-4 z-10 text-[8px] font-mono text-gray-600 opacity-60">
                            <span>0Hz (θ/α)</span> <span>|</span> <span>(β/γ) 100Hz</span>
                        </div>
                    </div>
                </div>

                <div className="bg-hw-panel-light p-4 rounded border border-hw-border shadow-inner flex justify-around items-center h-48">
                    {[
                        { label: 'LOW BAND', sub: 'GAIN (θ/α)', id: 'lowBand', min: 10, max: 150, step: 1, val: specParams.lowBand },
                        { label: 'HIGH BAND', sub: 'GAIN (β/γ)', id: 'highBand', min: 0, max: 200, step: 1, val: specParams.highBand }
                    ].map((ctrl) => (
                        <div key={ctrl.id} className="flex flex-col items-center gap-2 relative">
                            <div className="text-[9px] font-mono text-gray-400 mb-1 tracking-wider text-center">{ctrl.label}<br/><span className="text-[8px] text-gray-500">{ctrl.sub}</span></div>
                            <div style={styles.faderTrackContainer}>
                                <div className="absolute top-[5px] bottom-[5px] left-[14px] w-[2px] bg-black" />
                                <input 
                                    type="range" 
                                    className="absolute top-[35px] w-[100px] h-[30px] bg-transparent -rotate-90 origin-center outline-none z-10 cursor-pointer appearance-none"
                                    min={ctrl.min} max={ctrl.max} step={ctrl.step}
                                    value={ctrl.val}
                                    onChange={(e) => {
                                        setSpecMode('MANUAL');
                                        setSpecParams(prev => ({ ...prev, [ctrl.id]: parseFloat(e.target.value) }));
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    
                    <div className="w-32 h-24 border border-red-900/50 bg-red-900/10 rounded p-2 flex flex-col justify-center items-center opacity-80">
                        <span className="text-red-500 text-xl">⚠️</span>
                        <span className="text-[8px] text-center text-red-500/70 font-mono mt-1 leading-tight">WARNING: HIGH FREQUENCY SATURATION INDICATES CRITICAL PSYCHOSIS BREAK</span>
                    </div>
                </div>
            </div>

        </div>

        {/* UNIT 3: DATA TELEMETRY */}
        <div className="bg-hw-panel border border-hw-border rounded-lg shadow-panel-out relative p-6 mt-4 mb-12" style={styles.metalTexture}>
            <Screw className="top-3 left-3" /><Screw className="top-3 right-3" />
            <Screw className="bottom-3 left-3" /><Screw className="bottom-3 right-3" />

            <div className="text-sm tracking-widest text-gray-400 font-bold uppercase mb-4 px-2 border-b border-gray-800 pb-2">Neuro-Chemical Subsystem Analysis</div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-hw-bg p-4 rounded border border-hw-border shadow-inner flex flex-col">
                    <h4 className="text-[10px] font-mono text-gray-500 uppercase mb-2">Real-Time Receptor Saturation (Linked to Ambient Temp)</h4>
                    <div className="h-48 w-full">
                        <Chart 
                            type='bar'
                            data={chemData}
                            options={{
                                responsive: true, maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { 
                                    y: { beginAtZero: true, max: 100, grid: { color: '#1a1c23' } },
                                    x: { grid: { display: false } }
                                },
                                animation: { duration: 150 }
                            }}
                        />
                    </div>
                </div>
                
                <div className="bg-hw-bg p-4 rounded border border-hw-border shadow-inner flex flex-col relative">
                    <h4 className="text-[10px] font-mono text-gray-500 uppercase mb-2 text-center">Protocol Efficacy: Ketamine</h4>
                    <div className="h-48 w-full relative">
                        <Chart 
                            type='doughnut'
                            data={treatmentData}
                            options={{ 
                                responsive: true, maintainAspectRatio: false, 
                                plugins: { legend: { display: false } },
                                cutout: '70%'
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-4">
                            <span className="text-xl font-mono font-bold text-phosphor-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">88%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
