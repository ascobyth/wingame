import React from 'react';
import { Move } from '../types';
import { MOVES, MOVE_EMOJIS, MOVE_NAMES } from '../constants';

interface ControlsProps {
  onPlay: (move: Move) => void;
  disabled: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onPlay, disabled }) => {
  return (
    <div className="flex justify-center gap-6 mt-8">
      {MOVES.map((move) => (
        <button
          key={move}
          onClick={() => onPlay(move)}
          disabled={disabled}
          className={`
            group relative flex flex-col items-center justify-center
            w-24 h-24 sm:w-32 sm:h-32 rounded-2xl
            bg-zinc-900 border-2 border-zinc-800
            transition-all duration-200 ease-out
            hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:border-emerald-500
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            active:scale-95
          `}
        >
          <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-md group-hover:scale-110 transition-transform">
            {MOVE_EMOJIS[move]}
          </span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-500 group-hover:text-white">
            {MOVE_NAMES[move]}
          </span>
          
          {/* Key shortcut indicator */}
          <div className="absolute top-2 right-2 text-[10px] text-zinc-700 font-mono hidden sm:block">
            {move === Move.Rock ? '1' : move === Move.Paper ? '2' : '3'}
          </div>
        </button>
      ))}
    </div>
  );
};