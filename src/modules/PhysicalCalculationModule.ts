import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';

/**
 * MÓDULO 5: Cálculo Físico (Observer/Strategy)
 * UI: Ajustador de Frecuencia (Hz) con dial y osciloscopio visual.
 * Comando Terminal: calc --math -> "Resonancia igual al doble del primer número primo de dos dígitos."
 * Resolución: Primer primo de dos dígitos es 11 -> 11 * 2 = 22 Hz.
 * Patrón Observer: Se desbloquea automáticamente cuando el Módulo 4 es resuelto.
 * Al resolver, activa el Módulo 6.
 */
export class PhysicalCalculationModule extends BaseModule {
  public readonly id: ModuleId = 'module_5';
  public readonly title: string = 'MÓDULO 05 // CÁLCULO FÍSICO';
  public readonly subtitle: string = 'SINTONIZACIÓN DE RESONANCIA PRIMA';

  public readonly minHz: number = 0;
  public readonly maxHz: number = 100;
  public readonly targetHz: number = 22;

  private currentHz: number = 50;

  constructor() {
    super();
    this.isUnlocked = false; // Bloqueado hasta resolver Módulo 4
  }

  public update(event: BombEvent): void {
    if (event.type === 'MODULE_SOLVED' && event.data?.moduleId === 'module_4') {
      this.isUnlocked = true;
    } else if (event.type === 'RESET') {
      this.reset();
    }
  }

  public setFrequency(hz: number): void {
    if (this.isSolved || !this.isUnlocked) return;
    this.currentHz = Math.max(this.minHz, Math.min(this.maxHz, Math.round(hz)));
  }

  public adjustFrequency(delta: number): void {
    this.setFrequency(this.currentHz + delta);
  }

  public confirmTuning(): boolean {
    if (this.isSolved) return true;
    if (!this.isUnlocked) return false;
    if (!this.context || !this.context.canInteract()) return false;

    const strategy = this.context.getStrategy();
    const isValid = strategy.verifyPhysicalCalculation(this.currentHz);

    if (isValid) {
      this.markSolved();
      return true;
    } else {
      this.triggerStrike(
        `Frecuencia ${this.currentHz} Hz no armónica. Resonancia fallida (Valor primo desfasado).`
      );
      return false;
    }
  }

  public getFrequency(): number {
    return this.currentHz;
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = false;
    this.currentHz = 50;
  }
}
