import React, { useState } from 'react';
import { X, BookOpen, Key, Cpu, AlertTriangle, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'blackbox' | 'creator' | 'architecture';
}

export const DefusalManualModal: React.FC<ManualModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'blackbox',
}) => {
  const [activeTab, setActiveTab] = useState<'blackbox' | 'creator' | 'architecture'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1017] border-2 border-cyan-500/60 rounded-xl shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080c12]">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-display text-base font-bold text-white tracking-wider flex items-center gap-2">
                MANUAL DE OPERACIONES TÁCTICAS // THE UNHACKABLE BOMB
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  SEMILLA: BOMB-882
                </span>
              </h2>
              <p className="text-xs font-mono text-slate-400">
                DOCUMENTO CLASIFICADO - INGENIERÍA DE SOFTWARE & ARQUITECTURA
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

        {/* Pestañas de Navegación */}
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

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 font-display text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 border-t-2 ${
              activeTab === 'architecture'
                ? 'bg-[#0c1017] border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            3. Arquitectura & Patrones (Caja Blanca)
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
                    ADVERTENCIA CRÍTICA: ESCALADO DE PENALIZACIÓN POR ERRORES
                  </h4>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300 text-xs">
                    <li>
                      <strong>0 Errores:</strong> Reloj a velocidad estándar (1.0x). Tiempo límite: 15:00 min.
                    </li>
                    <li>
                      <strong>1er Strike:</strong> Deducción instantánea de <strong>-2 minutos (-120s)</strong> y aceleración del reloj a <strong>1.5x</strong>.
                    </li>
                    <li>
                      <strong>2do Strike:</strong> Deducción instantánea de <strong>-4 minutos (-240s)</strong>, conmuta a <strong>¡ESTADO DE PÁNICO!</strong> y aceleración a <strong>3.0x</strong>.
                    </li>
                    <li>
                      <strong>3er Strike:</strong> <strong>DETONACIÓN INMEDIATA</strong> catastrófica sin importar el tiempo restante.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-2 font-display">MÓDULO 1: BOTÓN DE FASES</h4>
                  <p className="text-slate-400">
                    Botón azul de conmutación. Al pulsar en momentos incorrectos, el circuito entra en corto produciendo un strike. Solo una ventana temporal de fase armónica permite el cambio de estado del núcleo.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-2 font-display">MÓDULO 2: PANTALLA NUMÉRICA</h4>
                  <p className="text-slate-400">
                    Muestra un display digital fijo con el valor 4. El teclado contiene los números 1, 2, 3 y 4. Pulsar directamente el 4 en estado inicial está protegido y genera strike inmediato. Requiere sincronización previa con el núcleo.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-2 font-display">MÓDULO 3: CABLES DE COLORES</h4>
                  <p className="text-slate-400">
                    Cuatro líneas de derivación (Rojo, Azul, Verde, Amarillo). Solo una línea estabiliza el circuito; cortar cualquier otra línea provoca una descarga que acelera el detonador.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-2 font-display">MÓDULO 4: TECLADO DE SÍMBOLOS</h4>
                  <p className="text-slate-400">
                    Presenta 4 glifos helénicos (Ω, λ, Δ, Ψ) afectados por interferencia de señal CRT. La secuencia debe ingresarse en estricto orden matemático. Un error reinicia la secuencia con penalización.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-2 font-display">MÓDULO 5: DIAL DE FRECUENCIA HZ</h4>
                  <p className="text-slate-400">
                    Rango de resonancia de 10 Hz a 200 Hz. La frecuencia debe calibrarse en tiempo real con la frecuencia de decaimiento del temporizador central. Confirmar una frecuencia no sincronizada suma un strike.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                  <h4 className="text-cyan-400 font-bold mb-2 font-display">MÓDULO 6: INTERRUPTOR MAESTRO</h4>
                  <p className="text-slate-400">
                    Protegido por una cubierta blindada. Corta el suministro principal de la bomba. Si se acciona mientras cualquiera de los subsistemas 1 al 5 sigue activo, provocará una explosión inmediata por sobrecarga de retorno.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALGORITMO DEL CREADOR */}
          {activeTab === 'creator' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-lg bg-emerald-950/40 border border-[#00ff66]/50 text-emerald-200">
                <h3 className="font-display font-bold text-sm text-[#00ff66] flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  MANUAL DE RESOLUCIÓN RÁPIDA DETERMINISTA (SEMILLA BOMB-882)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Guía de ejecución para desactivar los 6 módulos en menos de 60 segundos durante la sustentación en vivo:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-lg border-l-4 border-cyan-400">
                  <h4 className="font-bold text-white text-xs mb-1">
                    PASO 1: CAMBIO DE ESTADO GLOBAL (MÓDULO 1)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Observa el segundero del reloj principal.</li>
                    <li>
                      Espera a que el segundero marque un número <strong>PAR</strong> (ej. 14:58, 14:56, 14:54).
                    </li>
                    <li>Haz clic en el <strong>Botón Azul</strong> del Módulo 1.</li>
                  </ol>
                  <p className="text-[#00ff66] text-[11px] mt-1 font-bold">
                    → RESULTADO: Estado conmuta a "DESBLOQUEADO (DEDUCTIVO)".
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border-l-4 border-cyan-400">
                  <h4 className="font-bold text-white text-xs mb-1">
                    PASO 2: ESTRATEGIA NUMÉRICA (MÓDULO 2)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Con la bomba en estado "DESBLOQUEADO", observa el Display (Muestra el número 4).</li>
                    <li>Verifica que tienes 0 Strikes acumulados.</li>
                    <li>
                      Presiona el botón <strong>"4"</strong> en el teclado numérico (4 - 0 strikes = 4).
                    </li>
                  </ol>
                  <p className="text-[#00ff66] text-[11px] mt-1 font-bold">
                    → RESULTADO: Módulo 2 queda RESUELTO (Luz verde activa).
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border-l-4 border-cyan-400">
                  <h4 className="font-bold text-white text-xs mb-1">
                    PASO 3: EVENTO OBSERVER EN CABLES (MÓDULO 3)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Observa que el Módulo 1 es de color <strong>Azul</strong>.</li>
                    <li>
                      Haz clic en el <strong>CABLE AZUL</strong> del Módulo 3 para cortarlo.
                    </li>
                  </ol>
                  <p className="text-[#00ff66] text-[11px] mt-1 font-bold">
                    → RESULTADO: Módulo 3 queda RESUELTO (Luz verde activa).
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border-l-4 border-cyan-400">
                  <h4 className="font-bold text-white text-xs mb-1">
                    PASO 4: SECUENCIA EN MÓDULO DECORADO (MÓDULO 4)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Ignora el parpadeo e interferencia visual del decorador en el Módulo 4.</li>
                    <li>
                      Haz clic primero en la tecla <strong>Lambda (λ)</strong>.
                    </li>
                    <li>
                      Haz clic inmediatamente después en la tecla <strong>Delta (Δ)</strong>.
                    </li>
                  </ol>
                  <p className="text-[#00ff66] text-[11px] mt-1 font-bold">
                    → RESULTADO: Módulo 4 queda RESUELTO (Luz verde activa).
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border-l-4 border-cyan-400">
                  <h4 className="font-bold text-white text-xs mb-1">
                    PASO 5: FRECUENCIA DINÁMICA (MÓDULO 5)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Mira los minutos restantes en el reloj de la bomba (ej. si quedan 14 minutos).</li>
                    <li>
                      Ajusta el dial o botones hasta marcar <strong>140 Hz</strong> (14 min × 10).
                    </li>
                    <li>Haz clic en el botón <strong>"Sintonizar / Confirmar"</strong>.</li>
                  </ol>
                  <p className="text-[#00ff66] text-[11px] mt-1 font-bold">
                    → RESULTADO: Módulo 5 queda RESUELTO (Luz verde activa).
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border-l-4 border-[#00ff66]">
                  <h4 className="font-bold text-white text-xs mb-1">
                    PASO 6: APAGADO MAESTRO (MÓDULO 6)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Verifica que los 5 módulos previos tengan sus indicadores en VERDE.</li>
                    <li>Haz clic sobre la cubierta protectora del Módulo 6 para levantarla.</li>
                    <li>Acciona la palanca del <strong>Interruptor Maestro</strong>.</li>
                  </ol>
                  <p className="text-[#00ff66] text-xs mt-1 font-bold">
                    → RESULTADO FINAL: ¡BOMBA DESACTIVADA! VICTORIA EN TIEMPO RÉCORD (&lt; 60s).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARQUITECTURA & PATRONES */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-200">
                <h3 className="font-display font-bold text-sm text-amber-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  EVALUACIÓN DE ARQUITECTURA DE SOFTWARE (SOLID & PATRONES GOF)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  El proyecto implementa una separación estricta de responsabilidades, bajo acoplamiento y ausencia total de código rígido (hardcoded).
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                  <h4 className="font-bold text-cyan-400 text-xs mb-1">
                    A. Patrón STATE (Estado Global de la Bomba)
                  </h4>
                  <p className="text-slate-400 text-xs">
                    <code>IBombState</code> define el contrato de comportamiento. <code>BombContext</code> delega la gestión de velocidad, strikes y ticks a sus instancias: <code>NormalState</code> (inicial, 1x), <code>UnlockedState</code> (deductivo), <code>PanicState</code> (3x tras 2º strike), <code>DefusedState</code> (victoria) y <code>ExplodedState</code> (derrota).
                  </p>
                </div>

                <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                  <h4 className="font-bold text-cyan-400 text-xs mb-1">
                    B. Patrón STRATEGY (Algoritmos de Validación Dinámicos)
                  </h4>
                  <p className="text-slate-400 text-xs">
                    <code>IDefusalStrategy</code> desacopla las reglas de validación de los módulos. <code>StandardStrategy</code> rechaza los intentos intuitivos y distractores. Al desbloquearse la bomba, se conmuta dinámicamente a <code>DeductiveStrategy</code> para validar las fórmulas matemáticas.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                  <h4 className="font-bold text-cyan-400 text-xs mb-1">
                    C. Patrón OBSERVER (Sincronización Reactiva)
                  </h4>
                  <p className="text-slate-400 text-xs">
                    <code>BombContext</code> actúa como <code>IBombSubject</code>. Todos los módulos implementan <code>IBombObserver</code> y la clase base <code>BaseModule</code>. Reciben notificaciones de tiempo, strikes y estado sin acoplarse directamente entre sí.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                  <h4 className="font-bold text-cyan-400 text-xs mb-1">
                    D. Patrón FACTORY METHOD (Generación Determinista)
                  </h4>
                  <p className="text-slate-400 text-xs">
                    <code>ModuleFactory</code> encapsula la instanciación de los 6 módulos con la semilla <code>BOMB-882</code>. Esto garantiza repetibilidad exacta para la demostración en vivo.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                  <h4 className="font-bold text-cyan-400 text-xs mb-1">
                    E. Patrón DECORATOR (Modificadores de Interfaz Visual)
                  </h4>
                  <p className="text-slate-400 text-xs">
                    <code>SymbolDecorator</code> extiende <code>ModuleDecorator</code> envolviendo a <code>SymbolKeypadModule</code> para inyectar fallas de señal CRT, parpadeos y estilos glitch sin modificar la lógica interna del módulo de símbolos (Principio Open/Closed).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080c12] flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            ARQUITECTURA DE SOFTWARE // INGENIERÍA DE SOFTWARE II
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
