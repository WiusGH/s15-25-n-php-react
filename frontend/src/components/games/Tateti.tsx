import React, { useState, useEffect } from "react";
import xImage from "../../../public/images/cruz.png";
import oImage from "../../../public/images/circulo.png";
import "./Tateti.css";

type Player = "X" | "O" | null;

const Tateti: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player>(null);

  useEffect(() => {
    if (!isXNext && !winner) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner]);

  const handleClick = (index: number) => {
    if (winner || board[index]) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setWinner(calculateWinner(newBoard));
  };

  const makeAIMove = () => {
    const bestMove = findBestMove(board);
    const newBoard = board.slice();
    newBoard[bestMove] = "O";
    setBoard(newBoard);
    setIsXNext(true);
    setWinner(calculateWinner(newBoard));
  };

  const findBestMove = (board: Player[]): number => {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = board.slice();
        newBoard[i] = "O";
        if (calculateWinner(newBoard) === "O") {
          return i;
        }
      }
    }

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = board.slice();
        newBoard[i] = "X";
        if (calculateWinner(newBoard) === "X") {
          return i;
        }
      }
    }

    const emptyIndices = board
      .map((val, index) => (val === null ? index : null))
      .filter((val) => val !== null) as number[];
    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    return randomIndex;
  };

  const calculateWinner = (board: Player[]): Player | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="app">
      <h1 className="title">Ta Te Ti</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div key={index} className="cell" onClick={() => handleClick(index)}>
            {cell && (
              <img
                src={cell === "X" ? xImage : oImage}
                alt={cell}
                className={`cell-image ${cell === "X" ? "x-color" : "o-color"}`}
              />
            )}
          </div>
        ))}
      </div>
      {winner && (
        <p className="winner">
          {winner === "X" ? "¡¡Ganaste!!" : "¡¡Perdiste!!"}
        </p>
      )}
      {!winner && !board.includes(null) && (
        <p className="winner">Hemos empatado</p>
      )}
      <button className="reset-button" onClick={resetGame}>
        Reiniciar Juego
      </button>
    </div>
  );
};

export default Tateti;
