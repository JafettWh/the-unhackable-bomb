import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent, GeometricShape } from '../types';
import { GeometryChallenge, isValidGeometricPrefix } from './ChallengeVariants';

/**
 * MÓDULO 4: Cifrado Geométrico (Decorator)
 * UI: Cinco polígonos que el jugador selecciona en orden.
 * Lógica: La suma de los ángulos interiores debe coincidir con el objetivo de la variante.
 * Comando Terminal: analyze --geometry
 * Patrón Observer: Se desbloquea automáticamente cuando el Módulo 3 es resuelto.
 * Al resolver, activa el Módulo 5.
 */
export class GeometricCipherModule extends BaseModule {
  public readonly id: ModuleId = 'module_4';
  public readonly title: string = 'MÓDULO 04 // CIFRADO GEOMÉTRICO';
  public readonly subtitle: string = 'DEDUCCIÓN ESPACIAL — ÁNGULOS INTERIORES';

  public readonly targetInteriorAngleSum: number;
  public readonly targetSequenceLength: number = 3;
  private currentStepIndex: number = 0;
  private pressedShapes: GeometricShape[] = [];

  constructor(challenge: GeometryChallenge) {
    super();
    this.targetInteriorAngleSum = challenge.targetAngleSum;
    this.isUnlocked = false; // Bloqueado hasta resolver Módulo 3
  }

  public update(event: BombEvent): void {
    if (event.type === 'MODULE_SOLVED' && event.data?.moduleId === 'module_3') {
      this.isUnlocked = true;
    } else if (event.type === 'RESET') {
      this.reset();
    }
  }

  public pressShape(shape: GeometricShape): boolean {
    if (this.isSolved) return true;
    if (!this.isUnlocked) return false;
    if (!this.context || !this.context.canInteract()) return false;

    const strategy = this.context.getStrategy();
    const candidateSequence = [...this.pressedShapes, shape];
    const isValid = isValidGeometricPrefix(candidateSequence, this.targetInteriorAngleSum)
      && (candidateSequence.length < this.targetSequenceLength
        || strategy.verifyGeometricSequence(candidateSequence));

    if (isValid) {
      this.pressedShapes = candidateSequence;
      this.currentStepIndex++;
      if (this.currentStepIndex >= this.targetSequenceLength) {
        this.markSolved();
      }
      return true;
    } else {
      const failedStep = this.currentStepIndex + 1;
      this.currentStepIndex = 0;
      this.pressedShapes = [];
      this.triggerStrike(
        `Figura '${shape}' incorrecta en paso ${failedStep}. Secuencia geométrica reiniciada.`
      );
      return false;
    }
  }

  public getCurrentStep(): number {
    return this.currentStepIndex;
  }

  public getPressedShapes(): GeometricShape[] {
    return [...this.pressedShapes];
  }

  public getTerminalHint(): string {
    return `Suma los ángulos interiores de 3 polígonos regulares. Cada figura aporta (lados - 2) x 180°. Objetivo: ${this.targetInteriorAngleSum}°.`;
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = false;
    this.currentStepIndex = 0;
    this.pressedShapes = [];
  }
}
