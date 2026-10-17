import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent, WireState, WireColor } from '../types';

/**
 * MÓDULO 3: Cables de Colores (ColorWiresModule)
 * UI: 4 cables rectos horizontales/verticales (Rojo, Azul, Verde, Amarillo).
 * Mecánica: Observador reactivo al Módulo 1 (Sincronizado vía BombContext y Observer).
 * Validación: Como el Módulo 1 es de color Azul, el usuario debe cortar únicamente
 * el Cable Azul. Cortar cualquier otro cable suma un Strike.
 */
export class ColorWiresModule extends BaseModule {
  public readonly id: ModuleId = 'module_3';
  public readonly title: string = 'MÓDULO 03 // DERIVACIÓN DE CABLES';
  public readonly subtitle: string = 'CORRESPONDENCIA CROMÁTICA REACTIVA';

  private targetColor: WireColor = 'blue';
  private wires: WireState[] = [
    { id: 'w_red', color: 'red', isCut: false },
    { id: 'w_blue', color: 'blue', isCut: false },
    { id: 'w_green', color: 'green', isCut: false },
    { id: 'w_yellow', color: 'yellow', isCut: false },
  ];

  public update(event: BombEvent): void {
    if (event.type === 'RESET') {
      this.reset();
    }
  }

  public cutWire(wireId: string): boolean {
    if (this.isSolved) return true;
    if (!this.context || !this.context.canInteract()) return false;

    const wire = this.wires.find((w) => w.id === wireId);
    if (!wire || wire.isCut) return false;

    wire.isCut = true;
    const strategy = this.context.getStrategy();
    const isValid = strategy.verifyWireCut(wire.color, this.targetColor);

    if (isValid) {
      this.markSolved();
      return true;
    } else {
      this.triggerStrike(
        `Cable ${wire.color.toUpperCase()} cortado indebidamente. Circuito en corto.`
      );
      return false;
    }
  }

  public getWires(): WireState[] {
    return [...this.wires];
  }

  public getTargetColor(): WireColor {
    return this.targetColor;
  }

  public reset(): void {
    this.isSolved = false;
    this.targetColor = 'blue';
    this.wires = [
      { id: 'w_red', color: 'red', isCut: false },
      { id: 'w_blue', color: 'blue', isCut: false },
      { id: 'w_green', color: 'green', isCut: false },
      { id: 'w_yellow', color: 'yellow', isCut: false },
    ];
  }
}
