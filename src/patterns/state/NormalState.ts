import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';
import { PanicState } from './PanicState';
import { ExplodedState } from './ExplodedState';

/**
 * Patrón: STATE (Concreto)
 * NormalState: Estado operativo estándar de la bomba.
 * - Inicia con velocidad 1.0x (o 1.5x tras 1er strike).
 * - Maneja las penalizaciones progresivas:
 *   * 1er Strike: -2 minutos (-120s) y velocidad 1.5x.
 *   * 2do Strike: -4 minutos (-240s), transición inmediata a PanicState (3.0x).
 *   * 3er Strike: Detonación inmediata (ExplodedState).
 */
export class NormalState implements IBombState {
  public readonly name: BombStatus = 'NORMAL';
  public readonly displayName: string = 'NORMAL / OPERATIVO';
  public readonly allowsInteraction: boolean = true;
  private _speedMultiplier: number = 1.0;

  public get speedMultiplier(): number {
    return this._speedMultiplier;
  }

  public onEnter(context: BombContext): void {
    if (context.getStrikes() === 1) {
      this._speedMultiplier = 1.5;
      context.setSpeedMultiplier(1.5);
    } else {
      this._speedMultiplier = 1.0;
      context.setSpeedMultiplier(1.0);
    }
  }

  public handleStrike(context: BombContext): void {
    const currentStrikes = context.getStrikes();
    if (currentStrikes === 1) {
      this._speedMultiplier = 1.5;
      context.deductTime(120); // -2 minutos (-120s)
      context.setSpeedMultiplier(1.5);
    } else if (currentStrikes === 2) {
      context.deductTime(240); // -4 minutos (-240s)
      context.setState(new PanicState()); // Conmuta a estado de pánico
    } else if (currentStrikes >= 3) {
      context.setState(new ExplodedState()); // Detonación instantánea
    }
  }

  public handleTick(context: BombContext): void {
    if (context.getRemainingSeconds() <= 0) {
      context.setState(new ExplodedState());
    }
  }
}
