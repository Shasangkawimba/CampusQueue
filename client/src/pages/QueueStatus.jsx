import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import { useQueueSocket } from '../hooks/useQueueSocket';

export default function QueueStatus() {
  const { loketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get ticket from navigation state if available, else fallback
  const myTicket = location.state?.ticket || {
    number: '---',
    created_at: new Date().toISOString()
  };

  const [ticketState, setTicketState] = useState({
    ticketNumber: myTicket.number,
    counterName: `Loket ${loketId}`,
    deskLocation: 'Campus Services',
    currentlyServing: '-',
    peopleAhead: 0,
    estimatedWaitMinutes: 0,
    isDelayed: false,
    timestamp: new Date(myTicket.created_at).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
    }),
  });

  const { socketData } = useQueueSocket(loketId);

  // Fetch initial queue status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/loket/${loketId}/status`);
        if (response.ok) {
          const { data } = await response.json();
          setTicketState(prev => ({
            ...prev,
            currentlyServing: data.currentlyServing,
            peopleAhead: data.peopleAhead
          }));
        }
      } catch (err) {
        console.error('Failed to fetch initial status', err);
      }
    };
    fetchStatus();
  }, [loketId]);

  // Update status when socket receives an event
  useEffect(() => {
    if (socketData && socketData.status) {
      setTicketState(prev => ({
        ...prev,
        currentlyServing: socketData.status.currentlyServing,
        peopleAhead: socketData.status.peopleAhead
      }));
    }
  }, [socketData]);

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
    <div className="h-[100dvh] w-full flex flex-col bg-transparent font-sans relative overflow-hidden transition-colors duration-300 selection:bg-accent/20 dark:selection:bg-accent-dark/30">
      
      {/* Soft spotlight behind the elements for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] lg:w-[60vw] lg:h-[60vw] bg-accent/10 dark:bg-accent-dark/15 rounded-full blur-[120px] pointer-events-none z-0 animate-ambient-float"></div>

      {/* Header Actions (Normal document flow prevents overlaps) */}
      <div className="relative z-50 w-full px-4 sm:px-8 pt-3 sm:pt-6 flex justify-between items-center shrink-0">
        <button
          onClick={() => navigate('/')}
          className="text-[12px] font-bold text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 border border-black/5 dark:bg-white/10 dark:border-white/10 shadow-sm backdrop-blur-md"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span className="hidden sm:inline">Back to Services</span>
        </button>
        
        <ThemeToggle />
      </div>

      {/* Main Content Split Container */}
      <div className="relative z-10 w-full flex-1 max-w-5xl mx-auto flex items-center justify-center gap-8 lg:gap-24 px-6 lg:px-12 py-2 lg:py-4">
        
        {/* Left Side: Descriptive Hook (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col max-w-[420px] animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <Logo />
            <span className="text-xl font-extrabold text-text-light dark:text-text-dark tracking-tight">
              CampusQueue
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-text-light dark:text-white leading-[1.1] tracking-tight mb-6">
            Your pass is <span className="text-accent dark:text-accent-dark drop-shadow-sm">ready.</span>
          </h1>
          
          <p className="text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
            Monitor your position in real-time. Make sure to stay nearby and approach the counter when your number is called.
          </p>
        </div>

        {/* Right Side: The Digital Ticket Pass */}
        <div className="w-full max-w-[360px] animate-fade-in-up my-auto" style={{ animationDelay: '100ms' }}>
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex justify-center items-center gap-2 mb-6 lg:hidden">
            <Logo className="w-8 h-8" />
            <span className="text-lg font-extrabold text-text-light dark:text-white tracking-tight">
              CampusQueue
            </span>
          </div>

          {/* Ticket Card */}
          <div className="bg-white dark:bg-[#161616] rounded-[24px] border border-text-light/10 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-10px_rgba(134,59,255,0.15)] flex flex-col relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
            {/* Top Accent Strip with subtle gradient */}
            <div className="h-2 w-full bg-gradient-to-r from-accent to-blue-500 dark:from-accent-dark dark:to-blue-400 shrink-0"></div>
            
            {/* Ticket Header Area */}
            <div className="pt-5 pb-1 px-5 text-center bg-white dark:bg-[#161616] relative">
              <div className="flex justify-between items-center mb-1">
                <span className="h-5 px-2.5 rounded-full bg-black/5 dark:bg-white/10 text-text-light dark:text-white text-[9px] font-bold flex items-center border border-black/5 dark:border-white/10 shadow-inner">
                  Active Pass
                </span>
                <span className="text-text-muted-light dark:text-text-muted-dark text-[8px] font-bold tracking-widest uppercase">
                  {ticketState.timestamp}
                </span>
              </div>
              
              <div className="flex flex-col items-center mt-3">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-text-light/50 dark:text-white/40 mb-1">Queue Ticket</span>
                <div className="font-mono text-4xl font-black text-text-light dark:text-white tracking-tighter leading-none drop-shadow-sm">
                  {ticketState.ticketNumber}
                </div>
              </div>
            </div>

            {/* Perforation Line & Cutouts */}
            <div className="relative h-6 w-full flex items-center justify-center bg-white dark:bg-[#161616] z-10">
              {/* Left Cutout */}
              <div className="absolute left-[-10px] w-5 h-5 rounded-full bg-bg-light dark:bg-bg-dark border border-text-light/10 dark:border-white/10 shadow-inner z-20"></div>
              
              {/* Dashed Line */}
              <div className="absolute inset-x-5 border-b-[2px] border-dashed border-text-light/15 dark:border-white/20 z-0"></div>
              
              {/* Right Cutout */}
              <div className="absolute right-[-10px] w-5 h-5 rounded-full bg-bg-light dark:bg-bg-dark border border-text-light/10 dark:border-white/10 shadow-inner z-20"></div>
            </div>

            {/* Details Section */}
            <div className="pt-2 pb-4 px-5 sm:px-6 bg-white dark:bg-[#161616] relative">
              {/* Subtle inner glow for dark mode */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/[0.02] pointer-events-none"></div>

              <div className="text-center mb-4 relative z-10">
                <h2 className="text-base font-black tracking-tight text-text-light dark:text-white mb-0.5">{ticketState.counterName}</h2>
                <p className="text-[10px] font-bold text-text-muted-light dark:text-white/50 uppercase tracking-wide">{ticketState.deskLocation}</p>
              </div>

              {/* Stats Grid */}
              <div className="bg-black/[0.02] dark:bg-white/[0.04] rounded-xl p-3 mb-5 border border-black/5 dark:border-white/5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] relative z-10 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  <div>
                    <span className="text-[8px] font-extrabold text-text-muted-light dark:text-white/50 uppercase tracking-widest block mb-0.5">Serving</span>
                    <span className="font-mono text-base font-black text-text-light dark:text-white">{ticketState.currentlyServing}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-extrabold text-text-muted-light dark:text-white/50 uppercase tracking-widest block mb-0.5">Ahead</span>
                    <span className="text-base font-black text-text-light dark:text-white">{ticketState.peopleAhead} <span className="text-[10px] font-bold text-text-muted-light dark:text-white/50">people</span></span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-black/5 dark:border-white/10 mt-1">
                    <span className="text-[8px] font-extrabold text-text-muted-light dark:text-white/50 uppercase tracking-widest block mb-0.5">Est. Wait Time</span>
                    <span className="text-lg font-black text-text-light dark:text-white">{ticketState.estimatedWaitMinutes} <span className="text-[10px] font-bold text-text-muted-light dark:text-white/50">min</span></span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 relative z-10">
                <button
                  onClick={handleDelay}
                  className="w-full py-2.5 rounded-xl bg-bg-light dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-text-light dark:text-white border border-black/5 dark:border-white/10 font-black text-[11px] transition-colors shadow-sm"
                >
                  {ticketState.isDelayed ? 'Delayed (+10m)' : 'Need more time? (+10m)'}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full py-2.5 rounded-xl bg-transparent hover:bg-red-50 dark:hover:bg-red-500/5 text-text-muted-light/60 dark:text-white/30 hover:text-red-600 dark:hover:text-red-400 font-bold text-[11px] transition-colors border border-transparent"
                >
                  Cancel Ticket
                </button>
              </div>
            </div>
            
            {/* Compact Barcode Footer */}
            <div className="pb-5 pt-1 px-8 flex justify-center w-full opacity-20 dark:opacity-40 bg-white dark:bg-[#161616]">
              <div className="w-full h-6 flex justify-between gap-[2px]">
                {[3, 1, 4, 1, 2, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1].map((w, i) => (
                  <div key={i} className="bg-text-light dark:bg-white h-full rounded-sm" style={{ width: `${w * 1.5}px` }}></div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
