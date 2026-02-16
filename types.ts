export enum Move {
  Rock = 0,
  Paper = 1,
  Scissors = 2,
}

export enum GameResult {
  Win = 'WIN',
  Loss = 'LOSS',
  Tie = 'TIE',
}

export interface GameState {
  playerMove: Move | null;
  aiMove: Move | null;
  result: GameResult | null;
  roundCount: number;
  playerScore: number;
  aiScore: number;
  history: Move[]; // Only tracking player moves for pattern recognition
}

export interface TrainingData {
  input: number[]; // One-hot encoded history
  output: number[]; // One-hot encoded actual move
}