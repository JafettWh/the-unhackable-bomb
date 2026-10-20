import { BaseModule } from '../../modules/BaseModule';
import { SpatialOrientationModule } from '../../modules/SpatialOrientationModule';
import { MathSequenceModule } from '../../modules/MathSequenceModule';
import { ScientificTriviaModule } from '../../modules/ScientificTriviaModule';
import { GeometricCipherModule } from '../../modules/GeometricCipherModule';
import { PhysicalCalculationModule } from '../../modules/PhysicalCalculationModule';
import { MasterSwitchModule } from '../../modules/MasterSwitchModule';
import { GlitchDecorator } from '../decorator/GlitchDecorator';
import { CHALLENGE_VARIANTS } from '../../modules/ChallengeVariants';

/**
 * Patrón Creacional: FACTORY METHOD
 * ModuleFactory: Generación determinista de los 6 módulos de "The Unhackable Bomb - Terminal Edition"
 * bajo la semilla fija 'BOMB-882'.
 * Garantiza la secuencia estricta: Módulo 1 activo, Módulos 2 al 6 bloqueados secuencialmente.
 */
export class ModuleFactory {
  public static readonly SEED = 'BOMB-882';
  public static readonly VARIANT_COUNT = CHALLENGE_VARIANTS.length;

  public static normalizeVariantIndex(index: number): number {
    return ((Math.floor(index) % ModuleFactory.VARIANT_COUNT) + ModuleFactory.VARIANT_COUNT)
      % ModuleFactory.VARIANT_COUNT;
  }

  public static randomVariantIndex(excludeIndex?: number): number {
    const choices = CHALLENGE_VARIANTS.map((_, index) => index)
      .filter((index) => index !== excludeIndex);
    return choices[Math.floor(Math.random() * choices.length)];
  }

  /**
   * Crea la colección completa de los 6 módulos deterministas
   */
  public static createModules(seed: string = ModuleFactory.SEED, variantIndex: number = 0): BaseModule[] {
    if (seed !== ModuleFactory.SEED) {
      console.warn(`[ModuleFactory] Advertencia: Inicializando con semilla no canónica: ${seed}`);
    }

    const variant = CHALLENGE_VARIANTS[ModuleFactory.normalizeVariantIndex(variantIndex)];

    // Módulo 1: Matriz lógica - Activo inicialmente
    const mod1 = new SpatialOrientationModule(variant.spatial);

    // Módulo 2: Secuencia Matemática (Strategy) - Desbloqueado por M1
    const mod2 = new MathSequenceModule(variant.math);

    // Módulo 3: Conocimiento Científico (Observer) - Desbloqueado por M2
    const mod3 = new ScientificTriviaModule(variant.science);

    // Módulo 4: Cifrado Geométrico decorado con interferencia visual GlitchDecorator
    const rawMod4 = new GeometricCipherModule(variant.geometry);
    const mod4 = new GlitchDecorator(rawMod4);

    // Módulo 5: Cálculo Físico (Observer/Strategy) - Desbloqueado por M4
    const mod5 = new PhysicalCalculationModule(variant.physical);

    // Módulo 6: Ejecución Final (Master Switch) - Desbloqueado por M5 + sudo override
    const mod6 = new MasterSwitchModule();

    return [mod1, mod2, mod3, mod4, mod5, mod6];
  }
}
