import { AlertTriangle } from 'lucide-react';

export function Disclaimer() {
  return (
    <div className="bg-red-950/30 border-b border-red-900/50 p-4 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-red-200/90 text-sm font-mono">
        <AlertTriangle className="w-4 h-4" />
        <p className="uppercase tracking-wider">
          Disclaimer: The video and audio dramatizations featured on this website are AI-generated for illustrative purposes.
        </p>
      </div>
    </div>
  );
}
