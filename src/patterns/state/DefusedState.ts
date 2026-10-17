import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';

/**
 * Patrón: STATE (Concreto)
 * DefusedState: Estado final de victoria.
 * - Activado cuando el Módulo 6 (Interruptor Maestro) es encendido
 *   tras haber resuelto exitosamente los Módulos 1 al 5.
 * - Congela el temporizador y muestra el panel desarmado y condecoraciones.
 */
export class DefusedState implements IBombState {
  public readonly name: BombStatus = 'DEFUSED';
  public readonly displayName: string = 'DESACTIVADA (DESARMADA CON ÉXITO)';
  public readonly speedMultiplier: number = 0.0;
  public readonly allowsInteraction: boolean = false;

  public onEnter(context: BombContext): void {
    // Congela el reloj deteniendo el multiplicador
    context.setSpeedMultiplier(0.0);
    context.stopTimer();
  }

  public handlePhaseButtonClick(context: BombContext, currentSeconds: number): boolean {
    return false;
  }

  public handleStrike(context: BombContext): void {
    // Estado final alcanzado: no admite más strikes
  }

  public handleTick(context: BombContext): void {
    // Reloj detenido
  }
}
