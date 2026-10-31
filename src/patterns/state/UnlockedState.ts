import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';
import { ExplodedState } from './ExplodedState';

/**
 * Patrón: STATE (Concreto)
 * UnlockedState: Estado desbloqueado con deducción matemática activa.
 * - Sostiene la velocidad normal o sancionada según los strikes.
 */
export class UnlockedState implements IBombState {
  public readonly name: BombStatus = 'UNLOCKED';
  public readonly displayName: string = 'DESBLOQUEADO (DEDUCTIVO)';
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
