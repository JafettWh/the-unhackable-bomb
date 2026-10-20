import { BombContext } from './core/BombContext';
import { ModuleFactory } from './patterns/factory/ModuleFactory';
import { SpatialOrientationModule } from './modules/SpatialOrientationModule';
import { MathSequenceModule } from './modules/MathSequenceModule';
import { ScientificTriviaModule } from './modules/ScientificTriviaModule';
import { GlitchDecorator } from './patterns/decorator/GlitchDecorator';
import { GeometricCipherModule } from './modules/GeometricCipherModule';
import { PhysicalCalculationModule } from './modules/PhysicalCalculationModule';
import { MasterSwitchModule } from './modules/MasterSwitchModule';
import { CHALLENGE_VARIANTS } from './modules/ChallengeVariants';

function verifyVariant(variantIndex: number): void {
  const variantBomb = new BombContext(ModuleFactory.SEED, false, variantIndex);
  const variant = CHALLENGE_VARIANTS[variantIndex];
  variantBomb.startBomb();

  const blockedOverride = variantBomb.executeTerminalCommand('sudo override');
  console.assert(!blockedOverride.success && blockedOverride.isStrike === false, `Variante ${variantIndex + 1}: override bloqueado sin strike`);
  console.assert(variantBomb.getStrikes() === 0, `Variante ${variantIndex + 1}: intento temprano sin penalización`);
  console.assert(variantBomb.getIsOverrideUnlocked() === false, `Variante ${variantIndex + 1}: override sigue bloqueado`);

  const mod1 = variantBomb.getModule<SpatialOrientationModule>('module_1')!;
  const mod2 = variantBomb.getModule<MathSequenceModule>('module_2')!;
  const mod3 = variantBomb.getModule<ScientificTriviaModule>('module_3')!;
  const mod4 = variantBomb.getModule<GlitchDecorator>('module_4')!.getWrapped() as GeometricCipherModule;
  const mod5 = variantBomb.getModule<PhysicalCalculationModule>('module_5')!;
  const mod6 = variantBomb.getModule<MasterSwitchModule>('module_6')!;

  variantBomb.executeTerminalCommand('scan --spatial');
  mod1.submitAnswer(variant.spatial.answer);
  variantBomb.executeTerminalCommand('decode --seq');
  mod2.inputNumber(variant.math.answer);
  variantBomb.executeTerminalCommand('query --trivia');
  variant.science.elements.forEach((element) => {
    mod3.setElement(element.symbol);
    mod3.setDialZ(element.atomicNumber);
    mod3.confirmSubmission();
  });
  variantBomb.executeTerminalCommand('analyze --geometry');
  mod4.targetSequence.forEach((shape) => mod4.pressShape(shape));
  variantBomb.executeTerminalCommand('calc --math');
  mod5.setFrequency(variant.physical.fundamentalHz * variant.physical.harmonic);
  mod5.setPhase(360 / variant.physical.harmonic);
  mod5.confirmTuning();

  console.assert(variantBomb.getStrikes() === 0, `Variante ${variantIndex + 1}: respuestas correctas sin strikes`);
  const overridePrompt = variantBomb.executeTerminalCommand('sudo override');
  console.assert(overridePrompt.isStrike === false, `Variante ${variantIndex + 1}: override disponible tras resolver módulos`);
  console.assert(overridePrompt.output.includes(variant.override.clue), `Variante ${variantIndex + 1}: pista histórica correspondiente`);
  const overrideCode = variantBomb.executeTerminalCommand(variant.override.code);
  console.assert(overrideCode.isStrike === false && mod6.getIsOverrideAuthorized(), `Variante ${variantIndex + 1}: código correcto autorizado`);
  variantBomb.stopTimer();
}

