import React, { useState } from 'react';
import { Binary, Check } from 'lucide-react';
import { SpatialOrientationModule } from '../../modules/SpatialOrientationModule';
import { soundManager } from '../../core/SoundManager';

interface Module1Props {
  module: SpatialOrientationModule;
  onAction: () => void;
}

export const Module1SpatialOrientation: React.FC<Module1Props> = ({ module, onAction }) => {
  const [answer, setAnswer] = useState('');
  const isSolved = module.getSolved();
  const isUnlocked = module.getIsUnlocked();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSolved || !isUnlocked || !answer) return;

    const success = module.submitAnswer(Number(answer));
    if (success) {
      soundManager.playSuccess();
    } else {
      soundManager.playStrike();
      setAnswer('');
    }
    onAction();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 font-mono">
      <div className="flex items-center gap-2 text-[10px] text-cyan-300">
        <Binary className="w-4 h-4" />
        <span>MATRIZ DE RELACIONES // VALOR AUSENTE</span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 w-full max-w-[210px]" aria-label="Matriz numérica">
        {['2', '3', '13', '4', '5', '41', '6', '7', '?'].map((value, index) => (
          <div
            key={`${index}-${value}`}
            className={`aspect-square flex items-center justify-center border text-sm font-black ${
              value === '?'
                ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 text-lg'
                : 'bg-black/70 border-slate-700 text-slate-200'
            }`}
          >
            {isSolved && value === '?' ? module.targetValue : value}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-[210px]">
        <input
          aria-label="Resultado de la matriz"
          type="number"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={isSolved || !isUnlocked}
          className="min-w-0 flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-center text-cyan-200 focus:border-cyan-400 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSolved || !isUnlocked || !answer}
          aria-label="Validar resultado"
          className="p-2 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 disabled:opacity-40"
        >
          {isSolved ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs font-bold">OK</span>}
        </button>
      </form>

      {isSolved && <p className="text-[10px] text-[#00ff66] text-center font-bold">✓ MATRIZ ESTABILIZADA</p>}
    </div>
  );
};
