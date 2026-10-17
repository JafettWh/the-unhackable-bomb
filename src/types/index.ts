/**
 * THE UNHACKABLE BOMB - Tipos Globales y Enums
 * Semilla Determinista: BOMB-882
 */

export type BombStatus = 'NORMAL' | 'UNLOCKED' | 'PANIC' | 'DEFUSED' | 'EXPLODED';

export type StrategyType = 'STANDARD' | 'DEDUCTIVE';

export type ModuleId =
  | 'module_1' // Phase Button
  | 'module_2' // Numeric Display
  | 'module_3' // Color Wires
  | 'module_4' // Symbol Keypad
  | 'module_5' // Frequency Dial
  | 'module_6'; // Master Switch

export type WireColor = 'red' | 'blue' | 'green' | 'yellow';

export interface WireState {
  id: string;
  color: WireColor;
  isCut: boolean;
  cutOrder?: number;
}

export type SymbolChar = 'Ω' | 'λ' | 'Δ' | 'Ψ';

export interface SymbolButtonState {
  id: string;
  symbol: SymbolChar;
  label: string;
  isPressed: boolean;
}

export type BombEventType =
  | 'TICK'
  | 'STRIKE'
  | 'STATE_CHANGED'
  | 'STRATEGY_CHANGED'
  | 'SPEED_CHANGED'
  | 'MODULE_SOLVED'
  | 'RESET'
  | 'TIME_PENALTY';

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
