import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';

/**
 * MÓDULO 5: Dial de Frecuencia Hz (FrequencyDialModule)
 * UI: Dial/potenciómetro y botones de calibración con display digital en Hz (10 Hz a 200 Hz).
 * Mecánica: Observador sincronizado con el tiempo restante del BombContext.
 * Validación: Frecuencia requerida = (Minutos Restantes en el Reloj) x 10.
 * Ejemplo: Si quedan 14 minutos en el reloj, la frecuencia exacta es 140 Hz.
 */
export class FrequencyDialModule extends BaseModule {
  public readonly id: ModuleId = 'module_5';
  public readonly title: string = 'MÓDULO 05 // DIAL DE RESONANCIA HZ';
  public readonly subtitle: string = 'SINCRONIZACIÓN TEMPORAL POR OBSERVER';

  public readonly minHz: number = 10;
  public readonly maxHz: number = 200;
  public readonly stepHz: number = 5;

  private currentHz: number = 50;
  private remainingMinutes: number = 15;

  public update(event: BombEvent): void {
    if (event.type === 'TICK') {
      this.remainingMinutes = Math.floor(event.remainingSeconds / 60);
    } else if (event.type === 'RESET') {
      this.reset();
    }
  }

  public setFrequency(hz: number): void {
    if (this.isSolved) return;
    const clamped = Math.max(this.minHz, Math.min(this.maxHz, hz));
    this.currentHz = clamped;
  }

  public adjustFrequency(delta: number): void {
    if (this.isSolved) return;
    this.setFrequency(this.currentHz + delta);
  }

  public confirmTuning(): boolean {
    if (this.isSolved) return true;
    if (!this.context || !this.context.canInteract()) return false;

    // Recalcular minutos actuales directamente del contexto para precisión milimétrica
    const remainingSecs = this.context.getRemainingSeconds();
    const currentMins = Math.floor(remainingSecs / 60);

    const strategy = this.context.getStrategy();
    const isValid = strategy.verifyFrequency(this.currentHz, currentMins);

    if (isValid) {
      this.markSolved();
      return true;
    } else {
      const expected = currentMins * 10;
      this.triggerStrike(
        `Frecuencia ${this.currentHz} Hz no sintonizada. Resonancia fallida (Esperado: ${expected} Hz).`
      );
      return false;
    }
  }

  public getFrequency(): number {
    return this.currentHz;
  }

  public getRemainingMinutes(): number {
    return this.remainingMinutes;
  }

  public reset(): void {
    this.isSolved = false;
    this.currentHz = 50;
    this.remainingMinutes = 15;
  }
}
