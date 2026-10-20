import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent, GeometricShape } from '../types';

/**
 * MÓDULO 4: Cifrado Geométrico (Decorator)
 * UI: Cinco polígonos que el jugador selecciona en orden.
 * Lógica: La suma de sus ángulos interiores debe ser 1800°.
 *   - Solución: TRIANGLE(180°) + PENTAGON(540°) + OCTAGON(1080°)
 * Comando Terminal: analyze --geometry
 * Patrón Observer: Se desbloquea automáticamente cuando el Módulo 3 es resuelto.
 * Al resolver, activa el Módulo 5.
 */
export class GeometricCipherModule extends BaseModule {
  public readonly id: ModuleId = 'module_4';
  public readonly title: string = 'MÓDULO 04 // CIFRADO GEOMÉTRICO';
  public readonly subtitle: string = 'DEDUCCIÓN ESPACIAL — ÁNGULOS INTERIORES';

  public readonly targetInteriorAngleSum: number = 1800;
  public readonly targetSequence: GeometricShape[] = ['TRIANGLE', 'PENTAGON', 'OCTAGON'];
  private currentStepIndex: number = 0;
  private pressedShapes: GeometricShape[] = [];

  constructor() {
    super();
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
    const isValid = strategy.verifyGeometricStep(this.currentStepIndex, shape);

    this.pressedShapes.push(shape);

    if (isValid) {
      this.currentStepIndex++;
      if (this.currentStepIndex >= this.targetSequence.length) {
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

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = false;
    this.currentStepIndex = 0;
    this.pressedShapes = [];
  }
}
