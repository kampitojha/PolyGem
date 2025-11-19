export enum Tab {
  SVG_GEN = 'SVG_GEN',
  GAME = 'GAME',
  DASHBOARD = 'DASHBOARD',
}

export interface DashboardData {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

export enum GameState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}
