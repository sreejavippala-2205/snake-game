import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 80;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black border-4 border-cyan shadow-[8px_8px_0_0_#ff00ff] relative overflow-hidden">
      <div className="flex justify-between w-full items-center z-10 border-b-2 border-magenta pb-4">
        <div className="flex flex-col">
          <span className="text-sm font-pixel text-magenta uppercase tracking-widest">{'>'} SCORE_VAL</span>
          <span className="text-6xl font-glitch text-cyan tracking-widest mt-2">{score}</span>
        </div>
        <div className="flex gap-4 font-pixel text-sm">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-4 py-2 bg-black text-cyan border-2 border-cyan hover:bg-cyan hover:text-black transition-colors uppercase"
          >
            {isPaused ? '> RESUME' : '> PAUSE'}
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-black text-magenta border-2 border-magenta hover:bg-magenta hover:text-black transition-colors uppercase"
          >
            {'>'} PURGE
          </button>
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-cyan shadow-[inset_0_0_20px_rgba(0,255,255,0.2)] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan/30" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            layoutId={`snake-${i}`}
            className={`bg-cyan border border-black z-20`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              opacity: Math.max(0.3, 1 - (i / snake.length)),
              transform: `scale(${Math.max(0.6, 1 - (i / snake.length) * 0.4)})`
            }}
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="bg-magenta border border-black z-10"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 0.2 }}
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 border-4 border-magenta"
            >
              <h2 className="text-4xl font-pixel text-magenta mb-4 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
              <p className="text-cyan font-terminal text-xl mb-8">{'>'} PACKETS_LOST: {score}</p>
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-black text-magenta border-2 border-magenta font-pixel uppercase hover:bg-magenta hover:text-black transition-colors"
              >
                {'>'} REBOOT_SYS
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 border-4 border-cyan"
            >
              <div className="text-center">
                <p className="text-2xl font-pixel text-cyan mb-4 glitch-text" data-text="SYS_HALTED">SYS_HALTED</p>
                <p className="text-lg font-terminal text-magenta">{'>'} AWAITING_INPUT</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full text-center mt-2">
        <p className="text-sm text-magenta font-terminal">{'>'} USE_ARROWS // SPACE_TO_HALT</p>
      </div>
    </div>
  );
}
