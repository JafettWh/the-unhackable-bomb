import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent, GeometricShape } from '../types';

/**
 * MÓDULO 1: Orientación Espacial (State)
 * UI: Selección de polígonos sin indicar sus lados.
 * Comando Terminal: scan --spatial -> pista sobre la suma de ángulos interiores.
 * Resolución: TRIANGLE seguido de HEXAGON.
 * Al resolver, activa visual y lógicamente el Módulo 2 mediante el patrón Observer.
 */
export class SpatialOrientationModule extends BaseModule {
  public readonly id: ModuleId = 'module_1';
  public readonly title: string = 'MÓDULO 01 // ORIENTACIÓN ESPACIAL';
  public readonly subtitle: string = 'SECUENCIA DE ÁNGULOS POLIGONALES';

  public readonly targetSequence: GeometricShape[] = ['TRIANGLE', 'HEXAGON'];
  private currentStepIndex: number = 0;
  private inputHistory: GeometricShape[] = [];

  constructor() {
    super();
    this.isUnlocked = true; // El Módulo 1 está activo al inicio
  }

  public update(event: BombEvent): void {
    if (event.type === 'RESET') {
      this.reset();
    }
  }

  public pressShape(shape: GeometricShape): boolean {
    if (this.isSolved) return true;
    if (!this.isUnlocked) return false;
    if (!this.context || !this.context.canInteract()) return false;

    const strategy = this.context.getStrategy();
    const isValidStep = strategy.verifySpatialStep(this.currentStepIndex, shape);

    this.inputHistory.push(shape);

    if (isValidStep) {
      this.currentStepIndex++;
      if (this.currentStepIndex >= this.targetSequence.length) {
        this.markSolved();
      }
      return true;
    } else {
      // Reinicia la secuencia y penaliza una figura incorrecta.
      this.currentStepIndex = 0;
      this.inputHistory = [];
      this.triggerStrike(
        `Polígono '${shape}' incorrecto. Secuencia angular reiniciada.`
      );
      return false;
    }
  }

  public getCurrentStep(): number {
    return this.currentStepIndex;
  }

  public getInputHistory(): GeometricShape[] {
    return [...this.inputHistory];
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = true;
    this.currentStepIndex = 0;
    this.inputHistory = [];
  }
}
