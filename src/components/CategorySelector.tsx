interface Props {
  categories: string[];
  onSelect: (category: string) => void;
  isLoading?: boolean;
}

export function CategorySelector({ categories, onSelect, isLoading }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-6"
      style={{ background: 'linear-gradient(160deg, #FFF5EE 0%, #FFDFC8 60%, #FFD0B0 100%)' }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-amber-900 leading-tight">
            Choco Bunny
          </h1>
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mt-1">
            Hangman
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-amber-800 mb-2">Pick a Category</h2>
          <p className="text-sm text-amber-600">Choose your word list to save the bunny!</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onSelect(category)}
              disabled={isLoading}
              className="bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-amber-900 font-bold py-3 px-4 rounded-2xl text-sm transition-all duration-150 shadow-md border border-amber-200"
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border-4 border-amber-300 border-t-amber-700"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
            <p className="text-amber-600 text-xs font-semibold">Loading category...</p>
          </div>
        )}
      </div>
    </div>
  );
}
