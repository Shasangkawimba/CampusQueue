import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs active:scale-95 ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
      } ${className}`}
      title={`Ganti ke tema ${theme === 'dark' ? 'Terang' : 'Gelap'}`}
      aria-label="Toggle Theme"
    >
      <span className="material-symbols-outlined text-[17px] leading-none shrink-0 flex items-center justify-center">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
      <span className="hidden sm:inline">
        {theme === 'dark' ? 'Terang' : 'Gelap'}
      </span>
    </button>
  );
}
