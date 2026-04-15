interface Props {
  word: string;
  guessedLetters: Set<string>;
}

export function WordDisplay({ word, guessedLetters }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-2">
      {word.split('').map((letter, i) => {
        const revealed = guessedLetters.has(letter);
        return (
          <div key={i} className="flex flex-col items-center">
            <span
              className="text-2xl font-bold tracking-wider text-amber-900 h-9 flex items-end pb-0.5"
              style={{
                minWidth: '1.6rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(-6px)',
              }}
            >
              {revealed ? letter : '\u00A0'}
            </span>
            <div className="h-0.5 w-7 rounded-full bg-amber-800 opacity-60" />
          </div>
        );
      })}
    </div>
  );
}
