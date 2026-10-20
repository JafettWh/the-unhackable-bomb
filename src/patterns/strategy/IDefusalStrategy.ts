import { StrategyType, GeometricShape, VisualDirection } from '../../types';

/**
 * Patrón de Comportamiento: STRATEGY
 * Define la familia de algoritmos para validar las lógicas complejas de los módulos
 * (Orientación Espacial, Secuencia Matemática, Trivia Científica, Cifrado Geométrico y Resonancia Física).
 */
export interface IDefusalStrategy {
  readonly type: StrategyType;
  readonly name: string;
  readonly description: string;

  /**
   * Módulo 1: Orientación Espacial
  * Valida paso o secuencia completa de polígonos
   */
  verifySpatialStep(currentStep: number, shape: GeometricShape): boolean;
  verifySpatialSequence(sequence: GeometricShape[]): boolean;
  verifyVisualRoutingStep(currentStep: number, direction: VisualDirection): boolean;

  /**
   * Módulo 2: Secuencia Matemática
   * Valida término de la proporción Fibonacci
   */
  verifyMathSequence(inputNumber: number): boolean;

  /**
   * Módulo 3: Conocimiento Científico
   * Valida elemento químico y número atómico Z
   */
  verifyScientificTrivia(elementSymbol: string, atomicNumber: number): boolean;

  /**
   * Módulo 4: Cifrado Geométrico
   * Valida paso o secuencia de figuras geométricas por suma de lados
   */
  verifyGeometricStep(currentStep: number, shape: GeometricShape): boolean;
  verifyGeometricSequence(sequence: GeometricShape[]): boolean;

  /**
   * Módulo 5: Cálculo Físico
   * Valida frecuencia de resonancia en Hz
   */
  verifyPhysicalCalculation(frequencyHz: number): boolean;

  /**
   * Módulo 6: Ejecución Final
   * Valida prerrequisitos y anulación administrativa
   */
  verifyMasterSwitch(overrideGranted: boolean, allPrecedingSolved: boolean): boolean;
}
