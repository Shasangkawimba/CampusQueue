import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/Logo';
import api from '../../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin_a');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-black dark:text-white font-sans flex flex-col items-center justify-center p-6 relative selection:bg-black/10 dark:selection:bg-white/20">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-small opacity-20 pointer-events-none z-0"></div>
      
      {/* Top Nav */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-50">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate('/')}>
          <Logo className="w-5 h-5" iconClassName="w-3 h-3" />
          <span className="font-bold text-sm tracking-tight text-black dark:text-white">
            CampusQueue
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to Public
          </button>
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md p-0.5">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl p-8 relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        
        <div className="text-left mb-8">
          <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-black dark:text-white mb-1">
            Admin Console
          </h1>
          <p className="text-xs text-black/50 dark:text-white/50 font-medium">
            Sign in to manage queues and counters
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs px-3 py-2.5 rounded-lg font-bold text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black/60 dark:text-white/60 uppercase tracking-widest">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-[#fcfcfc] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors"
              placeholder="admin_a"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-black/60 dark:text-white/60 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-[#fcfcfc] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-black dark:bg-white text-white dark:text-black font-bold text-[13px] py-3 px-4 rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <span className="material-symbols-outlined text-[16px]">login</span>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-1 text-center">
          <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">Demo Credentials</p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-xs font-semibold text-black/70 dark:text-white/70 bg-black/5 dark:bg-white/5 px-2 py-1 rounded">admin_a</span>
            <span className="text-black/30 dark:text-white/30">/</span>
            <span className="font-mono text-xs font-semibold text-black/70 dark:text-white/70 bg-black/5 dark:bg-white/5 px-2 py-1 rounded">password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
