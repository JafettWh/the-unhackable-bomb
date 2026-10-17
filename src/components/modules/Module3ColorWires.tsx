import React from 'react';
import { ColorWiresModule } from '../../modules/ColorWiresModule';
import { WireColor } from '../../types';
import { soundManager } from '../../core/SoundManager';
import { Scissors } from 'lucide-react';

interface Module3Props {
  module: ColorWiresModule;
  onAction: () => void;
}

export const Module3ColorWires: React.FC<Module3Props> = ({
  module,
  onAction,
}) => {
  const isSolved = module.getSolved();
  const wires = module.getWires();

  const handleCut = (wireId: string) => {
    if (isSolved) return;
    soundManager.playWireCut();
    const success = module.cutWire(wireId);
    if (success) {
      soundManager.playSuccess();
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  const getWireColors = (color: WireColor) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-500',
          border: 'border-red-400',
          shadow: 'shadow-[0_0_12px_rgba(239,68,68,0.7)]',
          label: 'ROJO',
          stripes: 'from-red-600 via-red-500 to-red-700',
        };
      case 'blue':
        return {
          bg: 'bg-cyan-400',
          border: 'border-cyan-300',
          shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.8)]',
          label: 'AZUL',
          stripes: 'from-cyan-500 via-blue-500 to-cyan-600',
        };
      case 'green':
        return {
          bg: 'bg-emerald-400',
          border: 'border-emerald-300',
          shadow: 'shadow-[0_0_12px_rgba(52,211,153,0.7)]',
          label: 'VERDE',
          stripes: 'from-emerald-600 via-green-500 to-emerald-700',
        };
      case 'yellow':
        return {
          bg: 'bg-amber-400',
          border: 'border-amber-300',
          shadow: 'shadow-[0_0_12px_rgba(251,191,36,0.7)]',
          label: 'AMARILLO',
          stripes: 'from-amber-500 via-yellow-400 to-amber-600',
        };
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 py-1">
      {/* Caja de terminales de cables */}
      <div className="w-full bg-slate-950/80 border border-slate-800 rounded-md p-3 relative flex flex-col gap-3">
        {wires.map((wire, idx) => {
          const colors = getWireColors(wire.color);

          return (
            <div
              key={wire.id}
              className="flex items-center justify-between gap-3 group"
            >
              {/* Terminal izquierdo (cobre/oro) */}
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-200 shadow-sm" />
                <span className="font-mono text-[10px] text-slate-500 w-3">
                  {idx + 1}
                </span>
              </div>

              {/* Cable interactivo */}
              <div className="flex-1 relative h-6 flex items-center justify-center">
                {wire.isCut ? (
                  // Cable Cortado con chispas
                  <div className="w-full flex items-center justify-between px-2">
                    <div
                      className={`h-2.5 w-[38%] rounded-l-full bg-gradient-to-r ${colors.stripes} border-y ${colors.border} opacity-50`}
                    />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] font-mono text-red-400 font-bold tracking-widest animate-pulse">
                        ✕ SECCIONADO
                      </span>
                    </div>
                    <div
                      className={`h-2.5 w-[38%] rounded-r-full bg-gradient-to-r ${colors.stripes} border-y ${colors.border} opacity-50`}
                    />
                  </div>
                ) : (
                  // Cable Intacto (botón para cortar)
                  <button
                    id={`wire-btn-${wire.color}`}
                    onClick={() => handleCut(wire.id)}
                    disabled={isSolved}
                    className={`w-full h-3 rounded-full bg-gradient-to-r ${colors.stripes} border-y ${colors.border} ${colors.shadow} relative flex items-center justify-center transition-all duration-150 cursor-pointer hover:h-4 group/wire`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/wire:opacity-100 transition-opacity bg-black/40 rounded-full">
                      <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-white px-1.5 py-0.5 rounded bg-black/70">
                        <Scissors className="w-3 h-3 text-red-400" /> CORTAR {colors.label}
                      </span>
                    </div>
                  </button>
                )}
              </div>

              {/* Terminal derecho */}
              <div className="flex items-center gap-1">
                <span className="font-mono text-[9px] text-slate-400 uppercase w-10 text-right">
                  {colors.label}
                </span>
                <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-200 shadow-sm" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center font-mono text-[11px] text-slate-400">
        {isSolved ? (
          <span className="text-[#00ff66] font-semibold">
            ✓ Derivación Resuelta (Circuito Azul Aislado)
          </span>
        ) : (
          <span className="text-slate-400">
            Regla Observer: Cortar cable afín al <strong className="text-cyan-300">Módulo 1</strong>
          </span>
        )}
      </div>
    </div>
  );
};
