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

  public setContext(context: BombContext): void {
    super.setContext(context);
    this.wrappedModule.setContext(context);
  }

  public update(event: BombEvent): void {
    this.wrappedModule.update(event);
  }

  public reset(): void {
    this.wrappedModule.reset();
  }

  public getWrapped(): BaseModule {
    return this.wrappedModule;
  }
}
