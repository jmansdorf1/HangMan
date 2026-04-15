import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { playChomp } from '../lib/audio';
import { fallbackWords } from '../data/words';
import { GameState, WordEntry } from '../types';

const MAX_WRONG = 8;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchRandomWord(): Promise<WordEntry> {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('id, word, category, difficulty');
    if (error || !data || data.length === 0) return pickRandom(fallbackWords);
    return pickRandom(data as WordEntry[]);
  } catch {
    return pickRandom(fallbackWords);
  }
}

export function useGame() {
  const [state, setState] = useState<GameState>({
    word: '',
    category: '',
    guessedLetters: new Set(),
    wrongGuesses: 0,
    status: 'playing',
    isLoading: true,
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('bunny_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const startNewGame = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    const entry = await fetchRandomWord();
    setState({
      word: entry.word.toUpperCase(),
      category: entry.category,
      guessedLetters: new Set(),
      wrongGuesses: 0,
      status: 'playing',
      isLoading: false,
    });
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

  useEffect(() => {
    if (state.status === 'won') {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('bunny_streak', String(newStreak));
    } else if (state.status === 'lost') {
      setStreak(0);
      localStorage.setItem('bunny_streak', '0');
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
    streak,
    correctLetters,
    wrongLetters,
    guessLetter,
    startNewGame,
    maxWrong: MAX_WRONG,
  };
}
