import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent, GeometricShape } from '../types';

/**
 * MÓDULO 4: Cifrado Geométrico (Decorator)
 * UI: Cuatro figuras geométricas (△, □, ⬠, ⬡) que el jugador presiona en orden.
 * Lógica: La clave está en la suma de LADOS de las figuras seleccionadas.
 *   - El target visible es 7 (las caras de un cubo + 1 → 6+1=7)
 *   - Solución: TRIANGLE(3 lados) + SQUARE(4 lados) = 7
 *   - Secuencia correcta: △ (Triángulo) → □ (Cuadrado)
 * Comando Terminal: analyze --geometry
 * Patrón Observer: Se desbloquea automáticamente cuando el Módulo 3 es resuelto.
 * Al resolver, activa el Módulo 5.
 */
export class GeometricCipherModule extends BaseModule {
  public readonly id: ModuleId = 'module_4';
  public readonly title: string = 'MÓDULO 04 // CIFRADO GEOMÉTRICO';
  public readonly subtitle: string = 'DEDUCCIÓN ESPACIAL — SUMA DE LADOS';

  public readonly targetSum: number = 7;
  public readonly targetSequence: GeometricShape[] = ['TRIANGLE', 'SQUARE'];
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
      this.currentStepIndex = 0;
      this.pressedShapes = [];
      this.triggerStrike(
        `Figura '${shape}' incorrecta en paso ${this.currentStepIndex + 1}. Secuencia geométrica reiniciada.`
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
