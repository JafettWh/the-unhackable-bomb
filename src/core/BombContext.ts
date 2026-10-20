import { IBombSubject } from '../patterns/observer/IBombSubject';
import { IBombObserver } from '../patterns/observer/IBombObserver';
import { IBombState } from '../patterns/state/IBombState';
import { StartState } from '../patterns/state/StartState';
import { NormalState } from '../patterns/state/NormalState';
import { ExplodedState } from '../patterns/state/ExplodedState';
import { IDefusalStrategy } from '../patterns/strategy/IDefusalStrategy';
import { DeductiveStrategy } from '../patterns/strategy/DeductiveStrategy';
import { ModuleFactory } from '../patterns/factory/ModuleFactory';
import { BaseModule } from '../modules/BaseModule';
import { MasterSwitchModule } from '../modules/MasterSwitchModule';
import { CHALLENGE_VARIANTS, ChallengeVariant } from '../modules/ChallengeVariants';
import {
  BombEvent,
  BombStatus,
  ModuleId,
} from '../types';

/**
 * MOTOR CENTRAL: BombContext
 * Coordinador de Patrones (State, Strategy, Observer, Factory, Decorator).
 * Implementa IBombSubject para notificar reactivamente a observadores (módulos, terminal y UI).
 * Gestiona el tiempo (15:00 base = 900s), penalizaciones progresivas, strikes y comandos root.
 */
export class BombContext implements IBombSubject {
  public static readonly INITIAL_TIME_SECONDS = 900; // 15:00 minutos
  public static readonly MAX_STRIKES = 3;

  private state: IBombState;
  private strategy: IDefusalStrategy;
  private variantIndex: number;
  private variant: ChallengeVariant;
  private observers: Set<IBombObserver> = new Set();
  private modules: BaseModule[] = [];

  private remainingSeconds: number = BombContext.INITIAL_TIME_SECONDS;
  private strikes: number = 0;
  private speedMultiplier: number = 0;
  private timerIntervalId: number | null = null;
  private lastTickTimestamp: number = 0;

  private isAdminUnlocked: boolean = false;
  private isOverrideUnlocked: boolean = false;

  private listeners: Set<() => void> = new Set();
  private logMessages: Array<{ time: string; text: string; type: 'info' | 'warning' | 'danger' | 'success' }> = [];

  constructor(seed: string = ModuleFactory.SEED, startImmediately: boolean = false, variantIndex?: number) {
    this.variantIndex = ModuleFactory.normalizeVariantIndex(
      variantIndex ?? ModuleFactory.randomVariantIndex()
    );
    this.variant = CHALLENGE_VARIANTS[this.variantIndex];
    this.strategy = new DeductiveStrategy(this.variant);
    this.initializeModules(seed, this.variantIndex);

    if (startImmediately) {
      this.state = new NormalState();
      this.speedMultiplier = 1.0;
      this.state.onEnter(this);
      this.startTimer();
    } else {
      this.state = new StartState();
      this.state.onEnter(this);
    }

    this.addLog(`Sistema preparado. Variante aleatoria ${this.variantIndex + 1}/${ModuleFactory.VARIANT_COUNT}.`, 'info');
  }

  /**
  * Instancia los módulos de la variante elegida y los suscribe como observadores
   */
  private initializeModules(seed: string, variantIndex: number): void {
    this.modules = ModuleFactory.createModules(seed, variantIndex);
    this.observers.clear();

    this.modules.forEach((mod) => {
      mod.setContext(this);
      this.attach(mod);
    });
  }

  // ===================== CONTROL DE INICIO (PANTALLA DE INICIO) =====================

  public startBomb(): void {
    if (this.state.name !== 'STANDBY') return;

    this.setState(new NormalState());
    this.setSpeedMultiplier(1.0);
    this.startTimer();
    this.addLog('¡CONEXIÓN ESTABLECIDA! Detonador armado. Temporizador iniciado.', 'warning');
  }

