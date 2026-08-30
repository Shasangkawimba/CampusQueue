import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

export default function QueueStatus() {
  const { loketId } = useParams();
  const navigate = useNavigate();

  const [ticketState, setTicketState] = useState({
    ticketNumber: 'A-042',
    counterName: loketId === '2' ? 'Keuangan & Pembayaran' : 'Administrasi Akademik',
    deskLocation: 'Counter 01, Rectorate Floor 1',
    currentlyServing: 'A-038',
    peopleAhead: 4,
    estimatedWaitMinutes: 12,
    isDelayed: false,
    timestamp: 'Oct 26, 10:24 AM',
  });

  const handleDelay = () => {
    setTicketState((prev) => ({
      ...prev,
      estimatedWaitMinutes: prev.estimatedWaitMinutes + 10,
      isDelayed: true,
    }));
  };

  const handleCancel = () => {
    if (window.confirm('Cancel this queue ticket?')) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen font-sans pb-20 flex flex-col items-center bg-transparent relative">
      <header className="w-full sticky top-0 z-50 glass-panel !rounded-none !border-x-0 !border-t-0 border-b border-text-light/15 dark:border-text-dark/15 mb-8">
        <div className="max-w-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
            <button className="w-6 h-6 rounded-md bg-text-light/5 dark:bg-text-dark/5 flex items-center justify-center text-text-dark/50 dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            <span className="font-medium text-sm tracking-tight text-text-muted-light dark:text-text-dark/70">
              Back to Services
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="w-full max-w-[420px] px-4">
        <div className="glass-panel overflow-hidden relative">
          {/* Top Apple Wallet style pass header */}
          <div className="bg-accent dark:bg-accent-dark p-6 pb-8 rounded-t-[1.5rem] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent dark:from-black/10"></div>
            
            <div className="relative z-10 flex justify-between items-start mb-6">
              <Logo className="w-10 h-10" iconClassName="w-6 h-6" />
              <span className="h-6 px-3 rounded-full bg-bg-light/20 dark:bg-black/20 text-white text-[11px] font-semibold flex items-center backdrop-blur-md">
                Active Pass
              </span>
            </div>

            <div className="relative z-10 text-white">
              <span className="text-[10px] font-medium uppercase tracking-widest opacity-80 block mb-1">Queue Ticket</span>
              <div className="font-mono text-7xl font-bold tracking-tighter leading-none">
                {ticketState.ticketNumber}
              </div>
            </div>
          </div>

          {/* Wallet cutout dots */}
          <div className="flex w-full -mt-2 z-20 relative px-4">
            <div className="w-4 h-4 rounded-full bg-bg-light dark:bg-bg-dark border border-text-light/15 dark:border-text-dark/15 -ml-6 border-l-0 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.05)]"></div>
            <div className="flex-1 border-t-2 border-dashed border-black/10 dark:border-white/20 mx-2 self-center"></div>
            <div className="w-4 h-4 rounded-full bg-bg-light dark:bg-bg-dark border border-text-light/15 dark:border-text-dark/15 -mr-6 border-r-0 shadow-[inset_2px_0_4px_rgba(0,0,0,0.05)]"></div>
          </div>

          {/* Details Section */}
          <div className="p-6 pt-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold tracking-tight mb-1">{ticketState.counterName}</h2>
              <p className="text-sm text-text-dark/50 dark:text-text-muted-dark">{ticketState.deskLocation}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
              <div>
                <span className="text-[10px] font-semibold text-text-dark/50 dark:text-text-muted-dark uppercase tracking-wider block mb-1">Currently Serving</span>
                <span className="font-mono text-xl font-medium">{ticketState.currentlyServing}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-text-dark/50 dark:text-text-muted-dark uppercase tracking-wider block mb-1">People Ahead</span>
                <span className="text-xl font-medium">{ticketState.peopleAhead}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-text-dark/50 dark:text-text-muted-dark uppercase tracking-wider block mb-1">Estimated Wait</span>
                <span className="text-xl font-medium">{ticketState.estimatedWaitMinutes} min</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-text-dark/50 dark:text-text-muted-dark uppercase tracking-wider block mb-1">Issued At</span>
                <span className="text-sm font-medium pt-1 block">{ticketState.timestamp}</span>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="bg-text-light/5 dark:bg-text-dark/5 rounded-xl p-4 mb-8 border border-text-light/15 dark:border-text-dark/15">
              <div className="flex items-center justify-between text-xs">
                <div className="flex flex-col items-center gap-1.5 w-12">
                  <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px]">check</span>
                  </div>
                  <span className="text-[10px] font-medium">Joined</span>
                </div>
                <div className="flex-1 h-0.5 bg-blue-600 dark:bg-blue-500 mx-2 -mt-4"></div>
                <div className="flex flex-col items-center gap-1.5 w-12">
                  <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-600 dark:border-blue-500 animate-ping opacity-50"></div>
                    <span className="text-[10px] font-bold">2</span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-500">Waiting</span>
                </div>
                <div className="flex-1 h-0.5 bg-black/10 dark:bg-bg-light/10 mx-2 -mt-4"></div>
                <div className="flex flex-col items-center gap-1.5 w-12">
                  <div className="w-5 h-5 rounded-full bg-black/10 dark:bg-bg-light/10 text-text-dark/50 dark:text-text-muted-dark flex items-center justify-center">
                    <span className="text-[10px] font-bold">3</span>
                  </div>
                  <span className="text-[10px] font-medium text-text-dark/50 dark:text-text-muted-dark">Called</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelay}
                className="w-full py-3 rounded-xl bg-text-light/5 dark:bg-text-dark/5 hover:bg-text-light/10 dark:hover:bg-text-dark/10 text-text-light dark:text-text-dark font-medium text-sm transition-colors active:scale-[0.98]"
              >
                {ticketState.isDelayed ? 'Delayed (+10m)' : 'Need more time? (+10m)'}
              </button>
              <button
                onClick={handleCancel}
                className="w-full py-3 rounded-xl bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium text-sm transition-colors active:scale-[0.98]"
              >
                Cancel Ticket
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
