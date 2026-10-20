import React from 'react';
import { Atom, Plus, Minus, Check } from 'lucide-react';
import { ScientificTriviaModule } from '../../modules/ScientificTriviaModule';
import { soundManager } from '../../core/SoundManager';

interface Module3Props {
  module: ScientificTriviaModule;
  onAction: () => void;
}

export const Module3ScientificTrivia: React.FC<Module3Props> = ({ module, onAction }) => {
  const isSolved = module.getSolved();
  const isUnlocked = module.getIsUnlocked();
  const selectedElement = module.getSelectedElement();
  const currentDialZ = module.getCurrentDialZ();
  const solvedElements = module.getSolvedElements();

  const handleSelectElement = (symbol: string) => {
    if (isSolved || !isUnlocked) return;
    soundManager.playClick();
    module.setElement(symbol);
    onAction();
  };

  const handleAdjustZ = (delta: number) => {
    if (isSolved || !isUnlocked) return;
    soundManager.playClick();
    module.adjustDialZ(delta);
    onAction();
  };

  const handleConfirm = () => {
    if (isSolved || !isUnlocked) return;
    const success = module.confirmSubmission();
    if (success) {
      soundManager.playSuccess();
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      {/* Selector de Elementos Químicos */}
      <div className="w-full">
        <span className="text-[10px] text-slate-400 block font-mono uppercase mb-1 text-center">
          SELECTOR DE ELEMENTO:
        </span>
        <div className="grid grid-cols-4 gap-1.5 w-full">
          {ScientificTriviaModule.AVAILABLE_ELEMENTS.map((elem) => {
            const isSelected = selectedElement === elem.symbol;
            return (
              <button
                key={elem.symbol}
                id={`elem-btn-${elem.symbol}`}
                onClick={() => handleSelectElement(elem.symbol)}
                disabled={isSolved || !isUnlocked}
                className={`py-1 rounded font-mono text-xs font-bold transition-all cursor-pointer border active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-cyan-950 text-cyan-200 border-cyan-400 glow-blue font-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
                title={elem.name}
              >
                {elem.symbol}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calibrador de Número Atómico (Z) */}
      <div className="w-full bg-black/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Atom className={`w-4 h-4 ${isSolved ? 'text-[#00ff66]' : 'text-cyan-400'}`} />
          <span>DIAL Z:</span>
          <input
            aria-label="Número atómico Z"
            type="number"
            min={1}
            max={118}
            value={currentDialZ}
            onChange={(event) => module.setDialZ(Number(event.target.value))}
            disabled={isSolved || !isUnlocked}
            className="w-14 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-base font-black text-cyan-300"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleAdjustZ(-1)}
            disabled={isSolved || !isUnlocked}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer disabled:opacity-40 active:scale-90"
            title="-1 Z"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleAdjustZ(1)}
            disabled={isSolved || !isUnlocked}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer disabled:opacity-40 active:scale-90"
            title="+1 Z"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Botón de Confirmación */}
      <button
        id="btn-confirm-trivia"
        onClick={handleConfirm}
        disabled={isSolved || !isUnlocked}
        className={`w-full py-1.5 rounded-lg font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
          isSolved
            ? 'bg-emerald-950 text-[#00ff66] border border-[#00ff66] glow-green'
            : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 hover:glow-blue'
        }`}
      >
        <Check className="w-3.5 h-3.5" />
        <span>{isSolved ? 'ESTABILIZACIÓN COMPLETA' : `VALIDAR ELEMENTO ${solvedElements + 1} / 2`}</span>
      </button>

      {isSolved && <p className="text-[10px] text-[#00ff66] font-mono text-center font-bold">✓ {module.getTargetElements().map((element) => element.name).join(' y ')} estabilizados</p>}
    </div>
  );
};
