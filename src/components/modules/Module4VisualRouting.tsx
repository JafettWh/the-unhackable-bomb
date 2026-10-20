import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, EyeOff, Radio } from 'lucide-react';
import { GlitchDecorator } from '../../patterns/decorator/GlitchDecorator';
import { VisualRoutingModule } from '../../modules/VisualRoutingModule';
import { VisualDirection } from '../../types';
import { soundManager } from '../../core/SoundManager';

interface Module4Props {
  decorator: GlitchDecorator;
  onAction: () => void;
}

export const Module4VisualRouting: React.FC<Module4Props> = ({ decorator, onAction }) => {
  const wrapped = decorator.getWrapped() as VisualRoutingModule;
  const isSolved = decorator.getSolved();
  const isUnlocked = decorator.getIsUnlocked();
  const currentStep = wrapped.getCurrentStep();
  const glitchClass = decorator.getVisualEffectsClass();

  const handlePress = (dir: VisualDirection) => {
    if (isSolved || !isUnlocked) return;
    soundManager.playGlitch();
    const success = wrapped.pressDirection(dir);
    if (success) {
      if (wrapped.getSolved()) {
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
    <div className={`w-full flex flex-col items-center justify-center gap-3 p-2 rounded-lg border transition-all ${glitchClass}`}>
      {/* Indicador de Interferencia Glitch y Progreso */}
      <div className="flex items-center justify-between w-full px-2 py-1 bg-black/70 rounded border border-red-500/30 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-red-400">
          <EyeOff className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-bold">INTERFERENCIA CRT: ACTIVA</span>
        </div>
        <div className="flex items-center gap-1 font-bold">
          <span className={currentStep >= 1 ? 'text-[#00ff66]' : 'text-slate-600'}>CENIT</span>
          <span className="text-slate-600">·</span>
          <span className={currentStep >= 2 ? 'text-[#00ff66]' : 'text-slate-600'}>OCASO</span>
          <span className="text-slate-600">·</span>
          <span className={isSolved ? 'text-[#00ff66]' : 'text-slate-600'}>NADIR</span>
        </div>
      </div>

      {/* Matriz de Flechas Direccionales */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[170px] relative">
        {/* Fila 1: Arriba (Cenit) */}
        <div className="col-start-2 flex justify-center">
          <button
            id="btn-arrow-up"
            onClick={() => handlePress('UP')}
            disabled={isSolved || !isUnlocked}
            className="w-11 h-11 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 flex items-center justify-center cursor-pointer disabled:opacity-40 shadow-md active:scale-95 hover:glow-blue"
            title="Arriba / Cenit"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Fila 2: Izquierda (Ocaso) y Derecha */}
        <div className="col-start-1 col-span-3 flex justify-between items-center px-1">
          <button
            id="btn-arrow-left"
            onClick={() => handlePress('LEFT')}
            disabled={isSolved || !isUnlocked}
            className="w-11 h-11 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 flex items-center justify-center cursor-pointer disabled:opacity-40 shadow-md active:scale-95 hover:glow-blue"
            title="Izquierda / Ocaso"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-6 h-6 rounded-full bg-red-950/40 border border-red-500/40 flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-spin-slow" />
          </div>

          <button
            id="btn-arrow-right"
            onClick={() => handlePress('RIGHT')}
            disabled={isSolved || !isUnlocked}
            className="w-11 h-11 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 flex items-center justify-center cursor-pointer disabled:opacity-40 shadow-md active:scale-95 hover:glow-blue"
            title="Derecha"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Fila 3: Abajo (Nadir) */}
        <div className="col-start-2 flex justify-center">
          <button
            id="btn-arrow-down"
            onClick={() => handlePress('DOWN')}
            disabled={isSolved || !isUnlocked}
            className="w-11 h-11 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 flex items-center justify-center cursor-pointer disabled:opacity-40 shadow-md active:scale-95 hover:glow-blue"
            title="Abajo / Nadir"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 font-mono text-center">
        {isSolved ? (
          <span className="text-[#00ff66] font-bold">✓ Enrutamiento Cenit-Ocaso-Nadir Validado</span>
        ) : (
          <span>Consulte pista: <code className="text-cyan-300 font-bold">decrypt --visual</code></span>
        )}
      </p>
    </div>
  );
};
