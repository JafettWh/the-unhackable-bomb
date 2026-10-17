import React from 'react';
import { NumericDisplayModule } from '../../modules/NumericDisplayModule';
import { soundManager } from '../../core/SoundManager';
import { Binary, Hash } from 'lucide-react';

interface Module2Props {
  module: NumericDisplayModule;
  onAction: () => void;
  strikes: number;
}

export const Module2NumericDisplay: React.FC<Module2Props> = ({
  module,
  onAction,
  strikes,
}) => {
  const isSolved = module.getSolved();
  const displayVal = module.displayValue;
  const selectedKey = module.getSelectedButton();

  const handleKeyPress = (num: number) => {
    if (isSolved) return;
    soundManager.playClick();
    const success = module.pressKey(num);
    if (success) {
      soundManager.playSuccess();
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-1">
      {/* Pantalla Digital LED Segmentada */}
      <div className="relative w-full max-w-[200px] bg-black/90 border-2 border-emerald-500/50 rounded-lg p-3 shadow-[inset_0_0_15px_rgba(0,255,102,0.25)] flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-emerald-400/80 mb-1 border-b border-emerald-950 pb-1">
          <span className="flex items-center gap-1">
            <Binary className="w-3 h-3 text-emerald-400" />
            REG_VAL_04
          </span>
          <span className="font-bold">STATUS: OK</span>
        </div>

        {/* Número LED grande */}
        <div className="font-mono text-5xl font-black text-[#00ff66] text-glow-green tracking-widest my-1 select-none">
          {displayVal}
        </div>

        <div className="text-[9px] font-mono text-emerald-400/60 uppercase">
          [ NÚCLEO MATRICIAL FIJO ]
        </div>
      </div>

      {/* Teclado Numérico (1, 2, 3, 4) */}
      <div className="w-full max-w-[220px]">
        <div className="grid grid-cols-4 gap-2">
          {module.availableButtons.map((btnNum) => {
            const isThisSelected = selectedKey === btnNum;
            return (
              <button
                key={btnNum}
                id={`numeric-btn-${btnNum}`}
                disabled={isSolved}
                onClick={() => handleKeyPress(btnNum)}
                className={`h-12 rounded border-2 font-mono text-lg font-bold transition-all duration-150 flex items-center justify-center shadow-md active:scale-95 cursor-pointer ${
                  isSolved
                    ? isThisSelected
                      ? 'bg-emerald-900/60 border-[#00ff66] text-[#00ff66] glow-green'
                      : 'bg-slate-900/60 border-slate-800 text-slate-600'
                    : 'bg-slate-800/90 hover:bg-slate-700/90 border-cyan-500/50 hover:border-cyan-400 text-cyan-200 hover:text-white shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                }`}
              >
                {btnNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicador de ayuda */}
      <div className="text-center font-mono text-[11px] text-slate-400">
        {isSolved ? (
          <span className="text-[#00ff66] font-semibold">
            ✓ Matriz Deductiva Resuelta
          </span>
        ) : (
          <span className="text-slate-400">
            Regla: <strong className="text-cyan-300">Display ({displayVal})</strong> -{' '}
            <strong className="text-red-400">Strikes ({strikes})</strong>
          </span>
        )}
      </div>
    </div>
  );
};
