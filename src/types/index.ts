export interface WordEntry {
  id: string;
  word: string;
  category: string;
  difficulty: string;
}

export type GameStatus = 'playing' | 'won' | 'lost';
export type AppStatus = 'selecting' | 'playing' | 'won' | 'lost';

export interface GameState {
  word: string;
  category: string;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  status: GameStatus;
  isLoading: boolean;
}
