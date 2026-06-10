import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { BunnyCharacter } from './components/BunnyCharacter';
import { WordDisplay } from './components/WordDisplay';
import { LetterKeyboard } from './components/LetterKeyboard';

const MAX_WRONG = 8;
const CATEGORIES = ['Animals', 'Food', 'Space', 'Nature', 'Sports', 'Colors'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [showResult, setShowResult] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const { state, streak, correctLetters, wrongLetters, guessLetter, startNewGame } = useGame(selectedCategory);

  useEffect(() => {
    if (state.status === 'won') {
      setShowWinAnimation(true);
    }
  }, [state.status]);

  const handleWinAnimationComplete = () => {
    setShowWinAnimation(false);
    setShowResult(true);
  };

  const handlePlayAgain = () => {
    setShowResult(false);
    setShowWinAnimation(false);
    startNewGame();
  };

  const handleCategoryChange = (category: string) => {
    if (category !== selectedCategory) {
      setSelectedCategory(category);
      setShowResult(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background: 'linear-gradient(160deg, #FFF5EE 0%, #FFDFC8 60%, #FFD0B0 100%)',
        fontFamily: "'Nunito', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header className="w-full max-w-sm pt-8 pb-2 px-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-extrabold text-amber-900 leading-tight tracking-tight">
              Choco Bunny Hangman
            </h1>
          </div>
          {streak > 0 && (
            <div className="bg-amber-800 text-amber-100 rounded-2xl px-4 py-1.5 flex flex-col items-center shadow-md">
              <span className="text-lg font-extrabold leading-none">{streak}</span>
              <span className="text-xs font-semibold uppercase tracking-wide opacity-80">streak</span>
            </div>
          )}
        </div>

        {/* Category dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="category" className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={state.status !== 'playing' && !showResult}
            className="bg-white bg-opacity-70 border border-amber-200 text-amber-900 text-sm font-semibold rounded-xl px-3 py-1.5 shadow-sm cursor-pointer hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main */}
      <main className="w-full max-w-sm flex-1 flex flex-col gap-4 px-4 pb-8">

        {/* Bunny card */}
        <div
          className="bg-white bg-opacity-80 rounded-3xl shadow-xl p-5 flex flex-col items-center gap-3"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          {/* Wrong guess indicators */}
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_WRONG }).map((_, i) => (
              i < state.wrongGuesses ? (
                <span
                  key={i}
                  className="text-red-500 font-bold text-sm transition-all duration-300"
                  style={{
                    transform: i === state.wrongGuesses - 1 ? 'scale(1.35)' : 'scale(1)',
                  }}
                >
                  ✕
                </span>
              ) : (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: '#FDE8D8',
                  }}
                />
              )
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
            <>
              <BunnyCharacter
                bites={state.wrongGuesses}
                won={state.status === 'won'}
                onGhostAnimationComplete={state.status === 'lost' ? () => setShowResult(true) : undefined}
                onWinAnimationComplete={handleWinAnimationComplete}
              />

              {/* Result overlay */}
              {showResult && (state.status === 'won' || state.status === 'lost') && (
                <div className="bg-white bg-opacity-90 rounded-2xl p-5 text-center backdrop-blur-sm">
                  {state.status === 'won' ? (
                    <>
                      <p className="text-2xl font-extrabold text-amber-900 mb-2">You Won!</p>
                      <p className="text-sm text-amber-700 mb-3">The word was:</p>
                      <p className="text-lg font-bold text-amber-800 mb-4 tracking-widest">{state.word}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-extrabold text-rose-900 mb-2">You Lost!</p>
                      <p className="text-sm text-rose-700 mb-3">The word was:</p>
                      <p className="text-lg font-bold text-rose-800 mb-4 tracking-widest">{state.word}</p>
                    </>
                  )}
                  <button
                    onClick={handlePlayAgain}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white font-bold py-2 px-6 rounded-xl transition-all duration-150 shadow-md"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </>
          )}

        </div>

        {/* Word display */}
        {!state.isLoading && (
          <div className="bg-white bg-opacity-70 rounded-3xl shadow-md p-5">
            <WordDisplay word={state.word} guessedLetters={state.guessedLetters} />
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center min-h-6">
              {wrongLetters.map(l => (
                <span
                  key={l}
                  className="bg-rose-100 text-rose-500 font-bold text-xs rounded-lg px-2 py-0.5 border border-rose-200"
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
    </div>
  );
}
