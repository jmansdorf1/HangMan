import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { playChomp } from '../lib/audio';
import { fallbackWords, getWordsForDifficulty, CATEGORIES, DIFFICULTIES } from '../data/words';
import { GameState, WordEntry } from '../types';
import type { Category, Difficulty } from '../data/words';

const MAX_WRONG = 8;
const RECENT_WORDS_LIMIT = 20; // Track last 20 words to avoid repeats

// Get recent words from localStorage
function getRecentWords(): string[] {
  try {
    const saved = localStorage.getItem('bunny_recent_words');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save recent words to localStorage
function saveRecentWords(words: string[]): void {
  try {
    localStorage.setItem('bunny_recent_words', JSON.stringify(words.slice(-RECENT_WORDS_LIMIT)));
  } catch {
    // Ignore storage errors
  }
}

// Smart random selection with weighted distribution
// Avoids recent words and distributes picks more evenly
function pickSmartRandom<T extends { word: string }>(arr: T[], recentWords: string[]): T {
  // Filter out recent words
  const eligible = arr.filter(w => !recentWords.includes(w.word.toUpperCase()));

  // If all words are recent, reset and use all
  const pool = eligible.length > 0 ? eligible : arr;

  // Shuffle and pick (Fisher-Yates inspired random selection)
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

async function fetchRandomWord(
  category: Category,
  difficulty: Difficulty,
  recentWords: string[]
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
      return pickSmartRandom(difficultyWords.length > 0 ? difficultyWords : categoryWords, recentWords);
    }

    const typedData = data as WordEntry[];
    const eligible = typedData.filter(w => !recentWords.includes(w.word.toUpperCase()));
    return pickSmartRandom(eligible.length > 0 ? eligible : typedData, recentWords);
  } catch {
    // Fall back to local word library
    const categoryWords = fallbackWords.filter(w => w.category === category);
    const difficultyWords = getWordsForDifficulty(categoryWords, difficulty);
    return pickSmartRandom(difficultyWords.length > 0 ? difficultyWords : categoryWords, recentWords);
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

  // Track if we've already counted a win for the current game
  const winCountedRef = useRef(false);

  const recentWordsRef = useRef<string[]>(getRecentWords());

  const startNewGame = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    const entry = await fetchRandomWord(selectedCategory, selectedDifficulty, recentWordsRef.current);

    // Update recent words list
    const updatedRecent = [...recentWordsRef.current, entry.word.toUpperCase()];
    recentWordsRef.current = updatedRecent.slice(-RECENT_WORDS_LIMIT);
    saveRecentWords(recentWordsRef.current);

    // Reset win counted flag for new game
    winCountedRef.current = false;

    setState({
      word: entry.word.toUpperCase(),
      category: entry.category,
      guessedLetters: new Set(),
      wrongGuesses: 0,
      status: 'playing',
      isLoading: false,
    });
  }, [selectedCategory, selectedDifficulty]);

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
        playChomp();
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

  // Update bunnies saved counter - only once per win
  useEffect(() => {
    if (state.status === 'won' && !winCountedRef.current) {
      winCountedRef.current = true;
      setBunniesSaved(prev => prev + 1);
    }
  }, [state.status]);

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
    maxWrong: MAX_WRONG,
  };
}

// Export constants for use in UI
export { CATEGORIES, DIFFICULTIES };
export type { Category, Difficulty };
