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

  const [myStatus, setMyStatus] = useState('waiting'); // waiting, called, done, skipped

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
            peopleAhead: data.peopleAhead,
            estimatedWaitMinutes: data.peopleAhead * (data.avgWaitMinutes || 10)
          }));
        }

        // Also fetch our specific ticket's status to survive page refreshes
        if (myTicket.number && myTicket.number !== '---') {
          const ticketRes = await fetch(`http://localhost:3000/api/loket/${loketId}/ticket-status/${myTicket.number}`);
          if (ticketRes.ok) {
            const ticketData = await ticketRes.json();
            if (ticketData.data && ticketData.data.status) {
              setMyStatus(ticketData.data.status); // will be 'waiting', 'called', 'done', or 'skipped'
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial status', err);
      }
    };
    fetchStatus();
  }, [loketId, myTicket.number]);

  // Update status when socket receives an event
  useEffect(() => {
    if (socketData) {
      if (socketData.status) {
        setTicketState(prev => ({
          ...prev,
          currentlyServing: socketData.status.currentlyServing,
          peopleAhead: socketData.status.peopleAhead,
          estimatedWaitMinutes: socketData.status.peopleAhead * (socketData.status.avgWaitMinutes || 10)
        }));
      }

      // Explicitly convert both to strings to prevent '12' !== 12 issues
      if (socketData.ticket && String(socketData.ticket.number) === String(myTicket.number)) {
        if (socketData.action === 'CALL_NEXT') setMyStatus('called');
        if (socketData.action === 'DONE') setMyStatus('done');
        if (socketData.action === 'SKIP') setMyStatus('skipped');
      }
    }
  }, [socketData, myTicket.number]);

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
          
          {myStatus === 'waiting' && (
            <>
              <h1 className="text-4xl lg:text-5xl font-black text-text-light dark:text-white leading-[1.1] tracking-tight mb-6">
                Your pass is <span className="text-accent dark:text-accent-dark drop-shadow-sm">ready.</span>
              </h1>
              <p className="text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                Monitor your position in real-time. Make sure to stay nearby and approach the counter when your number is called.
              </p>
            </>
          )}

          {myStatus === 'called' && (
            <>
              <h1 className="text-4xl lg:text-5xl font-black text-text-light dark:text-white leading-[1.1] tracking-tight mb-6">
                It's your <span className="text-emerald-500 drop-shadow-sm">turn!</span>
              </h1>
              <p className="text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                Please proceed to the counter immediately. Have your documents ready.
              </p>
            </>
          )}

          {myStatus === 'done' && (
            <>
              <h1 className="text-4xl lg:text-5xl font-black text-text-light dark:text-white leading-[1.1] tracking-tight mb-6">
                You're all <span className="text-emerald-500 drop-shadow-sm">set.</span>
              </h1>
              <p className="text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                Your service has been completed. Thank you for using CampusQueue.
              </p>
            </>
          )}

          {myStatus === 'skipped' && (
            <>
              <h1 className="text-4xl lg:text-5xl font-black text-text-light dark:text-white leading-[1.1] tracking-tight mb-6">
                You were <span className="text-amber-500 drop-shadow-sm">missed.</span>
              </h1>
              <p className="text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                Your number was called but you were not present. Please take a new ticket if you still need assistance.
              </p>
            </>
          )}
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
          <div className={`bg-white dark:bg-[#161616] rounded-[24px] border border-text-light/10 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5 transition-all duration-500 ${
            myStatus === 'called' ? 'dark:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] animate-pulse shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]' : 
            myStatus === 'done' ? 'dark:shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)]' :
            myStatus === 'skipped' ? 'dark:shadow-[0_0_40px_-10px_rgba(245,158,11,0.1)] opacity-80 grayscale-[0.5]' :
            'dark:shadow-[0_0_40px_-10px_rgba(134,59,255,0.15)]'
          }`}>
            {/* Top Accent Strip with subtle gradient */}
            <div className={`h-2 w-full shrink-0 transition-colors duration-500 ${
              myStatus === 'called' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
              myStatus === 'done' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
              myStatus === 'skipped' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
              'bg-gradient-to-r from-accent to-blue-500 dark:from-accent-dark dark:to-blue-400'
            }`}></div>
            
            {/* Ticket Header Area */}
            <div className="pt-5 pb-1 px-5 text-center bg-white dark:bg-[#161616] relative">
              <div className="flex justify-between items-center mb-1">
                <span className={`h-5 px-2.5 rounded-full text-text-light dark:text-white text-[9px] font-bold flex items-center border shadow-inner transition-colors duration-300 ${
                  myStatus === 'called' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                  myStatus === 'done' ? 'bg-emerald-500/5 border-emerald-500/10' :
                  myStatus === 'skipped' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' :
                  'bg-black/5 dark:bg-white/10 border-black/5 dark:border-white/10'
                }`}>
                  {myStatus === 'waiting' && 'Active Pass'}
                  {myStatus === 'called' && 'NOW SERVING!'}
                  {myStatus === 'done' && 'Completed'}
                  {myStatus === 'skipped' && 'Skipped'}
                </span>
                <span className="text-text-muted-light dark:text-text-muted-dark text-[8px] font-bold tracking-widest uppercase">
                  {ticketState.timestamp}
                </span>
              </div>
              
              <div className="flex flex-col items-center mt-3 relative">
                {myStatus === 'skipped' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-amber-500/30 text-amber-500/40 font-black text-2xl tracking-widest uppercase px-3 py-1 rounded-lg pointer-events-none z-10 backdrop-blur-[1px]">
                    MISSED
                  </div>
                )}
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-text-light/50 dark:text-white/40 mb-1">Queue Ticket</span>
                <div className={`font-mono text-4xl font-black tracking-tighter leading-none drop-shadow-sm transition-colors duration-300 ${
                  myStatus === 'called' ? 'text-emerald-600 dark:text-emerald-400 scale-110 my-2' : 
                  myStatus === 'skipped' ? 'text-text-muted-light dark:text-text-muted-dark line-through decoration-amber-500/50' : 
                  'text-text-light dark:text-white'
                }`}>
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
                <h2 className={`text-base font-black tracking-tight mb-0.5 transition-colors duration-300 ${myStatus === 'called' ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-light dark:text-white'}`}>
                  {myStatus === 'called' ? 'Please proceed to' : ''} {ticketState.counterName}
                </h2>
                <p className="text-[10px] font-bold text-text-muted-light dark:text-white/50 uppercase tracking-wide">{ticketState.deskLocation}</p>
              </div>

              {/* Stats Grid or Final Message */}
              {(myStatus === 'waiting' || myStatus === 'called') ? (
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
              ) : (
                <div className="bg-black/[0.02] dark:bg-white/[0.04] rounded-xl p-6 mb-5 border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center relative z-10">
                  {myStatus === 'done' && (
                    <>
                      <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">check_circle</span>
                      <span className="text-xs font-bold text-text-light dark:text-white">Service Completed</span>
                      <span className="text-[10px] text-text-muted-light dark:text-white/50 mt-1">Thank you for using our services.</span>
                    </>
                  )}
                  {myStatus === 'skipped' && (
                    <>
                      <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">error</span>
                      <span className="text-xs font-bold text-text-light dark:text-white">Ticket Expired</span>
                      <span className="text-[10px] text-text-muted-light dark:text-white/50 mt-1">Please take a new number.</span>
                    </>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-1.5 relative z-10">
                {(myStatus === 'waiting') && (
                  <>
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
                  </>
                )}
                {(myStatus === 'done' || myStatus === 'skipped') && (
                  <button
                    onClick={() => navigate('/')}
                    className={`w-full py-2.5 rounded-xl text-white font-black text-[11px] transition-colors shadow-sm ${
                      myStatus === 'done' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                  >
                    Take New Ticket
                  </button>
                )}
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
