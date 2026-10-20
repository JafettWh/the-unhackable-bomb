import React from 'react';
import { Compass, Navigation } from 'lucide-react';
import { SpatialOrientationModule } from '../../modules/SpatialOrientationModule';
import { CardinalDirection } from '../../types';
import { soundManager } from '../../core/SoundManager';

interface Module1Props {
  module: SpatialOrientationModule;
  onAction: () => void;
}

export const Module1SpatialOrientation: React.FC<Module1Props> = ({ module, onAction }) => {
  const isSolved = module.getSolved();
  const isUnlocked = module.getIsUnlocked();
  const currentStep = module.getCurrentStep();

  const handlePress = (dir: CardinalDirection) => {
    if (isSolved || !isUnlocked) return;
    const success = module.pressDirection(dir);
    if (success) {
      if (module.getSolved()) {
        soundManager.playSuccess();
      } else {
        soundManager.playClick();
      }
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      {/* Indicador de Secuencia Cardinal */}
      <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded border border-cyan-500/30 text-[11px] font-mono">
        <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
        <span className="text-slate-400">PASOS:</span>
        <div className="flex items-center gap-1.5 font-bold">
          <span
            className={`px-2 py-0.5 rounded ${
              currentStep >= 1
                ? 'bg-emerald-950 text-[#00ff66] border border-[#00ff66]/50'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            {currentStep >= 1 ? 'E' : '—'}
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`px-2 py-0.5 rounded ${
              isSolved
                ? 'bg-emerald-950 text-[#00ff66] border border-[#00ff66]/50'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            {isSolved ? 'S' : '—'}
          </span>
        </div>
      </div>

      {/* Rosa de los Vientos / Teclado Cardinal */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Líneas de mira de cuadrante */}
        <div className="absolute inset-x-2 h-[1px] bg-slate-800/80 pointer-events-none" />
        <div className="absolute inset-y-2 w-[1px] bg-slate-800/80 pointer-events-none" />

        {/* Botón Norte (N) */}
        <button
          id="btn-cardinal-n"
          onClick={() => handlePress('N')}
          disabled={isSolved || !isUnlocked}
          className="absolute top-0 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 active:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-slate-200 font-bold font-mono text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:glow-blue active:scale-95"
        >
          N
        </button>

        {/* Botón Oeste (O) */}
        <button
          id="btn-cardinal-o"
          onClick={() => handlePress('O')}
          disabled={isSolved || !isUnlocked}
          className="absolute left-0 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 active:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-slate-200 font-bold font-mono text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:glow-blue active:scale-95"
        >
          O
        </button>

        {/* Núcleo Central Decorativo */}
        <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
          <Navigation className={`w-4 h-4 ${isSolved ? 'text-[#00ff66]' : 'text-cyan-400 animate-pulse'}`} />
        </div>

        {/* Botón Este (E) */}
        <button
          id="btn-cardinal-e"
          onClick={() => handlePress('E')}
          disabled={isSolved || !isUnlocked}
          className="absolute right-0 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 active:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-slate-200 font-bold font-mono text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:glow-blue active:scale-95"
        >
          E
        </button>

        {/* Botón Sur (S) */}
        <button
          id="btn-cardinal-s"
          onClick={() => handlePress('S')}
          disabled={isSolved || !isUnlocked}
          className="absolute bottom-0 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 active:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-slate-200 font-bold font-mono text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:glow-blue active:scale-95"
        >
          S
        </button>
      </div>

      <p className="text-[10px] text-slate-400 font-mono text-center">
        {isSolved ? (
          <span className="text-[#00ff66] font-bold">✓ Orientación Espacial Validada</span>
        ) : (
          <span>Consulte pista: <code className="text-cyan-300 font-bold">scan --spatial</code></span>
        )}
      </p>
    </div>
  );
};
