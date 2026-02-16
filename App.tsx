import React, { useState, useEffect, useCallback } from 'react';
import { aiService } from './services/aiService';
import { Controls } from './components/Controls';
import { Arena } from './components/Arena';
import { StatsPanel } from './components/StatsPanel';
import { Move, GameState, GameResult } from './types';
import { WINNING_MOVE } from './constants';

const initialGameState: GameState = {
  playerMove: null,
  aiMove: null,
  result: null,
  roundCount: 0,
  playerScore: 0,
  aiScore: 0,
  history: [],
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState<number[]>([0.33, 0.33, 0.33]);
  const [isResetGlowing, setIsResetGlowing] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isProcessing) return;
      if (e.key === '1') handlePlay(Move.Rock);
      if (e.key === '2') handlePlay(Move.Paper);
      if (e.key === '3') handlePlay(Move.Scissors);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing]);


  const determineResult = (p: Move, ai: Move): GameResult => {
    if (p === ai) return GameResult.Tie;
    if (WINNING_MOVE[p] === ai) return GameResult.Loss;
    return GameResult.Win;
  };

  const handlePlay = useCallback(async (playerMove: Move) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const predictedAiMove = aiService.predictCounterMove();

    const currentConfidence = aiService.getConfidence();
    setConfidence(currentConfidence);

    await new Promise(r => setTimeout(r, 600));

    const result = determineResult(playerMove, predictedAiMove);

    setGameState(prev => ({
      ...prev,
      playerMove,
      aiMove: predictedAiMove,
      result,
      roundCount: prev.roundCount + 1,
      playerScore: result === GameResult.Win ? prev.playerScore + 1 : prev.playerScore,
      aiScore: result === GameResult.Loss ? prev.aiScore + 1 : prev.aiScore,
      history: [...prev.history, playerMove],
    }));

    await aiService.recordMoveAndTrain(playerMove);

    setIsProcessing(false);
  }, [isProcessing]);

  const handleResetGame = () => {
    setIsResetGlowing((prev) => !prev);
    setGameState(initialGameState);
    setConfidence([0.33, 0.33, 0.33]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center p-4 sm:p-8 selection:bg-emerald-500/30">

      {/* Header */}
      <header className="mb-8 text-center space-y-2">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-200 to-zinc-600">
          NEURAL HAND
        </h1>
        <p className="text-emerald-500/80 font-mono text-[10px] tracking-[0.3em] uppercase">
          Synthetic Cognition • Non-Deterministic Counter-Play
        </p>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-4xl flex flex-col items-center">

        {/* Score Board */}
        <div className="flex justify-between w-full max-w-md mb-8 px-8 py-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-600 font-bold tracking-[0.2em] uppercase mb-1">USER</span>
            <span className="text-3xl font-mono text-white tracking-tighter">{gameState.playerScore}</span>
          </div>
          <div className="h-10 w-px bg-zinc-800 self-center"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-600 font-bold tracking-[0.2em] uppercase mb-1">EPOCH</span>
            <span className="text-2xl font-mono text-zinc-400 tracking-tighter">{gameState.roundCount}</span>
          </div>
          <div className="h-10 w-px bg-zinc-800 self-center"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-emerald-600 font-bold tracking-[0.2em] uppercase mb-1">AGENT</span>
            <span className="text-3xl font-mono text-emerald-400 tracking-tighter">{gameState.aiScore}</span>
          </div>
        </div>

        <Arena
          playerMove={gameState.playerMove}
          aiMove={gameState.aiMove}
          result={gameState.result}
          isThinking={isProcessing}
        />

        <Controls onPlay={handlePlay} disabled={isProcessing} />

        {/* Reset Game Button */}
        <button
          onClick={handleResetGame}
          className={`
            mt-6 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm
            border-2 transition-all duration-300 ease-out
            ${isResetGlowing
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]'
              : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'}
          `}
        >
          Reset Game
        </button>

        <StatsPanel
          confidence={confidence}
          historyCount={aiService.getHistoryLength()}
        />

      </main>

      <footer className="mt-16 text-zinc-700 text-[10px] font-mono text-center max-w-md leading-relaxed tracking-tight">
        <p className="uppercase opacity-50 mb-2">Technical Summary</p>
        <p>
          Local-First Neural Network executing real-time weight adjustment via Adam Optimization.
          The system identifies cyclical patterns and recursive heuristics within player input streams.
          Resistance is computationally futile.
        </p>
      </footer>
    </div>
  );
}