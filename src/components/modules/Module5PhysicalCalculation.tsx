import React from 'react';
import { Activity, Plus, Minus, Zap } from 'lucide-react';
import { PhysicalCalculationModule } from '../../modules/PhysicalCalculationModule';
import { soundManager } from '../../core/SoundManager';

interface Module5Props {
  module: PhysicalCalculationModule;
  onAction: () => void;
}

export const Module5PhysicalCalculation: React.FC<Module5Props> = ({ module, onAction }) => {
  const isSolved = module.getSolved();
  const isUnlocked = module.getIsUnlocked();
  const currentHz = module.getFrequency();
  const currentPhase = module.getPhase();

  const handleAdjustHz = (delta: number) => {
    if (isSolved || !isUnlocked) return;
    soundManager.playClick();
    module.adjustFrequency(delta);
    onAction();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSolved || !isUnlocked) return;
    module.setFrequency(Number(e.target.value));
    onAction();
  };

  const handlePhaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSolved || !isUnlocked) return;
    module.setPhase(Number(e.target.value));
    onAction();
  };

  const handleConfirm = () => {
    if (isSolved || !isUnlocked) return;
    const success = module.confirmTuning();
    if (success) {
      soundManager.playSuccess();
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      {/* Display LED de Frecuencia */}
      <div className="w-full bg-black/80 p-3 rounded-lg border-2 border-cyan-500/50 shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className={`w-5 h-5 ${isSolved ? 'text-[#00ff66]' : 'text-cyan-400 animate-pulse'}`} />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-mono">
              OSCILADOR ARMÓNICO
            </span>
            <span className="font-mono text-2xl font-black text-cyan-300 text-glow-blue">
              {currentHz}{' '}
              <span className="text-xs font-normal text-slate-400">Hz</span>
            </span>
          </div>
        </div>

        {/* Onda Senoidal SVG Simulada */}
        <div className="w-20 h-8 flex items-center overflow-hidden opacity-70">
          <svg className="w-full h-full text-cyan-400" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path
              d="M0 12.5 Q 12.5 0, 25 12.5 T 50 12.5 T 75 12.5 T 100 12.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Slider y Controles de Ajuste de Frecuencia */}
      <div className="w-full space-y-2">
        <input
          id="frequency-range-slider"
          type="range"
          min={module.minHz}
          max={module.maxHz}
          value={currentHz}
          onChange={handleSliderChange}
          disabled={isSolved || !isUnlocked}
          className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
        />

        <div className="flex items-center justify-between gap-1">
          <button
            onClick={() => handleAdjustHz(-5)}
            disabled={isSolved || !isUnlocked}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-700 cursor-pointer disabled:opacity-40 active:scale-95"
          >
            -5
          </button>
          <button
            onClick={() => handleAdjustHz(-1)}
            disabled={isSolved || !isUnlocked}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-700 cursor-pointer disabled:opacity-40 active:scale-95"
          >
            -1
          </button>
          <span className="text-[10px] font-mono text-slate-500">AJUSTE FINO</span>
          <button
            onClick={() => handleAdjustHz(1)}
            disabled={isSolved || !isUnlocked}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-700 cursor-pointer disabled:opacity-40 active:scale-95"
          >
            +1
          </button>
          <button
            onClick={() => handleAdjustHz(5)}
            disabled={isSolved || !isUnlocked}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-700 cursor-pointer disabled:opacity-40 active:scale-95"
          >
            +5
          </button>
        </div>
      </div>

      <div className="w-full space-y-1.5">
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <label htmlFor="phase-range-slider">FASE</label>
          <span className="text-cyan-300">{currentPhase}°</span>
        </div>
        <input
          id="phase-range-slider"
          type="range"
          min={module.minPhase}
          max={module.maxPhase}
          value={currentPhase}
          onChange={handlePhaseChange}
          disabled={isSolved || !isUnlocked}
          className="w-full accent-amber-400 cursor-pointer disabled:opacity-40"
        />
      </div>

      {/* Botón de Sintonización */}
      <button
        id="btn-tune-frequency"
        onClick={handleConfirm}
        disabled={isSolved || !isUnlocked}
        className={`w-full py-1.5 rounded-lg font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
          isSolved
            ? 'bg-emerald-950 text-[#00ff66] border border-[#00ff66] glow-green'
            : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 hover:glow-blue'
        }`}
      >
        <Zap className="w-3.5 h-3.5" />
        <span>{isSolved ? `RESONANCIA CALIBRADA (${module.targetHz} Hz / ${module.targetPhase}°)` : 'SINTONIZAR RESONANCIA'}</span>
      </button>

      {isSolved && <p className="text-[10px] text-[#00ff66] font-mono text-center font-bold">✓ Resonancia calibrada</p>}
    </div>
  );
};
