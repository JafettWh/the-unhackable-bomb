import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';
import { SpatialChallenge } from './ChallengeVariants';

/**
 * MÓDULO 1: Matriz Lógica (State)
 * UI: Análisis de una matriz numérica con una regla visual por fila.
 * Comando Terminal: scan --spatial -> pista sobre cuadrados y suma.
 * Resolución: 6² + 7² = 85.
 * Al resolver, activa visual y lógicamente el Módulo 2 mediante el patrón Observer.
 */
export class SpatialOrientationModule extends BaseModule {
  public readonly id: ModuleId = 'module_1';
  public readonly title: string = 'MÓDULO 01 // MATRIZ LÓGICA';
  public readonly subtitle: string = 'ANÁLISIS VISUAL DE PATRONES';

  public readonly matrixRows: Array<[number, number, number | null]>;
  public readonly targetValue: number;

  constructor(challenge: SpatialChallenge) {
    super();
    this.matrixRows = challenge.rows;
    this.targetValue = challenge.answer;
    this.isUnlocked = true; // El Módulo 1 está activo al inicio
  }

  public update(event: BombEvent): void {
    if (event.type === 'RESET') {
      this.reset();
    }
  }

  public submitAnswer(answer: number): boolean {
    if (this.isSolved) return true;
    if (!this.isUnlocked) return false;
    if (!this.context || !this.context.canInteract()) return false;

    const strategy = this.context.getStrategy();
    if (strategy.verifySpatialAnswer(answer)) {
      this.markSolved();
      return true;
    }
    this.triggerStrike(`Resultado ${answer} incorrecto. La matriz sigue sin estabilizar.`);
    return false;
  }

  public getTerminalHint(): string {
    return 'En cada fila, eleva al cuadrado los dos primeros valores y suma los resultados.';
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = true;
  }
}
