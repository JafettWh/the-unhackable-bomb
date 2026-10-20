/**
 * THE UNHACKABLE BOMB: TERMINAL EDITION
 * Tipos Globales, Enums e Interfaces
 * Semilla Determinista: BOMB-882
 */

export type BombStatus = 'STANDBY' | 'NORMAL' | 'UNLOCKED' | 'PANIC' | 'DEFUSED' | 'EXPLODED';

export type StrategyType = 'STANDARD' | 'DEDUCTIVE';

export type ModuleId =
  | 'module_1' // Orientación Espacial (State)
  | 'module_2' // Secuencia Matemática (Strategy)
  | 'module_3' // Conocimiento Científico (Observer)
  | 'module_4' // Cifrado Geométrico (Decorator)
  | 'module_5' // Cálculo Físico (Observer/Strategy)
  | 'module_6'; // Ejecución Final (Master Switch)

export type CardinalDirection = 'N' | 'S' | 'E' | 'O';

export type GeometricShape = 'TRIANGLE' | 'SQUARE' | 'PENTAGON' | 'HEXAGON';

export interface ShapeInfo {
  id: GeometricShape;
  symbol: string;
  name: string;
  sides: number;
}

export interface ChemicalElement {
  symbol: string;
  name: string;
  atomicNumber: number;
}

export type BombEventType =
  | 'TICK'
  | 'STRIKE'
  | 'STATE_CHANGED'
  | 'STRATEGY_CHANGED'
  | 'SPEED_CHANGED'
  | 'MODULE_SOLVED'
  | 'RESET'
  | 'TIME_PENALTY'
  | 'ADMIN_UNLOCKED'
  | 'OVERRIDE_UNLOCKED'
  | 'TERMINAL_COMMAND';

export interface BombEvent {
  type: BombEventType;
  timestamp: number;
  remainingSeconds: number;
  strikes: number;
  status: BombStatus;
  strategy: StrategyType;
  speedMultiplier: number;
  data?: any;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  strikeAdded?: boolean;
}

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'prompt' | 'output' | 'error' | 'success' | 'system' | 'hint';
}
