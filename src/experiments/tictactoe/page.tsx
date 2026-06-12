'use client';

import { useState } from 'react';

type SquareValue = 'X' | 'O' | null;

type SquareProps = {
  value: SquareValue;
  onSquareClick: () => void;
};

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
      type="button"
      className="aspect-square w-full max-w-[5.5rem] rounded-3xl bg-[#F7E8E1] text-4xl font-bold text-[#4B1524] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFF7F2] disabled:cursor-not-allowed disabled:bg-[#E7D5CE] sm:max-w-none sm:h-24"
      onClick={onSquareClick}
      disabled={value !== null}
    >
      {value}
    </button>
  );
}

type BoardProps = {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
};

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const winner = calculateWinner(squares);
  const isBoardFull = squares.every((square) => square !== null);
  const status = winner
    ? `Winner: ${winner}`
    : isBoardFull
    ? 'Draw'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  function handleClick(index: number) {
    if (winner || squares[index]) {
      return;
    }

    const nextSquares = [...squares] as SquareValue[];
    nextSquares[index] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  return (
    <div className="mx-auto max-w-[24rem] rounded-[2rem] border border-[#E8D5C8] bg-[#FFF8F3] p-5 shadow-xl sm:p-6">
      <div className="mb-6 rounded-full bg-[#F3E6DC] px-5 py-3 text-center text-sm font-semibold text-[#40121F] shadow-inner">
        {status}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {squares.map((value, index) => (
          <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
        ))}
      </div>
    </div>
  );
}

const initialSquares: SquareValue[] = Array(9).fill(null);

export default function Game() {
  const [history, setHistory] = useState<SquareValue[][]>([initialSquares]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const winner = calculateWinner(currentSquares);

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([initialSquares]);
    setCurrentMove(0);
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Move #${move}` : 'Game start';
    const isActive = move === currentMove;

    return (
      <li key={move}>
        <button
          type="button"
          className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            isActive
              ? 'border-[#8F1B3D] bg-[#F7E5E2] text-[#6D1128]'
              : 'border-[#E6D6C8] bg-[#FEFBF7] text-[#3E121F] hover:border-[#D8B7A8] hover:bg-[#F8EEE6]'
          }`}
          onClick={() => jumpTo(move)}
          disabled={isActive}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <main className="min-h-screen bg-[#FBF5EF] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 rounded-[2.5rem] bg-gradient-to-br from-[#651726] via-[#8F2F3F] to-[#F8EFE4] px-6 py-8 text-white shadow-2xl shadow-slate-900/10 sm:px-8 sm:py-10 lg:px-10">
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Tic Tac Toe</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#F4E7E1] sm:text-base">
            A simple tic tac toe game built with React and Next.js. Click on the squares to play, and use the move log to navigate through the game history. Enjoy playing!
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-[2rem] bg-[#FFF8F3] p-5 shadow-xl shadow-slate-200/80 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-[#F6E8DF] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8F1B3D]">Game board</p>
                <h2 className="mt-2 text-xl font-semibold text-[#2F0F19] sm:text-2xl">Play now</h2>
              </div>
              <button
                type="button"
                onClick={resetGame}
                className="rounded-full bg-[#6F172C] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-[#581427] sm:px-5 sm:py-3"
              >
                Restart
              </button>
            </div>

            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />

            {winner && (
              <div className="mt-6 rounded-3xl bg-[#F3E3D7] px-4 py-4 text-center text-[#5D1327] shadow-inner sm:px-5">
                {winner === 'X' || winner === 'O' ? `Winner: ${winner}` : 'Draw'}
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] bg-[#FCF5EE] p-5 shadow-xl shadow-slate-200/80 sm:p-6">
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8F1B3D]">History</p>
              <h2 className="mt-2 text-xl font-semibold text-[#2F0F19] sm:text-2xl">Move log</h2>
            </div>
            <ol className="grid gap-3">{moves}</ol>
          </aside>
        </div>
      </div>
    </main>
  );
}

function calculateWinner(squares: SquareValue[]): SquareValue {
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

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
