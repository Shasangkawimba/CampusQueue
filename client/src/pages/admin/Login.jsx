import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin_a');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-black dark:text-white font-sans flex flex-col items-center justify-center p-6 relative">
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-50">
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
          <Logo />
          <span className="font-semibold text-sm tracking-tight text-black/80 dark:text-white/80">
            CampusQueue
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to Public
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="w-full max-w-sm glass-panel p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60 mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-black dark:text-white mb-1">
            Admin Console
          </h1>
          <p className="text-xs text-black/50 dark:text-white/50">
            Sign in to manage queues and counters
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-semibold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-1.5 ml-1">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-black transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              placeholder="admin_a"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-black transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-3 px-4 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,102,204,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Sign In
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/10 text-center">
          <p className="text-[10px] text-black/40 dark:text-white/40">
            Demo credentials: <strong className="font-mono text-black/60 dark:text-white/60 font-medium">admin_a</strong> / <strong className="font-mono text-black/60 dark:text-white/60 font-medium">password123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
