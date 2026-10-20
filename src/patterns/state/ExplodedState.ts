import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';

/**
 * Patrón: STATE (Concreto)
 * ExplodedState: Estado final de derrota.
 * - Activado inmediatamente si el reloj llega a 00:00 o se acumula el 3er Strike.
 * - Bloquea todos los controles e interfaces interactivas.
 * - Muestra la pantalla de detonación catastrófica.
 */
export class ExplodedState implements IBombState {
  public readonly name: BombStatus = 'EXPLODED';
  public readonly displayName: string = 'DETONADA (MISIÓN FALLIDA)';
  public readonly speedMultiplier: number = 0.0;
  public readonly allowsInteraction: boolean = false;

  public onEnter(context: BombContext): void {
    context.setSpeedMultiplier(0.0);
    context.stopTimer();
  }

  public handleStrike(_context: BombContext): void {
    // Estado final alcanzado: detonación irreversible
  }

  public handleTick(_context: BombContext): void {
    // Reloj detenido
  }
}
