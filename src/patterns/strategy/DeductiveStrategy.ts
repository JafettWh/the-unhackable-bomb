import { IDefusalStrategy } from './IDefusalStrategy';
import { StrategyType, CardinalDirection, GeometricShape } from '../../types';

/**
 * Patrón: STRATEGY (Concreta)
 * DeductiveStrategy: Estrategia deductiva activa para resolución secuencial.
 * Basada estrictamente en la semilla BOMB-882:
 * 1. Espacial: "El sol nace por la derecha (E) y cae hacia el abismo (S)" -> E, S.
 * 2. Matemática: "Sexto término Fibonacci" -> 1, 1, 2, 3, 5, 8 -> 8.
 * 3. Científica: "Z del gas que alimenta el fuego" -> Oxígeno (O), Z = 8.
 * 4. Geométrico: "La suma de lados que iguale las caras de un cubo + 1" -> 6+1=7 -> TRIANGLE(3) + SQUARE(4).
 * 5. Física: "Doble del primer primo de dos dígitos" -> 11 * 2 = 22 Hz.
 * 6. Maestro: Anulación sudo override confirmada y módulos 1 a 5 resueltos.
 */
export class DeductiveStrategy implements IDefusalStrategy {
  public readonly type: StrategyType = 'DEDUCTIVE';
  public readonly name: string = 'Estrategia Deductiva (Núcleo Sincronizado)';
  public readonly description: string =
    'El núcleo de la bomba ha sido acoplado a las ecuaciones deterministas de la semilla BOMB-882.';

  private readonly spatialSolution: CardinalDirection[] = ['E', 'S'];
  /** Módulo 4: Secuencia de figuras cuya suma de lados = 7 → Triángulo(3) + Cuadrado(4) */
  private readonly geometricSolution: GeometricShape[] = ['TRIANGLE', 'SQUARE'];

  public verifySpatialStep(currentStep: number, direction: CardinalDirection): boolean {
    if (currentStep < 0 || currentStep >= this.spatialSolution.length) return false;
    return this.spatialSolution[currentStep] === direction;
  }

  public verifySpatialSequence(sequence: CardinalDirection[]): boolean {
    if (sequence.length !== this.spatialSolution.length) return false;
    return sequence.every((dir, idx) => dir === this.spatialSolution[idx]);
  }

  public verifyMathSequence(inputNumber: number): boolean {
    return inputNumber === 8;
  }

  public verifyScientificTrivia(elementSymbol: string, atomicNumber: number): boolean {
    const isOxygen = elementSymbol.trim().toUpperCase() === 'O';
    const isAtomicEight = Number(atomicNumber) === 8;
    return isOxygen && isAtomicEight;
  }

  public verifyGeometricStep(currentStep: number, shape: GeometricShape): boolean {
    if (currentStep < 0 || currentStep >= this.geometricSolution.length) return false;
    return this.geometricSolution[currentStep] === shape;
  }

  public verifyGeometricSequence(sequence: GeometricShape[]): boolean {
    if (sequence.length !== this.geometricSolution.length) return false;
    return sequence.every((shape, idx) => shape === this.geometricSolution[idx]);
  }

  public verifyPhysicalCalculation(frequencyHz: number): boolean {
    return Number(frequencyHz) === 22;
  }

  public verifyMasterSwitch(overrideGranted: boolean, allPrecedingSolved: boolean): boolean {
    return overrideGranted && allPrecedingSolved;
  }
}
