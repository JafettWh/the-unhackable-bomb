import React from 'react';
import { SymbolDecorator } from '../../patterns/decorator/SymbolDecorator';
import { SymbolKeypadModule } from '../../modules/SymbolKeypadModule';
import { SymbolChar } from '../../types';
import { soundManager } from '../../core/SoundManager';
import { Sparkles, Terminal } from 'lucide-react';

interface Module4Props {
  decorator: SymbolDecorator;
  onAction: () => void;
}

export const Module4SymbolKeypad: React.FC<Module4Props> = ({
  decorator,
  onAction,
}) => {
  const isSolved = decorator.getSolved();
  const rawModule = decorator.getWrapped() as SymbolKeypadModule;
  const buttons = rawModule.getButtons();
  const currentStep = rawModule.getCurrentStep();
  const glitchEffectsClass = decorator.getVisualEffectsClass();

  const handleSymbolClick = (symbol: SymbolChar) => {
    if (isSolved) return;
    soundManager.playGlitch();
    const success = rawModule.pressSymbol(symbol);
    if (success) {
      if (rawModule.getSolved()) {
        soundManager.playSuccess();
      }
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 py-1">
      {/* Contenedor con efecto Decorator Glitch / Flicker */}
      <div
        className={`w-full max-w-[240px] bg-black/80 border-2 rounded-lg p-3 transition-all duration-200 relative ${glitchEffectsClass}`}
      >
        {/* Cabecera del teclado con indicador de paso */}
        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-2 border-b border-cyan-900/50 pb-1">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            GLYPH_ARRAY
          </span>
          <span className="text-amber-400 font-bold">
            PASO: {currentStep}/2
          </span>
        </div>

        {/* Matriz 2x2 de símbolos */}
        <div className="grid grid-cols-2 gap-2.5">
          {buttons.map((btn) => {
            return (
              <button
                key={btn.id}
                id={`symbol-btn-${btn.label.toLowerCase()}`}
                disabled={isSolved}
                onClick={() => handleSymbolClick(btn.symbol)}
                className={`h-14 rounded-md border-2 font-display text-2xl font-black transition-all duration-150 flex flex-col items-center justify-center cursor-pointer active:scale-95 shadow-md relative group ${
                  isSolved
                    ? 'bg-emerald-950/60 border-[#00ff66]/60 text-[#00ff66]'
                    : btn.isPressed
                    ? 'bg-cyan-900/80 border-cyan-400 text-cyan-200 glow-blue scale-95'
                    : 'bg-slate-900/90 border-slate-700 hover:border-cyan-400/80 text-slate-200 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{btn.symbol}</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                  {btn.label}
                </span>

                {btn.isPressed && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#00ff66] shadow-[0_0_6px_#00ff66]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explicación de estado */}
      <div className="text-center font-mono text-[11px] text-slate-400">
        {isSolved ? (
          <span className="text-[#00ff66] font-semibold">
            ✓ Secuencia Glífica Confirmada (λ → Δ)
          </span>
        ) : (
          <span className="text-slate-400">
            Decorador activo: <strong className="text-cyan-300">Lambda (λ)</strong> →{' '}
            <strong className="text-cyan-300">Delta (Δ)</strong>
          </span>
        )}
      </div>
    </div>
  );
};
