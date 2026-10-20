import React, { useState } from 'react';
import { useBombContext } from './hooks/useBombContext';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { TerminalComponent } from './components/TerminalComponent';
import { ModuleWrapper } from './components/ModuleWrapper';
import { Module1SpatialOrientation } from './components/modules/Module1SpatialOrientation';
import { Module2MathSequence } from './components/modules/Module2MathSequence';
import { Module3ScientificTrivia } from './components/modules/Module3ScientificTrivia';
import { Module4GeometricCipher } from './components/modules/Module4GeometricCipher';
import { Module5PhysicalCalculation } from './components/modules/Module5PhysicalCalculation';
import { Module6MasterSwitch } from './components/modules/Module6MasterSwitch';
import { DefusalManualModal } from './components/DefusalManualModal';
import { VictoryModal } from './components/VictoryModal';
import { ExplosionModal } from './components/ExplosionModal';

import { SpatialOrientationModule } from './modules/SpatialOrientationModule';
import { MathSequenceModule } from './modules/MathSequenceModule';
import { ScientificTriviaModule } from './modules/ScientificTriviaModule';
import { GlitchDecorator } from './patterns/decorator/GlitchDecorator';
import { PhysicalCalculationModule } from './modules/PhysicalCalculationModule';
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
    isAdminUnlocked,
    isOverrideUnlocked,
    startBomb,
    reset,
  } = useBombContext();

  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualInitialTab, setManualInitialTab] = useState<'blackbox' | 'creator'>('blackbox');

  // Si el estado es STANDBY, mostrar exclusivamente la Pantalla de Inicio (ocultando la bomba)
  if (status === 'STANDBY') {
    return <StartScreen onStartConnection={startBomb} seed={ModuleFactory.SEED} />;
  }

  // Obtener referencias fuertemente tipadas a cada uno de los 6 módulos
  const module1 = modules.find((m) => m.id === 'module_1') as SpatialOrientationModule;
  const module2 = modules.find((m) => m.id === 'module_2') as MathSequenceModule;
  const module3 = modules.find((m) => m.id === 'module_3') as ScientificTriviaModule;
  const module4 = modules.find((m) => m.id === 'module_4') as GlitchDecorator;
  const module5 = modules.find((m) => m.id === 'module_5') as PhysicalCalculationModule;
  const module6 = modules.find((m) => m.id === 'module_6') as MasterSwitchModule;

  const handleOpenManual = (tab: 'blackbox' | 'creator' = 'blackbox') => {
    setManualInitialTab(tab);
    setManualModalOpen(true);
  };

  const handleModuleAction = () => {
    // Forzar actualización si fuera necesario
  };

  const isPanic = status === 'PANIC';
  const isDefused = status === 'DEFUSED';
  const isExploded = status === 'EXPLODED';

  return (
    <div className="relative min-h-screen bg-[#06090e] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-300 font-mono">
      {/* Capa de Efecto Scanline CRT Retro */}
      <div className="fixed inset-0 scanlines z-10 pointer-events-none opacity-50" />

      {/* Capa de Alerta Crítica en Estado de Pánico */}
      {isPanic && <div className="fixed inset-0 panic-overlay z-10 pointer-events-none" />}

      {/* Cabecera Principal con Telemetría y Botón de Bloqueo Admin */}
      <Header
        remainingSeconds={remainingSeconds}
        strikes={strikes}
        maxStrikes={3}
        speedMultiplier={speedMultiplier}
        status={status}
        seed={ModuleFactory.SEED}
        isAdminUnlocked={isAdminUnlocked}
        onReset={() => reset(false)}
        onOpenManual={handleOpenManual}
      />

      {/* Contenedor Principal de la Bomba y Terminal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col justify-start gap-5 relative z-20">
        {/* Banner Informativo en Estado de Pánico */}
        {isPanic && (
          <div className="p-3 bg-red-950/80 border-2 border-red-500 rounded-lg text-red-300 font-mono text-xs flex items-center justify-between shadow-[0_0_25px_rgba(255,0,51,0.5)] animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="font-bold">
                ¡ALERTA CRÍTICA DE SOBRECARGA! 2º STRIKE DETECTADO: VELOCIDAD 3.0x - PRÓXIMO ERROR DETONARÁ LA BOMBA.
              </span>
            </div>
            <span className="font-bold text-red-200">ESTADO: PÁNICO</span>
          </div>
        )}

        {/* NÚCLEO INTERACTIVO: Terminal de Comandos (Eje Central de Jugabilidad) */}
        <section aria-label="Terminal de Comandos">
          <TerminalComponent bomb={bomb} />
        </section>

        {/* Rejilla Secuencial de los 6 Módulos */}
        <section aria-label="Módulos de la Bomba" className="space-y-4">
          {/* Fila Superior: Módulos 1, 2 y 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Módulo 1: Orientación Espacial */}
            {module1 && (
              <ModuleWrapper
                id="module-wrapper-1"
                moduleNumber="01"
                title="MATRIZ LÓGICA"
                subtitle="ANÁLISIS VISUAL DE PATRONES"
                isSolved={module1.getSolved()}
                isLocked={!module1.getIsUnlocked()}
                isActive={module1.getIsUnlocked() && !module1.getSolved()}
              >
                <Module1SpatialOrientation
                  module={module1}
                  onAction={handleModuleAction}
                />
              </ModuleWrapper>
            )}

            {/* Módulo 2: Secuencia Matemática */}
            {module2 && (
              <ModuleWrapper
                id="module-wrapper-2"
                moduleNumber="02"
                title="SECUENCIA MATEMÁTICA"
                subtitle="ESTRATEGIA FIBONACCI"
                isSolved={module2.getSolved()}
                isLocked={!module2.getIsUnlocked()}
                isActive={module2.getIsUnlocked() && !module2.getSolved()}
              >
                <Module2MathSequence
                  module={module2}
                  onAction={handleModuleAction}
                />
              </ModuleWrapper>
            )}

            {/* Módulo 3: Conocimiento Científico */}
            {module3 && (
              <ModuleWrapper
                id="module-wrapper-3"
                moduleNumber="03"
                title="CONOCIMIENTO CIENTÍFICO"
                subtitle="CALIBRACIÓN ELEMENTAL"
                isSolved={module3.getSolved()}
                isLocked={!module3.getIsUnlocked()}
                isActive={module3.getIsUnlocked() && !module3.getSolved()}
              >
                <Module3ScientificTrivia
                  module={module3}
                  onAction={handleModuleAction}
                />
              </ModuleWrapper>
            )}
          </div>

          {/* Fila Inferior: Módulos 4, 5 y 6 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Módulo 4: Enrutamiento Visual con Interferencia Decorator */}
            {module4 && (
              <ModuleWrapper
                id="module-wrapper-4"
                moduleNumber="04"
                title="CIFRADO GEOMéTRICO"
                subtitle="DECORADOR GLITCH"
                isSolved={module4.getSolved()}
                isLocked={!module4.getIsUnlocked()}
                isActive={module4.getIsUnlocked() && !module4.getSolved()}
              >
                <Module4GeometricCipher
                  decorator={module4}
                  onAction={handleModuleAction}
                />
              </ModuleWrapper>
            )}

            {/* Módulo 5: Cálculo Físico */}
            {module5 && (
              <ModuleWrapper
                id="module-wrapper-5"
                moduleNumber="05"
                title="CÁLCULO FÍSICO"
                subtitle="RESONANCIA HZ"
                isSolved={module5.getSolved()}
                isLocked={!module5.getIsUnlocked()}
                isActive={module5.getIsUnlocked() && !module5.getSolved()}
              >
                <Module5PhysicalCalculation
                  module={module5}
                  onAction={handleModuleAction}
                />
              </ModuleWrapper>
            )}

            {/* Módulo 6: Ejecución Final (Master Switch) */}
            {module6 && (
              <ModuleWrapper
                id="module-wrapper-6"
                moduleNumber="06"
                title="EJECUCIÓN FINAL"
                subtitle="INTERRUPTOR MAESTRO"
                isSolved={module6.getSolved()}
                isLocked={!module6.getIsUnlocked()}
                isActive={module6.getIsUnlocked() && !module6.getSolved()}
                containerClassName="border-amber-500/30"
              >
                <Module6MasterSwitch
                  module={module6}
                  onAction={handleModuleAction}
                />
              </ModuleWrapper>
            )}
          </div>
        </section>
      </main>

      {/* Pie de Página */}
      <footer className="w-full bg-[#04070c] border-t border-slate-900 px-4 py-2.5 text-center font-mono text-[11px] text-slate-500 relative z-20">
        <p>
          THE UNHACKABLE BOMB: TERMINAL EDITION &copy; 2026 // ARQUITECTURA DE SOFTWARE POO // SEMILLA: BOMB-882
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
        onReset={() => reset(false)}
        onGoHome={() => reset(true)}
        remainingSeconds={remainingSeconds}
        strikes={strikes}
      />

      <ExplosionModal
        isOpen={isExploded}
        onReset={() => reset(false)}
        onGoHome={() => reset(true)}
        strikes={strikes}
        remainingSeconds={remainingSeconds}
      />
    </div>
  );
}

export default App;
