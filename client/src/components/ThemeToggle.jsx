import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer overflow-hidden ${
        isDark
          ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
          : 'bg-black/5 border border-black/5 hover:bg-black/10 text-black shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]'
      } ${className}`}
      aria-label="Toggle Theme"
    >
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
        <span className="material-symbols-outlined text-[20px] leading-none">
          dark_mode
        </span>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
        <span className="material-symbols-outlined text-[20px] leading-none">
          light_mode
        </span>
      </div>
    </button>
  );
}
