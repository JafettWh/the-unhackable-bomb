import React from 'react';
import { Lock, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface ModuleWrapperProps {
  id: string;
  moduleNumber: string;
  title: string;
  subtitle: string;
  isSolved: boolean;
  isLocked?: boolean;
  isActive?: boolean;
  extraHeaderBadge?: React.ReactNode;
  children: React.ReactNode;
  containerClassName?: string;
}

export const ModuleWrapper: React.FC<ModuleWrapperProps> = ({
  id,
  moduleNumber,
  title,
  subtitle,
  isSolved,
  isLocked = false,
  isActive = false,
  extraHeaderBadge,
  children,
  containerClassName = '',
}) => {
  return (
    <div
      id={id}
      className={`relative flex flex-col justify-between bg-[#0e131d] border-2 rounded-xl p-4 transition-all duration-300 shadow-xl overflow-hidden ${
        isSolved
          ? 'border-[#00ff66]/70 shadow-[0_0_20px_rgba(0,255,102,0.18)] bg-[#081512]/60'
          : isLocked
          ? 'border-slate-800/60 bg-[#090d14]/70 opacity-60'
          : 'border-cyan-500/70 shadow-[0_0_20px_rgba(0,229,255,0.2)] bg-[#0b101a]'
      } ${containerClassName}`}
    >
      {/* Tornillos Industriales en las esquinas */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 opacity-60 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-slate-900 rotate-45" />
      </div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 opacity-60 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-slate-900 -rotate-45" />
      </div>
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 opacity-60 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-slate-900 -rotate-12" />
      </div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 opacity-60 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-slate-900 rotate-60" />
      </div>

      {/* Cabecera del Módulo */}
      <div className="mb-3 border-b border-slate-800 pb-2 px-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded font-black border ${
                isSolved
                  ? 'bg-emerald-950 text-[#00ff66] border-[#00ff66]/40'
                  : isLocked
                  ? 'bg-slate-900 text-slate-500 border-slate-800'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-500/40 glow-blue'
              }`}
            >
              {moduleNumber}
            </span>
            <h3 className="font-display text-xs md:text-sm font-bold tracking-wider text-slate-100">
              {title}
            </h3>
          </div>

          {/* LED / Insignia de Estado */}
          <div className="flex items-center gap-2">
            {extraHeaderBadge}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all duration-300 border ${
                isSolved
                  ? 'bg-emerald-950/90 text-[#00ff66] border-[#00ff66] glow-green'
                  : isLocked
                  ? 'bg-slate-900 text-slate-500 border-slate-700'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-400 glow-blue animate-pulse'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isSolved
                    ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]'
                    : isLocked
                    ? 'bg-slate-600'
                    : 'bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-ping'
                }`}
              />
              <span>{isSolved ? 'DESACTIVADO' : isLocked ? 'BLOQUEADO' : 'ACTIVO'}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-tight">
          {subtitle}
        </p>
      </div>

      {/* Área del Contenido del Módulo */}
      <div className="relative flex-1 flex flex-col justify-center items-center py-2 min-h-[140px]">
        {children}

        {/* Capa de Bloqueo Secuencial */}
        {isLocked && !isSolved && (
          <div className="absolute inset-0 bg-[#070a10]/85 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center p-3 text-center z-10 border border-slate-800">
            <Lock className="w-8 h-8 text-slate-500 mb-2 animate-pulse" />
            <span className="font-mono text-xs font-bold text-slate-300 tracking-wider">
              MÓDULO BLOQUEADO
            </span>
            <span className="font-mono text-[10px] text-slate-500 mt-1">
              Requiere resolución del módulo previo en secuencia
            </span>
          </div>
        )}
      </div>

      {/* Pie del Módulo */}
      <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-cyan-600" />
          <span>SECURITY LEVEL: CANONICAL</span>
        </span>
        <span className="tracking-widest">● ● ●</span>
      </div>
    </div>
  );
};
