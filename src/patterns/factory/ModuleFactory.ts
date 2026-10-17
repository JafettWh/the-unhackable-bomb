import { BaseModule } from '../../modules/BaseModule';
import { PhaseButtonModule } from '../../modules/PhaseButtonModule';
import { NumericDisplayModule } from '../../modules/NumericDisplayModule';
import { ColorWiresModule } from '../../modules/ColorWiresModule';
import { SymbolKeypadModule } from '../../modules/SymbolKeypadModule';
import { FrequencyDialModule } from '../../modules/FrequencyDialModule';
import { MasterSwitchModule } from '../../modules/MasterSwitchModule';
import { SymbolDecorator } from '../decorator/SymbolDecorator';

/**
 * Patrón Creacional: FACTORY METHOD
 * ModuleFactory: Generación determinista de los 6 módulos de la bomba
 * basada en la semilla estática 'BOMB-882'.
 * Garantiza que las propiedades, cables, frecuencias y decoradores sean
 * 100% reproducibles para la resolución en menos de 60 segundos por el creador.
 */
export class ModuleFactory {
  public static readonly SEED = 'BOMB-882';

  /**
   * Crea la colección completa de los 6 módulos deterministas
   */
  public static createModules(seed: string = ModuleFactory.SEED): BaseModule[] {
    if (seed !== ModuleFactory.SEED) {
      console.warn(`[ModuleFactory] Advertencia: Inicializando con semilla no canónica: ${seed}`);
    }

    // Módulo 1: Botón de Fases (Color Azul)
    const phaseButtonModule = new PhaseButtonModule();

    // Módulo 2: Matriz Numérica (Display = 4, Teclado 1..4)
    const numericDisplayModule = new NumericDisplayModule();

    // Módulo 3: Derivación de Cables (Rojo, Azul, Verde, Amarillo)
    const colorWiresModule = new ColorWiresModule();

    // Módulo 4: Matriz de Glifos envuelto con el Decorador Estructural SymbolDecorator
    const rawSymbolModule = new SymbolKeypadModule();
    const decoratedSymbolModule = new SymbolDecorator(rawSymbolModule);

    // Módulo 5: Dial de Frecuencia Hz (10 a 200 Hz, sync con Observer)
    const frequencyDialModule = new FrequencyDialModule();

    // Módulo 6: Interruptor Maestro de Desconexión
    const masterSwitchModule = new MasterSwitchModule();

    return [
      phaseButtonModule,
      numericDisplayModule,
      colorWiresModule,
      decoratedSymbolModule,
      frequencyDialModule,
      masterSwitchModule,
    ];
  }
}
