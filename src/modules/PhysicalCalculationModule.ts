import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';

/**
 * MÓDULO 5: Cálculo Físico (Observer/Strategy)
 * UI: Ajustador de Frecuencia (Hz) con dial y osciloscopio visual.
 * Comando Terminal: calc --math -> quinto armónico de 13 Hz y su fase correspondiente.
 * Resolución: 5 * 13 = 65 Hz; 360° / 5 = 72°.
 * Patrón Observer: Se desbloquea automáticamente cuando el Módulo 4 es resuelto.
 * Al resolver, activa el Módulo 6.
 */
export class PhysicalCalculationModule extends BaseModule {
  public readonly id: ModuleId = 'module_5';
  public readonly title: string = 'MÓDULO 05 // CÁLCULO FÍSICO';
  public readonly subtitle: string = 'SINTONIZACIÓN DE RESONANCIA PRIMA';

  public readonly minHz: number = 0;
  public readonly maxHz: number = 100;
  public readonly targetHz: number = 65;
  public readonly minPhase: number = 0;
  public readonly maxPhase: number = 360;
  public readonly targetPhase: number = 72;

  private currentHz: number = 50;
  private currentPhase: number = 180;

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

  public setPhase(degrees: number): void {
    if (this.isSolved || !this.isUnlocked) return;
    this.currentPhase = Math.max(this.minPhase, Math.min(this.maxPhase, Math.round(degrees)));
  }

  public confirmTuning(): boolean {
    if (this.isSolved) return true;
    if (!this.isUnlocked) return false;
    if (!this.context || !this.context.canInteract()) return false;

    const strategy = this.context.getStrategy();
    const isValid = strategy.verifyPhysicalCalculation(this.currentHz, this.currentPhase);

    if (isValid) {
      this.markSolved();
      return true;
    } else {
      this.triggerStrike(
        `Calibración ${this.currentHz} Hz / ${this.currentPhase}° incorrecta. Revisa armónico y fase.`
      );
      return false;
    }
  }

  public getFrequency(): number {
    return this.currentHz;
  }

  public getPhase(): number {
    return this.currentPhase;
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = false;
    this.currentHz = 50;
    this.currentPhase = 180;
  }
}
