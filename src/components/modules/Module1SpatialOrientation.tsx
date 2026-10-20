import React from 'react';
import { Compass } from 'lucide-react';
import { SpatialOrientationModule } from '../../modules/SpatialOrientationModule';
import { GeometricShape } from '../../types';
import { soundManager } from '../../core/SoundManager';

interface Module1Props {
  module: SpatialOrientationModule;
  onAction: () => void;
}

export const Module1SpatialOrientation: React.FC<Module1Props> = ({ module, onAction }) => {
  const isSolved = module.getSolved();
  const isUnlocked = module.getIsUnlocked();
  const currentStep = module.getCurrentStep();

  const handlePress = (shape: GeometricShape) => {
    if (isSolved || !isUnlocked) return;
    const success = module.pressShape(shape);
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

  const shapes: Array<{ id: GeometricShape; symbol: string; name: string }> = [
    { id: 'TRIANGLE', symbol: '△', name: 'Triángulo' },
    { id: 'SQUARE', symbol: '□', name: 'Cuadrado' },
    { id: 'PENTAGON', symbol: '⬠', name: 'Pentágono' },
    { id: 'HEXAGON', symbol: '⬡', name: 'Hexágono' },
    { id: 'OCTAGON', symbol: '⯄', name: 'Octágono' },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      {/* Indicador de secuencia poligonal */}
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
            {currentStep >= 1 ? '△' : '—'}
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`px-2 py-0.5 rounded ${
              isSolved
                ? 'bg-emerald-950 text-[#00ff66] border border-[#00ff66]/50'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
              {isSolved ? '⬡' : '—'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-[220px]">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            id={`btn-spatial-${shape.id.toLowerCase()}`}
            onClick={() => handlePress(shape.id)}
            disabled={isSolved || !isUnlocked}
            title={shape.name}
            className="min-h-14 flex flex-col items-center justify-center gap-1 rounded bg-slate-900 hover:bg-slate-800 active:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-cyan-200 font-mono transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95"
          >
            <span className="text-xl leading-none">{shape.symbol}</span>
            <span className="text-[9px] text-slate-400">{shape.name}</span>
          </button>
        ))}
      </div>

      {isSolved && <p className="text-[10px] text-[#00ff66] font-mono text-center font-bold">✓ Orientación Espacial Validada</p>}
    </div>
  );
};
