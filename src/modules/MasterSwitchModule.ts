import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';
import { DefusedState } from '../patterns/state/DefusedState';

/**
 * MÓDULO 6: Ejecución Final (Master Switch)
 * UI: Interruptor Maestro bloqueado físicamente con cubierta de seguridad.
 * Comando Terminal: sudo override -> Desbloquea físicamente el interruptor en la UI.
 * Resolución: Accionar el interruptor maestro finaliza el juego (DefusedState).
 * Requiere: Módulos 1 al 5 resueltos + Autorización Terminal (sudo override).
 */
export class MasterSwitchModule extends BaseModule {
  public readonly id: ModuleId = 'module_6';
  public readonly title: string = 'MÓDULO 06 // INTERRUPTOR MAESTRO FINAL';
  public readonly subtitle: string = 'NÚCLEO DE DESCONEXIÓN DEFINITIVA';

  private isCoverOpen: boolean = false;
  private isSwitchEngaged: boolean = false;
  private isOverrideAuthorized: boolean = false;
  private solvedPrerequisites: boolean = false;

  constructor() {
    super();
    this.isUnlocked = false;
  }

  public update(event: BombEvent): void {
    if (event.type === 'MODULE_SOLVED' || event.type === 'STATE_CHANGED') {
      this.checkPrerequisites();
    } else if (event.type === 'OVERRIDE_UNLOCKED') {
      this.isOverrideAuthorized = true;
    } else if (event.type === 'RESET') {
      this.reset();
    }
  }

  public checkPrerequisites(): boolean {
    if (!this.context) return false;
    const modules = this.context.getAllModules();
    const prereqs = modules
      .filter((m) => m.id !== 'module_6')
      .every((m) => m.getSolved());

    this.solvedPrerequisites = prereqs;
    if (prereqs) {
      this.isUnlocked = true;
    }
    return prereqs;
  }

  public toggleCover(): boolean {
    if (!this.context || !this.context.canInteract()) return false;
    // La cubierta física solo puede abrirse si cuenta con anulación de terminal sudo override
    if (!this.isOverrideAuthorized) {
      this.triggerStrike('Cubierta bloqueada. Requiere comando de terminal [sudo override].');
      return false;
    }
    this.isCoverOpen = !this.isCoverOpen;
    return this.isCoverOpen;
  }

  public flipMasterSwitch(): boolean {
    if (this.isSolved) return true;
    if (!this.context || !this.context.canInteract()) return false;

    if (!this.isCoverOpen) {
      return false;
    }

    const prereqsMet = this.checkPrerequisites();
    const strategy = this.context.getStrategy();
    const canDefuse = strategy.verifyMasterSwitch(this.isOverrideAuthorized, prereqsMet);

    if (canDefuse) {
      this.isSwitchEngaged = true;
      this.markSolved();
      this.context.setState(new DefusedState());
      return true;
    } else {
      this.isCoverOpen = false;
      this.triggerStrike(
        '¡SOBRECARGA DEL NÚCLEO! Intento de anulación sin cumplir la secuencia previa o sin autorización root.'
      );
      return false;
    }
  }

  public getCoverOpen(): boolean {
    return this.isCoverOpen;
  }

  public getSwitchEngaged(): boolean {
    return this.isSwitchEngaged;
  }

  public getIsOverrideAuthorized(): boolean {
    return this.isOverrideAuthorized;
  }

  public setOverrideAuthorized(authorized: boolean): void {
    this.isOverrideAuthorized = authorized;
  }

  public arePrerequisitesMet(): boolean {
    return this.checkPrerequisites();
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = false;
    this.isCoverOpen = false;
    this.isSwitchEngaged = false;
    this.isOverrideAuthorized = false;
    this.solvedPrerequisites = false;
  }
}
