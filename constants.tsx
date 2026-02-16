import React from 'react';
import { Move } from './types';

export const MOVES = [Move.Rock, Move.Paper, Move.Scissors];

export const MOVE_NAMES: Record<Move, string> = {
  [Move.Rock]: 'Rock',
  [Move.Paper]: 'Paper',
  [Move.Scissors]: 'Scissors',
};

export const MOVE_EMOJIS: Record<Move, string> = {
  [Move.Rock]: '🪨',
  [Move.Paper]: '📄',
  [Move.Scissors]: '✂️',
};

// 0 beats 2, 1 beats 0, 2 beats 1
export const WINNING_MOVE: Record<Move, Move> = {
  [Move.Rock]: Move.Paper,
  [Move.Paper]: Move.Scissors,
  [Move.Scissors]: Move.Rock,
};

export const LOSING_MOVE: Record<Move, Move> = {
  [Move.Rock]: Move.Scissors,
  [Move.Paper]: Move.Rock,
  [Move.Scissors]: Move.Paper,
};

// How many past moves the AI looks at to predict the next one
export const HISTORY_WINDOW_SIZE = 5; 

export const COLORS = {
  primary: '#8b5cf6', // Violet
  secondary: '#06b6d4', // Cyan
  accent: '#f43f5e', // Rose
  success: '#10b981', // Emerald
  warning: '#f59e0b', // Amber
  dark: '#18181b', // Zinc 900
};