import React from 'react';
import { Binary, Hash } from 'lucide-react';
import { MathSequenceModule } from '../../modules/MathSequenceModule';
import { soundManager } from '../../core/SoundManager';

interface Module2Props {
  module: MathSequenceModule;
  onAction: () => void;
}

export const Module2MathSequence: React.FC<Module2Props> = ({ module, onAction }) => {
  const isSolved = module.getSolved();
  const isUnlocked = module.getIsUnlocked();
  const selectedInput = module.getSelectedInput();

  const handleKeyClick = (num: number) => {
    if (isSolved || !isUnlocked) return;
    const success = module.inputNumber(num);
    if (success) {
      soundManager.playSuccess();
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  const keypadButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 21];

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      {/* Pantalla LED de la Secuencia Matemática */}
      <div className="w-full max-w-[220px] bg-black/80 px-3 py-2 rounded-lg border-2 border-cyan-500/50 shadow-[inset_0_0_12px_rgba(0,229,255,0.2)] text-center">
        <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-widest mb-0.5">
          FIBONACCI REGISTER
        </span>
        <div className="font-mono text-sm md:text-base font-black tracking-wider text-cyan-300 text-glow-blue">
          {isSolved ? '1, 1, 2, 3, 5, 8, 13, [ 21 ]' : '1, 1, 2, 3, 5, 8, 13, [ ? ]'}
        </div>
      </div>

      {/* Teclado Numérico (Keypad 3x3) */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
        {keypadButtons.map((num) => {
          const isCurrentSelected = selectedInput === num;
          return (
            <button
              key={num}
              id={`keypad-btn-${num}`}
              onClick={() => handleKeyClick(num)}
              disabled={isSolved || !isUnlocked}
              className={`py-2 rounded-lg font-mono font-black text-sm transition-all cursor-pointer border shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                isSolved && num === 8
                  ? 'bg-emerald-950 text-[#00ff66] border-[#00ff66] glow-green'
                  : isCurrentSelected && !isSolved
                  ? 'bg-red-950 text-red-400 border-red-500 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-700 hover:border-cyan-400 hover:glow-blue'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-400 font-mono text-center">
        {isSolved && <span className="text-[#00ff66] font-bold">✓ Octavo Término Fibonacci Ingresado</span>}
      </p>
    </div>
  );
};
