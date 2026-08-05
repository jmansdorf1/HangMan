import { useState, useRef, useEffect } from 'react';
import { PawPrint, Apple, PartyPopper, Sprout, Cake, Film, ChevronDown, type LucideIcon } from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Animals: PawPrint,
  Food: Apple,
  Holidays: PartyPopper,
  Spring: Sprout,
  Dessert: Cake,
  Movies: Film,
};

interface Props {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
  disabled?: boolean;
}

export function CategoryDropdown({ categories, value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const CurrentIcon = CATEGORY_ICONS[value] ?? PawPrint;

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        id="category"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Category"
        onClick={() => !disabled && setOpen(o => !o)}
        className="w-full flex items-center gap-2 bg-white bg-opacity-70 border border-amber-200 text-amber-900 text-xs md:text-sm font-semibold rounded-lg md:rounded-xl px-2 md:px-3 py-1 md:py-1.5 shadow-sm cursor-pointer hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CurrentIcon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 text-amber-600" aria-hidden="true" />
        <span className="flex-1 text-left">{value}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 text-amber-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Category"
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg md:rounded-xl shadow-lg border border-amber-200 overflow-hidden py-1"
          style={{ animation: 'dropdownFadeIn 0.15s ease-out' }}
        >
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat] ?? PawPrint;
            const isSelected = cat === value;
            return (
              <li key={cat} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(cat);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold transition-colors duration-100 ${
                    isSelected
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 text-amber-600" aria-hidden="true" />
                  <span className="text-left">{cat}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
