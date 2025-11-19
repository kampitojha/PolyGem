import { TetrominoType } from './types';

export const TETROMINOS: Record<TetrominoType, { shape: number[][]; color: string }> = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'bg-cyan-500',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 'bg-blue-500',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: 'bg-orange-500',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'bg-yellow-500',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 'bg-green-500',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: 'bg-purple-500',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 'bg-red-500',
  },
};

export const MOCK_DASHBOARD_DATA = [
  { name: '00:00', uv: 4000, pv: 2400, amt: 2400 },
  { name: '04:00', uv: 3000, pv: 1398, amt: 2210 },
  { name: '08:00', uv: 2000, pv: 9800, amt: 2290 },
  { name: '12:00', uv: 2780, pv: 3908, amt: 2000 },
  { name: '16:00', uv: 1890, pv: 4800, amt: 2181 },
  { name: '20:00', uv: 2390, pv: 3800, amt: 2500 },
  { name: '23:59', uv: 3490, pv: 4300, amt: 2100 },
];
