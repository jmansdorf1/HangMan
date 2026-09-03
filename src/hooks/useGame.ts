import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { playChomp } from '../lib/audio';
import { fallbackWords, getWordsForDifficulty, CATEGORIES, DIFFICULTIES } from '../data/words';
import { GameState, WordEntry } from '../types';
import type { Category, Difficulty } from '../data/words';

const MAX_WRONG = 8;

// ---------------------------------------------------------------------------
// Shuffled deck system.
// Each category+difficulty combination has its own deck of words. The deck is
// shuffled, every word is used exactly once, then the deck reshuffles and a
// new cycle begins. The previous word is never repeated back-to-back, even
// across cycle boundaries.
// ---------------------------------------------------------------------------

type DeckKey = string;

function deckKey(category: Category, difficulty: Difficulty): DeckKey {
  return `${category}:${difficulty}`;
}

// Fisher-Yates shuffle (returns a new array, does not mutate input)
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface DeckState {
  remaining: WordEntry[]; // words left to draw this cycle
  drawn: WordEntry[];      // words already drawn this cycle
  lastWord: string | null;  // last word drawn (for no-immediate-repeat)
}

// Cache of word lists per category+difficulty, fetched once from Supabase
// (or fallback library), then reused for all subsequent shuffles.
const wordListCache = new Map<DeckKey, WordEntry[]>();

async function getWordList(category: Category, difficulty: Difficulty): Promise<WordEntry[]> {
  const key = deckKey(category, difficulty);

  const cached = wordListCache.get(key);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('words')
      .select('id, word, category, difficulty')
      .eq('category', category)
      .eq('difficulty', difficulty);

    if (!error && data && data.length > 0) {
      wordListCache.set(key, data as WordEntry[]);
      return data as WordEntry[];
    }
  } catch {
    // Fall through to local library
  }

  // Fallback to local word library
  const categoryWords = fallbackWords.filter(w => w.category === category);
  const difficultyWords = getWordsForDifficulty(categoryWords, difficulty);
  const list = difficultyWords.length > 0 ? difficultyWords : categoryWords;
  wordListCache.set(key, list);
  return list;
}

// Per-deck state, stored in a ref so it persists across renders
const decks = new Map<DeckKey, DeckState>();

async function drawFromDeck(
  category: Category,
  difficulty: Difficulty
): Promise<WordEntry> {
  const key = deckKey(category, difficulty);
  const fullList = await getWordList(category, difficulty);

  let deck = decks.get(key);

  if (!deck || deck.remaining.length === 0) {
    // Start a fresh cycle: shuffle all words, avoiding repeating the last word first
    let shuffled = shuffle(fullList);

    // If we have a last word, make sure it's not the first card in the new cycle
    if (deck?.lastWord && shuffled.length > 1 && shuffled[0].word.toUpperCase() === deck.lastWord) {
      // Swap first card with a random other card
      const swapIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
      [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
    }

    deck = {
      remaining: shuffled,
      drawn: [],
      lastWord: deck?.lastWord ?? null,
    };
    decks.set(key, deck);
  }

  // Draw the next word
  const next = deck.remaining.shift()!;
  deck.drawn.push(next);
  deck.lastWord = next.word.toUpperCase();

  return next;
}

export function useGame(selectedCategory: Category, selectedDifficulty: Difficulty) {
  const [state, setState] = useState<GameState>({
    word: '',
    category: '',
    guessedLetters: new Set(),
    wrongGuesses: 0,
    status: 'playing',
    isLoading: true,
  });

  // Bunnies Saved counter - session only, not persisted
  const [bunniesSaved, setBunniesSaved] = useState(0);
  // Total game attempts - session only, not persisted
  const [totalAttempts, setTotalAttempts] = useState(0);

  const startNewGame = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    setTotalAttempts(prev => prev + 1);

    const entry = await drawFromDeck(selectedCategory, selectedDifficulty);

    const wordUpper = entry.word.toUpperCase();

    setState({
      word: wordUpper,
      category: entry.category,
      guessedLetters: new Set(),
      wrongGuesses: 0,
      status: 'playing',
      isLoading: false,
    });
  }, [selectedCategory, selectedDifficulty]);

  // Increment bunnies saved - called externally after win animation
  const incrementBunniesSaved = useCallback(() => {
    setBunniesSaved(prev => prev + 1);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const guessLetter = useCallback((letter: string) => {
    setState(prev => {
      if (prev.status !== 'playing') return prev;
      if (prev.guessedLetters.has(letter)) return prev;

      const newGuessed = new Set(prev.guessedLetters);
      newGuessed.add(letter);

      const isWrong = !prev.word.includes(letter);
      const newWrong = isWrong ? prev.wrongGuesses + 1 : prev.wrongGuesses;

      if (isWrong) {
        playChomp(newWrong);
      }

      const allRevealed = prev.word.split('').every(l => newGuessed.has(l));
      const newStatus = allRevealed ? 'won' : newWrong >= MAX_WRONG ? 'lost' : 'playing';

      return {
        ...prev,
        guessedLetters: newGuessed,
        wrongGuesses: newWrong,
        status: newStatus,
      };
    });
  }, []);

  const correctLetters = state.word
    ? state.word.split('').filter(l => state.guessedLetters.has(l))
    : [];

  const wrongLetters = Array.from(state.guessedLetters).filter(
    l => !state.word.includes(l)
  );

  return {
    state,
    bunniesSaved,
    totalAttempts,
    correctLetters,
    wrongLetters,
    guessLetter,
    startNewGame,
    incrementBunniesSaved,
    maxWrong: MAX_WRONG,
  };
}

// Export constants for use in UI
export { CATEGORIES, DIFFICULTIES };
export type { Category, Difficulty };
