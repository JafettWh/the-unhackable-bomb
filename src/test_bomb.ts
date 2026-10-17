import { BombContext } from './core/BombContext';
import { ModuleFactory } from './patterns/factory/ModuleFactory';
import { PhaseButtonModule } from './modules/PhaseButtonModule';
import { NumericDisplayModule } from './modules/NumericDisplayModule';
import { ColorWiresModule } from './modules/ColorWiresModule';
import { SymbolDecorator } from './patterns/decorator/SymbolDecorator';
import { SymbolKeypadModule } from './modules/SymbolKeypadModule';
import { FrequencyDialModule } from './modules/FrequencyDialModule';
import { MasterSwitchModule } from './modules/MasterSwitchModule';

function runDeterministicTest() {
  console.log('--- TEST 1: SIMULACIÓN DE DESACTIVACIÓN DETERMINISTA (CREADOR < 60s) ---');
  const bomb = new BombContext(ModuleFactory.SEED);

  // Módulos
  const mod1 = bomb.getModule<PhaseButtonModule>('module_1')!;
  const mod2 = bomb.getModule<NumericDisplayModule>('module_2')!;
  const mod3 = bomb.getModule<ColorWiresModule>('module_3')!;
  const mod4Dec = bomb.getModule<SymbolDecorator>('module_4')!;
  const mod4 = mod4Dec.getWrapped() as SymbolKeypadModule;
  const mod5 = bomb.getModule<FrequencyDialModule>('module_5')!;
  const mod6 = bomb.getModule<MasterSwitchModule>('module_6')!;

  // 1. Estado inicial
  console.assert(bomb.getStatus() === 'NORMAL', 'El estado inicial debe ser NORMAL');
  console.assert(bomb.getStrikes() === 0, 'Strikes iniciales deben ser 0');
  console.assert(bomb.getSpeedMultiplier() === 1.0, 'Velocidad inicial debe ser 1.0x');

  // 2. Paso 1: Pulsar botón de fases en segundo par
  // Simulamos que el segundo es PAR (ej. 58)
  const step1Success = bomb.getState().handlePhaseButtonClick(bomb, 58);
  console.assert(step1Success === true, 'Paso 1 debe ser exitoso en segundo par');
  console.assert(bomb.getStatus() === 'UNLOCKED', 'Estado debe cambiar a UNLOCKED');
  console.assert(bomb.getStrategy().type === 'DEDUCTIVE', 'Estrategia debe ser DEDUCTIVE');
  console.log('✓ Paso 1 superado: Bomba en estado UNLOCKED con estrategia DEDUCTIVE');

  // 3. Paso 2: Presionar 4 en NumericDisplay
  const step2Success = mod2.pressKey(4);
  console.assert(step2Success === true, 'Paso 2 debe aceptar tecla 4');
  console.assert(mod2.getSolved() === true, 'Módulo 2 debe estar resuelto');
  console.log('✓ Paso 2 superado: Módulo 2 resuelto con tecla 4 (Display 4 - 0 strikes = 4)');

  // 4. Paso 3: Cortar cable azul en ColorWires
  const step3Success = mod3.cutWire('w_blue');
  console.assert(step3Success === true, 'Paso 3 debe aceptar cortar cable azul');
  console.assert(mod3.getSolved() === true, 'Módulo 3 debe estar resuelto');
  console.log('✓ Paso 3 superado: Cable azul cortado exitosamente');

  // 5. Paso 4: Secuencia Lambda -> Delta
  const step4a = mod4.pressSymbol('λ');
  console.assert(step4a === true, 'Lambda debe ser aceptado en paso 1');
  const step4b = mod4.pressSymbol('Δ');
  console.assert(step4b === true, 'Delta debe ser aceptado en paso 2');
  console.assert(mod4.getSolved() === true, 'Módulo 4 debe estar resuelto');
  console.log('✓ Paso 4 superado: Secuencia de símbolos λ -> Δ confirmada');

  // 6. Paso 5: Frecuencia (Minutos restantes * 10)
  const remainingMins = Math.floor(bomb.getRemainingSeconds() / 60);
  const targetHz = remainingMins * 10;
  mod5.setFrequency(targetHz);
  const step5Success = mod5.confirmTuning();
  console.assert(step5Success === true, `Paso 5 debe aceptar ${targetHz} Hz`);
  console.assert(mod5.getSolved() === true, 'Módulo 5 debe estar resuelto');
  console.log(`✓ Paso 5 superado: Frecuencia calibrada a ${targetHz} Hz`);

  // 7. Paso 6: Interruptor maestro
  mod6.toggleCover();
  console.assert(mod6.getCoverOpen() === true, 'Cubierta de seguridad debe estar abierta');
  console.assert(mod6.arePrerequisitesMet() === true, 'Prerrequisitos 1-5 deben estar cumplidos');
  const step6Success = mod6.flipMasterSwitch();
  console.assert(step6Success === true, 'Paso 6 debe accionar interruptor maestro');
  console.assert(bomb.getStatus() === 'DEFUSED', 'Bomba debe estar en estado DEFUSED');
  console.log('✓ Paso 6 superado: ¡BOMBA DESACTIVADA EXITOSAMENTE! (ESTADO: DEFUSED)');

  console.log('\n--- TEST 2: SIMULACIÓN DE ESCALADO DE ERRORES (STRIKES) ---');
  const bombErr = new BombContext(ModuleFactory.SEED);
  const initialTime = bombErr.getRemainingSeconds();

  // 1er Strike: Descuenta -120s (-2 min), velocidad 1.5x
  bombErr.addStrike('Test Strike 1');
  console.assert(bombErr.getStrikes() === 1, 'Strikes debe ser 1');
  console.assert(bombErr.getSpeedMultiplier() === 1.5, 'Velocidad debe ser 1.5x tras 1er strike');
  console.assert(bombErr.getRemainingSeconds() <= initialTime - 120, 'Debe descontar al menos 120s');
  console.log('✓ 1er Strike verificado: -2 minutos (-120s) y velocidad 1.5x');

  // 2do Strike: Descuenta -240s (-4 min), conmuta a PANIC, velocidad 3x
  const timeBeforeStrike2 = bombErr.getRemainingSeconds();
  bombErr.addStrike('Test Strike 2');
  console.assert(bombErr.getStrikes() === 2, 'Strikes debe ser 2');
  console.assert(bombErr.getStatus() === 'PANIC', 'Debe conmutar a estado PANIC');
  console.assert(bombErr.getSpeedMultiplier() === 3.0, 'Velocidad debe ser 3.0x en pánico');
  console.assert(bombErr.getRemainingSeconds() <= timeBeforeStrike2 - 240, 'Debe descontar al menos 240s');
  console.log('✓ 2do Strike verificado: -4 minutos (-240s), estado PANIC y velocidad 3.0x');

  // 3er Strike: Detonación inmediata (EXPLODED)
  bombErr.addStrike('Test Strike 3');
  console.assert(bombErr.getStrikes() === 3, 'Strikes debe ser 3');
  console.assert(bombErr.getStatus() === 'EXPLODED', 'Debe detonar inmediatamente (EXPLODED)');
  console.log('✓ 3er Strike verificado: Detonación inmediata (EXPLODED)');

  console.log('\n=== ¡TODAS LAS VALIDACIONES DE ARQUITECTURA Y LÓGICA PASARON AL 100%! ===');
}

runDeterministicTest();
