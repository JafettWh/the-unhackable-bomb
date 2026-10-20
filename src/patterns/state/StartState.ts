import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';

/**
 * Patrón: STATE (Concreto)
 * StartState: Estado inicial pre-juego (Pantalla de Inicio).
 * - La bomba permanece oculta y el reloj en pausa hasta presionar "INICIAR CONEXIÓN".
 * - Multiplicador de velocidad 0.0x.
 * - Deshabilita interacciones directas con los módulos.
 */
export class StartState implements IBombState {
  public readonly name: BombStatus = 'STANDBY';
  public readonly displayName: string = 'STANDBY // CONEXIÓN PENDIENTE';
  public readonly allowsInteraction: boolean = false;
  public readonly speedMultiplier: number = 0;

  public onEnter(context: BombContext): void {
    context.stopTimer();
    context.setSpeedMultiplier(0);
  }

  public handleStrike(_context: BombContext): void {
    // No aplica sanciones en pantalla de inicio
  }

  public handleTick(_context: BombContext): void {
    // Reloj detenido
  }
}
