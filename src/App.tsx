import { useState, useEffect, useCallback } from 'react';
import { useGame, CATEGORIES, DIFFICULTIES } from './hooks/useGame';
import { BunnyCharacter } from './components/BunnyCharacter';
import { WordDisplay } from './components/WordDisplay';
import { LetterKeyboard } from './components/LetterKeyboard';
import { unlockAudio } from './lib/audio';
import type { Category, Difficulty } from './hooks/useGame';

const MAX_WRONG = 8;

// Local storage keys
const STORAGE_CATEGORY = 'bunny_category';
const STORAGE_DIFFICULTY = 'bunny_difficulty';

// Get initial values from localStorage
function getInitialCategory(): Category {
  const saved = localStorage.getItem(STORAGE_CATEGORY);
  if (saved && CATEGORIES.includes(saved as Category)) {
    return saved as Category;
  }
  return CATEGORIES[0];
}

function getInitialDifficulty(): Difficulty {
  const saved = localStorage.getItem(STORAGE_DIFFICULTY);
  if (saved && DIFFICULTIES.includes(saved as Difficulty)) {
    return saved as Difficulty;
  }
  return 'easy';
}

// Difficulty display config
const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; emoji: string }> = {
  easy: { label: 'Easy', emoji: '😊' },
  medium: { label: 'Medium', emoji: '😅' },
  hard: { label: 'Hard', emoji: '😈' },
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(getInitialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(getInitialDifficulty);
  const [showResult, setShowResult] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [celebrateCounter, setCelebrateCounter] = useState(false);

  const { state, bunniesSaved, correctLetters, wrongLetters, guessLetter, startNewGame, incrementBunniesSaved } = useGame(
    selectedCategory,
    selectedDifficulty
  );

  // Wrap guess letter to unlock audio on first interaction
  const handleGuess = useCallback((letter: string) => {
    unlockAudio();
    guessLetter(letter);
  }, [guessLetter]);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_CATEGORY, selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_DIFFICULTY, selectedDifficulty);
  }, [selectedDifficulty]);

  useEffect(() => {
    if (state.status === 'won') {
      setShowWinAnimation(true);
    }
  }, [state.status]);

  const handleWinAnimationComplete = () => {
    setShowWinAnimation(false);
    // Increment counter and trigger celebration animation
    incrementBunniesSaved();
    setCelebrateCounter(true);
    // Show result after celebration animation
    setTimeout(() => {
      setCelebrateCounter(false);
      setShowResult(true);
    }, 500);
  };

  const handlePlayAgain = () => {
    setShowResult(false);
    setShowWinAnimation(false);
    startNewGame();
  };

  const handleCategoryChange = (category: string) => {
    unlockAudio();
    if (category !== selectedCategory && CATEGORIES.includes(category as Category)) {
      setSelectedCategory(category as Category);
      setShowResult(false);
      setShowWinAnimation(false);
    }
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    unlockAudio();
    if (difficulty !== selectedDifficulty) {
      setSelectedDifficulty(difficulty);
      setShowResult(false);
      setShowWinAnimation(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-3 py-4 md:py-6"
      style={{
        background: 'linear-gradient(160deg, #FFF5EE 0%, #FFDFC8 60%, #FFD0B0 100%)',
        fontFamily: "'Nunito', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="pt-1 md:pt-5 pb-1 md:pb-1 px-1 md:px-5">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h1 className="text-xl md:text-2xl font-extrabold text-amber-900 leading-tight tracking-tight">
              Choco Bunny Hangman
            </h1>
            <div
              className="bg-amber-800 text-amber-100 rounded-xl md:rounded-2xl px-3 md:px-4 py-1 md:py-1.5 flex items-center gap-2 shadow-md"
              style={{
                animation: celebrateCounter ? 'counterCelebrate 0.5s ease-out forwards' : 'none',
              }}
            >
              <span className="text-base md:text-lg">🐰</span>
              <div className="flex flex-col items-center">
                <span className="text-base md:text-lg font-extrabold leading-none">{bunniesSaved}</span>
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide opacity-80">saved</span>
              </div>
            </div>
          </div>

          {/* Category dropdown */}
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <label htmlFor="category" className="text-[10px] md:text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Category:
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={state.status !== 'playing' && !showResult}
              className="bg-white bg-opacity-70 border border-amber-200 text-amber-900 text-xs md:text-sm font-semibold rounded-lg md:rounded-xl px-2 md:px-3 py-1 md:py-1.5 shadow-sm cursor-pointer hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty selector - segmented buttons */}
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <span className="text-[10px] md:text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Difficulty:
            </span>
            <div className="flex flex-1 rounded-lg md:rounded-xl overflow-hidden border border-amber-200 bg-white bg-opacity-50">
              {DIFFICULTIES.map((diff) => {
                const config = DIFFICULTY_CONFIG[diff];
                const isSelected = selectedDifficulty === diff;
                const isDisabled = state.status !== 'playing' && !showResult;

                return (
                  <button
                    key={diff}
                    onClick={() => !isDisabled && handleDifficultyChange(diff)}
                    disabled={isDisabled}
                    className={`
                      flex-1 py-1.5 md:py-2 px-2 md:px-3 text-xs md:text-sm font-semibold
                      transition-all duration-150 select-none
                      ${isSelected
                        ? 'bg-amber-500 text-white shadow-inner'
                        : 'bg-transparent text-amber-800 hover:bg-amber-100'
                      }
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      ${diff === 'easy' ? 'rounded-l-lg md:rounded-l-xl' : ''}
                      ${diff === 'hard' ? 'rounded-r-lg md:rounded-r-xl' : ''}
                    `}
                  >
                    <span className="mr-1">{config.emoji}</span>
                    <span className="hidden sm:inline">{config.label}</span>
                    <span className="sm:hidden">{config.label.charAt(0)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result message */}
          {showResult && (state.status === 'won' || state.status === 'lost') && (
            <div className="mt-2 md:mt-3 text-center">
              {state.status === 'won' ? (
                <p className="text-xl md:text-2xl font-extrabold text-amber-900 mb-2 md:mb-4">You Won!</p>
              ) : (
                <>
                  <p className="text-xl md:text-2xl font-extrabold text-rose-900 mb-0.5 md:mb-1">You Lost!</p>
                  <p className="text-xs md:text-sm text-rose-700 mb-0.5 md:mb-1">The word was:</p>
                  <p className="text-base md:text-lg font-bold text-rose-800 mb-2 md:mb-4 tracking-widest">{state.word}</p>
                </>
              )}
              <button
                onClick={handlePlayAgain}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white font-bold py-1.5 md:py-2 px-5 md:px-6 rounded-lg md:rounded-xl transition-all duration-150 shadow-md mb-2 md:mb-4 text-sm md:text-base"
              >
                Play Again
              </button>
            </div>
          )}
        </header>

        {/* Main */}
        <main className="flex flex-col gap-2 md:gap-3 px-1 md:px-4 pb-safe md:pb-4">
          {/* Bunny card */}
          <div
            className="bg-white bg-opacity-80 rounded-2xl md:rounded-3xl p-2 md:p-4 flex flex-col items-center gap-1 md:gap-2"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {/* Wrong guess indicators */}
            <div className="flex gap-1 md:gap-1.5">
              {Array.from({ length: MAX_WRONG }).map((_, i) => (
                i < state.wrongGuesses ? (
                  <div
                    key={i}
                    className="w-2 md:w-2.5 h-2 md:h-2.5 flex items-center justify-center transition-all duration-300"
                    style={{
                      transform: i === state.wrongGuesses - 1 ? 'scale(1.35)' : 'scale(1)',
                    }}
                  >
                    <span className="text-red-500 font-bold leading-none" style={{ fontSize: '6px' }}>
                      X
                    </span>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full transition-all duration-300"
                    style={{
                      background: '#FDE8D8',
                    }}
                  />
                )
              ))}
            </div>

            {/* Bunny */}
            {state.isLoading ? (
              <div className="flex flex-col items-center gap-2 md:gap-3 py-4 md:py-8">
                <div
                  className="w-8 md:w-10 h-8 md:h-10 rounded-full border-3 md:border-4 border-amber-300 border-t-amber-700"
                  style={{ animation: 'spin 0.8s linear infinite' }}
                />
                <p className="text-amber-600 text-xs md:text-sm font-semibold">Finding a word...</p>
              </div>
            ) : (
              <BunnyCharacter
                bites={state.wrongGuesses}
                won={state.status === 'won'}
                onGhostAnimationComplete={state.status === 'lost' ? () => setShowResult(true) : undefined}
                onWinAnimationComplete={handleWinAnimationComplete}
              />
            )}
          </div>

          {/* Word display */}
          {!state.isLoading && (
            <div className="bg-white bg-opacity-70 rounded-2xl md:rounded-3xl p-2 md:p-4">
              <WordDisplay word={state.word} guessedLetters={state.guessedLetters} />
              <div className="mt-2 md:mt-3 flex flex-wrap gap-1 md:gap-1.5 justify-center min-h-5 md:min-h-6">
                {wrongLetters.map(l => (
                  <span
                    key={l}
                    className="bg-rose-100 text-rose-500 font-bold text-[10px] md:text-xs rounded px-1.5 md:px-2 py-0 md:py-0.5 border border-rose-200"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard */}
          {!state.isLoading && (
            <div
              className="bg-white bg-opacity-70 rounded-2xl md:rounded-3xl p-2 md:p-3"
              style={{ backdropFilter: 'blur(6px)' }}
            >
              <LetterKeyboard
                guessedLetters={state.guessedLetters}
                correctLetters={correctLetters}
                onGuess={handleGuess}
                disabled={state.status !== 'playing'}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
