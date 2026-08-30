import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/Logo';
import api from '../../api/axios';
import { useQueueSocket } from '../../hooks/useQueueSocket';

// A minimal SVG sparkline component for stats cards
const Sparkline = ({ data, colorClass }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className={`w-full h-8 overflow-visible opacity-40 ${colorClass}`} viewBox="0 -10 100 120" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(1);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [currentServing, setCurrentServing] = useState(null);
  const [queueList, setQueueList] = useState([]);
  const [stats, setStats] = useState({ avgWaitMins: 0, totalServed: 0 }); // Mock stats for now

  // Add socket listener
  const { socketData } = useQueueSocket(selectedCounter);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const fetchAdminStatus = async () => {
    try {
      const response = await api.get(`/loket/${selectedCounter}/admin-status`);
      const { currentlyServing, waitingList } = response.data.data;
      setCurrentServing(currentlyServing);
      setQueueList(waitingList);
    } catch (err) {
      console.error('Failed to fetch admin status:', err);
    }
  };

  useEffect(() => {
    fetchAdminStatus();
  }, [selectedCounter]);

  useEffect(() => {
    if (socketData) {
      // Trigger a re-fetch when socket emits an update to ensure strict consistency
      fetchAdminStatus();
    }
  }, [socketData]);

  const handleCallNext = async () => {
    try {
      await api.post(`/loket/${selectedCounter}/call-next`);
    } catch (error) {
      console.error('Failed to call next ticket', error);
      if (error.response?.status === 404) {
        alert('No tickets waiting in queue');
      }
    }
  };

  const handleComplete = async () => {
    if (!currentServing) return;
    try {
      await api.post(`/loket/${selectedCounter}/ticket/${currentServing.id}/done`);
    } catch (error) {
      console.error('Failed to mark done', error);
    }
  };

  const handleSkip = async () => {
    if (!currentServing) return;
    try {
      await api.post(`/loket/${selectedCounter}/ticket/${currentServing.id}/skip`);
    } catch (error) {
      console.error('Failed to skip', error);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-text-light dark:text-text-dark font-sans flex flex-col selection:bg-accent/20 dark:selection:bg-accent-dark/30 relative">
      
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-bg-light dark:bg-bg-dark border-l border-text-light/10 dark:border-text-dark/10 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-text-light/10 dark:border-text-dark/10 flex items-center justify-between">
          <div className="font-bold text-sm leading-tight">Menu</div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-text-muted-light hover:bg-text-light/5 dark:hover:bg-text-dark/5 transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-6">
          
          {/* Expanded Profile Info (No Dropdown) */}
          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark px-1">
              Officer Profile
            </div>
            <div className="flex items-center gap-3 px-1">
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Ahmad" 
                alt="Profile" 
                className="w-10 h-10 rounded-full bg-text-light/5 dark:bg-text-dark/10 border border-text-light/10 dark:border-text-dark/10 shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold truncate">Drs. Ahmad Fauzi</div>
                <div className="text-[11px] text-text-muted-light dark:text-text-muted-dark">ahmad.fauzi@campus.ac.id</div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-text-light/10 dark:bg-text-dark/10"></div>

          {/* Loket Selector */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark mb-2 px-1">
              Select Counter
            </div>
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => { setSelectedCounter(1); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                  selectedCounter === 1 
                    ? 'bg-text-light/10 dark:bg-text-dark/10 font-bold border border-text-light/15 dark:border-text-dark/15' 
                    : 'hover:bg-text-light/5 dark:hover:bg-text-dark/5 font-medium text-text-muted-light dark:text-text-dark/80 border border-transparent'
                }`}
              >
                <div>
                  <div className="text-sm">Counter 01</div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark/70 font-normal mt-0.5">Academic Administration</div>
                </div>
                {selectedCounter === 1 && <span className="material-symbols-outlined text-[18px]">check</span>}
              </button>

              <button 
                onClick={() => { setSelectedCounter(2); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                  selectedCounter === 2 
                    ? 'bg-text-light/10 dark:bg-text-dark/10 font-bold border border-text-light/15 dark:border-text-dark/15' 
                    : 'hover:bg-text-light/5 dark:hover:bg-text-dark/5 font-medium text-text-muted-light dark:text-text-dark/80 border border-transparent'
                }`}
              >
                <div>
                  <div className="text-sm">Counter 02</div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark/70 font-normal mt-0.5">Finance & Tuition</div>
                </div>
                {selectedCounter === 2 && <span className="material-symbols-outlined text-[18px]">check</span>}
              </button>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-text-light/10 dark:border-text-dark/10">
          <button 
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-lg bg-text-light/5 dark:bg-text-dark/5 hover:bg-text-light/10 dark:hover:bg-text-dark/10 text-text-light dark:text-text-dark text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-text-light/10 dark:border-text-dark/10"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Crafted Top Navigation */}
      <header className="sticky top-0 z-40 bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-xl border-b border-text-light/10 dark:border-text-dark/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-extrabold text-base tracking-tight">
              CampusQueue
            </span>
          </div>

          {/* Right: Theme Toggle, Profile (Desktop), Hamburger (Mobile) */}
          <div className="flex items-center gap-2 md:gap-4">
            
            <ThemeToggle />

            {/* Mobile Hamburger Toggle Button (Right Side) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-text-light dark:text-text-dark hover:bg-text-light/10 dark:hover:bg-text-dark/10 transition-colors flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Desktop User Profile Dropdown */}
            <div className="hidden md:block relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-2 rounded-xl hover:bg-text-light/5 dark:hover:bg-text-dark/5 transition-colors text-left border border-transparent hover:border-text-light/10 dark:hover:border-text-dark/10"
              >
                <img 
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Ahmad" 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full bg-text-light/5 dark:bg-text-dark/10 border border-text-light/10 dark:border-text-dark/10 shadow-sm"
                />
                <span className="text-sm font-semibold tracking-tight">Drs. Ahmad Fauzi</span>
                <span className="material-symbols-outlined text-[16px] text-text-muted-light dark:text-text-muted-dark">
                  {isProfileOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl py-1 z-50 shadow-lg border border-text-light/15 dark:border-text-dark/15">
                    <div className="px-4 py-3 border-b border-text-light/10 dark:border-text-dark/10">
                      <div className="text-sm font-bold">Drs. Ahmad Fauzi</div>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">ahmad.fauzi@campus.ac.id</div>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-text-light/5 dark:hover:bg-text-dark/5 transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 md:py-10 flex flex-col gap-8 relative z-10">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark bg-text-light/5 dark:bg-text-dark/10 px-2.5 py-1 rounded-md border border-text-light/10 dark:border-text-dark/10">
                Counter 01 • Academic Administration
              </span>
            </div>
          </div>
          <div className="text-sm font-mono text-text-muted-light dark:text-text-muted-dark bg-text-light/5 dark:bg-text-dark/5 px-3 py-1.5 rounded-lg border border-text-light/10 dark:border-text-dark/10 hidden md:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Unique Structural Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Card 1: Waiting */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-text-light/15 dark:border-text-dark/15 shadow-sm group">
            <div className="px-5 py-4 border-b border-text-light/10 dark:border-text-dark/10 flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">
                Waiting
              </span>
              <span className="material-symbols-outlined text-[16px] text-text-light/30 dark:text-text-dark/30">people</span>
            </div>
            <div className="px-5 py-6 flex-1 flex flex-col justify-end relative">
              <div className="absolute inset-x-0 bottom-0 px-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <Sparkline data={[5, 8, 4, 12, 9, queueList.length]} colorClass="text-accent dark:text-accent-dark" />
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-5xl font-black tracking-tighter text-text-light dark:text-text-dark">
                  {queueList.length}
                </span>
                <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark">
                  PEOPLE
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Avg Wait Time */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-text-light/15 dark:border-text-dark/15 shadow-sm group">
            <div className="px-5 py-4 border-b border-text-light/10 dark:border-text-dark/10 flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">
                Avg Wait Time
              </span>
              <span className="material-symbols-outlined text-[16px] text-text-light/30 dark:text-text-dark/30">timer</span>
            </div>
            <div className="px-5 py-6 flex-1 flex flex-col justify-end relative">
              <div className="absolute inset-x-0 bottom-0 px-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <Sparkline data={[12, 9, 8, 7, 7, 6]} colorClass="text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-5xl font-black tracking-tighter text-text-light dark:text-text-dark">
                  06
                </span>
                <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark">
                  MINS
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Served */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-text-light/15 dark:border-text-dark/15 shadow-sm group">
            <div className="px-5 py-4 border-b border-text-light/10 dark:border-text-dark/10 flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">
                Total Served
              </span>
              <span className="material-symbols-outlined text-[16px] text-text-light/30 dark:text-text-dark/30">check_circle</span>
            </div>
            <div className="px-5 py-6 flex-1 flex flex-col justify-end relative">
              <div className="absolute inset-x-0 bottom-0 px-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <Sparkline data={[0, 10, 25, 30, 38, 42]} colorClass="text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-5xl font-black tracking-tighter text-text-light dark:text-text-dark">
                  42
                </span>
                <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark">
                  TICKETS
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Session Duration */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-text-light/15 dark:border-text-dark/15 shadow-sm">
            <div className="px-5 py-4 border-b border-text-light/10 dark:border-text-dark/10 flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">
                Session Duration
              </span>
              <span className="material-symbols-outlined text-[16px] text-text-light/30 dark:text-text-dark/30">schedule</span>
            </div>
            <div className="px-5 py-6 flex-1 flex flex-col justify-end">
              <div className="flex items-baseline relative z-10 mt-auto">
                <span className="text-4xl font-black tracking-tighter font-mono text-text-light dark:text-text-dark">
                  02:14
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Split Section: Active Serving (Left) & Queue List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Active Serving Card - Premium Digital Ticket Concept */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-text-light dark:text-text-dark">
              Currently Serving
            </h2>

            {currentServing ? (
              <div className="relative filter drop-shadow-md">
                {/* Ticket Top Half */}
                <div className="bg-bg-light dark:bg-bg-dark border border-text-light/15 dark:border-text-dark/15 rounded-t-2xl p-6 md:p-8 flex flex-col gap-6 ticket-cutout-bottom relative z-10">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-2">
                        Ticket Number
                      </div>
                      <div className="text-6xl md:text-7xl font-black tracking-tighter text-text-light dark:text-text-dark leading-none">
                        A-{currentServing.number.toString().padStart(3, '0')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-1">
                        Called At
                      </div>
                      <div className="font-mono text-sm font-bold text-text-light dark:text-text-dark">
                        {new Date(currentServing.called_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {/* Dashed Tear Line */}
                  <div className="absolute bottom-0 left-4 right-4 h-[2px] border-b-2 border-dashed border-text-light/10 dark:border-text-dark/10"></div>
                </div>

                {/* Ticket Bottom Half */}
                <div className="bg-text-light/5 dark:bg-text-dark/5 border-x border-b border-text-light/15 dark:border-text-dark/15 p-6 flex flex-col gap-5 relative z-0">
                  <div className="text-center text-text-muted-light dark:text-text-muted-dark text-sm">
                    In progress
                  </div>
                  
                  {/* Decorative Barcode */}
                  <div className="mt-2 opacity-30 dark:opacity-40 h-8 flex justify-between items-end gap-[2px] px-2 overflow-hidden">
                    {[...Array(40)].map((_, i) => (
                      <div key={i} className="bg-text-light dark:bg-text-dark" style={{ 
                        width: `${Math.random() > 0.5 ? 2 : 4}px`, 
                        height: `${Math.random() > 0.3 ? 100 : 70}%` 
                      }}></div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex rounded-b-2xl overflow-hidden border-x border-b border-text-light/15 dark:border-text-dark/15 mt-[-1px]">
                  <button 
                    onClick={handleSkip} 
                    className="flex-1 py-4 text-xs font-bold text-text-light dark:text-text-dark hover:bg-text-light/5 dark:hover:bg-text-dark/5 transition-colors border-r border-text-light/10 dark:border-text-dark/10 bg-bg-light dark:bg-bg-dark uppercase tracking-widest"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={handleComplete} 
                    className="flex-1 py-4 text-xs font-bold bg-accent dark:bg-accent-dark text-white dark:text-bg-dark hover:opacity-90 transition-colors uppercase tracking-widest"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel border border-text-light/15 dark:border-text-dark/15 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
                <span className="material-symbols-outlined text-4xl text-text-muted-light/50 dark:text-text-muted-dark/50">inbox</span>
                <div>
                  <h3 className="font-bold text-text-light dark:text-text-dark">No Active Ticket</h3>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">Call the next student to begin.</p>
                </div>
              </div>
            )}
          </div>

          {/* Incoming Queue Table - Minimalist */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-light dark:text-text-dark">
                Queue List
              </h2>
              <button 
                onClick={handleCallNext} 
                className="text-sm font-bold text-accent dark:text-accent-dark hover:opacity-80 transition-opacity"
              >
                Call Next
              </button>
            </div>

            <div className="glass-panel rounded-xl flex flex-col border border-text-light/15 dark:border-text-dark/15 overflow-hidden">
              
              <div className="p-3 border-b border-text-light/10 dark:border-text-dark/10">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-text-muted-light dark:text-text-muted-dark">search</span>
                  <input
                    type="text"
                    placeholder="Search ticket numbers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-text-light/5 dark:bg-text-dark/10 border-transparent focus:border-text-light/20 dark:focus:border-text-dark/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-text-light/5 dark:border-text-dark/5 text-[10px] uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
                      <th className="px-5 py-4 font-bold w-32">Ticket No</th>
                      <th className="px-5 py-4 font-bold">Time Joined</th>
                      <th className="px-5 py-4 font-bold text-right w-24">Wait</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-text-light/5 dark:divide-text-dark/5">
                    {queueList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-5 py-12 text-center text-text-muted-light dark:text-text-muted-dark">
                          No tickets in queue
                        </td>
                      </tr>
                    ) : (
                      queueList
                        .filter((q) => `A-${q.number.toString().padStart(3, '0')}`.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-text-light/5 dark:hover:bg-text-dark/5 transition-colors">
                            <td className="px-5 py-4 font-bold font-mono text-text-light dark:text-text-dark">
                              A-{item.number.toString().padStart(3, '0')}
                            </td>
                            <td className="px-5 py-4 text-sm font-semibold text-text-muted-light dark:text-text-dark/80">
                              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-5 py-4 text-right font-mono font-bold text-xs text-text-muted-light dark:text-text-muted-dark">
                              {Math.floor((new Date() - new Date(item.created_at)) / 60000)}m
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
