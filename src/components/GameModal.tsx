interface Props {
  status: 'won' | 'lost';
  word: string;
  streak: number;
  onPlayAgain: () => void;
}

export function GameModal({ status, word, streak, onPlayAgain }: Props) {
  const won = status === 'won';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-6"
      style={{ background: 'rgba(60, 20, 0, 0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-5 w-full max-w-sm"
        style={{ animation: 'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <div className="text-6xl">{won ? '🎉' : '😢'}</div>

        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-amber-900">
            {won ? 'You saved the bunny!' : 'Oh no!'}
          </h2>
          <p className="text-amber-700 mt-1 text-sm">
            {won
              ? 'The chocolate bunny survives another day!'
              : 'The bunny was completely eaten...'}
          </p>
        </div>

        {!won && (
          <div className="bg-amber-50 rounded-2xl px-6 py-3 text-center">
            <p className="text-xs text-amber-600 uppercase tracking-wider font-semibold">The word was</p>
            <p className="text-2xl font-extrabold text-amber-900 tracking-widest mt-0.5">{word}</p>
          </div>
        )}

        {streak > 1 && won && (
          <div className="bg-emerald-50 rounded-2xl px-6 py-2 text-center">
            <p className="text-emerald-700 font-bold text-sm">
              {streak} win streak!
            </p>
          </div>
        )}

        <button
          onClick={onPlayAgain}
          className="w-full bg-amber-800 hover:bg-amber-700 active:scale-95 text-white font-bold py-3.5 rounded-2xl text-base transition-all duration-150 shadow-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
