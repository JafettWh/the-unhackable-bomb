import React from 'react';
import { Flame, Play, ShieldAlert, Cpu, Terminal, Zap, Radio, Clock, AlertTriangle } from 'lucide-react';
import { soundManager } from '../core/SoundManager';

interface StartScreenProps {
  onStartConnection: () => void;
  seed: string;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartConnection, seed }) => {
  const handleStart = () => {
    soundManager.playSuccess();
    onStartConnection();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05080e] text-slate-100 flex flex-col justify-between items-center p-6 sm:p-10 overflow-hidden select-none font-mono">
      {/* Capa de Efectos CRT y Rejilla Cibernética */}
      <div className="fixed inset-0 scanlines z-10 pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-[#070b12] to-[#04060a] -z-10" />

      {/* Círculos de Radar de Fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-cyan-500/10 rounded-full pointer-events-none animate-ping opacity-20 duration-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-500/20 rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-emerald-500/15 rounded-full pointer-events-none" />

      {/* Barra Superior con Telemetría Previa */}
      <header className="w-full max-w-5xl flex items-center justify-between border-b border-slate-800 pb-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-950 border border-red-500/50 flex items-center justify-center glow-red">
            <Flame className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <div>
            <span className="font-display font-black text-sm text-white tracking-widest">
              DEFENSE MATRIX LABS
            </span>
            <p className="text-[10px] text-slate-400">PROTOCOLO DE SEGURIDAD MILITAR // ARQUITECTURA POO</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold tracking-wider">
            SERIE: {seed}
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-red-950/80 text-red-300 border border-red-500/40 font-bold animate-pulse">
            DISPOSITIVO ARMADO
          </span>
        </div>
      </header>

      {/* Contenido Central: Título y Botón Gigante */}
      <main className="max-w-4xl w-full flex flex-col items-center justify-center text-center my-auto py-8 relative z-20">
        {/* Insignia de Clasificación */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs mb-6 shadow-inner">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="tracking-wider">SISTEMA CIBERNÉTICO // 5 VARIANTES DE DESACTIVACIÓN</span>
        </div>

        {/* Título Principal Retro-Futurista */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-widest text-white uppercase text-glow-green mb-3">
          THE UNHACKABLE BOMB
        </h1>
        <h2 className="font-display text-lg sm:text-2xl font-bold tracking-widest text-cyan-400 text-glow-blue uppercase mb-8">
          — TERMINAL EDITION —
        </h2>

        {/* Panel de Especificaciones Tácticas */}
        <div className="w-full max-w-2xl bg-black/70 border border-cyan-500/30 rounded-xl p-5 mb-10 text-left shadow-[0_0_35px_rgba(0,229,255,0.15)] backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-cyan-400 font-bold text-xs">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              BRIEFING TÁCTICO DE CONEXIÓN
            </span>
            <span className="text-slate-500">6 MÓDULOS ENCADENADOS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-xs">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Clock className="w-6 h-6 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">TIEMPO LÍMITE</span>
                <span className="text-white font-black text-sm">15:00 MIN</span>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">TOLERANCIA</span>
                <span className="text-red-400 font-black text-sm">3 STRIKES MAX</span>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Cpu className="w-6 h-6 text-[#00ff66] flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">RESOLUCIÓN</span>
                <span className="text-[#00ff66] font-black text-sm">SECUENCIAL</span>
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed border-t border-slate-800/80 pt-3">
            Para desarmar el núcleo, debe ingresar comandos en la <strong className="text-cyan-300">Terminal Interactiva</strong> para consultar las pistas de esta partida. Los módulos inician bloqueados; resolver cada etapa desbloquea la siguiente bajo el patrón Observer.
          </p>
        </div>

        {/* Botón Gigante de INICIAR CONEXIÓN */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />

          <button
            id="btn-start-connection"
            onClick={handleStart}
            className="relative px-10 py-5 sm:px-14 sm:py-6 rounded-xl bg-gradient-to-b from-[#0b1720] to-[#04080e] border-2 border-[#00ff66] text-[#00ff66] font-display font-black text-lg sm:text-2xl tracking-widest uppercase transition-all duration-300 group-hover:scale-105 active:scale-95 cursor-pointer glow-green shadow-[0_0_40px_rgba(0,255,102,0.6)] flex items-center gap-4"
          >
            <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-[#00ff66] animate-bounce" />
            <span>INICIAR CONEXIÓN</span>
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500 tracking-wider">
          PRESIONE EL BOTÓN PARA ARMAR EL TEMPORIZADOR Y DESPLEGAR LA CONSOLA TÁCTICA
        </p>
      </main>

      {/* Pie de Página */}
      <footer className="w-full max-w-5xl flex flex-wrap items-center justify-between border-t border-slate-800 pt-4 text-[11px] text-slate-500 relative z-20">
        <span>THE UNHACKABLE BOMB &copy; 2026 // INGENIERÍA DE SOFTWARE II</span>
        <div className="flex items-center gap-4">
          <span>PATRONES: STATE · STRATEGY · OBSERVER · FACTORY · DECORATOR</span>
        </div>
      </footer>
    </div>
  );
};
