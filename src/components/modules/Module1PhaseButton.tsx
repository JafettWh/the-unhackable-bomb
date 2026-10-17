import React from 'react';
import { PhaseButtonModule } from '../../modules/PhaseButtonModule';
import { soundManager } from '../../core/SoundManager';
import { Radio, Zap } from 'lucide-react';

interface Module1Props {
  module: PhaseButtonModule;
  onAction: () => void;
  currentSecond: number;
  bombStatus: string;
}

export const Module1PhaseButton: React.FC<Module1Props> = ({
  module,
  onAction,
  currentSecond,
  bombStatus,
}) => {
  const isSolved = module.getSolved();
  const isUnlocked = bombStatus === 'UNLOCKED';
  const isPar = currentSecond % 2 === 0;

  const handleClick = () => {
    if (isSolved) return;
    const success = module.pressButton();
    if (success) {
      soundManager.playSuccess();
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-2">
      {/* Indicador de fase actual */}
      <div className="flex items-center gap-4 bg-slate-900/90 px-4 py-1.5 rounded-md border border-cyan-500/30 font-mono text-xs">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>CICLO SEG:</span>
          <span className="font-bold text-cyan-200">
            {currentSecond.toString().padStart(2, '0')}s
          </span>
        </div>
        <div className="h-3 w-[1px] bg-slate-700" />
        <div className="flex items-center gap-1">
          <span className="text-slate-400">FASE:</span>
          <span
            className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
              isPar
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-950 text-amber-400 border border-amber-500/40'
            }`}
          >
            {isPar ? 'PAR' : 'IMPAR'}
          </span>
        </div>
      </div>

      {/* Botón Circular Gigante Iluminado en Azul */}
      <div className="relative group">
        {/* Anillo de advertencia de pulsación */}
        <div
          className={`absolute -inset-3 rounded-full transition-all duration-500 ${
            isSolved
              ? 'bg-[#00ff66]/20 blur-md'
              : 'bg-cyan-500/25 group-hover:bg-cyan-400/40 blur-md animate-pulse'
          }`}
        />

        <button
          id="phase-button-main"
          onClick={handleClick}
          disabled={isSolved}
          className={`relative w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-2xl ${
            isSolved
              ? 'bg-gradient-to-br from-emerald-600 to-teal-900 border-[#00ff66] text-[#00ff66] glow-green'
              : 'bg-gradient-to-br from-cyan-600 via-blue-700 to-blue-950 border-cyan-300 text-white shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:shadow-[0_0_40px_rgba(0,229,255,0.9)] active:border-cyan-100'
          }`}
        >
          <Zap className={`w-8 h-8 mb-1 ${isSolved ? 'text-[#00ff66]' : 'text-cyan-200 animate-bounce'}`} />
          <span className="font-display font-black text-xs tracking-wider text-center px-2">
            {isSolved ? 'SINCRONIZADO' : 'CONMUTAR FASE'}
          </span>
          <span className="text-[9px] font-mono opacity-80 mt-0.5">
            {isSolved ? 'NÚCLEO ALFA OK' : 'AZUL // 500V'}
          </span>
        </button>
      </div>

      <div className="text-center font-mono text-[11px] text-slate-400">
        {isSolved ? (
          <span className="text-[#00ff66] font-semibold">
            ✓ Estado Global: {bombStatus} (Fórmula deductiva habilitada)
          </span>
        ) : (
          <span className="text-slate-400">
            Requiere sincronización en segundo <strong className="text-cyan-300">PAR</strong>
          </span>
        )}
      </div>
    </div>
  );
};
