import { BaseModule } from '../../modules/BaseModule';
import { ModuleId, BombEvent } from '../../types';
import type { BombContext } from '../../core/BombContext';

/**
 * Patrón Estructural: DECORATOR (Base)
 * Permite añadir responsabilidades y efectos visuales/comportamentales adicionales
 * a un BaseModule de forma dinámica y transparente sin modificar la clase base.
 */
export abstract class ModuleDecorator extends BaseModule {
  protected wrappedModule: BaseModule;

  constructor(module: BaseModule) {
    super();
    this.wrappedModule = module;
    this.isUnlocked = module.getIsUnlocked();
    this.isSolved = module.getSolved();
  }

  public get id(): ModuleId {
    return this.wrappedModule.id;
  }

  public get title(): string {
    return this.wrappedModule.title;
  }

  public get subtitle(): string {
    return this.wrappedModule.subtitle;
  }

  public getSolved(): boolean {
    return this.wrappedModule.getSolved();
  }

  public getIsUnlocked(): boolean {
    return this.wrappedModule.getIsUnlocked();
  }

  public setUnlocked(unlocked: boolean): void {
    super.setUnlocked(unlocked);
    this.wrappedModule.setUnlocked(unlocked);
  }

  public setContext(context: BombContext): void {
    super.setContext(context);
    this.wrappedModule.setContext(context);
  }

  public update(event: BombEvent): void {
    this.wrappedModule.update(event);
    this.isUnlocked = this.wrappedModule.getIsUnlocked();
    this.isSolved = this.wrappedModule.getSolved();
  }

  public reset(): void {
    this.wrappedModule.reset();
    this.isUnlocked = this.wrappedModule.getIsUnlocked();
    this.isSolved = this.wrappedModule.getSolved();
  }

  public getWrapped(): BaseModule {
    return this.wrappedModule;
  }
}
