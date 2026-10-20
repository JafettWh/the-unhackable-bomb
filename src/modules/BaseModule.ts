import { IBombObserver } from '../patterns/observer/IBombObserver';
import { ModuleId, BombEvent } from '../types';
import type { BombContext } from '../core/BombContext';

/**
 * Clase Base Abstracta para todos los Módulos de la Bomba.
 * Implementa IBombObserver para garantizar la resolución secuencial
 * y la reactividad a los eventos del BombContext.
 */
export abstract class BaseModule implements IBombObserver {
  public abstract readonly id: ModuleId;
  public abstract readonly title: string;
  public abstract readonly subtitle: string;

  protected isSolved: boolean = false;
  protected isUnlocked: boolean = false;
  protected context: BombContext | null = null;

  public get observerId(): string {
    return this.id;
  }

  public setContext(context: BombContext): void {
    this.context = context;
  }

  public getSolved(): boolean {
    return this.isSolved;
  }

  public getIsUnlocked(): boolean {
    return this.isUnlocked;
  }

  public setUnlocked(unlocked: boolean): void {
    this.isUnlocked = unlocked;
  }

  protected markSolved(): void {
    if (this.isSolved) return;
    this.isSolved = true;
    if (this.context) {
      this.context.notifyModuleSolved(this.id);
    }
  }

  protected triggerStrike(reason: string): void {
    if (this.context) {
      this.context.addStrike(`[${this.title}] ${reason}`);
    }
  }

  /**
   * Método del patrón Observer: reacciona dinámicamente a notificaciones
   */
  public abstract update(event: BombEvent): void;

  /**
   * Restablecimiento determinista a valores iniciales de la semilla BOMB-882
   */
  public abstract reset(): void;
}
