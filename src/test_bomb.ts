import { BombContext } from './core/BombContext';
import { ModuleFactory } from './patterns/factory/ModuleFactory';
import { SpatialOrientationModule } from './modules/SpatialOrientationModule';
import { MathSequenceModule } from './modules/MathSequenceModule';
import { ScientificTriviaModule } from './modules/ScientificTriviaModule';
import { GlitchDecorator } from './patterns/decorator/GlitchDecorator';
import { VisualRoutingModule } from './modules/VisualRoutingModule';
import { PhysicalCalculationModule } from './modules/PhysicalCalculationModule';
import { MasterSwitchModule } from './modules/MasterSwitchModule';

function runTerminalEditionTestSuite() {
  console.log('======================================================================');
  console.log('--- TEST 1: THE UNHACKABLE BOMB - TERMINAL EDITION (SIMULACIÓN DETERMINISTA) ---');
  console.log('======================================================================');

  // Inicialización de la Bomba en Estado Standby (Pantalla de Inicio)
  const bomb = new BombContext(ModuleFactory.SEED, false);

  console.assert(bomb.getStatus() === 'STANDBY', 'El estado inicial debe ser STANDBY');
  console.assert(bomb.getSpeedMultiplier() === 0, 'Velocidad inicial en STANDBY debe ser 0.0x');
  console.assert(bomb.getIsAdminUnlocked() === false, 'El manual debe estar bloqueado para administrador');
  console.log('✓ Estado inicial verificado: STANDBY (Pantalla de Inicio activa, bomba oculta)');

  // 1. Iniciar Conexión
  bomb.startBomb();
  console.assert(bomb.getStatus() === 'NORMAL', 'Tras iniciar conexión, el estado debe ser NORMAL');
  console.assert(bomb.getSpeedMultiplier() === 1.0, 'Velocidad operativa debe ser 1.0x');
  console.assert(bomb.getStrikes() === 0, 'Strikes iniciales deben ser 0');
  console.log('✓ Conexión establecida: Temporizador 15:00 iniciado en NormalState (1.0x)');

  // Obtener módulos
  const mod1 = bomb.getModule<SpatialOrientationModule>('module_1')!;
  const mod2 = bomb.getModule<MathSequenceModule>('module_2')!;
  const mod3 = bomb.getModule<ScientificTriviaModule>('module_3')!;
  const mod4Dec = bomb.getModule<GlitchDecorator>('module_4')!;
  const mod4 = mod4Dec.getWrapped() as VisualRoutingModule;
  const mod5 = bomb.getModule<PhysicalCalculationModule>('module_5')!;
  const mod6 = bomb.getModule<MasterSwitchModule>('module_6')!;

  // Verificar estado de bloqueo secuencial inicial
  console.assert(mod1.getIsUnlocked() === true, 'Módulo 1 debe ser el único activo inicialmente');
  console.assert(mod2.getIsUnlocked() === false, 'Módulo 2 debe iniciar bloqueado');
  console.assert(mod3.getIsUnlocked() === false, 'Módulo 3 debe iniciar bloqueado');
  console.assert(mod4.getIsUnlocked() === false, 'Módulo 4 debe iniciar bloqueado');
  console.assert(mod5.getIsUnlocked() === false, 'Módulo 5 debe iniciar bloqueado');
  console.assert(mod6.getIsUnlocked() === false, 'Módulo 6 debe iniciar bloqueado');
  console.log('✓ Secuencia estricta confirmada: Módulo 1 activo, Módulos 2-6 bloqueados');

  // 2. Probar Comandos de Terminal
  const cmdSpatial = bomb.executeTerminalCommand('scan --spatial');
  console.assert(cmdSpatial.output === 'El sol nace por la derecha y cae hacia el abismo.', 'Comando scan --spatial falló');
  console.log('✓ Terminal scan --spatial verificado:', cmdSpatial.output);

  // 3. Resolver Módulo 1 (Orientación Espacial: Este -> Sur)
  console.assert(mod1.pressDirection('E') === true, 'Paso 1: Este debe ser aceptado');
  console.assert(mod1.pressDirection('S') === true, 'Paso 2: Sur debe ser aceptado');
  console.assert(mod1.getSolved() === true, 'Módulo 1 debe estar resuelto');
  console.assert(mod2.getIsUnlocked() === true, 'Observer: Módulo 2 debe desbloquearse al resolver Módulo 1');
  console.log('✓ Módulo 1 resuelto exitosamente: [E, S] &rarr; Módulo 2 DESBLOQUEADO vía Observer');

  // 4. Probar Terminal decode --seq y resolver Módulo 2 (Matemática: 8)
  const cmdSeq = bomb.executeTerminalCommand('decode --seq');
  console.assert(cmdSeq.output === 'Sexto término de la proporción áurea (Fibonacci).', 'Comando decode --seq falló');
  console.assert(mod2.inputNumber(8) === true, 'Módulo 2 debe aceptar número 8');
  console.assert(mod2.getSolved() === true, 'Módulo 2 debe estar resuelto');
  console.assert(mod3.getIsUnlocked() === true, 'Observer: Módulo 3 debe desbloquearse al resolver Módulo 2');
  console.log('✓ Módulo 2 resuelto exitosamente: [8] &rarr; Módulo 3 DESBLOQUEADO vía Observer');

  // 5. Probar Terminal query --trivia y resolver Módulo 3 (Científico: Oxígeno, Z=8)
  const cmdTrivia = bomb.executeTerminalCommand('query --trivia');
  console.assert(cmdTrivia.output === 'Z del gas que alimenta el fuego.', 'Comando query --trivia falló');
  mod3.setElement('O');
  mod3.setDialZ(8);
  console.assert(mod3.confirmSubmission() === true, 'Módulo 3 debe aceptar Oxígeno con Z=8');
  console.assert(mod3.getSolved() === true, 'Módulo 3 debe estar resuelto');
  console.assert(mod4.getIsUnlocked() === true, 'Observer: Módulo 4 debe desbloquearse al resolver Módulo 3');
  console.log('✓ Módulo 3 resuelto exitosamente: [O, Z=8] &rarr; Módulo 4 DESBLOQUEADO vía Observer');

  // 6. Probar Terminal decrypt --visual y resolver Módulo 4 (Enrutamiento Visual: Arriba -> Izquierda -> Abajo)
  const cmdVisual = bomb.executeTerminalCommand('decrypt --visual');
  console.assert(cmdVisual.output === 'Ignora el ruido. Sigue la constelación: Cenit, Ocaso, Nadir.', 'Comando decrypt --visual falló');
  console.assert(mod4.pressDirection('UP') === true, 'Cenit (Arriba) debe ser aceptado');
  console.assert(mod4.pressDirection('LEFT') === true, 'Ocaso (Izquierda) debe ser aceptado');
  console.assert(mod4.pressDirection('DOWN') === true, 'Nadir (Abajo) debe ser aceptado');
  console.assert(mod4.getSolved() === true, 'Módulo 4 debe estar resuelto');
  console.assert(mod5.getIsUnlocked() === true, 'Observer: Módulo 5 debe desbloquearse al resolver Módulo 4');
  console.log('✓ Módulo 4 resuelto exitosamente: [UP, LEFT, DOWN] &rarr; Módulo 5 DESBLOQUEADO vía Observer');

  // 7. Probar Terminal calc --math y resolver Módulo 5 (Física: 22 Hz)
  const cmdMath = bomb.executeTerminalCommand('calc --math');
  console.assert(cmdMath.output === 'Resonancia igual al doble del primer número primo de dos dígitos.', 'Comando calc --math falló');
  mod5.setFrequency(22);
  console.assert(mod5.confirmTuning() === true, 'Módulo 5 debe aceptar 22 Hz');
  console.assert(mod5.getSolved() === true, 'Módulo 5 debe estar resuelto');
  console.assert(mod6.arePrerequisitesMet() === true, 'Módulo 6: Prerrequisitos 1-5 deben estar cumplidos');
  console.log('✓ Módulo 5 resuelto exitosamente: [22 Hz] &rarr; Módulo 6 prerrequisitos cumplidos');

  // 8. Desbloqueo de Administrador (Admin Lock: sudo -admin)
  const cmdAdmin = bomb.executeTerminalCommand('sudo -admin');
  console.assert(cmdAdmin.success === true, 'Comando sudo -admin debe ejecutarse con éxito');
  console.assert(bomb.getIsAdminUnlocked() === true, 'Manual de desactivación debe estar desbloqueado tras sudo -admin');
  console.log('✓ Bloqueo de Administrador verificado: comando sudo -admin desbloqueó el Manual táctico');

  // 9. Resolver Módulo 6 (Ejecución Final: sudo override + Master Switch)
  // Intentar abrir cubierta sin sudo override genera strike
  const coverAttempt = mod6.toggleCover();
  console.assert(coverAttempt === false, 'Cubierta debe rechazar apertura sin sudo override');

  const cmdOverride = bomb.executeTerminalCommand('sudo override');
  console.assert(cmdOverride.success === true, 'Comando sudo override debe ejecutarse con éxito');
  console.assert(mod6.getIsOverrideAuthorized() === true, 'Módulo 6 debe autorizar anulación');

  mod6.toggleCover();
  console.assert(mod6.getCoverOpen() === true, 'Cubierta debe abrirse con anulación autorizada');

  const defusedSuccess = mod6.flipMasterSwitch();
  console.assert(defusedSuccess === true, 'Interruptor maestro debe accionarse');
  console.assert(bomb.getStatus() === 'DEFUSED', 'La bomba debe estar en estado DEFUSED');
  console.log('✓ Módulo 6 resuelto exitosamente: ¡BOMBA DESACTIVADA! (ESTADO: DEFUSED)');

  console.log('\n======================================================================');
  console.log('--- TEST 2: SIMULACIÓN DE ESCALADO DE ERRORES & COMANDOS INVÁLIDOS ---');
  console.log('======================================================================');

  const bombErr = new BombContext(ModuleFactory.SEED, true);
  const initialTime = bombErr.getRemainingSeconds();

  // 1er Strike vía comando inválido en Terminal
  const errCmd1 = bombErr.executeTerminalCommand('hack --nuclear');
  console.assert(errCmd1.isStrike === true, 'Comando inválido debe registrar strike');
  console.assert(bombErr.getStrikes() === 1, 'Strikes debe ser 1');
  console.assert(bombErr.getSpeedMultiplier() === 1.5, 'Velocidad debe ser 1.5x tras 1er strike');
  console.assert(bombErr.getRemainingSeconds() <= initialTime - 120, 'Debe descontar -2 min (-120s)');
  console.log('✓ 1er Strike por comando inválido verificado: -2 min (-120s) y velocidad 1.5x');

  // 2do Strike vía comando inválido en Terminal
  const timeBefore2 = bombErr.getRemainingSeconds();
  const errCmd2 = bombErr.executeTerminalCommand('bypass_firewall');
  console.assert(errCmd2.isStrike === true, 'Comando inválido debe registrar strike');
  console.assert(bombErr.getStrikes() === 2, 'Strikes debe ser 2');
  console.assert(bombErr.getStatus() === 'PANIC', 'Debe entrar a PANIC tras 2do strike');
  console.assert(bombErr.getSpeedMultiplier() === 3.0, 'Velocidad debe ser 3.0x en pánico');
  console.assert(bombErr.getRemainingSeconds() <= timeBefore2 - 240, 'Debe descontar -4 min (-240s)');
  console.log('✓ 2do Strike por comando inválido verificado: -4 min (-240s), estado PANIC y velocidad 3.0x');

  // 3er Strike: Detonación Inmediata
  const errCmd3 = bombErr.executeTerminalCommand('rm -rf /');
  console.assert(errCmd3.isStrike === true, '3er comando inválido debe registrar strike');
  console.assert(bombErr.getStrikes() === 3, 'Strikes debe ser 3');
  console.assert(bombErr.getStatus() === 'EXPLODED', 'Debe detonar inmediatamente (EXPLODED)');
  console.log('✓ 3er Strike verificado: Detonación catastrófica inmediata (EXPLODED)');

  console.log('\n=== ¡TODAS LAS VALIDACIONES DE TERMINAL EDITION PASARON AL 100%! ===\n');
}

runTerminalEditionTestSuite();
