import React, { useState } from 'react';
import { useBombContext } from './hooks/useBombContext';
import { Header } from './components/Header';
import { TerminalDrawer } from './components/TerminalDrawer';
import { ModuleWrapper } from './components/ModuleWrapper';
import { Module1PhaseButton } from './components/modules/Module1PhaseButton';
import { Module2NumericDisplay } from './components/modules/Module2NumericDisplay';
import { Module3ColorWires } from './components/modules/Module3ColorWires';
import { Module4SymbolKeypad } from './components/modules/Module4SymbolKeypad';
import { Module5FrequencyDial } from './components/modules/Module5FrequencyDial';
import { Module6MasterSwitch } from './components/modules/Module6MasterSwitch';
import { DefusalManualModal } from './components/DefusalManualModal';
import { VictoryModal } from './components/VictoryModal';
import { ExplosionModal } from './components/ExplosionModal';

import { PhaseButtonModule } from './modules/PhaseButtonModule';
import { NumericDisplayModule } from './modules/NumericDisplayModule';
import { ColorWiresModule } from './modules/ColorWiresModule';
import { SymbolDecorator } from './patterns/decorator/SymbolDecorator';
import { FrequencyDialModule } from './modules/FrequencyDialModule';
import { MasterSwitchModule } from './modules/MasterSwitchModule';
import { ModuleFactory } from './patterns/factory/ModuleFactory';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function App() {
  const {
    bomb,
    status,
    remainingSeconds,
    strikes,
    speedMultiplier,
    strategy,
    modules,
    logs,
    reset,
  } = useBombContext();

  const [showTerminal, setShowTerminal] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualInitialTab, setManualInitialTab] = useState<'blackbox' | 'creator' | 'architecture'>('blackbox');

  // Obtener referencias fuertemente tipadas a cada módulo
  const module1 = modules.find((m) => m.id === 'module_1') as PhaseButtonModule;
  const module2 = modules.find((m) => m.id === 'module_2') as NumericDisplayModule;
  const module3 = modules.find((m) => m.id === 'module_3') as ColorWiresModule;
  const module4 = modules.find((m) => m.id === 'module_4') as SymbolDecorator;
  const module5 = modules.find((m) => m.id === 'module_5') as FrequencyDialModule;
  const module6 = modules.find((m) => m.id === 'module_6') as MasterSwitchModule;

  const handleOpenManual = (tab: 'blackbox' | 'creator' | 'architecture' = 'blackbox') => {
    setManualInitialTab(tab);
    setManualModalOpen(true);
  };

  const handleModuleAction = () => {
    // Forzar actualización si fuera necesario
  };

  const currentSecond = remainingSeconds % 60;
  const isPanic = status === 'PANIC';
  const isDefused = status === 'DEFUSED';
  const isExploded = status === 'EXPLODED';

  return (
    <div className="relative min-h-screen bg-[#070a0f] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Capa de Efecto Scanline CRT Retro */}
      <div className="fixed inset-0 scanlines z-10 pointer-events-none" />

      {/* Capa de Alerta Crítica en Estado de Pánico */}
      {isPanic && <div className="fixed inset-0 panic-overlay z-10 pointer-events-none" />}

      {/* Cabecera Principal con Telemetría */}
      <Header
        remainingSeconds={remainingSeconds}
        strikes={strikes}
        maxStrikes={3}
        speedMultiplier={speedMultiplier}
        status={status}
        seed={ModuleFactory.SEED}
        onReset={reset}
        onOpenManual={handleOpenManual}
        onToggleTerminal={() => setShowTerminal((prev) => !prev)}
        showTerminal={showTerminal}
      />

      {/* Consola Desplegable de Eventos */}
      <TerminalDrawer
        isOpen={showTerminal}
        onClose={() => setShowTerminal(false)}
        logs={logs}
      />

      {/* Chasis Central de la Bomba */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        {/* Banner de Estado Crítico Informativo */}
        {isPanic && (
          <div className="mb-4 p-3 bg-red-950/80 border-2 border-red-500 rounded-lg text-red-300 font-mono text-xs flex items-center justify-between shadow-[0_0_25px_rgba(255,0,51,0.5)] animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="font-bold">
                ¡ALERTA CRÍTICA DE SOBRECARGA! 2º STRIKE DETECTADO: VELOCIDAD 3.0x - PRÓXIMO ERROR DETONARÁ LA BOMBA.
              </span>
            </div>
            <span className="font-bold text-red-200">ESTADO: PÁNICO</span>
          </div>
        )}

        {status === 'UNLOCKED' && !isDefused && (
          <div className="mb-4 p-2.5 bg-emerald-950/70 border border-emerald-500/60 rounded-lg text-emerald-300 font-mono text-xs flex items-center justify-between shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
              <span>
                NÚCLEO DESBLOQUEADO: ESTRATEGIA DEDUCTIVA HABILITADA. PROCEDA CON MÓDULOS 2 AL 5.
              </span>
            </div>
            <span className="font-bold text-[#00ff66]">ESTRATEGIA: DEDUCTIVA</span>
          </div>
        )}

        {/* Rejilla de Módulos (Filas de la Especificación Técnica) */}
        <div className="space-y-4">
          {/* Fila Superior: Módulos 1, 2, 3 y 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Módulo 1: Botón de Fases */}
            {module1 && (
              <ModuleWrapper
                id="module-wrapper-1"
                moduleNumber="01"
                title="BOTÓN FASES"
                subtitle="ESTADO GLOBAL"
                isSolved={module1.getSolved()}
              >
                <Module1PhaseButton
                  module={module1}
                  onAction={handleModuleAction}
                  currentSecond={currentSecond}
                  bombStatus={status}
                />
              </ModuleWrapper>
            )}

            {/* Módulo 2: Matriz Numérica */}
            {module2 && (
              <ModuleWrapper
                id="module-wrapper-2"
                moduleNumber="02"
                title="PANTALLA NÚMEROS"
                subtitle="ESTRATEGIA DEDUCTIVA"
                isSolved={module2.getSolved()}
              >
                <Module2NumericDisplay
                  module={module2}
                  onAction={handleModuleAction}
                  strikes={strikes}
                />
              </ModuleWrapper>
            )}

            {/* Módulo 3: Cables de Colores */}
            {module3 && (
              <ModuleWrapper
                id="module-wrapper-3"
                moduleNumber="03"
                title="CABLES CROMÁTICOS"
                subtitle="OBSERVER MÓDULO 1"
                isSolved={module3.getSolved()}
              >
                <Module3ColorWires
                  module={module3}
                  onAction={handleModuleAction}
                />
              </ModuleWrapper>
            )}

            {/* Módulo 4: Teclado de Símbolos Decorado */}
            {module4 && (
              <ModuleWrapper
                id="module-wrapper-4"
                moduleNumber="04"
                title="MATRIZ SÍMBOLOS"
                subtitle="DECORADOR GLITCH"
                isSolved={module4.getSolved()}
              >
                <Module4SymbolKeypad
                  decorator={module4}
                  onAction={handleModuleAction}
                />
              </ModuleWrapper>
            )}
          </div>

          {/* Fila Inferior: Módulos 5 (Dial) y 6 (Interruptor Maestro) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Módulo 5: Dial de Frecuencia Hz */}
            {module5 && (
              <ModuleWrapper
                id="module-wrapper-5"
                moduleNumber="05"
                title="DIAL FRECUENCIA HZ"
                subtitle="SINCRONIZACIÓN TEMPORAL OBSERVER"
                isSolved={module5.getSolved()}
              >
                <Module5FrequencyDial
                  module={module5}
                  onAction={handleModuleAction}
                  remainingSeconds={remainingSeconds}
                />
              </ModuleWrapper>
            )}

            {/* Módulo 6: Interruptor Maestro */}
            {module6 && (
              <ModuleWrapper
                id="module-wrapper-6"
                moduleNumber="06"
                title="INTERRUPTOR MAESTRO (NÚCLEO)"
                subtitle="APAGADO FINAL DIRECTO"
                isSolved={module6.getSolved()}
                containerClassName="border-amber-500/30"
              >
                <Module6MasterSwitch
                  module={module6}
                  onAction={handleModuleAction}
                />
              </ModuleWrapper>
            )}
          </div>
        </div>
      </main>

      {/* Pie de Página */}
      <footer className="w-full bg-[#05080c] border-t border-slate-900 px-4 py-2 text-center font-mono text-[11px] text-slate-500">
        <p>
          THE UNHACKABLE BOMB &copy; 2026 // ARQUITECTURA DE SOFTWARE // INGENIERÍA DE SOFTWARE II // SEMILLA: BOMB-882
        </p>
      </footer>

      {/* Modales de Interacción */}
      <DefusalManualModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        defaultTab={manualInitialTab}
      />

      <VictoryModal
        isOpen={isDefused}
        onReset={reset}
        onOpenManual={handleOpenManual}
        remainingSeconds={remainingSeconds}
        strikes={strikes}
      />

      <ExplosionModal
        isOpen={isExploded}
        onReset={reset}
        onOpenManual={handleOpenManual}
        strikes={strikes}
        remainingSeconds={remainingSeconds}
      />
    </div>
  );
}
export default App;
