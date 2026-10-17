import React from 'react';
import { Skull, RotateCcw, HelpCircle, AlertOctagon } from 'lucide-react';

interface ExplosionModalProps {
  isOpen: boolean;
  onReset: () => void;
  onOpenManual: (tab: 'creator') => void;
  strikes: number;
  remainingSeconds: number;
}

export const ExplosionModal: React.FC<ExplosionModalProps> = ({
  isOpen,
  onReset,
  onOpenManual,
  strikes,
  remainingSeconds,
}) => {
  if (!isOpen) return null;

  const reason =
    strikes >= 3
      ? 'Acumulación de 3 Strikes consecutivos (Detonación instantánea por fallo de protocolo).'
      : 'Agotamiento total del tiempo límite (00:00).';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#140608] border-2 border-red-600 rounded-2xl p-6 shadow-[0_0_80px_rgba(255,0,51,0.6)] flex flex-col items-center text-center">
        {/* Insignia de Detonación */}
        <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center mb-4 glow-red animate-pulse">
          <Skull className="w-9 h-9 text-red-500" />
        </div>

        <h2 className="font-display text-2xl font-black text-white text-glow-red tracking-wider uppercase mb-1">
          ¡DETONACIÓN CATASTRÓFICA!
        </h2>
        <p className="font-mono text-xs text-red-400 mb-6 uppercase tracking-widest">
          EL NÚCLEO EXPLOSIVO SE HA ACTIVADO
        </p>

        {/* Motivo */}
        <div className="w-full p-4 bg-black/80 rounded-lg border border-red-900/60 mb-6 text-left font-mono text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
            <AlertOctagon className="w-4 h-4 text-red-500" />
            <span>CAUSA DEL COLAPSO:</span>
          </div>
          <p className="text-slate-300">{reason}</p>
          <div className="mt-3 pt-2 border-t border-slate-900 flex justify-between text-[11px] text-slate-500">
            <span>Strikes: {strikes} / 3</span>
            <span>Tiempo restante: {remainingSeconds}s</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg glow-red"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar Misión
          </button>
          <button
            onClick={() => onOpenManual('creator')}
            className="flex-1 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Consultar Guía del Creador
          </button>
        </div>
      </div>
    </div>
  );
};
