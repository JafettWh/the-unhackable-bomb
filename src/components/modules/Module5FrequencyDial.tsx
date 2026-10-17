import React from 'react';
import { FrequencyDialModule } from '../../modules/FrequencyDialModule';
import { soundManager } from '../../core/SoundManager';
import { Activity, Sliders, CheckCircle } from 'lucide-react';

interface Module5Props {
  module: FrequencyDialModule;
  onAction: () => void;
  remainingSeconds: number;
}

export const Module5FrequencyDial: React.FC<Module5Props> = ({
  module,
  onAction,
  remainingSeconds,
}) => {
  const isSolved = module.getSolved();
  const currentHz = module.getFrequency();
  const remainingMinutes = Math.floor(remainingSeconds / 60);

  const handleAdjust = (delta: number) => {
    if (isSolved) return;
    soundManager.playClick();
    module.adjustFrequency(delta);
    onAction();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSolved) return;
    const val = parseInt(e.target.value, 10);
    module.setFrequency(val);
    onAction();
  };

  const handleConfirm = () => {
    if (isSolved) return;
    const success = module.confirmTuning();
    if (success) {
      soundManager.playSuccess();
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  // Generar onda senoidal decorativa según la frecuencia actual
  const wavePoints = Array.from({ length: 30 }, (_, i) => {
    const x = i * 6;
    const freqFactor = (currentHz / 200) * 12;
    const y = 15 + Math.sin(i * 0.4 * freqFactor) * 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 py-1">
      {/* Pantalla digital de Osciloscopio & Frecuencia */}
      <div className="w-full max-w-[260px] bg-black/90 border-2 border-cyan-500/50 rounded-lg p-2.5 shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            OSCILOSCOPIO HZ
          </span>
          <span className="text-slate-400">SYNC: OBSERVER</span>
        </div>

        {/* Onda senoidal SVG dinámica */}
        <div className="h-8 bg-slate-950 rounded border border-cyan-950 flex items-center justify-center overflow-hidden px-1">
          <svg className="w-full h-full" viewBox="0 0 174 30">
            <polyline
              fill="none"
              stroke="#00e5ff"
              strokeWidth="2"
              points={wavePoints}
              className="drop-shadow-[0_0_6px_#00e5ff]"
            />
          </svg>
        </div>

        {/* Display numérico grande */}
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-mono text-3xl font-black text-cyan-300 text-glow-blue">
            {currentHz}
          </span>
          <span className="font-display text-sm font-bold text-cyan-500">Hz</span>
        </div>
      </div>

      {/* Slider y Controles de Ajuste Rápido */}
      <div className="w-full max-w-[260px] flex flex-col gap-2">
        <input
          id="frequency-slider"
          type="range"
          min={module.minHz}
          max={module.maxHz}
          step={module.stepHz}
          value={currentHz}
          onChange={handleSliderChange}
          disabled={isSolved}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
        />

        <div className="flex items-center justify-between gap-1.5 font-mono text-xs">
          <button
            id="freq-sub-10"
            disabled={isSolved}
            onClick={() => handleAdjust(-10)}
            className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            -10
          </button>
          <button
            id="freq-sub-5"
            disabled={isSolved}
            onClick={() => handleAdjust(-5)}
            className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            -5
          </button>
          <button
            id="freq-add-5"
            disabled={isSolved}
            onClick={() => handleAdjust(5)}
            className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            +5
          </button>
          <button
            id="freq-add-10"
            disabled={isSolved}
            onClick={() => handleAdjust(10)}
            className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            +10
          </button>
        </div>
      </div>

      {/* Botón de Confirmación */}
      <button
        id="frequency-confirm-btn"
        disabled={isSolved}
        onClick={handleConfirm}
        className={`w-full max-w-[260px] py-2 rounded-md font-display font-bold text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer ${
          isSolved
            ? 'bg-emerald-950 border border-[#00ff66] text-[#00ff66] glow-green'
            : 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 border border-cyan-400 text-white glow-blue'
        }`}
      >
        <CheckCircle className="w-3.5 h-3.5" />
        {isSolved ? 'RESONANCIA ESTABILIZADA' : 'SINTONIZAR / CONFIRMAR'}
      </button>

      <div className="text-center font-mono text-[11px] text-slate-400">
        {isSolved ? (
          <span className="text-[#00ff66] font-semibold">
            ✓ Frecuencia Acoplada ({currentHz} Hz)
          </span>
        ) : (
          <span className="text-slate-400">
            Fórmula: <strong className="text-cyan-300">Minutos ({remainingMinutes})</strong> × 10
          </span>
        )}
      </div>
    </div>
  );
};
