import React from 'react';
import { EyeOff, Hexagon, Triangle, Square, Pentagon } from 'lucide-react';
import { GlitchDecorator } from '../../patterns/decorator/GlitchDecorator';
import { GeometricCipherModule } from '../../modules/GeometricCipherModule';
import { GeometricShape, ShapeInfo } from '../../types';
import { soundManager } from '../../core/SoundManager';

interface Module4Props {
  decorator: GlitchDecorator;
  onAction: () => void;
}

const SHAPES: ShapeInfo[] = [
  { id: 'TRIANGLE', symbol: '△', name: 'Triángulo', sides: 3 },
  { id: 'SQUARE',   symbol: '□', name: 'Cuadrado',  sides: 4 },
  { id: 'PENTAGON', symbol: '⬠', name: 'Pentágono', sides: 5 },
  { id: 'HEXAGON',  symbol: '⬡', name: 'Hexágono',  sides: 6 },
];

export const Module4GeometricCipher: React.FC<Module4Props> = ({ decorator, onAction }) => {
  const wrapped = decorator.getWrapped() as GeometricCipherModule;
  const isSolved = decorator.getSolved();
  const isUnlocked = decorator.getIsUnlocked();
  const currentStep = wrapped.getCurrentStep();
  const glitchClass = decorator.getVisualEffectsClass();
  const targetSum = wrapped.targetSum;

  const handlePress = (shape: GeometricShape) => {
    if (isSolved || !isUnlocked) return;
    soundManager.playGlitch();
    const success = wrapped.pressShape(shape);
    if (success) {
      if (wrapped.getSolved()) {
        soundManager.playSuccess();
      } else {
        soundManager.playClick();
      }
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center gap-3 p-2 rounded-lg border transition-all ${glitchClass}`}>
      {/* Cabecera: objetivo y progreso */}
      <div className="flex items-center justify-between w-full px-2 py-1 bg-black/70 rounded border border-cyan-500/30 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <EyeOff className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-bold">CIFRADO GEOMÉTRICO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">TARGET:</span>
          <span className="text-amber-400 font-black text-sm">{targetSum}</span>
          <span className="text-slate-600">|</span>
          <span className={`font-bold ${currentStep >= 1 ? 'text-[#00ff66]' : 'text-slate-600'}`}>▶ P1</span>
          <span className={`font-bold ${currentStep >= 2 || isSolved ? 'text-[#00ff66]' : 'text-slate-600'}`}>▶ P2</span>
        </div>
      </div>

      {/* Instrucción contextual */}
      <div className="w-full px-2 py-1.5 bg-slate-900/70 rounded border border-slate-700/40 text-center font-mono text-[10px] text-slate-400 leading-relaxed">
        Selecciona{' '}
        <span className="text-amber-300 font-bold">2 figuras en orden</span>{' '}
        cuya suma de lados iguale el valor objetivo.
      </div>

      {/* Cuadrícula de figuras */}
      <div className="grid grid-cols-2 gap-2.5 w-full max-w-[200px]">
        {SHAPES.map((shape) => (
          <button
            key={shape.id}
            id={`btn-shape-${shape.id.toLowerCase()}`}
            onClick={() => handlePress(shape.id)}
            disabled={isSolved || !isUnlocked}
            title={`${shape.name} — ${shape.sides} lados`}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 cursor-pointer disabled:opacity-40 shadow-md active:scale-95 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.25)] transition-all select-none"
          >
            <span className="text-2xl leading-none">{shape.symbol}</span>
            <span className="text-[9px] font-mono text-slate-400">{shape.sides} lados</span>
          </button>
        ))}
      </div>

      {/* Estado final */}
      <p className="text-[10px] text-slate-400 font-mono text-center">
        {isSolved ? (
          <span className="text-[#00ff66] font-bold">✓ Cifrado Geométrico Validado — Suma confirmada</span>
        ) : !isUnlocked ? (
          <span className="text-slate-600">🔒 Esperando desbloqueo de módulo previo…</span>
        ) : (
          <span className="text-slate-500">Paso {currentStep + 1} / 2 activo</span>
        )}
      </p>
    </div>
  );
};
