import React from 'react';
import { MasterSwitchModule } from '../../modules/MasterSwitchModule';
import { soundManager } from '../../core/SoundManager';
import { ShieldAlert, ShieldCheck, Power, Lock, Unlock } from 'lucide-react';

interface Module6Props {
  module: MasterSwitchModule;
  onAction: () => void;
}

export const Module6MasterSwitch: React.FC<Module6Props> = ({
  module,
  onAction,
}) => {
  const isSolved = module.getSolved();
  const isCoverOpen = module.getCoverOpen();
  const isSwitchEngaged = module.getSwitchEngaged();
  const prereqsMet = module.arePrerequisitesMet();

  const handleToggleCover = () => {
    if (isSolved) return;
    soundManager.playClick();
    module.toggleCover();
    onAction();
  };

  const handleFlipSwitch = () => {
    if (isSolved) return;
    soundManager.playClick();
    const success = module.flipMasterSwitch();
    if (success) {
      soundManager.playDefusedVictory();
    } else {
      soundManager.playStrike();
    }
    onAction();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 py-1">
      {/* Indicador de subsistemas previos */}
      <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded border border-slate-700 font-mono text-xs">
        {prereqsMet ? (
          <span className="flex items-center gap-1.5 text-[#00ff66] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            SUBSISTEMAS 1-5 LISTOS PARA APAGADO
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-400">
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
            NÚCLEO ENERGIZADO: RESUELVA MÓDULOS 1 AL 5
          </span>
        )}
      </div>

      {/* Ensamblaje del Interruptor Maestro */}
      <div className="relative w-44 h-40 bg-slate-950 border-4 border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between shadow-2xl overflow-hidden">
        {/* Rayas industriales de peligro amarillas y negras en el fondo */}
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ffaa00_10px,#ffaa00_20px)] pointer-events-none" />

        {/* LED de estado de armado */}
        <div className="z-10 w-full flex items-center justify-between px-2 pt-1 border-b border-slate-800 pb-1">
          <span className="text-[9px] font-mono font-bold text-slate-400">CORE KILL</span>
          <div className="flex items-center gap-1">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isSolved
                  ? 'bg-[#00ff66] glow-green'
                  : prereqsMet
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-red-600'
              }`}
            />
            <span className="text-[9px] font-mono font-bold text-slate-300">
              {isSolved ? 'OFF' : prereqsMet ? 'ARMED' : 'LOCKED'}
            </span>
          </div>
        </div>

        {/* Palanca Basculante Heavy-Duty */}
        <div className="z-10 flex-1 flex flex-col items-center justify-center py-2">
          <button
            id="master-switch-lever"
            disabled={!isCoverOpen || isSolved}
            onClick={handleFlipSwitch}
            className={`w-14 h-20 rounded-lg border-2 flex flex-col items-center justify-between p-2 transition-all duration-300 active:scale-95 cursor-pointer shadow-xl ${
              isSwitchEngaged || isSolved
                ? 'bg-emerald-900 border-[#00ff66] text-[#00ff66] glow-green translate-y-1'
                : !isCoverOpen
                ? 'bg-slate-900/60 border-slate-700 text-slate-600 opacity-60 cursor-not-allowed'
                : prereqsMet
                ? 'bg-gradient-to-t from-red-700 to-red-500 border-red-300 text-white shadow-[0_0_20px_rgba(255,0,51,0.6)] animate-pulse'
                : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-red-500'
            }`}
          >
            <Power className="w-5 h-5" />
            <div className="w-8 h-1.5 rounded-full bg-slate-300/40" />
            <span className="text-[10px] font-display font-black">
              {isSolved ? 'SAFE' : 'KILL'}
            </span>
          </button>
        </div>

        {/* Tapa Cibernética de Protección Abatible */}
        <div
          onClick={handleToggleCover}
          className={`absolute inset-x-2 bottom-2 top-8 rounded-lg border-2 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-3 select-none backdrop-blur-sm z-20 ${
            isCoverOpen
              ? '-translate-y-28 opacity-20 pointer-events-auto bg-amber-500/20 border-amber-500/40'
              : 'translate-y-0 opacity-100 bg-amber-950/90 border-amber-500/80 shadow-[0_0_20px_rgba(255,170,0,0.3)]'
          }`}
        >
          {!isCoverOpen && (
            <div className="flex flex-col items-center text-center gap-1">
              <Lock className="w-6 h-6 text-amber-400 animate-pulse" />
              <span className="font-display font-bold text-xs text-amber-300 tracking-wider">
                CUBIERTA DE SEGURIDAD
              </span>
              <span className="font-mono text-[9px] text-amber-200/80 bg-black/50 px-2 py-0.5 rounded">
                [ CLIC PARA LEVANTAR ]
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="text-center font-mono text-[11px] text-slate-400">
        {isSolved ? (
          <span className="text-[#00ff66] font-semibold">
            ✓ NÚCLEO DESCONECTADO // AMENAZA NEUTRALIZADA
          </span>
        ) : (
          <span className="text-slate-400">
            {isCoverOpen ? (
              <span className="text-cyan-300 font-bold">Cubierta abierta: Active la palanca final</span>
            ) : (
              'Levante la cubierta protectora para acceder a la palanca'
            )}
          </span>
        )}
      </div>
    </div>
  );
};
