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
      className="h-24 w-24 rounded-3xl bg-slate-100 text-4xl font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-200"
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
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <div className="mb-6 rounded-full bg-slate-50 px-5 py-3 text-center text-sm font-semibold text-slate-700 shadow-inner">
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
              ? 'border-sky-500 bg-sky-50 text-sky-700'
              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
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
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 rounded-[2.5rem] bg-gradient-to-br from-sky-600 via-cyan-500 to-indigo-600 px-8 py-10 text-white shadow-2xl shadow-slate-900/10 sm:px-12 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-100">Tic Tac Toe</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Classic match, modern design</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100/90 sm:text-lg">
            Enjoy a crisp Tailwind-powered board with move history, reset support, and a friendly status panel.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-[1.5fr_1fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/80 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-500">Game board</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Play now</h2>
              </div>
              <button
                type="button"
                onClick={resetGame}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
              >
                Restart
              </button>
            </div>

            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />

            {winner && (
              <div className="mt-6 rounded-3xl bg-sky-50 px-5 py-4 text-sky-700 shadow-inner">
                {winner === 'X' || winner === 'O' ? `Winner: ${winner}` : 'Draw'}
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/80 sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">History</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Move log</h2>
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
