import * as tf from '@tensorflow/tfjs';
import { Move } from '../types';
import { HISTORY_WINDOW_SIZE, WINNING_MOVE } from '../constants';

// We use a small sequential model to learn patterns in user behavior
class AiService {
  private model: tf.Sequential;
  private history: Move[] = [];
  private isTrained = false;

  constructor() {
    this.model = tf.sequential();
    
    // Input layer: Takes a flattened one-hot encoded history
    // Shape: HISTORY_WINDOW_SIZE * 3 (for 3 possible moves)
    this.model.add(tf.layers.dense({
      units: 32,
      inputShape: [HISTORY_WINDOW_SIZE * 3],
      activation: 'relu',
    }));

    this.model.add(tf.layers.dropout({ rate: 0.2 }));

    this.model.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
    }));

    // Output layer: Probability of User playing Rock, Paper, or Scissors
    this.model.add(tf.layers.dense({
      units: 3,
      activation: 'softmax',
    }));

    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'categoricalCrossentropy',
    });
  }

  // Convert a Move enum to a one-hot array [1,0,0], [0,1,0], or [0,0,1]
  private oneHot(move: Move): number[] {
    const encoded = [0, 0, 0];
    encoded[move] = 1;
    return encoded;
  }

  // Record a player's move and retrain the model on the fly
  public async recordMoveAndTrain(playerMove: Move) {
    // We need enough history to form a training sample
    if (this.history.length >= HISTORY_WINDOW_SIZE) {
      // Input: The previous N moves
      const inputSequence = this.history.slice(-HISTORY_WINDOW_SIZE);
      const xsData = inputSequence.flatMap(m => this.oneHot(m));
      
      // Output: The move the player JUST made (this is what we wanted to predict)
      const ysData = this.oneHot(playerMove);

      const xs = tf.tensor2d([xsData]);
      const ys = tf.tensor2d([ysData]);

      // Online training: Update weights immediately
      await this.model.fit(xs, ys, { epochs: 1, verbose: 0 });
      
      xs.dispose();
      ys.dispose();
      this.isTrained = true;
    }

    this.history.push(playerMove);
  }

  // Predict the user's NEXT move, then return the counter to it
  public predictCounterMove(): Move {
    // If not enough history, play random
    if (this.history.length < HISTORY_WINDOW_SIZE || !this.isTrained) {
      return Math.floor(Math.random() * 3) as Move;
    }

    // Get the immediate last N moves to use as input for prediction
    const inputSequence = this.history.slice(-HISTORY_WINDOW_SIZE);
    const xsData = inputSequence.flatMap(m => this.oneHot(m));
    const xs = tf.tensor2d([xsData]);

    // Predict
    const prediction = this.model.predict(xs) as tf.Tensor;
    const values = prediction.dataSync(); // Float32Array of probabilities [Prob(Rock), Prob(Paper), Prob(Scissors)]
    
    xs.dispose();
    prediction.dispose();

    // Find the move the USER is most likely to play (index of max probability)
    let predictedUserMove = 0;
    let maxProb = -1;
    for(let i=0; i<3; i++) {
        if (values[i] > maxProb) {
            maxProb = values[i];
            predictedUserMove = i;
        }
    }

    // Return the move that BEATS the predicted user move
    return WINNING_MOVE[predictedUserMove as Move];
  }
  
  public getHistoryLength(): number {
      return this.history.length;
  }
  
  // Debug: Get probabilities for UI
  public getConfidence(): number[] {
     if (this.history.length < HISTORY_WINDOW_SIZE || !this.isTrained) {
         return [0.33, 0.33, 0.33];
     }
     const inputSequence = this.history.slice(-HISTORY_WINDOW_SIZE);
     const xsData = inputSequence.flatMap(m => this.oneHot(m));
     const xs = tf.tensor2d([xsData]);
     const prediction = this.model.predict(xs) as tf.Tensor;
     const values = Array.from(prediction.dataSync()) as number[];
     xs.dispose();
     prediction.dispose();
     return values;
  }
}

// Singleton instance
export const aiService = new AiService();