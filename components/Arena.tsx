import React from 'react';
import { Move, GameResult } from '../types';
import { MOVE_EMOJIS } from '../constants';

interface ArenaProps {
  playerMove: Move | null;
  aiMove: Move | null;
  result: GameResult | null;
  isThinking: boolean;
}

export const Arena: React.FC<ArenaProps> = ({ playerMove, aiMove, result, isThinking }) => {
  const getResultColor = () => {
    switch (result) {
      case GameResult.Win: return 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]';
      case GameResult.Loss: return 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]';
      case GameResult.Tie: return 'text-zinc-400';
      default: return 'text-white';
    }
  };

  const getResultMessage = () => {
    switch (result) {
      case GameResult.Win: return 'YOU WON';
      case GameResult.Loss: return 'AI DOMINATED';
      case GameResult.Tie: return 'STALEMATE';
      default: return 'READY';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto h-64 sm:h-80 bg-zinc-900/40 rounded-3xl border border-zinc-800/60 flex items-center justify-between px-8 sm:px-16 overflow-hidden shadow-2xl">

      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Player Side */}
      <div className="z-10 flex flex-col items-center">
        <div className={`text-6xl sm:text-8xl transition-all duration-500 ${playerMove !== null ? 'animate-float' : ''}`}>
          {playerMove !== null ? MOVE_EMOJIS[playerMove] : '🧑‍💻'}
        </div>
        <div className="mt-4 font-mono text-sm text-zinc-500 tracking-widest uppercase">YOU</div>
      </div>

      {/* VS / Result Center */}
      <div className="z-10 flex flex-col items-center justify-center">
        {isThinking ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-emerald-400 text-[10px] font-mono mt-3 animate-pulse tracking-tighter">NEURAL_ANALYSIS_LIVE</span>
          </div>
        ) : (
          <div className={`text-3xl sm:text-5xl font-black font-mono tracking-tighter transition-all duration-300 ${getResultColor()}`}>
            {result ? getResultMessage() : 'VS'}
          </div>
        )}
      </div>

      {/* AI Side */}
      <div className="z-10 flex flex-col items-center">
        <div className={`text-6xl sm:text-8xl transition-all duration-500 ${aiMove !== null ? 'animate-float' : ''}`}>
          {aiMove !== null ? MOVE_EMOJIS[aiMove] : '🐶'}
        </div>
        <div className="mt-4 font-mono text-sm text-emerald-500 font-bold tracking-widest uppercase">NEURAL NET</div>
      </div>
    </div>
  );
};