import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ModuleWrapperProps {
  id: string;
  moduleNumber: string;
  title: string;
  subtitle: string;
  isSolved: boolean;
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
  extraHeaderBadge,
  children,
  containerClassName = '',
}) => {
  return (
    <div
      id={id}
      className={`relative flex flex-col justify-between bg-[#0e131d] border-2 rounded-lg p-4 transition-all duration-300 shadow-xl overflow-hidden ${
        isSolved
          ? 'border-[#00ff66]/70 shadow-[0_0_20px_rgba(0,255,102,0.18)]'
          : 'border-slate-800 hover:border-slate-700'
      } ${containerClassName}`}
    >
      {/* Tornillos de esquina industriales */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center opacity-70">
        <div className="w-1.5 h-[1px] bg-slate-800 rotate-45"></div>
      </div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center opacity-70">
        <div className="w-1.5 h-[1px] bg-slate-800 -rotate-45"></div>
      </div>
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center opacity-70">
        <div className="w-1.5 h-[1px] bg-slate-800 -rotate-12"></div>
      </div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center opacity-70">
        <div className="w-1.5 h-[1px] bg-slate-800 rotate-60"></div>
      </div>

      {/* Cabecera del Módulo */}
      <div className="mb-3 border-b border-slate-800/80 pb-2 px-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800/90 text-cyan-400 border border-cyan-500/30 font-bold">
              {moduleNumber}
            </span>
            <h3 className="font-display text-sm font-bold tracking-wider text-slate-100">
              {title}
            </h3>
          </div>

          {/* LED de estado del módulo */}
          <div className="flex items-center gap-2">
            {extraHeaderBadge}
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all duration-300 ${
                isSolved
                  ? 'bg-emerald-950/80 text-[#00ff66] border border-[#00ff66] glow-green'
                  : 'bg-red-950/60 text-red-400 border border-red-700/60'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isSolved
                    ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]'
                    : 'bg-red-500 animate-pulse'
                }`}
              />
              <span>{isSolved ? 'DESACTIVADO' : 'ACTIVO'}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-tight">
          {subtitle}
        </p>
      </div>

      {/* Contenido interactivo del Módulo */}
      <div className="relative flex-1 flex flex-col justify-center items-center py-2">
        {children}
      </div>

      {/* Pie del Módulo con textura de rejilla */}
      <div className="mt-3 pt-2 border-t border-slate-900/90 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>SECURITY LEVEL: CLASSIFIED</span>
        <span className="tracking-widest">● ● ●</span>
      </div>
    </div>
  );
};