function runTerminalEditionTestSuite() {
  console.log('======================================================================');
  console.log('--- TEST 1: THE UNHACKABLE BOMB - TERMINAL EDITION (SIMULACIÓN DETERMINISTA) ---');
  console.log('======================================================================');

  // Inicialización de la Bomba en Estado Standby (Pantalla de Inicio)
  const bomb = new BombContext(ModuleFactory.SEED, false, 0);

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
  const mod4 = mod4Dec.getWrapped() as GeometricCipherModule;
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

  const blockedOverride = bomb.executeTerminalCommand('sudo override');
  console.assert(!blockedOverride.success && blockedOverride.isStrike === false, 'Override prematuro debe bloquearse sin strike');
  console.assert(bomb.getStrikes() === 0 && !bomb.getIsOverrideUnlocked(), 'Override prematuro no debe penalizar ni desbloquear');

  // 2. Probar Comandos de Terminal
  const cmdSpatial = bomb.executeTerminalCommand('scan --spatial');
  console.assert(cmdSpatial.isStrike === false, 'Comando scan --spatial no debe generar strike');
  console.log('✓ Terminal scan --spatial verificado:', cmdSpatial.output);

  // 3. Resolver Módulo 1 (Matriz: 6² + 7² = 85)
  console.assert(mod1.submitAnswer(85) === true, 'Módulo 1 debe aceptar resultado 85');
  console.assert(mod1.getSolved() === true, 'Módulo 1 debe estar resuelto');
  console.assert(mod2.getIsUnlocked() === true, 'Observer: Módulo 2 debe desbloquearse al resolver Módulo 1');
  console.log('✓ Módulo 1 resuelto exitosamente: [85] &rarr; Módulo 2 DESBLOQUEADO vía Observer');

  // 4. Probar Terminal decode --seq y resolver Módulo 2 (Matemática: 8)
  const cmdSeq = bomb.executeTerminalCommand('decode --seq');
  console.assert(cmdSeq.isStrike === false, 'Comando decode --seq no debe generar strike');
  console.assert(mod2.inputNumber(21) === true, 'Módulo 2 debe aceptar número 21');
  console.assert(mod2.getSolved() === true, 'Módulo 2 debe estar resuelto');
  console.assert(mod3.getIsUnlocked() === true, 'Observer: Módulo 3 debe desbloquearse al resolver Módulo 2');
  console.log('✓ Módulo 2 resuelto exitosamente: [21] &rarr; Módulo 3 DESBLOQUEADO vía Observer');

  // 5. Probar Terminal query --trivia y resolver Módulo 3 (Oxígeno y Hierro)
  const cmdTrivia = bomb.executeTerminalCommand('query --trivia');
  console.assert(cmdTrivia.isStrike === false && cmdTrivia.output.includes('Fe'), 'Comando query --trivia debe mostrar las dos pistas');
  mod3.setElement('O');
  mod3.setDialZ(8);
  console.assert(mod3.confirmSubmission() === true, 'Módulo 3 debe aceptar Oxígeno con Z=8');
  mod3.setElement('Fe');
  mod3.setDialZ(26);
  console.assert(mod3.confirmSubmission() === true, 'Módulo 3 debe aceptar Hierro con Z=26');
  console.assert(mod3.getSolved() === true, 'Módulo 3 debe estar resuelto');
  console.assert(mod4.getIsUnlocked() === true, 'Observer: Módulo 4 debe desbloquearse al resolver Módulo 3');
  console.log('✓ Módulo 3 resuelto exitosamente: [O, Z=8; Fe, Z=26] &rarr; Módulo 4 DESBLOQUEADO vía Observer');

  // 6. Resolver Módulo 4 (ángulos interiores: triángulo, pentágono y octágono)
  const cmdGeometry = bomb.executeTerminalCommand('analyze --geometry');
  console.assert(cmdGeometry.isStrike === false, 'Comando analyze --geometry no debe generar strike');
  console.assert(mod4.pressShape('TRIANGLE') === true, 'Triángulo debe ser aceptado');
  console.assert(mod4.pressShape('PENTAGON') === true, 'Pentágono debe ser aceptado');
  console.assert(mod4.pressShape('OCTAGON') === true, 'Octágono debe ser aceptado');
  console.assert(mod4.getSolved() === true, 'Módulo 4 debe estar resuelto');
  console.assert(mod5.getIsUnlocked() === true, 'Observer: Módulo 5 debe desbloquearse al resolver Módulo 4');
  console.log('✓ Módulo 4 resuelto exitosamente: [TRIANGLE, PENTAGON, OCTAGON] &rarr; Módulo 5 DESBLOQUEADO vía Observer');

  // 7. Probar Terminal calc --math y resolver Módulo 5 (Física: 22 Hz)
  const cmdMath = bomb.executeTerminalCommand('calc --math');
  console.assert(cmdMath.isStrike === false, 'Comando calc --math no debe generar strike');
  console.assert(bomb.getStrikes() === 0, 'La ruta de comandos y módulos correctos debe conservar cero strikes');
  mod5.setFrequency(65);
  mod5.setPhase(72);
  console.assert(mod5.confirmTuning() === true, 'Módulo 5 debe aceptar 65 Hz y 72°');
  console.assert(mod5.getSolved() === true, 'Módulo 5 debe estar resuelto');
  console.assert(mod6.arePrerequisitesMet() === true, 'Módulo 6: Prerrequisitos 1-5 deben estar cumplidos');
  console.log('✓ Módulo 5 resuelto exitosamente: [65 Hz / 72°] &rarr; Módulo 6 prerrequisitos cumplidos');

  // 8. Desbloqueo de Administrador (Admin Lock: sudo -admin)
  const cmdAdmin = bomb.executeTerminalCommand('sudo -admin');
  console.assert(cmdAdmin.success === true, 'Comando sudo -admin debe ejecutarse con éxito');
  bomb.executeTerminalCommand('santamadre123');
  console.assert(bomb.getIsAdminUnlocked() === true, 'Manual de desactivación debe estar desbloqueado tras sudo -admin');
  console.log('✓ Bloqueo de Administrador verificado: comando sudo -admin desbloqueó el Manual táctico');

  // 9. Resolver Módulo 6 (Ejecución Final: sudo override + Master Switch)
  const cmdOverride = bomb.executeTerminalCommand('sudo override');
  console.assert(cmdOverride.success === true && cmdOverride.output.includes('Código requerido'), 'sudo override debe solicitar código');
  const overrideCode = bomb.executeTerminalCommand('1945');
  console.assert(overrideCode.isStrike === false, 'Código histórico correcto no debe generar strike');
  console.assert(mod6.getIsOverrideAuthorized() === true, 'Módulo 6 debe autorizar anulación');

  mod6.toggleCover();
  console.assert(mod6.getCoverOpen() === true, 'Cubierta debe abrirse con anulación autorizada');

  const defusedSuccess = mod6.flipMasterSwitch();
  console.assert(defusedSuccess === true, 'Interruptor maestro debe accionarse');
  console.assert(bomb.getStatus() === 'DEFUSED', 'La bomba debe estar en estado DEFUSED');
  console.log('✓ Módulo 6 resuelto exitosamente: ¡BOMBA DESACTIVADA! (ESTADO: DEFUSED)');

  for (let variantIndex = 0; variantIndex < CHALLENGE_VARIANTS.length; variantIndex++) {
    verifyVariant(variantIndex);
  }
  console.log(`✓ Las ${CHALLENGE_VARIANTS.length} variantes completas se resuelven con comandos dinámicos.`);

  const resetBomb = new BombContext(ModuleFactory.SEED, false, 0);
  resetBomb.reset(ModuleFactory.SEED, false);
  console.assert(resetBomb.getVariantIndex() !== 0, 'Un reinicio debe elegir una variante distinta a la partida anterior');

  console.log('\n======================================================================');
  console.log('--- TEST 2: SIMULACIÓN DE ESCALADO DE ERRORES & COMANDOS INVÁLIDOS ---');
  console.log('======================================================================');

  const bombErr = new BombContext(ModuleFactory.SEED, true, 0);
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
