import React from 'react';
import { Terminal as TerminalIcon, X, Trash2 } from 'lucide-react';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: Array<{ time: string; text: string; type: 'info' | 'warning' | 'danger' | 'success' }>;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-full bg-[#06090e] border-b-2 border-cyan-500/40 p-4 font-mono text-xs shadow-2xl relative z-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <TerminalIcon className="w-4 h-4" />
            <span>TELEMETRÍA Y TRAZA DE EVENTOS // PATRÓN OBSERVER & CONTEXT</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1 bg-black/60 p-3 rounded border border-slate-900">
          {logs.length === 0 ? (
            <p className="text-slate-600 italic">No hay eventos registrados aún...</p>
          ) : (
            logs.map((log, index) => {
              let color = 'text-slate-300';
              if (log.type === 'danger') color = 'text-red-400 font-bold';
              if (log.type === 'warning') color = 'text-amber-400 font-semibold';
              if (log.type === 'success') color = 'text-[#00ff66] font-bold';
              if (log.type === 'info') color = 'text-cyan-400';

              return (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-slate-600 text-[10px]">[{log.time}]</span>
                  <span className={color}>&gt; {log.text}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
