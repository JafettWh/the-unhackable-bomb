import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';
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
      this._speedMultiplier = context.getEffectiveSpeedMultiplier(context.getStrikePenalty(1).speedMultiplier);
      context.setSpeedMultiplier(this._speedMultiplier);
    } else {
      this._speedMultiplier = 1.0;
      context.setSpeedMultiplier(1.0);
    }
  }

  public handleStrike(context: BombContext): void {
    context.applyStrikeEscalation();
  }

  public handleTick(context: BombContext): void {
    if (context.getRemainingSeconds() <= 0) {
      context.setState(new ExplodedState());
    }
  }
}
