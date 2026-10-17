import { IBombSubject } from '../patterns/observer/IBombSubject';
import { IBombObserver } from '../patterns/observer/IBombObserver';
import { IBombState } from '../patterns/state/IBombState';
import { NormalState } from '../patterns/state/NormalState';
import { ExplodedState } from '../patterns/state/ExplodedState';
import { IDefusalStrategy } from '../patterns/strategy/IDefusalStrategy';
import { StandardStrategy } from '../patterns/strategy/StandardStrategy';
import { ModuleFactory } from '../patterns/factory/ModuleFactory';
import { BaseModule } from '../modules/BaseModule';
import {
  BombEvent,
  BombEventType,
  BombStatus,
  ModuleId,
} from '../types';

/**
 * MOTOR CENTRAL: BombContext
 * Actúa como Coordinador de Patrones (State, Strategy, Observer, Factory, Decorator).
 * Implementa IBombSubject para notificar reactivamente a observadores (módulos y vistas).
 * Gestiona el tiempo (15:00 base), penalizaciones progresivas y strikes.
 */
export class BombContext implements IBombSubject {
  public static readonly INITIAL_TIME_SECONDS = 900; // 15:00 minutos
  public static readonly MAX_STRIKES = 3;

  private state: IBombState;
  private strategy: IDefusalStrategy;
  private observers: Set<IBombObserver> = new Set();
  private modules: BaseModule[] = [];

  private remainingSeconds: number = BombContext.INITIAL_TIME_SECONDS;
  private strikes: number = 0;
  private speedMultiplier: number = 1.0;
  private timerIntervalId: number | null = null;
  private lastTickTimestamp: number = 0;

  private listeners: Set<() => void> = new Set();
  private logMessages: Array<{ time: string; text: string; type: 'info' | 'warning' | 'danger' | 'success' }> = [];

  constructor(seed: string = ModuleFactory.SEED) {
    this.state = new NormalState();
    this.strategy = new StandardStrategy();
    this.initializeModules(seed);
    this.state.onEnter(this);
    this.addLog('Sistema inicializado. Semilla determinista: ' + seed, 'info');
  }

  /**
   * Instancia módulos usando ModuleFactory y los suscribe como observadores
   */
  private initializeModules(seed: string): void {
    this.modules = ModuleFactory.createModules(seed);
    this.observers.clear();

    this.modules.forEach((mod) => {
      mod.setContext(this);
      this.attach(mod);
    });
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

    // Notificar a listeners de React
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
    // Intervalo de 100ms para precisión milimétrica de reloj retro
    this.timerIntervalId = window.setInterval(() => {
      this.tick();
    }, 100);
  }

  public stopTimer(): void {
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  private tick(): void {
    if (this.state.name === 'DEFUSED' || this.state.name === 'EXPLODED') {
      this.stopTimer();
      return;
    }

    const now = Date.now();
    const elapsedSeconds = (now - this.lastTickTimestamp) / 1000;
    this.lastTickTimestamp = now;

    // Descuenta tiempo multiplicando por la velocidad del estado actual
    const deduction = elapsedSeconds * this.speedMultiplier;
    this.remainingSeconds = Math.max(0, this.remainingSeconds - deduction);

    if (this.remainingSeconds <= 0) {
      this.remainingSeconds = 0;
      this.setState(new ExplodedState());
      this.addLog('¡TIEMPO AGOTADO! Detonación del núcleo.', 'danger');
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
    if (this.state.name === 'DEFUSED' || this.state.name === 'EXPLODED') return;

    this.strikes++;
    this.addLog(`¡STRIKE ${this.strikes}/${BombContext.MAX_STRIKES}! ${reason}`, 'danger');

    // Notificar evento
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
    this.addLog(`Módulo desactivado con éxito: ${moduleId.toUpperCase()}`, 'success');

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

  // ===================== REINICIO DETERMINISTA =====================

  public reset(seed: string = ModuleFactory.SEED): void {
    this.stopTimer();
    this.remainingSeconds = BombContext.INITIAL_TIME_SECONDS;
    this.strikes = 0;
    this.speedMultiplier = 1.0;
    this.state = new NormalState();
    this.strategy = new StandardStrategy();
    this.logMessages = [];

    // Reinstanciar módulos con semilla determinista
    this.initializeModules(seed);
    this.state.onEnter(this);

    this.addLog('Bomba reiniciada. Semilla determinista: ' + seed, 'info');

    this.notify({
      type: 'RESET',
      timestamp: Date.now(),
      remainingSeconds: this.remainingSeconds,
      strikes: this.strikes,
      status: this.state.name,
      strategy: this.strategy.type,
      speedMultiplier: this.speedMultiplier,
    });

    this.startTimer();
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
