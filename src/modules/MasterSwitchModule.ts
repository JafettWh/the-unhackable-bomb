import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';
import { DefusedState } from '../patterns/state/DefusedState';

/**
 * MÓDULO 6: Interruptor Maestro (MasterSwitchModule)
 * UI: Palanca o switch maestro protegido por una cubierta de seguridad cibernética.
 * Mecánica: Núcleo final de desconexión.
 * Validación: Solo interactuable si los Módulos 1 al 5 están en estado resuelto.
 * Al activarlo, la bomba pasa automáticamente a DefusedState (Pantalla de Victoria).
 */
export class MasterSwitchModule extends BaseModule {
  public readonly id: ModuleId = 'module_6';
  public readonly title: string = 'MÓDULO 06 // NÚCLEO DE DESCONEXIÓN MAESTRO';
  public readonly subtitle: string = 'DESACTIVADOR PRINCIPAL DE ENERGÍA';

  private isCoverOpen: boolean = false;
  private isSwitchEngaged: boolean = false;
  private solvedPrerequisites: boolean = false;

  public update(event: BombEvent): void {
    if (event.type === 'MODULE_SOLVED' || event.type === 'STATE_CHANGED' || event.type === 'TICK') {
      this.checkPrerequisites();
    } else if (event.type === 'RESET') {
      this.reset();
    }
  }

  private checkPrerequisites(): boolean {
    if (!this.context) return false;
    const modules = this.context.getAllModules();
    // Módulos 1 al 5 deben estar resueltos
    const prereqs = modules
      .filter((m) => m.id !== 'module_6')
      .every((m) => m.getSolved());
    this.solvedPrerequisites = prereqs;
    return prereqs;
  }

  public toggleCover(): boolean {
    if (!this.context || !this.context.canInteract()) return false;
    this.isCoverOpen = !this.isCoverOpen;
    return this.isCoverOpen;
  }

  public flipMasterSwitch(): boolean {
    if (this.isSolved) return true;
    if (!this.context || !this.context.canInteract()) return false;

    if (!this.isCoverOpen) {
      return false; // Debe levantar la cubierta primero
    }

    const canDefuse = this.checkPrerequisites();

    if (canDefuse) {
      this.isSwitchEngaged = true;
      this.markSolved();
      // Transición final al estado de victoria
      this.context.setState(new DefusedState());
      return true;
    } else {
      // Intento no autorizado: penalización severa
      this.isCoverOpen = false;
      this.triggerStrike(
        '¡CORTE NO AUTORIZADO! El Núcleo Maestro detectó subsistemas activos. Sobrecarga de derivación.'
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

  public arePrerequisitesMet(): boolean {
    return this.checkPrerequisites();
  }

  public reset(): void {
    this.isSolved = false;
    this.isCoverOpen = false;
    this.isSwitchEngaged = false;
    this.solvedPrerequisites = false;
  }
}
