import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent, CardinalDirection } from '../types';

/**
 * MÓDULO 1: Orientación Espacial (State)
 * UI: 4 botones cardinales (N, S, E, O).
 * Comando Terminal: scan --spatial -> "El sol nace por la derecha y cae hacia el abismo."
 * Resolución: Razonamiento espacial. Presionar Este (E) y luego Sur (S).
 * Al resolver, activa visual y lógicamente el Módulo 2 mediante el patrón Observer.
 */
export class SpatialOrientationModule extends BaseModule {
  public readonly id: ModuleId = 'module_1';
  public readonly title: string = 'MÓDULO 01 // ORIENTACIÓN ESPACIAL';
  public readonly subtitle: string = 'SISTEMA DE NAVEGACIÓN CARDINAL';

  public readonly targetSequence: CardinalDirection[] = ['E', 'S'];
  private currentStepIndex: number = 0;
  private inputHistory: CardinalDirection[] = [];

  constructor() {
    super();
    this.isUnlocked = true; // El Módulo 1 está activo al inicio
  }

  public update(event: BombEvent): void {
    if (event.type === 'RESET') {
      this.reset();
    }
  }

  public pressDirection(direction: CardinalDirection): boolean {
    if (this.isSolved) return true;
    if (!this.isUnlocked) return false;
    if (!this.context || !this.context.canInteract()) return false;

    const strategy = this.context.getStrategy();
    const isValidStep = strategy.verifySpatialStep(this.currentStepIndex, direction);

    this.inputHistory.push(direction);

    if (isValidStep) {
      this.currentStepIndex++;
      if (this.currentStepIndex >= this.targetSequence.length) {
        this.markSolved();
      }
      return true;
    } else {
      // Intento cardinal fallido: reinicia secuencia y penaliza con Strike
      this.currentStepIndex = 0;
      this.inputHistory = [];
      this.triggerStrike(
        `Rumbo cardinal '${direction}' erróneo. Desviación detectada respecto al patrón solar.`
      );
      return false;
    }
  }

  public getCurrentStep(): number {
    return this.currentStepIndex;
  }

  public getInputHistory(): CardinalDirection[] {
    return [...this.inputHistory];
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = true;
    this.currentStepIndex = 0;
    this.inputHistory = [];
  }
}
