import React, { useEffect, useState } from 'react';
import { Delete, Lock, Power, ShieldAlert, ShieldCheck, Unlock } from 'lucide-react';
import { MasterSwitchModule } from '../../modules/MasterSwitchModule';
import { OVERRIDE_COLOR_BASES, OverrideColor } from '../../modules/ChallengeVariants';
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
  const isUnlocked = module.getIsUnlocked();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  useEffect(() => {
    setCode('');
    setCodeError('');
  }, [module]);

  const colorPresentation: Record<OverrideColor, string> = {
    RED: 'bg-red-500',
    CYAN: 'bg-cyan-400',
    GREEN: 'bg-green-500',
    LIME: 'bg-lime-400',
    PURPLE: 'bg-purple-500',
    BLUE: 'bg-blue-500',
    ORANGE: 'bg-orange-500',
    WHITE: 'bg-white',
    PINK: 'bg-pink-500',
    SLATE: 'bg-slate-400',
  };

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

  const handleSubmitCode = () => {
    if (code.length !== 4) {
      setCodeError('EL CÓDIGO DEBE TENER 4 DÍGITOS.');
      return;
    }

    const success = module.submitOverrideCode(code);
    if (success) {
      soundManager.playSuccess();
      setCodeError('');
    } else {
      soundManager.playStrike();
      setCode('');
      setCodeError('CÓDIGO INCORRECTO. REVISA LOS COLORES.');
    }
    onAction();
  };

  const colorSequence = module.getColorSequence();

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

      {prereqsMet ? (
        <div className="w-full space-y-3 rounded-lg border border-cyan-500/30 bg-black/50 p-3">
          <div className="text-center font-mono">
            <p className="text-[10px] font-bold text-cyan-300">CIFRADO DE ANULACIÓN // 4 DÍGITOS</p>
            <p className="mt-1 text-[9px] text-slate-400">Descifra la secuencia con la tabla de bases. Consulta la terminal para obtener la regla de conversión.</p>
          </div>

          <div className="flex items-center justify-center gap-2" aria-label="Secuencia de cuatro colores">
            {colorSequence.map((color, index) => (
              <div key={`${color}-${index}`} className="flex flex-col items-center gap-1">
                <span aria-label={`Señal ${index + 1}`} className={`h-7 w-7 rounded-full border border-white/30 shadow-[0_0_12px_currentColor] ${colorPresentation[color]}`} />
                <span className="text-[8px] font-mono text-slate-500">#{index + 1}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-1" aria-label="Tabla de equivalencias de colores">
            {(Object.keys(OVERRIDE_COLOR_BASES) as OverrideColor[]).map((color) => (
              <div key={color} aria-label={`Señal de base ${OVERRIDE_COLOR_BASES[color]}`} className="flex items-center justify-center gap-1 rounded border border-slate-800 bg-slate-900/80 py-1">
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${colorPresentation[color]}`} />
                <span className="text-[8px] font-mono text-slate-300">BASE</span>
                <span className="text-[9px] font-mono font-bold text-amber-300">{OVERRIDE_COLOR_BASES[color]}</span>
              </div>
            ))}
          </div>

          {isOverrideAuthorized ? (
            <p role="status" className="text-center text-[10px] font-mono font-bold text-[#00ff66]">✓ CÓDIGO ACEPTADO — CUBIERTA DESBLOQUEADA</p>
          ) : (
            <div className="mx-auto w-full max-w-[190px] space-y-2">
              <div
                aria-label={`${code.length} de 4 dígitos ingresados`}
                aria-live="polite"
                className="rounded border border-cyan-500/40 bg-slate-950 px-3 py-1 text-center font-mono text-xl font-black tracking-[0.5em] text-cyan-300"
              >
                {`${code}${'·'.repeat(4 - code.length)}`}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => {
                      if (code.length < 4) setCode((current) => current + digit);
                      setCodeError('');
                      soundManager.playClick();
                    }}
                    className="rounded border border-slate-700 bg-slate-900 py-1.5 font-mono text-sm font-bold text-slate-100 hover:border-cyan-400 hover:bg-cyan-950 active:scale-95"
                    aria-label={`Ingresar ${digit}`}
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setCode('');
                    setCodeError('');
                    soundManager.playClick();
                  }}
                  className="rounded border border-slate-700 bg-slate-900 py-1.5 font-mono text-[9px] font-bold text-slate-300 hover:bg-slate-800 active:scale-95"
                  aria-label="Borrar código"
                >
                  BORRAR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (code.length < 4) setCode((current) => current + '0');
                    setCodeError('');
                    soundManager.playClick();
                  }}
                  className="rounded border border-slate-700 bg-slate-900 py-1.5 font-mono text-sm font-bold text-slate-100 hover:border-cyan-400 hover:bg-cyan-950 active:scale-95"
                  aria-label="Ingresar 0"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCode((current) => current.slice(0, -1));
                    setCodeError('');
                    soundManager.playClick();
                  }}
                  className="flex items-center justify-center rounded border border-slate-700 bg-slate-900 py-1.5 text-slate-300 hover:bg-slate-800 active:scale-95"
                  aria-label="Borrar último dígito"
                >
                  <Delete className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={!isUnlocked || code.length !== 4}
                className="w-full rounded border border-cyan-500/60 bg-cyan-950 py-1.5 font-mono text-[10px] font-bold text-cyan-200 hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                VALIDAR CÓDIGO
              </button>
              {codeError && <p role="alert" className="text-center text-[9px] font-mono text-red-300">{codeError}</p>}
            </div>
          )}
        </div>
      ) : (
        <p className="w-full rounded border border-slate-800 bg-black/40 p-2 text-center text-[9px] font-mono text-slate-500">
          El cifrado de colores se habilitará al resolver los módulos 01–05.
        </p>
      )}

      {/* Chasis del Interruptor Maestro */}
      <div className="relative p-5 rounded-xl bg-gradient-to-b from-slate-900 to-black border-2 border-amber-500/40 shadow-[0_0_25px_rgba(255,170,0,0.15)] flex flex-col items-center justify-center">
        {/* Cubierta de Seguridad Acrílica */}
        <div className="relative mb-3">
          <button
            id="btn-toggle-cover"
            onClick={handleToggleCover}
            disabled={isSolved || !isUnlocked}
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

      {isSolved && <p className="text-[10px] text-[#00ff66] font-mono text-center font-bold">✓ Bomba desarmada exitosamente</p>}
    </div>
  );
};
