import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, ShieldAlert, Sparkles, HelpCircle, Lock, Unlock, RefreshCw } from 'lucide-react';
import { BombContext } from '../core/BombContext';
import { IBombObserver } from '../patterns/observer/IBombObserver';
import { BombEvent, TerminalLogEntry } from '../types';
import { soundManager } from '../core/SoundManager';

interface TerminalComponentProps {
  bomb: BombContext;
}

export const TerminalComponent: React.FC<TerminalComponentProps> = ({ bomb }) => {
  const [inputCommand, setInputCommand] = useState<string>('');
  const [history, setHistory] = useState<TerminalLogEntry[]>([
    {
      id: 'init-1',
      timestamp: '00:00:00',
      text: 'KERNEL BOMB-882 OS // ACCESO DE TERMINAL ESTABLECIDO',
      type: 'system',
    },
    {
      id: 'init-2',
      timestamp: '00:00:01',
      text: "Escriba 'help' para listar los comandos tácticos o ingrese comandos de análisis.",
      type: 'hint',
    },
    {
      id: 'init-3',
      timestamp: '00:00:02',
      text: 'ADVERTENCIA: Comandos no reconocidos serán sancionados con +1 STRIKE.',
      type: 'error',
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Patrón Observer: La Terminal se suscribe como Observador a BombContext
  useEffect(() => {
    const observer: IBombObserver = {
      observerId: 'terminal_component_observer',
      update: (event: BombEvent) => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        if (event.type === 'MODULE_SOLVED') {
          addLogEntry({
            id: `evt-${Date.now()}-${Math.random()}`,
            timestamp: timeStr,
            text: `[OBSERVER] TELEMETRÍA CONFIRMADA: ${event.data?.moduleId?.toUpperCase()} desactivado con éxito. Próximo módulo desbloqueado.`,
            type: 'success',
          });
        } else if (event.type === 'STRIKE') {
          addLogEntry({
            id: `evt-${Date.now()}-${Math.random()}`,
            timestamp: timeStr,
            text: `[OBSERVER] ¡ALERTA DE SEGURIDAD! Strike ${event.strikes}/3 registrado: ${event.data?.reason || 'Error crítico'}`,
            type: 'error',
          });
        } else if (event.type === 'ADMIN_UNLOCKED') {
          addLogEntry({
            id: `evt-${Date.now()}-${Math.random()}`,
            timestamp: timeStr,
            text: '[OBSERVER] PRIVILEGIOS ROOT: Manual de Desactivación desbloqueado en interfaz.',
            type: 'success',
          });
        } else if (event.type === 'OVERRIDE_UNLOCKED') {
          addLogEntry({
            id: `evt-${Date.now()}-${Math.random()}`,
            timestamp: timeStr,
            text: '[OBSERVER] ANULACIÓN MAESTRA: Interruptor físico liberado.',
            type: 'success',
          });
        } else if (event.type === 'RESET') {
          setHistory([
            {
              id: `reset-${Date.now()}`,
              timestamp: timeStr,
              text: 'SISTEMA REINICIADO // KERNEL BOMB-882 RESTABLECIDO A VALORES POR DEFECTO.',
              type: 'system',
            },
          ]);
        }
      },
    };

    bomb.attach(observer);
    return () => {
      bomb.detach(observer);
    };
  }, [bomb]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const addLogEntry = (entry: TerminalLogEntry) => {
    setHistory((prev) => [...prev, entry]);
  };

  const handleExecute = (cmdToRun?: string) => {
    const rawCmd = cmdToRun !== undefined ? cmdToRun : inputCommand;
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    soundManager.playClick();

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Registrar comando ejecutado en la terminal
    addLogEntry({
      id: `prompt-${Date.now()}`,
      timestamp: timeStr,
      text: trimmed,
      type: 'prompt',
    });

    // Guardar en historial de comandos (flechas arriba/abajo)
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInputCommand('');

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    // Ejecución centralizada a través de BombContext
    const result = bomb.executeTerminalCommand(trimmed);

    if (result.isStrike) {
      soundManager.playStrike();
      addLogEntry({
        id: `out-${Date.now()}`,
        timestamp: timeStr,
        text: result.output,
        type: 'error',
      });
    } else {
      soundManager.playSuccess();
      addLogEntry({
        id: `out-${Date.now()}`,
        timestamp: timeStr,
        text: result.output,
        type: trimmed.startsWith('sudo') ? 'success' : 'hint',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputCommand(cmdHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setInputCommand(cmdHistory[nextIndex] || '');
      }
    }
  };

  const quickCommands = [
    { label: 'scan --spatial', cmd: 'scan --spatial', desc: 'Pista Módulo 1' },
    { label: 'decode --seq', cmd: 'decode --seq', desc: 'Pista Módulo 2' },
    { label: 'query --trivia', cmd: 'query --trivia', desc: 'Pista Módulo 3' },
    { label: 'decrypt --visual', cmd: 'decrypt --visual', desc: 'Pista Módulo 4' },
    { label: 'calc --math', cmd: 'calc --math', desc: 'Pista Módulo 5' },
    { label: 'sudo override', cmd: 'sudo override', desc: 'Desbloqueo Módulo 6' },
    { label: 'sudo -admin', cmd: 'sudo -admin', desc: 'Desbloquear Manual Root' },
    { label: 'status', cmd: 'status', desc: 'Diagnóstico' },
  ];

  return (
    <div className="w-full bg-[#070b12] border-2 border-cyan-500/50 rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col font-mono">
      {/* Barra de Título Retro tipo Consola Unix / MacOS */}
      <div className="bg-[#0b121e] px-4 py-2 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400" />
          </div>
          <div className="h-4 w-[1px] bg-slate-700 mx-2" />
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs tracking-wider">
            <TerminalIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>TERMINAL INTERACTIVA DE COMANDOS // BOMB-882 VIRTUAL SHELL</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden sm:inline-block">ENV: zsh/tty01</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
            OBSERVER SUBSCRIBED
          </span>
        </div>
      </div>

      {/* Pantalla CRT con Historial de Salida */}
      <div className="relative p-4 max-h-64 sm:max-h-72 overflow-y-auto space-y-2 text-xs bg-black/75">
        {/* Efecto de línea de escaneo sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none" />

        {history.map((item) => {
          if (item.type === 'prompt') {
            return (
              <div key={item.id} className="flex items-start gap-2 text-white">
                <span className="text-emerald-400 font-bold select-none">operator@unhackable-bomb:~$</span>
                <span className="text-cyan-200 font-bold">{item.text}</span>
              </div>
            );
          }

          if (item.type === 'error') {
            return (
              <div key={item.id} className="p-2 rounded bg-red-950/40 border border-red-500/50 text-red-300 font-bold flex items-start gap-2 shadow-[0_0_15px_rgba(255,0,51,0.25)]">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap">{item.text}</div>
              </div>
            );
          }

          if (item.type === 'success') {
            return (
              <div key={item.id} className="p-2 rounded bg-emerald-950/40 border border-[#00ff66]/50 text-[#00ff66] font-bold flex items-start gap-2 shadow-[0_0_15px_rgba(0,255,102,0.2)]">
                <Sparkles className="w-4 h-4 text-[#00ff66] flex-shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap">{item.text}</div>
              </div>
            );
          }

          if (item.type === 'hint') {
            return (
              <div key={item.id} className="p-2 rounded bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 flex items-start gap-2 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
                <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap font-semibold tracking-wide">{item.text}</div>
              </div>
            );
          }

          return (
            <div key={item.id} className="text-slate-400 whitespace-pre-wrap leading-relaxed">
              <span className="text-slate-600 text-[10px] select-none mr-2">[{item.timestamp}]</span>
              {item.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Barra de Acciones Rápidas (Chips de Comandos Disponibles) */}
      <div className="bg-[#090f18] px-3 py-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider select-none pr-1">
          Comandos Rápidos:
        </span>
        {quickCommands.map((qc) => (
          <button
            key={qc.cmd}
            onClick={() => handleExecute(qc.cmd)}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-300 hover:text-white border border-slate-700 hover:border-cyan-500 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title={qc.desc}
          >
            {qc.label}
          </button>
        ))}
      </div>

      {/* Input de Comando Activo (Bash / Zsh) */}
      <div className="p-3 bg-[#060a10] border-t-2 border-cyan-500/40 flex items-center gap-2">
        <span className="text-[#00ff66] font-bold text-xs select-none flex items-center gap-1">
          <span>operator@unhackable-bomb:~$</span>
        </span>
        <input
          ref={inputRef}
          id="terminal-interactive-input"
          type="text"
          value={inputCommand}
          onChange={(e) => setInputCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escriba un comando (ej: scan --spatial, decode --seq, sudo override, sudo -admin)..."
          className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-600 tracking-wider"
          autoFocus
        />
        <button
          onClick={() => handleExecute()}
          id="btn-terminal-submit"
          className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/60 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.3)] hover:shadow-[0_0_15px_rgba(0,229,255,0.6)] active:scale-95"
        >
          <span>EJECUTAR</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
