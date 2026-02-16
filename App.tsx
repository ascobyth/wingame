import React, { useState, useEffect, useCallback } from 'react';
import { aiService } from './services/aiService';
import { Controls } from './components/Controls';
import { Arena } from './components/Arena';
import { StatsPanel } from './components/StatsPanel';
import { Move, GameState, GameResult } from './types';
import { WINNING_MOVE } from './constants';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    playerMove: null,
    aiMove: null,
    result: null,
    roundCount: 0,
    playerScore: 0,
    aiScore: 0,
    history: [],
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState<number[]>([0.33, 0.33, 0.33]);

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
    if (WINNING_MOVE[p] === ai) return GameResult.Loss; // If Player's winning move IS the AI's move (wait, logic check)
    // WINNING_MOVE[Rock] = Paper. If AI is Paper, AI wins (Player Loss).
    // Correct.
    return GameResult.Win;
  };

  const handlePlay = useCallback(async (playerMove: Move) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // 1. AI decides its move (Predicts user move, then counters it)
    const predictedAiMove = aiService.predictCounterMove();
    
    // 2. Get Confidence (Before training on new data, effectively what the AI thought BEFORE this turn)
    const currentConfidence = aiService.getConfidence();
    setConfidence(currentConfidence);

    // 3. Simulate "Thinking" delay for dramatic effect
    await new Promise(r => setTimeout(r, 600));

    // 4. Calculate result
    const result = determineResult(playerMove, predictedAiMove);

    // 5. Update State
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

    // 6. Train the model with the *new* player move
    await aiService.recordMoveAndTrain(playerMove);

    setIsProcessing(false);
  }, [isProcessing]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center p-4 sm:p-8 selection:bg-violet-500/30">
      
      {/* Header */}
      <header className="mb-8 text-center space-y-2">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
          NEURAL HAND
        </h1>
        <p className="text-violet-400 font-mono text-sm tracking-widest uppercase">
            TensorFlow.js Powered • Unbeatable Logic
        </p>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-4xl flex flex-col items-center">
        
        {/* Score Board */}
        <div className="flex justify-between w-full max-w-md mb-8 px-6 py-3 bg-zinc-900/80 rounded-full border border-zinc-800">
            <div className="flex flex-col items-center">
                <span className="text-xs text-zinc-500 font-bold tracking-wider">HUMAN</span>
                <span className="text-2xl font-mono text-white">{gameState.playerScore}</span>
            </div>
            <div className="h-full w-px bg-zinc-800"></div>
            <div className="flex flex-col items-center">
                <span className="text-xs text-zinc-500 font-bold tracking-wider">ROUNDS</span>
                <span className="text-xl font-mono text-zinc-400">{gameState.roundCount}</span>
            </div>
             <div className="h-full w-px bg-zinc-800"></div>
            <div className="flex flex-col items-center">
                <span className="text-xs text-violet-500 font-bold tracking-wider">AI AGENT</span>
                <span className="text-2xl font-mono text-violet-400">{gameState.aiScore}</span>
            </div>
        </div>

        <Arena 
          playerMove={gameState.playerMove}
          aiMove={gameState.aiMove}
          result={gameState.result}
          isThinking={isProcessing}
        />

        <Controls onPlay={handlePlay} disabled={isProcessing} />

        <StatsPanel 
          confidence={confidence}
          historyCount={aiService.getHistoryLength()}
        />

      </main>
      
      <footer className="mt-12 text-zinc-600 text-xs font-mono text-center max-w-lg">
        <p>
            This game uses a Machine Learning model running entirely in your browser. 
            It analyzes your move history to predict your next action. 
            The more you play, the harder it gets to win.
        </p>
      </footer>
    </div>
  );
}