import { IDefusalStrategy } from './IDefusalStrategy';
import { StrategyType, GeometricShape, VisualDirection } from '../../types';
import { ChallengeVariant, getInteriorAngle } from '../../modules/ChallengeVariants';

/**
 * Patrón: STRATEGY (Concreta)
 * DeductiveStrategy: Estrategia deductiva activa para resolución secuencial.
 * Basada estrictamente en la semilla BOMB-882:
 * Las soluciones se inyectan desde la variante elegida por ModuleFactory.
 * 6. Maestro: Anulación sudo override confirmada y módulos 1 a 5 resueltos.
 */
export class DeductiveStrategy implements IDefusalStrategy {
  public readonly type: StrategyType = 'DEDUCTIVE';
  public readonly name: string = 'Estrategia Deductiva (Núcleo Sincronizado)';
  public readonly description: string =
    'El núcleo de la bomba ha sido acoplado a la configuración aleatoria de esta partida.';

  private readonly visualRoutingSolution: VisualDirection[] = ['UP', 'LEFT', 'DOWN'];

  constructor(private readonly variant: ChallengeVariant) {}

  public verifySpatialAnswer(answer: number): boolean {
    return answer === this.variant.spatial.answer;
  }

  public verifyVisualRoutingStep(currentStep: number, direction: VisualDirection): boolean {
    if (currentStep < 0 || currentStep >= this.visualRoutingSolution.length) return false;
    return this.visualRoutingSolution[currentStep] === direction;
  }

  public verifyMathSequence(inputNumber: number): boolean {
    return inputNumber === this.variant.math.answer;
  }

  public verifyScientificTrivia(elementSymbol: string, atomicNumber: number): boolean {
    const normalizedSymbol = elementSymbol.trim().toUpperCase();
    const normalizedAtomicNumber = Number(atomicNumber);
    return this.variant.science.elements.some((element) =>
      element.symbol.toUpperCase() === normalizedSymbol
      && element.atomicNumber === normalizedAtomicNumber
    );
  }

  public verifyGeometricStep(currentStep: number, shape: GeometricShape): boolean {
    if (currentStep < 0 || currentStep >= this.variant.geometry.sequence.length) return false;
    return this.variant.geometry.sequence[currentStep] === shape;
  }

  public verifyGeometricSequence(sequence: GeometricShape[]): boolean {
    if (sequence.length !== this.variant.geometry.sequence.length) return false;
    return sequence.every((shape, idx) => shape === this.variant.geometry.sequence[idx]);
  }

  public verifyPhysicalCalculation(frequencyHz: number, phaseDegrees: number): boolean {
    const targetFrequency = this.variant.physical.fundamentalHz * this.variant.physical.harmonic;
    const targetPhase = 360 / this.variant.physical.harmonic;
    return Number(frequencyHz) === targetFrequency && Number(phaseDegrees) === targetPhase;
  }

  public verifyMasterSwitch(overrideGranted: boolean, allPrecedingSolved: boolean): boolean {
    return overrideGranted && allPrecedingSolved;
  }
}
