import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/Logo';
import api from '../../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const [currentServing, setCurrentServing] = useState({
    ticketNumber: 'A-042',
    studentName: 'Michael Chang',
    studentId: '84920',
    serviceType: 'Banding Biaya Kuliah & UKT',
    note: 'Permohonan peninjauan kembali besaran UKT semester genap karena perubahan data penghasilan keluarga.',
    duration: '04:22',
  });

  const [queueList, setQueueList] = useState([
    {
      id: 1,
      ticketNumber: 'A-043',
      name: 'Sarah Jenkins',
      studentId: '99281',
      serviceType: 'Konseling Beasiswa KIP-K',
      waitTime: '14m',
    },
    {
      id: 2,
      ticketNumber: 'A-044',
      name: 'David Okafor',
      studentId: '44102',
      serviceType: 'Legalisir Ijazah & Transkrip',
      waitTime: '8m',
    },
    {
      id: 3,
      ticketNumber: 'A-045',
      name: 'Elena Rostova',
      studentId: '11093',
      serviceType: 'Surat Keterangan Mahasiswa Aktif',
      waitTime: '3m',
    },
    {
      id: 4,
      ticketNumber: 'A-046',
      name: 'Budi Santoso',
      studentId: '22104',
      serviceType: 'Pengambilan KTM Baru',
      waitTime: '1m',
    },
  ]);

  const handleCallNext = async () => {
    try {
      const loketId = 1; // Assuming currently selected loket is 1
      const response = await api.post(`/loket/${loketId}/call-next`);
      const { data } = response.data;
      
      setCurrentServing({
        ticketNumber: `A-0${data.number}`, // Simple format for now
        studentName: 'Student (Virtual)', // Since name is not in queue_tickets table yet
        studentId: '---',
        serviceType: 'Administrasi Akademik',
        note: 'Antrean virtual mahasiswa melalui sistem CampusQueue.',
        duration: '00:00',
      });
      // Removing from list logic to be handled properly with socket.io in phase 4.
      // For now just simulate UI update.
      setQueueList((prev) => prev.slice(1));
    } catch (error) {
      console.error('Failed to call next ticket', error);
      if (error.response?.status === 404) {
        alert('No tickets waiting in queue');
      }
    }
  };

  const handleComplete = () => {};
  const handleSkip = () => {
    handleCallNext();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-black dark:text-white font-sans flex h-screen overflow-hidden selection:bg-black/10 dark:selection:bg-white/20">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Stark Solid Sidebar / Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-[#fcfcfc] dark:bg-[#0a0a0a] border-r border-black/10 dark:border-white/10 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-12 px-4 flex items-center gap-3 border-b border-black/10 dark:border-white/10 relative">
          <Logo className="w-4 h-4" iconClassName="w-2.5 h-2.5" />
          <span className="font-semibold text-sm tracking-tight text-black dark:text-white">
            Admin Console
          </span>
          {/* Close button for mobile */}
          <button 
            className="md:hidden absolute right-3 p-1 rounded-md text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-[0.1em] px-2 mb-2">Service Counters</div>
          
          <div className="flex flex-col gap-0.5">
            {/* Active Counter */}
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
                Counter 01
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </button>
            
            {/* Inactive Counter */}
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-md text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white text-xs font-medium transition-colors">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
                Counter 02
              </div>
            </button>
          </div>
        </div>

        <div className="p-3 border-t border-black/10 dark:border-white/10 flex flex-col gap-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <span className="text-[11px] font-medium text-black/80 dark:text-white/80">Appearance</span>
            <ThemeToggle />
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-between px-3 py-2 rounded-md text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 text-[11px] font-semibold transition-colors">
            Sign Out
            <span className="material-symbols-outlined text-[14px]">logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#111111] relative z-10 w-full min-w-0">
        
        {/* Header */}
        <header className="h-12 px-4 md:px-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-[#fcfcfc] dark:bg-[#0a0a0a] shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-1.5 -ml-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
            <h1 className="text-sm font-bold tracking-tight text-black dark:text-white truncate">Administrasi Akademik</h1>
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-black/60 dark:text-white/60 flex-shrink-0 ml-2">
            <span className="material-symbols-outlined text-[14px] hidden sm:block">person</span>
            <span className="truncate max-w-[100px] sm:max-w-none">Drs. Ahmad Fauzi</span>
          </div>
        </header>

        {/* Dense Content Scroll */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            
            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="p-3 md:p-4 border border-black/10 dark:border-white/10 rounded-xl bg-[#fcfcfc] dark:bg-[#0a0a0a] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Waiting</span>
                <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter">{queueList.length}</span>
              </div>
              <div className="p-3 md:p-4 border border-black/10 dark:border-white/10 rounded-xl bg-[#fcfcfc] dark:bg-[#0a0a0a] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Avg Wait Time</span>
                <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter">06:30</span>
              </div>
              <div className="p-3 md:p-4 border border-black/10 dark:border-white/10 rounded-xl bg-[#fcfcfc] dark:bg-[#0a0a0a] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Total Served</span>
                <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter">42</span>
              </div>
              <div className="p-3 md:p-4 border border-black/10 dark:border-white/10 rounded-xl bg-[#fcfcfc] dark:bg-[#0a0a0a] flex flex-col gap-1">
                <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Session Time</span>
                <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter">02:14:00</span>
              </div>
            </div>
            
            {/* Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Dense Active Serving (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-[#fcfcfc] dark:bg-[#0a0a0a]">
                  <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-black/5 dark:bg-white/5">
                    <span className="text-[11px] font-bold text-black/60 dark:text-white/60 uppercase tracking-wider flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      Active Ticket
                    </span>
                    <span className="font-mono text-xs font-semibold bg-white dark:bg-black px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10">
                      {currentServing.duration}
                    </span>
                  </div>
                  
                  <div className="p-5 flex flex-col gap-4 relative">
                    <div className="absolute inset-0 bg-grid-small opacity-10 pointer-events-none z-0"></div>
                    <div className="relative z-10 flex flex-col gap-1">
                      <div className="font-mono text-5xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                        {currentServing.ticketNumber}
                      </div>
                      <div className="text-sm font-bold text-black dark:text-white">{currentServing.studentName}</div>
                      <div className="text-[11px] font-mono font-medium text-black/60 dark:text-white/60">{currentServing.studentId}</div>
                    </div>
                    
                    <div className="relative z-10 w-full flex flex-col gap-3 p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                      <div>
                        <div className="text-[9px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest mb-0.5">Service</div>
                        <div className="text-xs font-semibold text-black dark:text-white leading-tight">{currentServing.serviceType}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest mb-0.5">Notes</div>
                        <div className="text-[11px] text-black/70 dark:text-white/70 leading-relaxed border-l border-black/20 dark:border-white/20 pl-2">"{currentServing.note}"</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t border-black/10 dark:border-white/10 flex items-center gap-2 bg-black/5 dark:bg-white/5">
                    <button onClick={handleSkip} className="flex-1 py-2 rounded-lg bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white text-[11px] font-bold transition-colors">
                      Skip
                    </button>
                    <button onClick={handleComplete} className="flex-1 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black border border-transparent hover:opacity-90 text-[11px] font-bold transition-colors">
                      Complete
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Dense Queue Table (8 cols) */}
              <div className="lg:col-span-8 flex flex-col h-[400px] lg:h-[500px]">
                <div className="border border-black/10 dark:border-white/10 rounded-xl flex flex-col h-full bg-[#fcfcfc] dark:bg-[#0a0a0a] overflow-hidden">
                  <div className="px-3 md:px-4 py-3 border-b border-black/10 dark:border-white/10 flex flex-wrap gap-2 items-center justify-between bg-black/5 dark:bg-white/5">
                    <h3 className="text-xs font-bold text-black/80 dark:text-white/80 uppercase tracking-wider hidden sm:block">Waiting Queue</h3>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[14px] text-black/40 dark:text-white/40">search</span>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full sm:w-40 pl-7 pr-3 py-1.5 text-[11px] font-medium rounded-md bg-white dark:bg-black border border-black/10 dark:border-white/10 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors"
                        />
                      </div>
                      <button onClick={handleCallNext} className="h-7 px-3 rounded-md bg-black dark:bg-white text-white dark:text-black text-[11px] font-bold hover:opacity-90 transition-opacity flex items-center gap-1 flex-shrink-0">
                        Call Next
                        <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto bg-white dark:bg-[#111111]">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead className="sticky top-0 bg-[#fcfcfc] dark:bg-[#0a0a0a] border-b border-black/10 dark:border-white/10 z-10">
                        <tr>
                          <th className="px-3 md:px-4 py-2 font-bold text-black/40 dark:text-white/40 uppercase tracking-wider w-20 md:w-24">Ticket</th>
                          <th className="px-3 md:px-4 py-2 font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">Student</th>
                          <th className="px-4 py-2 font-bold text-black/40 dark:text-white/40 uppercase tracking-wider hidden sm:table-cell">Service</th>
                          <th className="px-3 md:px-4 py-2 font-bold text-black/40 dark:text-white/40 uppercase tracking-wider text-right w-16 md:w-20">Wait</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/5">
                        {queueList.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-12 text-center">
                              <div className="text-[11px] font-medium text-black/40 dark:text-white/40">Queue is empty</div>
                            </td>
                          </tr>
                        ) : (
                          queueList
                            .filter((q) => q.name.toLowerCase().includes(searchQuery.toLowerCase()) || q.studentId.includes(searchQuery))
                            .map((item, index) => (
                              <tr 
                                key={item.id} 
                                className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${index === 0 ? 'bg-black/[0.02] dark:bg-white/[0.02]' : ''}`}
                              >
                                <td className="px-3 md:px-4 py-3 font-mono font-bold text-black dark:text-white">
                                  <div className="flex items-center gap-1.5 md:gap-2">
                                    {index === 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>}
                                    <span className="truncate">{item.ticketNumber}</span>
                                  </div>
                                </td>
                                <td className="px-3 md:px-4 py-3">
                                  <div className="font-semibold text-black/90 dark:text-white/90 truncate">{item.name}</div>
                                  <div className="text-[10px] font-mono text-black/50 dark:text-white/50">{item.studentId}</div>
                                </td>
                                <td className="px-4 py-3 text-black/70 dark:text-white/70 hidden sm:table-cell max-w-[150px] md:max-w-[200px] truncate">{item.serviceType}</td>
                                <td className={`px-3 md:px-4 py-3 text-right font-mono font-bold ${index === 0 ? 'text-red-600 dark:text-red-400' : 'text-black/60 dark:text-white/60'}`}>
                                  {item.waitTime}
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
            
          </div>
        </div>
      </main>
    </div>
  );
}
