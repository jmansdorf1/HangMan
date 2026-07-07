import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { playChomp } from '../lib/audio';
import { fallbackWords, getWordsForDifficulty, CATEGORIES, DIFFICULTIES } from '../data/words';
import { GameState, WordEntry } from '../types';
import type { Category, Difficulty } from '../data/words';

const MAX_WRONG = 8;
const RECENT_WORDS_LIMIT = 50; // Track last 50 words to avoid repeats

// Get recent words from localStorage
function getRecentWords(): Map<string, number> {
  try {
    const saved = localStorage.getItem('bunny_recent_words');
    if (!saved) return new Map();
    const parsed = JSON.parse(saved) as [string, number][];
    return new Map(parsed);
  } catch {
    return new Map();
  }
}

// Save recent words to localStorage
function saveRecentWords(words: Map<string, number>): void {
  try {
    // Keep only the most recent words
    const entries = Array.from(words.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, RECENT_WORDS_LIMIT);
    localStorage.setItem('bunny_recent_words', JSON.stringify(entries));
  } catch {
    // Ignore storage errors
  }
}

// Weighted random selection that heavily penalizes recent words
// Returns the selected word and its weight for transparency
function pickWeightedRandom<T extends { word: string }>(
  arr: T[],
  recentWords: Map<string, number>,
  previousWord: string | null,
  currentTime: number
): T {
  // Filter out previous word completely
  const candidates = arr.filter(w => w.word.toUpperCase() !== previousWord);

  if (candidates.length === 0) return arr[0];

  // Calculate weights for each candidate
  // Never-seen words get highest weight, recent words get lowest
  const weighted = candidates.map(item => {
    const wordUpper = item.word.toUpperCase();
    const lastSeen = recentWords.get(wordUpper);

    let weight: number;
    if (lastSeen === undefined) {
      // Never seen - highest priority
      weight = 100;
    } else {
      // Calculate age-based weight
      // More recent = lower weight, older = higher weight
      const age = currentTime - lastSeen;
      // Words seen recently (within last 10 games) get very low weight
      // Words seen 20+ games ago get progressively higher weight
      if (age < 5) {
        weight = 1; // Very fresh - almost never pick
      } else if (age < 10) {
        weight = 5; // Somewhat fresh - rarely pick
      } else if (age < 20) {
        weight = 20; // Getting older - occasional pick
      } else {
        weight = 50 + Math.min(age, 50); // Old - good candidate
      }
    }

    return { item, weight };
  });

  // Calculate total weight
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);

  // Pick based on weighted random
  let random = Math.random() * totalWeight;
  for (const { item, weight } of weighted) {
    random -= weight;
    if (random <= 0) {
      return item;
    }
  }

  // Fallback to last item
  return weighted[weighted.length - 1].item;
}

async function fetchRandomWord(
  category: Category,
  difficulty: Difficulty,
  recentWords: Map<string, number>,
  previousWord: string | null,
  gameTime: number
): Promise<WordEntry> {
  try {
    let query = supabase.from('words').select('id, word, category, difficulty');
    query = query.eq('category', category);
    query = query.eq('difficulty', difficulty);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fall back to local word library
      const categoryWords = fallbackWords.filter(w => w.category === category);
      const difficultyWords = getWordsForDifficulty(categoryWords, difficulty);
      return pickWeightedRandom(
        difficultyWords.length > 0 ? difficultyWords : categoryWords,
        recentWords,
        previousWord,
        gameTime
      );
    }

    const typedData = data as WordEntry[];
    return pickWeightedRandom(typedData, recentWords, previousWord, gameTime);
  } catch {
    // Fall back to local word library
    const categoryWords = fallbackWords.filter(w => w.category === category);
    const difficultyWords = getWordsForDifficulty(categoryWords, difficulty);
    return pickWeightedRandom(
      difficultyWords.length > 0 ? difficultyWords : categoryWords,
      recentWords,
      previousWord,
      gameTime
    );
  }
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

  // Track recent words with timestamps - persists across sessions
  const recentWordsRef = useRef<Map<string, number>>(getRecentWords());
  // Track previous word to never repeat immediately
  const previousWordRef = useRef<string | null>(null);
  // Game counter for weighted selection
  const gameCounterRef = useRef(0);

  const startNewGame = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    // Get the previous word before we start a new one
    const previousWord = previousWordRef.current;
    const gameTime = gameCounterRef.current;

    const entry = await fetchRandomWord(
      selectedCategory,
      selectedDifficulty,
      recentWordsRef.current,
      previousWord,
      gameTime
    );

    // Update game counter
    gameCounterRef.current += 1;

    // Update the recent words map with new timestamp
    const wordUpper = entry.word.toUpperCase();
    recentWordsRef.current.set(wordUpper, gameTime);
    saveRecentWords(recentWordsRef.current);

    // Store as previous word for next game
    previousWordRef.current = wordUpper;

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