  // ===================== PATRÓN OBSERVER =====================

  public attach(observer: IBombObserver): void {
    this.observers.add(observer);
  }

  public detach(observer: IBombObserver): void {
    this.observers.delete(observer);
  }

  public notify(event: BombEvent): void {
    this.observers.forEach((observer) => {
      try {
        observer.update(event);
      } catch (err) {
        console.error(`Error actualizando observador [${observer.observerId}]:`, err);
      }
    });

    this.notifyReactListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyReactListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  // ===================== GESTIÓN DE TIEMPO & TICK =====================

  public startTimer(): void {
    if (this.timerIntervalId !== null) return;

    this.lastTickTimestamp = Date.now();
    this.timerIntervalId = globalThis.setInterval(() => {
      this.tick();
    }, 100) as unknown as number;
  }

  public stopTimer(): void {
    if (this.timerIntervalId !== null) {
      globalThis.clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  private tick(): void {
    if (this.state.name === 'DEFUSED' || this.state.name === 'EXPLODED' || this.state.name === 'STANDBY') {
      this.stopTimer();
      return;
    }

    const now = Date.now();
    const elapsedSeconds = (now - this.lastTickTimestamp) / 1000;
    this.lastTickTimestamp = now;

    const deduction = elapsedSeconds * this.speedMultiplier;
    this.remainingSeconds = Math.max(0, this.remainingSeconds - deduction);

    if (this.remainingSeconds <= 0) {
      this.remainingSeconds = 0;
      this.setState(new ExplodedState());
      this.addLog('¡TIEMPO AGOTADO! Detonación del núcleo catastrófica.', 'danger');
      return;
    }

    this.state.handleTick(this);

    this.notify({
      type: 'TICK',
      timestamp: now,
      remainingSeconds: Math.ceil(this.remainingSeconds),
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
    });
  }

  // ===================== PENALIZACIONES Y STRIKES =====================

  public addStrike(reason: string = 'Infracción de secuencia lógica'): void {
    if (this.state.name === 'DEFUSED' || this.state.name === 'EXPLODED' || this.state.name === 'STANDBY') return;

    this.strikes++;
    this.addLog(`¡STRIKE ${this.strikes}/${BombContext.MAX_STRIKES}! ${reason}`, 'danger');

    this.notify({
      type: 'STRIKE',
      timestamp: Date.now(),
      remainingSeconds: Math.ceil(this.remainingSeconds),
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
      data: { reason },
    });

    // Delegar escalado de error al estado activo
    this.state.handleStrike(this);
  }

  public deductTime(seconds: number): void {
    const prev = this.remainingSeconds;
    this.remainingSeconds = Math.max(0, this.remainingSeconds - seconds);
    const mins = (seconds / 60).toFixed(0);
    this.addLog(`Penalización temporal: -${mins} minutos (-${seconds}s).`, 'warning');

    if (this.remainingSeconds <= 0 && prev > 0) {
      this.remainingSeconds = 0;
      this.setState(new ExplodedState());
      this.addLog('¡TIEMPO AGOTADO POR PENALIZACIÓN!', 'danger');
    }

    this.notify({
      type: 'TIME_PENALTY',
      timestamp: Date.now(),
      remainingSeconds: Math.ceil(this.remainingSeconds),
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
      data: { deductedSeconds: seconds },
    });
  }

  // ===================== CONTROL DE ESTADO & ESTRATEGIA =====================

  public setState(newState: IBombState): void {
    if (this.state.name === newState.name) return;

    const oldStateName = this.state.name;
    this.state = newState;
    this.state.onEnter(this);

    this.addLog(`Transición de estado: [${oldStateName}] -> [${newState.name}]`, 'info');

    this.notify({
      type: 'STATE_CHANGED',
      timestamp: Date.now(),
      remainingSeconds: Math.ceil(this.remainingSeconds),
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
    });
  }

  public setStrategy(newStrategy: IDefusalStrategy): void {
    if (this.strategy.type === newStrategy.type) return;

    this.strategy = newStrategy;
    this.addLog(`Estrategia activa: ${newStrategy.name}`, 'info');

    this.notify({
      type: 'STRATEGY_CHANGED',
      timestamp: Date.now(),
      remainingSeconds: Math.ceil(this.remainingSeconds),
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
    });
  }

  public setSpeedMultiplier(multiplier: number): void {
    if (this.speedMultiplier === multiplier) return;

    this.speedMultiplier = multiplier;
    this.addLog(`Velocidad de reloj ajustada a ${multiplier}x`, 'warning');

    this.notify({
      type: 'SPEED_CHANGED',
      timestamp: Date.now(),
      remainingSeconds: Math.ceil(this.remainingSeconds),
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
    });
  }

  public notifyModuleSolved(moduleId: ModuleId): void {
    this.addLog(`Módulo resuelto con éxito: ${moduleId.toUpperCase()}`, 'success');

    this.notify({
      type: 'MODULE_SOLVED',
      timestamp: Date.now(),
      remainingSeconds: Math.ceil(this.remainingSeconds),
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
      data: { moduleId },
    });
  }

  // ===================== COMANDOS ADMINISTRATIVOS & TERMINAL =====================

  public unlockAdmin(): void {
    if (this.isAdminUnlocked) return;
    this.isAdminUnlocked = true;
    this.addLog('Privilegios administrativos ROOT habilitados. Manual de Desactivación disponible.', 'success');

    this.notify({
      type: 'ADMIN_UNLOCKED',
      timestamp: Date.now(),
      remainingSeconds: Math.ceil(this.remainingSeconds),
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
    });
  }

  public getIsAdminUnlocked(): boolean {
    return this.isAdminUnlocked;
  }

  public unlockOverride(): void {
    if (this.isOverrideUnlocked) return;
    this.isOverrideUnlocked = true;

    // Actualizar Módulo 6 si está instanciado
    const mod6 = this.getModule<MasterSwitchModule>('module_6');
    if (mod6) {
      mod6.setOverrideAuthorized(true);
    }

    this.addLog('Comando sudo override aceptado. Interruptor Maestro desbloqueado físicamente.', 'success');

    this.notify({
      type: 'OVERRIDE_UNLOCKED',
      timestamp: Date.now(),
      remainingSeconds: Math.ceil(this.remainingSeconds),
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
    });
  }

  public getIsOverrideUnlocked(): boolean {
    return this.isOverrideUnlocked;
  }

  /**
   * Ejecuta un comando introducido en la Terminal interactiva
   */
  // Estado interno para autenticación interactiva de sudo -admin
  private awaitingAdminPassword: boolean = false;
  private awaitingOverrideCode: boolean = false;

  private areDefusalModulesSolved(): boolean {
    return this.modules
      .filter((module) => module.id !== 'module_6')
      .every((module) => module.getSolved());
  }

  public executeTerminalCommand(rawInput: string): { success: boolean; output: string; isStrike: boolean } {
    const input = rawInput.trim().toLowerCase();

    if (this.awaitingOverrideCode) {
      this.awaitingOverrideCode = false;
      if (!this.areDefusalModulesSolved()) {
        return {
          success: false,
          output: '[OVERRIDE BLOQUEADO] Resuelve primero los módulos 01–05. No se ha registrado strike.',
          isStrike: false,
        };
      }
      if (input === this.variant.override.code) {
        this.unlockOverride();
        return {
          success: true,
          output: '[ANULACIÓN DE SEGURIDAD] Código histórico verificado. Interruptor Maestro desbloqueado.',
          isStrike: false,
        };
      }
      this.addStrike(`Código de anulación incorrecto: '${input}'`);
      return {
        success: false,
        output: 'ERROR: Código histórico incorrecto. Intento de anulación registrado. +1 STRIKE.',
        isStrike: true,
      };
    }

    // Flujo de contraseña admin (primer paso: sudo -admin → solicitar password)
    if (this.awaitingAdminPassword) {
      this.awaitingAdminPassword = false;
      if (input === 'santamadre123') {
        this.unlockAdmin();
        return {
          success: true,
          output: '[ACCESO ROOT CONCEDIDO] Credenciales administrativas verificadas. Manual de Desactivación habilitado.',
          isStrike: false,
        };
      } else {
        this.addStrike(`Contraseña administrativa incorrecta: '${input}'`);
        return {
          success: false,
          output: 'ERROR: Contraseña incorrecta. Intento de acceso no autorizado registrado. +1 STRIKE.',
          isStrike: true,
        };
      }
    }

    if (input === 'sudo -admin') {
      if (this.isAdminUnlocked) {
        return {
          success: true,
          output: '[ROOT] Ya tienes privilegios administrativos activos.',
          isStrike: false,
        };
      }
      this.awaitingAdminPassword = true;
      return {
        success: true,
        output: '[sudo] Contraseña requerida para root@bomb-882:',
        isStrike: false,
      };
    }

    if (input === 'analyze --geometry') {
      return {
        success: true,
        output: `Suma los ángulos interiores de 3 polígonos regulares. Cada figura aporta (lados - 2) x 180°. Objetivo: ${this.variant.geometry.targetAngleSum}°.`,
        isStrike: false,
      };
    }

    if (input === 'sudo override') {
      if (!this.areDefusalModulesSolved()) {
        return {
          success: false,
          output: '[OVERRIDE BLOQUEADO] Resuelve primero los módulos 01–05. No se ha registrado strike.',
          isStrike: false,
        };
      }
      if (this.isOverrideUnlocked) {
        return {
          success: true,
          output: '[ANULACIÓN DE SEGURIDAD] El interruptor Maestro ya está desbloqueado.',
          isStrike: false,
        };
      }
      this.awaitingOverrideCode = true;
      return {
        success: true,
        output: `[sudo] Código requerido (4 dígitos): ${this.variant.override.clue}`,
        isStrike: false,
      };
    }

    const commandHints: Record<string, string> = {
      'scan --spatial': 'En cada fila, eleva al cuadrado los dos primeros valores y suma los resultados.',
      'decode --seq': `Completa la secuencia: ${this.variant.math.sequence.join(', ')}, [ ? ].`,
      'query --trivia': `Pistas elementales:\n${this.variant.science.clues.map((clue, index) => `${index + 1}. ${clue}`).join('\n')}\nDetermina el número atómico Z de ambos.`,
      'calc --math': `Frecuencia fundamental: ${this.variant.physical.fundamentalHz} Hz. Calcula el armónico ${this.variant.physical.harmonic} y la fase 360° / ${this.variant.physical.harmonic}.`,
    };

    if (commandHints[input]) {
      return { success: true, output: commandHints[input], isStrike: false };
    }

    if (input === 'help') {
      return {
        success: true,
        output: `COMANDOS DEL SISTEMA DISPONIBLES:
        scan --spatial             : Análisis de orientación espacial
        decode --seq               : Análisis de secuencia Fibonacci
        query --trivia             : Consultar pistas de dos elementos y sus números atómicos
        analyze --geometry        : Análisis de ángulos geométricos
        calc --math                : Análisis de resonancia
        sudo override              : Disponible tras resolver los módulos 01–05
  sudo -admin        : Autenticación root (requiere contraseña)
  status             : Diagnóstico general de módulos y telemetría
  clear              : Limpiar buffer de pantalla`,
        isStrike: false,
      };
    }

    if (input === 'status') {
      const remainingMins = Math.floor(this.remainingSeconds / 60);
      const remainingSecs = Math.floor(this.remainingSeconds % 60);
      const timeStr = `${remainingMins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
      const modulesStatus = this.modules
        .map((m) => `  [${m.id.toUpperCase()}] ${m.title}: ${m.getSolved() ? 'DESACTIVADO ✓' : m.getIsUnlocked() ? 'ACTIVO ⚡' : 'BLOQUEADO 🔒'}`)
        .join('\n');

      return {
        success: true,
        output: `DIAGNÓSTICO DE PARTIDA // BOMB-882 // VARIANTE ${this.variantIndex + 1}/${ModuleFactory.VARIANT_COUNT}:
  Tiempo Restante: ${timeStr} | Strikes: ${this.strikes}/${BombContext.MAX_STRIKES} | Vel: ${this.speedMultiplier.toFixed(1)}x
  Estado Global  : ${this.state.displayName}
  Admin Root     : ${this.isAdminUnlocked ? 'HABILITADO' : 'BLOQUEADO'}
  Master Override: ${this.isOverrideUnlocked ? 'AUTORIZADO' : 'BLOQUEADO'}
MÓDULOS:
${modulesStatus}`,
        isStrike: false,
      };
    }

    // Cualquier comando inválido suma 1 Strike
    this.addStrike(`Comando no reconocido en terminal: '${input}'`);
    return {
      success: false,
      output: `ERROR CRÍTICO: Comando '${input}' no reconocido o acceso no autorizado. Intento de vulneración detectado. +1 STRIKE REGISTRADO.`,
      isStrike: true,
    };
  }

  // ===================== REINICIO DETERMINISTA =====================

  public reset(seed: string = ModuleFactory.SEED, startInNormalState: boolean = true, variantIndex?: number): void {
    this.stopTimer();
    this.remainingSeconds = BombContext.INITIAL_TIME_SECONDS;
    this.strikes = 0;
    this.isAdminUnlocked = false;
    this.isOverrideUnlocked = false;
    this.awaitingAdminPassword = false;
    this.awaitingOverrideCode = false;
    this.variantIndex = ModuleFactory.normalizeVariantIndex(
      variantIndex ?? ModuleFactory.randomVariantIndex(this.variantIndex)
    );
    this.variant = CHALLENGE_VARIANTS[this.variantIndex];
    this.strategy = new DeductiveStrategy(this.variant);
    this.logMessages = [];

    this.initializeModules(seed, this.variantIndex);

    if (startInNormalState) {
      this.speedMultiplier = 1.0;
      this.state = new NormalState();
      this.state.onEnter(this);
      this.startTimer();
    } else {
      this.speedMultiplier = 0.0;
      this.state = new StartState();
      this.state.onEnter(this);
    }

    this.addLog(`Bomba reiniciada. Variante ${this.variantIndex + 1}/${ModuleFactory.VARIANT_COUNT}.`, 'info');

    this.notify({
      type: 'RESET',
      timestamp: Date.now(),
      remainingSeconds: this.remainingSeconds,
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
    });
  }

  // ===================== GETTERS & HELPERS =====================

  public getState(): IBombState {
    return this.state;
  }

  public getStatus(): BombStatus {
    return this.state.name;
  }

  public getStrategy(): IDefusalStrategy {
    return this.strategy;
  }

  public getVariantIndex(): number {
    return this.variantIndex;
  }

  public getRemainingSeconds(): number {
    return Math.ceil(this.remainingSeconds);
  }

  public getStrikes(): number {
    return this.strikes;
  }

  public getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }

  public canInteract(): boolean {
    return this.state.allowsInteraction;
  }

  public getAllModules(): BaseModule[] {
    return this.modules;
  }

  public getModule<T extends BaseModule>(id: ModuleId): T | undefined {
    const found = this.modules.find((m) => m.id === id);
    return found as T | undefined;
  }

  public getLogs(): Array<{ time: string; text: string; type: 'info' | 'warning' | 'danger' | 'success' }> {
    return [...this.logMessages];
  }

  private addLog(text: string, type: 'info' | 'warning' | 'danger' | 'success'): void {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    this.logMessages.unshift({ time: timeStr, text, type });
    if (this.logMessages.length > 50) {
      this.logMessages.pop();
    }
  }
}
