import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';

/**
 * MÓDULO 1: Botón de Fases (PhaseButtonModule)
 * UI: Botón circular grande e iluminado en color Azul.
 * Mecánica: Modifica el estado global de la bomba a través del patrón State.
 * Validación: Válido presionar únicamente en segundo PAR (ej. 14:58, 14:56, 14:54).
 * Al presionar correctamente, conmuta la bomba a UnlockedState.
 * Si se presiona en segundo impar, registra un Strike.
 */
export class PhaseButtonModule extends BaseModule {
  public readonly id: ModuleId = 'module_1';
  public readonly title: string = 'MÓDULO 01 // SINCRONIZADOR DE FASE';
  public readonly subtitle: string = 'TRANSICIÓN DE ESTADO (NÚCLEO ALFA)';

  public readonly buttonColor: string = 'blue';
  private lastPressSuccess: boolean | null = null;
  private currentSecond: number = 0;

  public update(event: BombEvent): void {
    if (event.type === 'TICK') {
      this.currentSecond = event.remainingSeconds % 60;
    } else if (event.type === 'STATE_CHANGED') {
      if (event.status === 'UNLOCKED' || event.status === 'DEFUSED') {
        this.isSolved = true;
      }
    } else if (event.type === 'RESET') {
      this.reset();
    }
  }

  public pressButton(): boolean {
    if (!this.context) return false;
    if (!this.context.canInteract()) return false;

    const remainingSecs = this.context.getRemainingSeconds();
    const secondOfMinute = remainingSecs % 60;

    // Delega la transición al estado actual de la bomba
    const success = this.context.getState().handlePhaseButtonClick(this.context, secondOfMinute);
    this.lastPressSuccess = success;

    if (success) {
      this.markSolved();
    }
    return success;
  }

  public reset(): void {
    this.isSolved = false;
    this.lastPressSuccess = null;
    this.currentSecond = 0;
  }

  public getLastPressSuccess(): boolean | null {
    return this.lastPressSuccess;
  }

  public getCurrentSecond(): number {
    return this.currentSecond;
  }
}
