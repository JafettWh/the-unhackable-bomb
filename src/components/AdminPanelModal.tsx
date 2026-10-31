import React, { useEffect, useState } from 'react';
import { AlertTriangle, Gauge, KeyRound, LogOut, Mail, Save, ShieldCheck, X } from 'lucide-react';
import { BombRules, StrikePenalty } from '../core/BombContext';

interface AdminPanelModalProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  rules: BombRules;
  onClose: () => void;
  onAuthenticate: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  onSave: (rules: BombRules) => Promise<void>;
}

const defaultPenalty = (strikeNumber: number): StrikePenalty => ({
  timePenaltySeconds: strikeNumber === 1 ? 120 : strikeNumber === 2 ? 240 : 0,
  speedMultiplier: strikeNumber === 1 ? 1.5 : strikeNumber === 2 ? 3 : 1,
});

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  isAuthenticated,
  rules,
  onClose,
  onAuthenticate,
  onSignOut,
  onSave,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [draft, setDraft] = useState<BombRules>(rules);
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setDraft(rules);
  }, [rules]);

  if (!isOpen) return null;

  const handleAuthenticate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onAuthenticate(email, password);
      setAuthError('');
    } catch {
      setAuthError('No se pudo iniciar sesión. Revisa las credenciales y que Firebase Authentication esté habilitado.');
    } finally {
      setPassword('');
      setIsSubmitting(false);
    }
  };

  const handleMaxStrikesChange = (value: number) => {
    const maxStrikes = Math.min(10, Math.max(1, Math.round(value) || 1));
    setDraft((current) => ({
      ...current,
      maxStrikes,
      strikePenalties: Array.from({ length: maxStrikes }, (_, index) =>
        current.strikePenalties[index] ?? defaultPenalty(index + 1)
      ),
    }));
    setSaved(false);
  };

  const updatePenalty = (index: number, field: keyof StrikePenalty, value: number) => {
    setDraft((current) => ({
      ...current,
      strikePenalties: current.strikePenalties.map((penalty, penaltyIndex) =>
        penaltyIndex === index ? { ...penalty, [field]: value } : penalty
      ),
    }));
    setSaved(false);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSaveError('');
    try {
      await onSave(draft);
      setSaved(true);
    } catch {
      setSaved(false);
      setSaveError('No se guardaron las reglas. Verifica Firestore y el UID autorizado en firestore.rules.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="admin-panel-title"
        aria-modal="true"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-emerald-500/60 bg-[#080d12] font-mono text-slate-100 shadow-[0_0_45px_rgba(0,255,102,0.16)]"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-slate-800 bg-[#0b1218] px-5 py-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <div>
              <h2 id="admin-panel-title" className="text-sm font-black tracking-widest text-white">
                PANEL DE ADMINISTRACIÓN
              </h2>
              <p className="mt-1 text-[10px] text-slate-400">CONFIGURACIÓN DE PARTIDA // ROOT</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                aria-label="Cerrar sesión de administrador"
                className="rounded border border-slate-700 p-2 text-slate-400 transition hover:border-red-500/60 hover:text-red-300"
                onClick={() => void onSignOut()}
                title="Cerrar sesión"
                type="button"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
            <button
              aria-label="Cerrar panel"
              className="rounded border border-slate-700 p-2 text-slate-400 transition hover:border-slate-500 hover:text-white"
              onClick={onClose}
              title="Cerrar"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {!isAuthenticated ? (
          <form className="space-y-4 p-6" onSubmit={handleAuthenticate}>
            <p className="text-xs leading-relaxed text-slate-300">
              Inicia sesión con la cuenta admin de Firebase para modificar las reglas compartidas.
            </p>
            <label className="block text-[11px] font-bold text-slate-400" htmlFor="admin-email">
              CORREO ADMIN
            </label>
            <div className="flex items-center gap-2 rounded border border-slate-700 bg-black/70 px-3 focus-within:border-emerald-500">
              <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
              <input
                autoComplete="username"
                autoFocus
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none"
                id="admin-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@correo.com"
                required
                type="email"
                value={email}
              />
            </div>
            <label className="block text-[11px] font-bold text-slate-400" htmlFor="admin-password">
              CONTRASEÑA
            </label>
            <div className="flex gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded border border-slate-700 bg-black/70 px-3 focus-within:border-emerald-500">
                <KeyRound className="h-4 w-4 shrink-0 text-emerald-400" />
                <input
                  autoComplete="current-password"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none"
                  id="admin-password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Contraseña"
                  required
                  type="password"
                  value={password}
                />
              </div>
              <button
                className="rounded border border-emerald-500/70 bg-emerald-950/70 px-4 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-50"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'CONECTANDO...' : 'INICIAR SESIÓN'}
              </button>
            </div>
            {authError && <p className="text-xs text-red-400" role="alert">{authError}</p>}
          </form>
        ) : (
          <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSave}>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="rounded border border-slate-800 bg-black/40 p-3">
                  <span className="mb-2 flex items-center gap-2 text-[10px] font-bold text-cyan-300">
                    <Gauge className="h-4 w-4" /> TIEMPO INICIAL (MINUTOS)
                  </span>
                  <input
                    className="w-full rounded border border-slate-700 bg-[#070b10] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                    max="60"
                    min="1"
                    onChange={(event) => {
                      setDraft((current) => ({
                        ...current,
                        initialTimeSeconds: Number(event.target.value) * 60,
                      }));
                      setSaved(false);
                    }}
                    type="number"
                    value={Math.round(draft.initialTimeSeconds / 60)}
                  />
                </label>
                <label className="rounded border border-slate-800 bg-black/40 p-3">
                  <span className="mb-2 flex items-center gap-2 text-[10px] font-bold text-red-300">
                    <AlertTriangle className="h-4 w-4" /> LÍMITE DE STRIKES
                  </span>
                  <input
                    className="w-full rounded border border-slate-700 bg-[#070b10] px-3 py-2 text-sm text-white outline-none focus:border-red-500"
                    max="10"
                    min="1"
                    onChange={(event) => handleMaxStrikesChange(Number(event.target.value))}
                    type="number"
                    value={draft.maxStrikes}
                  />
                </label>
              </div>

              <div>
                <div className="mb-2 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold tracking-wider text-white">PENALIZACIÓN POR STRIKE</h3>
                    <p className="mt-1 text-[10px] text-slate-500">Define el tiempo descontado y la velocidad del reloj.</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-500">{draft.maxStrikes} niveles</span>
                </div>
                <div className="space-y-2">
                  {draft.strikePenalties.map((penalty, index) => (
                    <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-3 rounded border border-slate-800 bg-[#0b1118] p-3" key={index}>
                      <span className="min-w-16 text-xs font-black text-red-300">STRIKE {index + 1}</span>
                      <label className="text-[9px] text-slate-500">
                        MINUTOS DESCONTADOS
                        <input
                          className="mt-1 w-full rounded border border-slate-700 bg-black/60 px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-500"
                          min="0"
                          onChange={(event) => updatePenalty(index, 'timePenaltySeconds', Number(event.target.value) * 60)}
                          step="0.5"
                          type="number"
                          value={penalty.timePenaltySeconds / 60}
                        />
                      </label>
                      <label className="text-[9px] text-slate-500">
                        VELOCIDAD (×)
                        <input
                          className="mt-1 w-full rounded border border-slate-700 bg-black/60 px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-500"
                          min="0.1"
                          onChange={(event) => updatePenalty(index, 'speedMultiplier', Number(event.target.value))}
                          step="0.1"
                          type="number"
                          value={penalty.speedMultiplier}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded border border-amber-500/30 bg-amber-950/10 p-3">
                <h3 className="text-xs font-bold tracking-wider text-amber-200">PENALIZACIÓN POR TIEMPO RESTANTE</h3>
                <p className="mb-3 mt-1 text-[10px] text-slate-500">Acelera el reloj automáticamente al cruzar el umbral indicado.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="text-[9px] text-slate-500">
                    ACTIVAR CON (MINUTOS RESTANTES, 0 = INACTIVO)
                    <input
                      className="mt-1 w-full rounded border border-slate-700 bg-black/60 px-2 py-2 text-xs text-white outline-none focus:border-amber-500"
                      max={Math.floor(draft.initialTimeSeconds / 60)}
                      min="0"
                      onChange={(event) => {
                        setDraft((current) => ({
                          ...current,
                          criticalTimeThresholdSeconds: Number(event.target.value) * 60,
                        }));
                        setSaved(false);
                      }}
                      type="number"
                      value={draft.criticalTimeThresholdSeconds / 60}
                    />
                  </label>
                  <label className="text-[9px] text-slate-500">
                    VELOCIDAD CRÍTICA (×)
                    <input
                      className="mt-1 w-full rounded border border-slate-700 bg-black/60 px-2 py-2 text-xs text-white outline-none focus:border-amber-500"
                      max="5"
                      min="0.1"
                      onChange={(event) => {
                        setDraft((current) => ({ ...current, criticalTimeSpeedMultiplier: Number(event.target.value) }));
                        setSaved(false);
                      }}
                      step="0.1"
                      type="number"
                      value={draft.criticalTimeSpeedMultiplier}
                    />
                  </label>
                </div>
              </div>

              <p className="border-l-2 border-amber-500/70 bg-amber-950/20 px-3 py-2 text-[10px] leading-relaxed text-amber-200/80">
                El strike que alcanza el límite detona la bomba. El tiempo inicial se usa al comenzar o reiniciar; las penalizaciones se aplican a los próximos errores.
              </p>
            </div>
            <footer className="flex items-center justify-between gap-3 border-t border-slate-800 bg-[#0b1218] px-5 py-3">
              <span aria-live="polite" className="text-[10px] text-emerald-300">
                {saved ? 'REGLAS GUARDADAS' : 'CAMBIOS PENDIENTES'}
              </span>
              {saveError && <p className="mr-auto text-[10px] text-red-300" role="alert">{saveError}</p>}
              <button className="flex items-center gap-2 rounded border border-emerald-500/70 bg-emerald-950/70 px-4 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-50" disabled={isSubmitting} type="submit">
                <Save className="h-4 w-4" /> GUARDAR REGLAS
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
};