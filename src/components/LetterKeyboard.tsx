interface Props {
  guessedLetters: Set<string>;
  correctLetters: string[];
  onGuess: (letter: string) => void;
  disabled: boolean;
}

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export function LetterKeyboard({ guessedLetters, correctLetters, onGuess, disabled }: Props) {
  const correctSet = new Set(correctLetters);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1.5">
          {row.split('').map(letter => {
            const guessed = guessedLetters.has(letter);
            const correct = correctSet.has(letter);
            const wrong = guessed && !correct;

            let bg = 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200 active:scale-95';
            if (correct) bg = 'bg-emerald-500 border-emerald-600 text-white';
            else if (wrong) bg = 'bg-rose-400 border-rose-500 text-white opacity-60';

            return (
              <button
                key={letter}
                onClick={() => !guessed && !disabled && onGuess(letter)}
                disabled={guessed || disabled}
                className={`
                  w-8 h-10 sm:w-9 sm:h-11 rounded-lg border-2 font-bold text-sm
                  shadow-sm transition-all duration-150 select-none
                  ${bg}
                  ${guessed ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
