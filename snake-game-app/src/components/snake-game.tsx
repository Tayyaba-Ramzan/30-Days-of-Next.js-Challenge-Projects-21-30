"use client"; // Enables client-side rendering for this component

import { useState, useEffect, useCallback, useRef } from "react"; // Import React hooks
import { Button } from "@/components/ui/button"; // Import custom Button component
import { PauseIcon, PlayIcon, RefreshCcwIcon } from "lucide-react"; // Import icons from lucide-react

// Define the possible game states
enum GameState {
  START,
  PAUSE,
  RUNNING,
  GAME_OVER,
}

// Define the directions for the snake movement
enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

// Define the Position interface
interface Position {
  x: number;
  y: number;
}

// Initial state for the snake and food
const initialSnake: Position[] = [{ x: 0, y: 0 }];
const initialFood: Position = { x: 5, y: 5 };

export default function SnakeGame() {
  // State to manage the game
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [snake, setSnake] = useState<Position[]>(initialSnake);
  const [food, setFood] = useState<Position>(initialFood);
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const gameInterval = useRef<NodeJS.Timeout | null>(null);

  // Function to move the snake
  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = newSnake[0];
      let newHead: Position;

      switch (direction) {
        case Direction.UP:
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case Direction.DOWN:
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case Direction.LEFT:
          newHead = { x: head.x - 1, y: head.y };
          break;
        case Direction.RIGHT:
          newHead = { x: head.x + 1, y: head.y };
          break;
        default:
          return newSnake;
      }

      // Check for collision with walls
      if (newHead.x < 0 || newHead.x >= 10 || newHead.y < 0 || newHead.y >= 10) {
        setGameState(GameState.GAME_OVER);
        return prevSnake;
      }

      // Check for collision with itself
      if (newSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState(GameState.GAME_OVER);
        return prevSnake;
      }

      newSnake.unshift(newHead);

      if (newHead.x === food.x && newHead.y === food.y) {
        // Snake eats the food
        setFood({
          x: Math.floor(Math.random() * 10),
          y: Math.floor(Math.random() * 10),
        });
        setScore((prevScore) => prevScore + 1);
      } else {
        newSnake.pop(); // Remove the last part of the snake's body
      }

      return newSnake;
    });
  }, [direction, food]);

  // Function to handle key press events
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case "ArrowDown":
          if (direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case "ArrowLeft":
          if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case "ArrowRight":
          if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
      }
    },
    [direction]
  );

  // useEffect to handle the game interval and key press events
  useEffect(() => {
    if (gameState === GameState.RUNNING) {
      gameInterval.current = setInterval(moveSnake, 200);
      document.addEventListener("keydown", handleKeyPress);
    } else {
      if (gameInterval.current) clearInterval(gameInterval.current);
      document.removeEventListener("keydown", handleKeyPress);
    }

    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [gameState, moveSnake, handleKeyPress]);

  // Function to start the game
  const startGame = () => {
    setSnake(initialSnake);
    setFood(initialFood);
    setScore(0);
    setDirection(Direction.RIGHT);
    setGameState(GameState.RUNNING);
  };

  // Function to pause or resume the game
  const pauseGame = () => {
    setGameState(
      gameState === GameState.RUNNING ? GameState.PAUSE : GameState.RUNNING
    );
  };

  // Function to reset the game
  const resetGame = () => {
    setGameState(GameState.START);
    setSnake(initialSnake);
    setFood(initialFood);
    setScore(0);
  };

  // useEffect to update the high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  // GameButton Component
  const GameButton = ({ onClick, icon: Icon, tooltip }: any) => (
    <button
      onClick={onClick}
      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
      title={tooltip}
    >
      <Icon size={24} />
    </button>
  );

  // JSX return statement rendering the Snake Game UI
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black to-gray-900">
      <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold text-[#FF00FF] drop-shadow-lg italic">
            Snake Game
          </h1>
          <div className="flex gap-4">
            <GameButton onClick={startGame} icon={PlayIcon} tooltip="Start" />
            <GameButton onClick={pauseGame} icon={PauseIcon} tooltip="Pause" />
            <GameButton onClick={resetGame} icon={RefreshCcwIcon} tooltip="Reset" />
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 grid grid-cols-10 gap-1 shadow-inner">
          {Array.from({ length: 100 }).map((_, i) => {
            const x = i % 10;
            const y = Math.floor(i / 10);
            const isSnakePart = snake.some((part) => part.x === x && part.y === y);
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={i}
                className={`w-6 h-6 rounded-md transition-all ${
                  isSnakePart
                    ? "bg-[#FF00FF] shadow-[0_0_10px_#FF00FF]"
                    : isFood
                    ? "bg-[#00FFFF] shadow-[0_0_10px_#00FFFF]"
                    : "bg-gray-800"
                }`}
              />
            );
          })}
        </div>

        {/* Score Panel */}
        <div className="flex items-center justify-between mt-6 text-[#00FFFF] text-lg font-semibold bg-black/30 backdrop-blur-md p-3 rounded-xl border border-gray-700">
          <span>Score: {score}</span>
          <span>High Score: {highScore}</span>
        </div>
      </div>
    </div>
  );
}
