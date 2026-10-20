import React from 'react';
import {
  RotateCcw,
  BookOpen,
  Volume2,
  VolumeX,
  Flame,
  Shield,
  Clock,
  Gauge,
  Lock,
  Unlock,
} from 'lucide-react';
import { BombStatus } from '../types';
import { soundManager } from '../core/SoundManager';

interface HeaderProps {
  remainingSeconds: number;
  strikes: number;
  maxStrikes: number;
  speedMultiplier: number;
  status: BombStatus;
  seed: string;
  isAdminUnlocked: boolean;
  onReset: () => void;
  onOpenManual: (tab?: 'blackbox' | 'creator') => void;
}

export const Header: React.FC<HeaderProps> = ({
  remainingSeconds,
  strikes,
  maxStrikes,
  speedMultiplier,
  status,
  seed,
  isAdminUnlocked,
  onReset,
  onOpenManual,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.getIsMuted());

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleManualClick = () => {
    if (!isAdminUnlocked) {
      soundManager.playStrike();
      alert("ACCESO DENEGADO [403 FORBIDDEN]\nEl Manual de Desactivación está bloqueado por el administrador.\nIntroduzca el comando 'sudo -admin' en la Terminal interactiva para desbloquear privilegios root.");
      return;
    }
    soundManager.playClick();
    onOpenManual('blackbox');
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'STANDBY':
        return {
          text: 'EN ESPERA // STANDBY',
          className: 'bg-slate-900 text-slate-400 border-slate-700',
        };
      case 'UNLOCKED':
        return {
          text: 'DESBLOQUEADO (DEDUCTIVO)',
          className: 'bg-emerald-950 text-[#00ff66] border-[#00ff66] glow-green',
        };
      case 'PANIC':
        return {
          text: '¡ESTADO DE PÁNICO CRÍTICO!',
          className: 'bg-red-950 text-red-400 border-red-500 glow-red animate-pulse',
        };
      case 'DEFUSED':
        return {
          text: 'DESACTIVADA // VICTORIA',
          className: 'bg-cyan-950 text-cyan-300 border-cyan-400 glow-blue',
        };
      case 'EXPLODED':
        return {
          text: 'DETONADA // MISIÓN FALLIDA',
          className: 'bg-red-950 text-red-500 border-red-600',
        };
      case 'NORMAL':
      default:
        return {
          text: 'NORMAL / SECUENCIAL',
          className: 'bg-slate-900 text-cyan-300 border-cyan-700/60',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <header className="w-full bg-[#0b0f17] border-b-2 border-slate-800 shadow-2xl relative z-30 font-mono">
      {/* Barra Superior con Título y Acciones */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Título de la Aplicación y Semilla */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-500/60 flex items-center justify-center glow-red">
            <Flame className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg md:text-xl font-black tracking-widest text-white text-glow-green">
                THE UNHACKABLE BOMB
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                {seed}
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              TERMINAL EDITION // 5 VARIANTES DE 6 MÓDULOS
            </p>
          </div>
        </div>

        {/* Botones de Control Principal */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Botón Ver Manual con Bloqueo de Administrador */}
          <button
            id="btn-open-manual"
            onClick={handleManualClick}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
              isAdminUnlocked
                ? 'bg-emerald-950/90 hover:bg-emerald-900 text-[#00ff66] border-[#00ff66]/70 glow-green'
                : 'bg-slate-900/90 text-slate-500 border-red-900/50 hover:border-red-600 hover:text-red-300'
            }`}
            title={
              isAdminUnlocked
                ? 'Manual desbloqueado (Acceso Root)'
                : "Bloqueado para Administrador. Escriba 'sudo -admin' en la terminal."
            }
          >
            {isAdminUnlocked ? (
              <Unlock className="w-4 h-4 text-[#00ff66]" />
            ) : (
              <Lock className="w-4 h-4 text-red-500" />
            )}
            <span>Manual de Desactivación</span>
            {!isAdminUnlocked && (
              <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.2 rounded border border-red-800">
                LOCKED
              </span>
            )}
          </button>

          {/* Botón Reiniciar Bomba */}
          <button
            id="btn-reset-bomb"
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-600/60 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:glow-red active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>

          {/* Toggle Silenciar Audio */}
          <button
            id="btn-toggle-sound"
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border font-mono text-xs transition-colors cursor-pointer ${
              isMuted
                ? 'bg-slate-900 text-slate-500 border-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
            }`}
            title={isMuted ? 'Activar Sonido' : 'Silenciar Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Panel Central de Telemetría: Reloj, Strikes, Velocidad y Estado */}
      <div className="bg-[#070a0f] border-t border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Reloj Digital LED Segmentado */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>RELOJ:</span>
            </div>
            <div className="bg-black/90 px-4 py-1 rounded-md border-2 border-red-500/70 shadow-[inset_0_0_12px_rgba(255,0,51,0.3)]">
              <span
                id="bomb-timer-display"
                className={`font-mono text-2xl md:text-3xl font-black tracking-widest ${
                  status === 'PANIC' || (remainingSeconds > 0 && remainingSeconds < 120)
                    ? 'text-red-500 text-glow-red animate-pulse'
                    : 'text-red-400 text-glow-red'
                }`}
              >
                {timeFormatted}
              </span>
            </div>
          </div>

          {/* LEDs de Strikes (X X X) */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-400 font-bold">STRIKES:</span>
            <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded border border-slate-800">
              {Array.from({ length: maxStrikes }, (_, i) => {
                const isStrikeActive = i < strikes;
                return (
                  <div
                    key={i}
                    id={`strike-led-${i + 1}`}
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-mono text-[10px] font-black ${
                      isStrikeActive
                        ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(255,0,51,1)] animate-bounce'
                        : 'bg-red-950/40 border-red-900/60 text-transparent'
                    }`}
                  >
                    ✕
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indicador de Multiplicador de Velocidad */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              VELOCIDAD:
            </span>
            <div
              className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${
                speedMultiplier >= 3.0
                  ? 'bg-red-950 text-red-400 border-red-500 glow-red animate-pulse'
                  : speedMultiplier > 1.0
                  ? 'bg-amber-950 text-amber-400 border-amber-500 glow-amber'
                  : 'bg-slate-900 text-cyan-300 border-slate-700'
              }`}
            >
              {speedMultiplier.toFixed(1)}x
            </div>
          </div>

          {/* Insignia de Estado Global */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              ESTADO:
            </span>
            <div
              className={`font-display text-xs font-bold px-3 py-1 rounded border uppercase tracking-wider ${statusBadge.className}`}
            >
              {statusBadge.text}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
