import React from 'react';
import { Power, ShieldAlert, ShieldCheck, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { MasterSwitchModule } from '../../modules/MasterSwitchModule';
import { soundManager } from '../../core/SoundManager';

interface Module6Props {
  module: MasterSwitchModule;
  onAction: () => void;
}

export const Module6MasterSwitch: React.FC<Module6Props> = ({ module, onAction }) => {
  const isSolved = module.getSolved();
  const isCoverOpen = module.getCoverOpen();
  const isEngaged = module.getSwitchEngaged();
  const isOverrideAuthorized = module.getIsOverrideAuthorized();
  const prereqsMet = module.arePrerequisitesMet();

  const handleToggleCover = () => {
    if (isSolved) return;
    soundManager.playClick();
    const open = module.toggleCover();
    if (!open && !isOverrideAuthorized) {
      soundManager.playStrike();
    }
    onAction();
  };

  const handleFlipSwitch = () => {
    if (isSolved) return;
    const success = module.flipMasterSwitch();
    if (success) {
      soundManager.playDefusedVictory();
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      {/* Insignias de Estado de Prerrequisitos y Autorización */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full text-[10px] font-mono">
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded border ${
            prereqsMet
              ? 'bg-emerald-950/80 text-[#00ff66] border-[#00ff66]/50'
              : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}
        >
          {prereqsMet ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
          <span>ETAPAS 01-05: {prereqsMet ? 'RESUELTAS' : 'PENDIENTES'}</span>
        </div>

        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded border ${
            isOverrideAuthorized
              ? 'bg-emerald-950/80 text-[#00ff66] border-[#00ff66]/50'
              : 'bg-red-950/60 text-red-400 border-red-500/40'
          }`}
        >
          {isOverrideAuthorized ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          <span>ROOT OVERRIDE: {isOverrideAuthorized ? 'AUTORIZADO' : 'BLOQUEADO'}</span>
        </div>
      </div>

      {/* Chasis del Interruptor Maestro */}
      <div className="relative p-5 rounded-xl bg-gradient-to-b from-slate-900 to-black border-2 border-amber-500/40 shadow-[0_0_25px_rgba(255,170,0,0.15)] flex flex-col items-center justify-center">
        {/* Cubierta de Seguridad Acrílica */}
        <div className="relative mb-3">
          <button
            id="btn-toggle-cover"
            onClick={handleToggleCover}
            disabled={isSolved}
            className={`px-3 py-1 rounded font-mono text-[10px] font-bold uppercase transition-all cursor-pointer border ${
              isCoverOpen
                ? 'bg-amber-950 text-amber-300 border-amber-500 glow-amber'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
            }`}
          >
            {isCoverOpen ? 'CUBIERTA LEVANTADA (PELIGRO)' : 'LEVANTAR CUBIERTA DE SEGURIDAD'}
          </button>
        </div>

        {/* Palanca / Botón de Conmutación Definitiva */}
        <div className="relative">
          {/* Advertencia si la cubierta está cerrada */}
          {!isCoverOpen && !isSolved && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-full z-10 flex items-center justify-center pointer-events-none">
              <Lock className="w-6 h-6 text-amber-500/70" />
            </div>
          )}

          <button
            id="btn-master-switch-flip"
            onClick={handleFlipSwitch}
            disabled={!isCoverOpen || isSolved}
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-2xl ${
              isSolved
                ? 'bg-gradient-to-br from-emerald-600 to-teal-950 border-[#00ff66] text-[#00ff66] glow-green'
                : isCoverOpen && isOverrideAuthorized && prereqsMet
                ? 'bg-gradient-to-br from-red-600 via-amber-700 to-amber-950 border-red-500 text-white shadow-[0_0_35px_rgba(255,0,51,0.6)] animate-pulse hover:scale-105'
                : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            <Power className={`w-9 h-9 mb-1 ${isSolved ? 'text-[#00ff66]' : 'text-amber-400'}`} />
            <span className="font-display font-black text-[11px] tracking-wider text-center px-1">
              {isSolved ? 'DESACTIVADO' : 'CORTE TOTAL'}
            </span>
            <span className="text-[9px] font-mono opacity-80">
              {isSolved ? 'SISTEMA SEGURO' : 'APAGADO MASTER'}
            </span>
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 font-mono text-center">
        {isSolved ? (
          <span className="text-[#00ff66] font-bold">✓ Bomba Desarmada Exitosamente</span>
        ) : !isOverrideAuthorized ? (
          <span>Desbloqueo en terminal: <code className="text-cyan-300 font-bold">sudo override</code></span>
        ) : (
          <span className="text-amber-300 font-bold animate-pulse">¡Anulación autorizada! Levante cubierta y accione corte.</span>
        )}
      </p>
    </div>
  );
};
