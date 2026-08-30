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
    <div className="h-[100dvh] w-full flex flex-col bg-transparent font-sans relative overflow-hidden transition-colors duration-300 selection:bg-accent/20 dark:selection:bg-accent-dark/30">

      
      {/* Soft spotlight behind the elements for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] lg:w-[60vw] lg:h-[60vw] bg-accent/10 dark:bg-accent-dark/10 rounded-full blur-[100px] pointer-events-none z-0 animate-ambient-float"></div>

      {/* Header Actions (Now in normal document flow to prevent overlaps) */}
      <div className="relative z-50 w-full px-4 sm:px-8 pt-4 sm:pt-6 flex justify-between items-center shrink-0">
        <button
          onClick={() => navigate('/')}
          className="text-[12px] font-bold text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 border border-black/5 dark:bg-white/5 dark:border-white/10 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span className="hidden sm:inline">Back to Public</span>
        </button>
        
        <ThemeToggle />
      </div>

      {/* Main Content Split Container */}
      <div className="relative z-10 w-full flex-1 max-w-5xl mx-auto flex items-center justify-center gap-8 lg:gap-24 px-6 lg:px-12 py-4">
        
        {/* 
          Left Side: Descriptive Hook
          Hidden entirely on mobile to ensure the ticket takes center stage without scrolling.
        */}
        <div className="hidden lg:flex flex-col max-w-[480px] animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <Logo className="w-8 h-8 text-accent dark:text-accent-dark" />
            <span className="text-xl font-extrabold text-text-light dark:text-text-dark tracking-tight">
              CampusQueue
            </span>
          </div>
          <h1 className="text-[2.75rem] font-black text-text-light dark:text-text-dark tracking-tighter leading-[1.1] mb-6">
            Intelligent queue management. <br />
            <span className="text-accent dark:text-accent-dark">Seamless campus services.</span>
          </h1>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark font-medium leading-relaxed">
            The command center for your campus service counters. Streamline the wait, manage the flow, and deliver exceptional experiences.
          </p>
        </div>

        {/* 
          Right Side / Center: The Compact Ticket Form
          Strictly contained to max-w-[340px] and packed tight to ensure zero-scroll on mobile.
        */}
        <div className="w-full max-w-[340px] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          
          {/* Ticket Container */}
          <div className="bg-white dark:bg-[#0C0C0C] rounded-[24px] border border-text-light/10 dark:border-text-dark/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden">
            
            {/* Top Accent Strip */}
            <div className="h-3 w-full bg-accent dark:bg-accent-dark shrink-0"></div>

            {/* Ticket Header Area */}
            <div className="pt-8 pb-4 px-8 text-center bg-white dark:bg-[#0C0C0C]">
              <Logo className="w-8 h-8 text-accent dark:text-accent-dark mx-auto mb-2 lg:hidden" />
              <h2 className="text-2xl font-black text-text-light dark:text-text-dark tracking-tighter">
                Admin Console
              </h2>
              <p className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mt-1">
                Authorized Personnel
              </p>
            </div>

            {/* Perforation Line & Cutouts */}
            <div className="relative h-8 w-full flex items-center justify-center bg-white dark:bg-[#0C0C0C] z-10">
              {/* Left Cutout */}
              <div className="absolute left-[-14px] w-7 h-7 rounded-full bg-bg-light dark:bg-bg-dark border border-text-light/10 dark:border-text-dark/10 shadow-inner z-20"></div>
              
              {/* Dashed Line */}
              <div className="absolute inset-x-6 border-b-2 border-dashed border-text-light/15 dark:border-text-dark/20 z-0"></div>
              
              {/* Right Cutout */}
              <div className="absolute right-[-14px] w-7 h-7 rounded-full bg-bg-light dark:bg-bg-dark border border-text-light/10 dark:border-text-dark/10 shadow-inner z-20"></div>
            </div>

            {/* Form Area */}
            <div className="pt-4 pb-6 px-6 sm:px-8 bg-white dark:bg-[#0C0C0C]">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[12px] px-3 py-2 rounded-xl font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-text-light/70 dark:text-text-dark/70 uppercase tracking-widest pl-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full bg-bg-light dark:bg-bg-dark border border-text-light/10 dark:border-text-dark/10 rounded-xl px-4 py-3 text-[14px] font-bold text-text-light dark:text-text-dark placeholder:text-text-muted-light/40 focus:outline-none focus:border-accent dark:focus:border-accent-dark focus:ring-4 focus:ring-accent/10 dark:focus:ring-accent-dark/20 transition-all shadow-inner"
                    placeholder="admin_a"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-text-light/70 dark:text-text-dark/70 uppercase tracking-widest pl-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-bg-light dark:bg-bg-dark border border-text-light/10 dark:border-text-dark/10 rounded-xl px-4 py-3 text-[14px] font-bold text-text-light dark:text-text-dark placeholder:text-text-muted-light/40 focus:outline-none focus:border-accent dark:focus:border-accent-dark focus:ring-4 focus:ring-accent/10 dark:focus:ring-accent-dark/20 transition-all shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-text-light dark:bg-text-dark text-bg-light dark:text-bg-dark font-black text-[14px] py-3.5 px-4 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] shadow-md flex items-center justify-center disabled:opacity-70"
                >
                  {isLoading ? 'Authenticating...' : 'Validate Ticket'}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center">
                <p className="text-[9px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-2">
                  Demo Access
                </p>
                <div className="flex items-center gap-1.5">
                  <code className="text-[10px] font-mono font-bold text-text-light dark:text-text-dark bg-bg-light dark:bg-bg-dark border border-text-light/5 dark:border-text-dark/5 px-2 py-1 rounded-md">admin_a</code>
                  <code className="text-[10px] font-mono font-bold text-text-light dark:text-text-dark bg-bg-light dark:bg-bg-dark border border-text-light/5 dark:border-text-dark/5 px-2 py-1 rounded-md">password123</code>
                </div>
              </div>
            </div>

            {/* Compact Barcode Footer */}
            <div className="pb-8 pt-2 px-10 flex justify-center w-full opacity-20 dark:opacity-30 bg-white dark:bg-[#0C0C0C]">
              <div className="w-full h-8 flex justify-between gap-[2px]">
                {[3, 1, 4, 1, 2, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1].map((w, i) => (
                  <div key={i} className="bg-text-light dark:bg-text-dark h-full rounded-sm" style={{ width: `${w * 1.5}px` }}></div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
