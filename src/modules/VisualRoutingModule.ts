import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent, VisualDirection } from '../types';

/**
 * MÓDULO 4: Enrutamiento Visual con Interferencia (Decorator)
 * UI: Matriz de flechas direccionales (Arriba, Izquierda, Abajo, Derecha) envuelta en GlitchDecorator.
 * Comando Terminal: decrypt --visual -> "Ignora el ruido. Sigue la constelación: Cenit, Ocaso, Nadir."
 * Resolución: Secuencia: Arriba (Cenit), Izquierda (Ocaso), Abajo (Nadir).
 * Patrón Observer: Se desbloquea automáticamente cuando el Módulo 3 es resuelto.
 * Al resolver, activa el Módulo 5.
 */
export class VisualRoutingModule extends BaseModule {
  public readonly id: ModuleId = 'module_4';
  public readonly title: string = 'MÓDULO 04 // ENRUTAMIENTO VISUAL';
  public readonly subtitle: string = 'CONSTELACIÓN CENIT-OCASO-NADIR';

  public readonly targetSequence: VisualDirection[] = ['UP', 'LEFT', 'DOWN'];
  private currentStepIndex: number = 0;
  private inputHistory: VisualDirection[] = [];

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

  public pressDirection(dir: VisualDirection): boolean {
    if (this.isSolved) return true;
    if (!this.isUnlocked) return false;
    if (!this.context || !this.context.canInteract()) return false;

    const strategy = this.context.getStrategy();
    const isValid = strategy.verifyVisualRoutingStep(this.currentStepIndex, dir);

    this.inputHistory.push(dir);

    if (isValid) {
      this.currentStepIndex++;
      if (this.currentStepIndex >= this.targetSequence.length) {
        this.markSolved();
      }
      return true;
    } else {
      this.currentStepIndex = 0;
      this.inputHistory = [];
      this.triggerStrike(
        `Vector direccional '${dir}' refractado por el ruido. Secuencia constelar interrumpida.`
      );
      return false;
    }
  }

  public getCurrentStep(): number {
    return this.currentStepIndex;
  }

  public getInputHistory(): VisualDirection[] {
    return [...this.inputHistory];
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = false;
    this.currentStepIndex = 0;
    this.inputHistory = [];
  }
}
