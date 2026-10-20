import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, Home } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  onReset: () => void;
  onGoHome: () => void;
  remainingSeconds: number;
  strikes: number;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onReset,
  onGoHome,
  remainingSeconds,
  strikes,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Lanzar confeti cibernético
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00ff66', '#00e5ff', '#ffffff', '#ffaa00'],
      });

      const interval = setInterval(() => {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { x: Math.random(), y: Math.random() * 0.4 },
          colors: ['#00ff66', '#00e5ff'],
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0a121a] border-2 border-[#00ff66] rounded-2xl p-6 shadow-[0_0_60px_rgba(0,255,102,0.35)] flex flex-col items-center text-center">
        {/* Insignia de Trofeo */}
        <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-[#00ff66] flex items-center justify-center mb-4 glow-green">
          <Award className="w-9 h-9 text-[#00ff66]" />
        </div>

        <h2 className="font-display text-2xl font-black text-white text-glow-green tracking-wider uppercase mb-1">
          ¡BOMBA DESACTIVADA CON ÉXITO!
        </h2>
        <p className="font-mono text-xs text-emerald-400 mb-6 uppercase tracking-widest">
          VARIANTE BOMB-882 NEUTRALIZADA
        </p>

        {/* Estadísticas de la partida */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col items-center">
            <span className="text-slate-400 text-[10px] uppercase">Tiempo Sobrante</span>
            <span className="text-xl font-black text-[#00ff66]">{timeFormatted}</span>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col items-center">
            <span className="text-slate-400 text-[10px] uppercase">Strikes Cometidos</span>
            <span className="text-xl font-black text-amber-400">{strikes} / 3</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-mono mb-6 leading-relaxed">
          Has completado la deducción lógica con precisión quirúrgica, validando la sincronización de patrones State, Strategy, Observer, Factory y Decorator.
        </p>

        {/* Botones de Acción */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg glow-green"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar Simulación
          </button>
          <button
            onClick={onGoHome}
            className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};
