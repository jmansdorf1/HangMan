import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { BunnyCharacter } from './components/BunnyCharacter';
import { WordDisplay } from './components/WordDisplay';
import { LetterKeyboard } from './components/LetterKeyboard';
import { GameModal } from './components/GameModal';
import { CategorySelector } from './components/CategorySelector';

const MAX_WRONG = 8;
const CATEGORIES = ['Animals', 'Food', 'Space', 'Nature', 'Sports', 'Colors'];

const BITE_LABELS = [
  'Top of ear bitten off!',
  'Full ear gone!',
  'Right arm eaten!',
  'Left arm eaten!',
  'Right leg gone!',
  'Left leg gone!',
  'Body chomped!',
  'Head eaten!',
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [categoryLoading, setCategoryLoading] = useState(false);
  const { state, streak, correctLetters, wrongLetters, guessLetter, startNewGame } = useGame(selectedCategory);
  const [showModal, setShowModal] = useState(false);

  const handleCategorySelect = async (category: string) => {
    setCategoryLoading(true);
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (state.status === 'won') {
      setShowModal(true);
    } else if (state.status === 'lost') {
      setShowModal(false);
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status === 'playing') {
      setShowModal(false);
      setCategoryLoading(false);
    }
  }, [state.status]);

  const handleGhostAnimationComplete = () => {
    setShowModal(true);
  };

  if (!selectedCategory) {
    return (
      <CategorySelector
        categories={CATEGORIES}
        onSelect={handleCategorySelect}
        isLoading={categoryLoading}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background: 'linear-gradient(160deg, #FFF5EE 0%, #FFDFC8 60%, #FFD0B0 100%)',
        fontFamily: "'Nunito', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header className="w-full max-w-sm pt-8 pb-2 px-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-amber-900 leading-tight tracking-tight">
            Choco Bunny
          </h1>
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
            Hangman
          </p>
        </div>
        {streak > 0 && (
          <div className="bg-amber-800 text-amber-100 rounded-2xl px-4 py-1.5 flex flex-col items-center shadow-md">
            <span className="text-lg font-extrabold leading-none">{streak}</span>
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">streak</span>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="w-full max-w-sm flex-1 flex flex-col gap-4 px-4 pb-8">

        {/* Category badge */}
        {!state.isLoading && (
          <div className="flex justify-center">
            <span className="bg-white bg-opacity-70 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
              {state.category}
            </span>
          </div>
        )}

        {/* Bunny card */}
        <div
          className="bg-white bg-opacity-80 rounded-3xl shadow-xl p-5 flex flex-col items-center gap-3"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          {/* Progress bar */}
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(state.wrongGuesses / MAX_WRONG) * 100}%`,
                  background:
                    state.wrongGuesses < 4
                      ? '#10B981'
                      : state.wrongGuesses < 7
                      ? '#F59E0B'
                      : '#EF4444',
                }}
              />
            </div>
            <span className="text-xs font-bold text-amber-700 tabular-nums whitespace-nowrap">
              {state.wrongGuesses}/{MAX_WRONG}
            </span>
          </div>

          {/* Bite dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_WRONG }).map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background: i < state.wrongGuesses ? '#EF4444' : '#FDE8D8',
                  transform: i === state.wrongGuesses - 1 ? 'scale(1.35)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          {/* Bunny */}
          {state.isLoading ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <div
                className="w-10 h-10 rounded-full border-4 border-amber-300 border-t-amber-700"
                style={{ animation: 'spin 0.8s linear infinite' }}
              />
              <p className="text-amber-600 text-sm font-semibold">Finding a word...</p>
            </div>
          ) : (
            <BunnyCharacter
              bites={state.wrongGuesses}
              onGhostAnimationComplete={state.status === 'lost' ? handleGhostAnimationComplete : undefined}
            />
          )}

        </div>

        {/* Word display */}
        {!state.isLoading && (
          <div className="bg-white bg-opacity-70 rounded-3xl shadow-md p-5">
            <WordDisplay word={state.word} guessedLetters={state.guessedLetters} />
            {wrongLetters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {wrongLetters.map(l => (
                  <span
                    key={l}
                    className="bg-rose-100 text-rose-500 font-bold text-xs rounded-lg px-2 py-0.5 border border-rose-200"
                  >
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Keyboard */}
        {!state.isLoading && (
          <div
            className="bg-white bg-opacity-70 rounded-3xl shadow-md p-4"
            style={{ backdropFilter: 'blur(6px)' }}
          >
            <LetterKeyboard
              guessedLetters={state.guessedLetters}
              correctLetters={correctLetters}
              onGuess={guessLetter}
              disabled={state.status !== 'playing'}
            />
          </div>
        )}
      </main>

      {/* Win / Lose modal */}
      {showModal && (state.status === 'won' || state.status === 'lost') && (
        <GameModal
          status={state.status}
          word={state.word}
          streak={streak}
          onPlayAgain={startNewGame}
        />
      )}
    </div>
  );
}
