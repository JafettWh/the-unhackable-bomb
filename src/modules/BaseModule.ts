import { IBombObserver } from '../patterns/observer/IBombObserver';
import { ModuleId, BombEvent } from '../types';
import type { BombContext } from '../core/BombContext';

/**
 * Clase Base Abstracta para todos los Módulos de la Bomba.
 * Implementa IBombObserver para garantizar la sincronización reactiva
 * con los eventos del BombContext (reloj, strikes, cambios de estado y velocidad).
 * Sigue los principios SOLID (OCP, LSP, DIP).
 */
export abstract class BaseModule implements IBombObserver {
  public abstract readonly id: ModuleId;
  public abstract readonly title: string;
  public abstract readonly subtitle: string;

  protected isSolved: boolean = false;
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
