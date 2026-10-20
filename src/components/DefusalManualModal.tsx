import React, { useState } from 'react';
import { X, BookOpen, AlertTriangle, ShieldCheck, Zap, HelpCircle, Terminal, Cpu } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'blackbox' | 'creator';
}

export const DefusalManualModal: React.FC<ManualModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'blackbox',
}) => {
  const [activeTab, setActiveTab] = useState<'blackbox' | 'creator'>(defaultTab as 'blackbox' | 'creator');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1017] border-2 border-cyan-500/60 rounded-xl shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col overflow-hidden font-mono">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080c12]">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-display text-base font-bold text-white tracking-wider flex items-center gap-2">
                MANUAL DE OPERACIONES TÁCTICAS // THE UNHACKABLE BOMB
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  TERMINAL EDITION // BOMB-882
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                DOCUMENTO CLASIFICADO — PRIVILEGIOS ROOT VERIFICADOS (sudo -admin)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de Navegación (solo 2 tabs) */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('blackbox')}
            className={`px-4 py-2 font-display text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 border-t-2 ${
              activeTab === 'blackbox'
                ? 'bg-[#0c1017] border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            1. Manual de Campo (Caja Negra)
          </button>

          <button
            onClick={() => setActiveTab('creator')}
            className={`px-4 py-2 font-display text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 border-t-2 ${
              activeTab === 'creator'
                ? 'bg-[#0c1017] border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            2. Algoritmo del Creador (&lt; 60s)
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed text-slate-300 space-y-6">
          {/* TAB 1: CAJA NEGRA */}
          {activeTab === 'blackbox' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/40 text-red-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold font-display text-sm text-red-300 uppercase">
                    ESCALADO DE TIEMPO Y SANCIONES EN TERMINAL EDITION
                  </h4>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300 text-xs">
                    <li>
                      <strong>Tiempo inicial:</strong> 15:00 minutos (900 segundos).
                    </li>
                    <li>
                      <strong>Comandos Inválidos:</strong> Introducir comandos desconocidos en la terminal suma <strong>1 Strike</strong> instantáneo.
                    </li>
                    <li>
                      <strong>Contraseña incorrecta en sudo -admin:</strong> También suma <strong>1 Strike</strong>.
                    </li>
                    <li>
                      <strong>1er Strike:</strong> Deducción instantánea de <strong>-2 minutos (-120s)</strong> y aceleración de reloj a <strong>1.5x</strong>.
                    </li>
                    <li>
                      <strong>2do Strike:</strong> Deducción instantánea de <strong>-4 minutos (-240s)</strong>, conmuta a <strong>¡ESTADO DE PÁNICO!</strong> y aceleración a <strong>3.0x</strong>.
                    </li>
                    <li>
                      <strong>3er Strike:</strong> <strong>DETONACIÓN INMEDIATA (EXPLODED)</strong> catastrófica.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 flex items-start gap-3">
                <Terminal className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold font-display text-sm text-cyan-300 uppercase">
                    RESOLUCIÓN SECUENCIAL ESTRICTA
                  </h4>
                  <p className="mt-1 text-slate-300 text-xs">
                    Los 6 módulos inician bloqueados a excepción del Módulo 1. Cada módulo resuelto desbloquea automáticamente al siguiente mediante el patrón <strong>Observer</strong>. Deduzca la solución de cada módulo con los datos e información que el propio módulo presenta en pantalla.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-1 font-display">MÓDULO 1: ORIENTACIÓN ESPACIAL</h4>
                  <p className="text-slate-300 text-xs">
                    Presenta 4 rumbos cardinales (N, S, E, O). Requiere deducir la trayectoria astronómica del amanecer y el abismo pulsando los botones en el orden correcto.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-1 font-display">MÓDULO 2: SECUENCIA MATEMÁTICA</h4>
                  <p className="text-slate-300 text-xs">
                    Pantalla LED con una progresión numérica y un teclado 1 al 9. Requiere ingresar el término correcto de la secuencia mostrada.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-1 font-display">MÓDULO 3: CONOCIMIENTO CIENTÍFICO</h4>
                  <p className="text-slate-300 text-xs">
                    Selector de elementos de la tabla periódica y dial Z. Requiere identificar el comburente primario y fijar su número atómico correcto.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-1 font-display">MÓDULO 4: CIFRADO GEOMÉTRICO</h4>
                  <p className="text-slate-300 text-xs">
                    Presenta 4 figuras geométricas con su número de lados visible, y un valor objetivo (<em>TARGET</em>). Seleccione 2 figuras en el orden correcto cuya suma de lados iguale el objetivo. El decorador <em>GlitchDecorator</em> añade interferencia visual.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-1 font-display">MÓDULO 5: CÁLCULO FÍSICO</h4>
                  <p className="text-slate-300 text-xs">
                    Oscilador de frecuencia regulable (0 a 100 Hz). Requiere ajustar la resonancia al valor matemáticamente derivado de una propiedad de los números primos.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-1 font-display">MÓDULO 6: EJECUCIÓN FINAL (MASTER SWITCH)</h4>
                  <p className="text-slate-300 text-xs">
                    Interruptor físico protegido por cubierta de seguridad. Requiere anulación root por terminal (<code>sudo override</code>) y resolución previa de los módulos 1 al 5.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALGORITMO DEL CREADOR (< 60s) */}
          {activeTab === 'creator' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-lg bg-emerald-950/40 border border-[#00ff66]/50 text-emerald-200">
                <h4 className="font-bold font-display text-sm text-[#00ff66] flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  SECUENCIA ÓPTIMA DETERMINISTA (RESOLUCIÓN EXACTA)
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Semilla canónica: <strong className="text-[#00ff66]">BOMB-882</strong>. Esta guía permite desarmar la bomba en menos de 60 segundos conociendo la lógica exacta de cada etapa:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900/90 rounded border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-300 font-black text-xs flex items-center justify-center border border-cyan-500/40">
                    1
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">Módulo 1: Orientación Espacial</h5>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Pista: "El sol nace por la derecha y cae hacia el abismo."<br />
                      <strong>Acción:</strong> Presionar <strong className="text-[#00ff66]">E (Este)</strong> y luego <strong className="text-[#00ff66]">S (Sur)</strong>. Desbloquea el Módulo 2.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-300 font-black text-xs flex items-center justify-center border border-cyan-500/40">
                    2
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">Módulo 2: Secuencia Matemática</h5>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Secuencia visible: 1, 1, 2, 3, 5, ?<br />
                      <strong>Acción:</strong> Teclear el número <strong className="text-[#00ff66]">8</strong> en el teclado (sexto término Fibonacci). Desbloquea el Módulo 3.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-300 font-black text-xs flex items-center justify-center border border-cyan-500/40">
                    3
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">Módulo 3: Conocimiento Científico</h5>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Gas comburente: Oxígeno (O). Número atómico Z = 8.<br />
                      <strong>Acción:</strong> Seleccionar <strong className="text-[#00ff66]">O</strong>, ajustar el Dial a <strong className="text-[#00ff66]">8</strong> y pulsar "Estabilizar". Desbloquea el Módulo 4.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-300 font-black text-xs flex items-center justify-center border border-cyan-500/40">
                    4
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">Módulo 4: Cifrado Geométrico</h5>
                    <p className="text-slate-400 text-xs mt-0.5">
                      TARGET = 7. Un cubo tiene 6 caras → 6 + 1 = 7. Busca figuras cuya suma de lados = 7.<br />
                      △ Triángulo = 3 lados | □ Cuadrado = 4 lados → 3 + 4 = 7.<br />
                      <strong>Acción:</strong> Presionar <strong className="text-[#00ff66]">△ Triángulo</strong> y luego <strong className="text-[#00ff66]">□ Cuadrado</strong>. Desbloquea el Módulo 5.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-300 font-black text-xs flex items-center justify-center border border-cyan-500/40">
                    5
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">Módulo 5: Cálculo Físico</h5>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Primer número primo de 2 dígitos: 11. Multiplicado por 2 = <strong>22 Hz</strong>.<br />
                      <strong>Acción:</strong> Ajustar la frecuencia a <strong className="text-[#00ff66]">22 Hz</strong> y pulsar "Sintonizar". Desbloquea el Módulo 6.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-300 font-black text-xs flex items-center justify-center border border-cyan-500/40">
                    6
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">Módulo 6: Ejecución Final (Master Switch)</h5>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Comando terminal: <code className="text-cyan-300 font-bold">sudo override</code> → Desbloquea físicamente el interruptor en la UI.<br />
                      <strong>Acción:</strong> Levantar la cubierta de seguridad y accionar el botón de <strong className="text-[#00ff66]">Corte Total</strong>. La bomba entra en <strong>DefusedState</strong> (Victoria).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
