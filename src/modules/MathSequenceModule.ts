import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';

/**
 * MÓDULO 2: Secuencia Matemática (Strategy)
 * UI: Teclado numérico y una pantalla que muestra la progresión determinista.
 * Comando Terminal: decode --seq -> "Sexto término de la proporción áurea (Fibonacci)."
 * Resolución: 1, 1, 2, 3, 5, [ 8 ]. El usuario debe teclear 8.
 * Patrón Observer: Se desbloquea automáticamente cuando el Módulo 1 es resuelto.
 * Al resolver, activa el Módulo 3.
 */
export class MathSequenceModule extends BaseModule {
  public readonly id: ModuleId = 'module_2';
  public readonly title: string = 'MÓDULO 02 // SECUENCIA MATEMÁTICA';
  public readonly subtitle: string = 'PROPORCIÓN ÁUREA Y FIBONACCI';

  public readonly sequenceDisplay: string = '1, 1, 2, 3, 5, [ ? ]';
  public readonly targetValue: number = 8;
  private selectedInput: number | null = null;

  constructor() {
    super();
    this.isUnlocked = false; // Bloqueado hasta resolver Módulo 1
  }

  public update(event: BombEvent): void {
    if (event.type === 'MODULE_SOLVED' && event.data?.moduleId === 'module_1') {
      this.isUnlocked = true;
    } else if (event.type === 'RESET') {
      this.reset();
    }
  }

  public inputNumber(num: number): boolean {
    if (this.isSolved) return true;
    if (!this.isUnlocked) return false;
    if (!this.context || !this.context.canInteract()) return false;

    this.selectedInput = num;
    const strategy = this.context.getStrategy();
    const isValid = strategy.verifyMathSequence(num);

    if (isValid) {
      this.markSolved();
      return true;
    } else {
      this.triggerStrike(
        `Valor ${num} rechazado para la progresión armónica. Término no corresponde a la secuencia.`
      );
      return false;
    }
  }

  public getSelectedInput(): number | null {
    return this.selectedInput;
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = false;
    this.selectedInput = null;
  }
}
