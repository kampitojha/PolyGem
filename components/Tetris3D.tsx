import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './Button';
import { GameState, TetrominoType, Position } from '../types';
import { TETROMINOS } from '../constants';
import { Play, RotateCcw, Pause, ArrowDown, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const createBoard = () => Array.from(Array(BOARD_HEIGHT), () => Array(BOARD_WIDTH).fill([0, 'clear']));

export const Tetris3D: React.FC = () => {
  const [board, setBoard] = useState(createBoard());
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [score, setScore] = useState(0);
  const [dropTime, setDropTime] = useState<number | null>(null);
  
  // Player state
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS.I.shape,
    collided: false,
    type: 'I' as TetrominoType,
  });

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const dropCounterRef = useRef<number>(0);

  // Game Loop using requestAnimationFrame for smoothness
  const gameLoop = useCallback((time: number) => {
    if (gameState !== GameState.PLAYING) return;

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    dropCounterRef.current += deltaTime;

    if (dropTime && dropCounterRef.current > dropTime) {
      drop();
      dropCounterRef.current = 0;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, dropTime]); 

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, gameLoop]);

  const checkCollision = (playerPos: Position, playerTetromino: number[][], gameBoard: any[][]) => {
    for (let y = 0; y < playerTetromino.length; y += 1) {
      for (let x = 0; x < playerTetromino[y].length; x += 1) {
        if (playerTetromino[y][x] !== 0) {
          if (
            // 1. Check that we're on an actual Board cell
            !gameBoard[y + playerPos.y] ||
            !gameBoard[y + playerPos.y][x + playerPos.x] ||
            // 2. Check that the cell isn't set to clear
            gameBoard[y + playerPos.y][x + playerPos.x][1] !== 'clear'
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = (matrix: number[][]) => {
    // Transpose then reverse rows
    return matrix[0].map((_, index) => matrix.map(row => row[index])).map(row => row.reverse());
  };

  const playerRotate = () => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino);
    
    // Wall check
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer.pos, clonedPlayer.tetromino, board)) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino); // rotate back
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const updateBoard = (prevBoard: any[][]) => {
    // 1. Flush the board from the previous render (remove 'clear' cells that were the active piece)
    const newBoard = prevBoard.map(row =>
      row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
    );

    // 2. Draw the tetromino
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          // Safeguard against out of bounds during fast moves
          if (newBoard[y + player.pos.y] && newBoard[y + player.pos.y][x + player.pos.x]) {
             newBoard[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? 'merged' : 'clear'}`,
              TETROMINOS[player.type].color,
            ];
          }
        }
      });
    });

    // 3. Check collision handled in 'drop'
    if (player.collided) {
      resetPlayer();
      return sweepRows(newBoard);
    }

    return newBoard;
  };

  const sweepRows = (newBoard: any[][]) => {
    let rowsCleared = 0;
    const sweepedBoard = newBoard.reduce((ack, row) => {
      if (row.findIndex(cell => cell[0] === 0) === -1) {
        rowsCleared += 1;
        ack.unshift(new Array(newBoard[0].length).fill([0, 'clear']));
        return ack;
      }
      ack.push(row);
      return ack;
    }, []);
    if (rowsCleared > 0) {
      setScore(prev => prev + rowsCleared * 10);
    }
    return sweepedBoard;
  };

  const resetPlayer = () => {
    const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    setPlayer({
      pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
      tetromino: TETROMINOS[type].shape,
      collided: false,
      type,
    });

    // Check immediate collision (Game Over)
    if (checkCollision({ x: BOARD_WIDTH / 2 - 2, y: 0 }, TETROMINOS[type].shape, board)) {
      setGameState(GameState.GAME_OVER);
      setDropTime(null);
    }
  };

  const drop = () => {
    if (gameState !== GameState.PLAYING) return;
    
    player.pos.y += 1;
    if (checkCollision(player.pos, player.tetromino, board)) {
      player.pos.y -= 1; // Move back up
      player.collided = true;
      // Trigger board update to merge
      setBoard(prev => updateBoard(prev));
    } else {
      setPlayer({ ...player }); // Update position
    }
  };

  const move = (dir: number) => {
    if (gameState !== GameState.PLAYING) return;
    player.pos.x += dir;
    if (checkCollision(player.pos, player.tetromino, board)) {
      player.pos.x -= dir;
    } else {
      setPlayer({ ...player });
    }
  };

  const startGame = () => {
    setBoard(createBoard());
    setScore(0);
    resetPlayer();
    setGameState(GameState.PLAYING);
    setDropTime(1000);
    lastTimeRef.current = 0;
    dropCounterRef.current = 0;
  };

  // Key controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return;
      
      if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowDown') drop();
      else if (e.key === 'ArrowUp') playerRotate();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, player, board]);

  // Sync board with player movement visuals (soft render)
  // We render the 'view' of the board by merging static board + active player
  const renderGrid = () => {
    // Clone the static board
    const tempBoard = board.map(row => [...row]);
    
    // Overlay active player if playing
    if (gameState === GameState.PLAYING && !player.collided) {
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
             const targetY = y + player.pos.y;
             const targetX = x + player.pos.x;
             if (tempBoard[targetY] && tempBoard[targetY][targetX]) {
               tempBoard[targetY][targetX] = [value, 'active', TETROMINOS[player.type].color];
             }
          }
        });
      });
    }
    return tempBoard;
  };

  const displayBoard = renderGrid();

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 p-6 items-start justify-center">
      
      {/* Game Container with 3D Perspective */}
      <div className="relative group perspective-800">
        <div 
          className="bg-gray-900 p-4 rounded-xl shadow-2xl transform transition-transform duration-500 border-b-8 border-r-8 border-gray-800"
          style={{ transform: 'rotateX(5deg)' }}
        >
          <div className="grid grid-cols-10 gap-[1px] bg-gray-800 border-4 border-gray-700 p-1">
            {displayBoard.map((row, y) =>
              row.map((cell, x) => {
                const isFilled = cell[0] !== 0;
                const colorClass = isFilled ? cell[2] : 'bg-gray-900';
                
                return (
                  <div
                    key={`${y}-${x}`}
                    className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-75
                      ${colorClass}
                      ${isFilled ? 'shadow-inner border-t-2 border-l-2 border-white/30 border-b-2 border-r-2 border-black/30' : ''}
                    `}
                  />
                );
              })
            )}
          </div>
          
          {gameState === GameState.GAME_OVER && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-xl">
              <h2 className="text-3xl font-bold text-white mb-4">Game Over</h2>
              <div className="text-xl text-indigo-300 mb-6">Score: {score}</div>
              <Button onClick={startGame}>Try Again</Button>
            </div>
          )}

          {gameState === GameState.IDLE && (
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl backdrop-blur-sm">
               <Button onClick={startGame} className="text-lg px-8 py-4">
                 <Play className="w-6 h-6 mr-2" /> Start Game
               </Button>
             </div>
          )}
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="flex flex-col gap-6 w-full lg:w-64">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Score</h3>
          <div className="text-4xl font-bold text-indigo-600">{score}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-gray-900 font-semibold">Controls</h3>
          <div className="grid grid-cols-3 gap-2">
             <div className="col-start-2">
                <Button variant="secondary" onClick={() => playerRotate()} className="w-full h-12">
                    <RotateCw className="w-5 h-5" />
                </Button>
             </div>
             <div className="col-start-1 row-start-2">
                <Button variant="secondary" onClick={() => move(-1)} className="w-full h-12">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
             </div>
             <div className="col-start-2 row-start-2">
                <Button variant="secondary" onClick={() => drop()} className="w-full h-12">
                    <ArrowDown className="w-5 h-5" />
                </Button>
             </div>
             <div className="col-start-3 row-start-2">
                <Button variant="secondary" onClick={() => move(1)} className="w-full h-12">
                    <ArrowRight className="w-5 h-5" />
                </Button>
             </div>
          </div>
          <div className="pt-4 flex gap-2">
            {gameState === GameState.PLAYING ? (
                <Button variant="danger" onClick={() => setGameState(GameState.PAUSED)} className="flex-1">
                    <Pause className="w-4 h-4" /> Pause
                </Button>
            ) : gameState === GameState.PAUSED ? (
                <Button onClick={() => setGameState(GameState.PLAYING)} className="flex-1">
                    <Play className="w-4 h-4" /> Resume
                </Button>
            ) : null}
            <Button variant="ghost" onClick={() => { setGameState(GameState.IDLE); setBoard(createBoard()); setScore(0); }} title="Reset">
                <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          Use keyboard arrows to play on desktop.
        </div>
      </div>
    </div>
  );
};
