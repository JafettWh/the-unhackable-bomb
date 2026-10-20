import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';
import { MathChallenge } from './ChallengeVariants';

/**
 * MÓDULO 2: Secuencia Matemática (Strategy)
 * UI: Teclado numérico y una pantalla con la secuencia de la variante activa.
 * Comando Terminal: decode --seq -> Consultar la secuencia incompleta.
 * Patrón Observer: Se desbloquea automáticamente cuando el Módulo 1 es resuelto.
 * Al resolver, activa el Módulo 3.
 */
export class MathSequenceModule extends BaseModule {
  public readonly id: ModuleId = 'module_2';
  public readonly title: string = 'MÓDULO 02 // SECUENCIA MATEMÁTICA';
  public readonly subtitle: string = 'PATRONES NUMÉRICOS';

  public readonly sequence: number[];
  public readonly targetValue: number;
  public readonly choices: number[];
  private selectedInput: number | null = null;

  constructor(challenge: MathChallenge) {
    super();
    this.sequence = challenge.sequence;
    this.targetValue = challenge.answer;
    this.choices = challenge.choices;
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

  public getSequenceDisplay(isSolved: boolean = false): string {
    return `${this.sequence.join(', ')}, [ ${isSolved ? this.targetValue : '?'} ]`;
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = false;
    this.selectedInput = null;
  }
}
