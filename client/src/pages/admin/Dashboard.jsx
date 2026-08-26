import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Logo from '../../components/Logo';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
      waitTime: '14 min',
    },
    {
      id: 2,
      ticketNumber: 'A-044',
      name: 'David Okafor',
      studentId: '44102',
      serviceType: 'Legalisir Ijazah & Transkrip',
      waitTime: '8 min',
    },
    {
      id: 3,
      ticketNumber: 'A-045',
      name: 'Elena Rostova',
      studentId: '11093',
      serviceType: 'Surat Keterangan Mahasiswa Aktif',
      waitTime: '3 min',
    },
  ]);

  const handleCallNext = () => {
    if (queueList.length > 0) {
      const nextStudent = queueList[0];
      setCurrentServing({
        ticketNumber: nextStudent.ticketNumber,
        studentName: nextStudent.name,
        studentId: nextStudent.studentId,
        serviceType: nextStudent.serviceType,
        note: 'Antrean virtual mahasiswa melalui sistem CampusQueue.',
        duration: '00:01',
      });
      setQueueList((prev) => prev.slice(1));
    }
  };

  const handleComplete = () => {};
  const handleSkip = () => {
    handleCallNext();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-black dark:text-white font-sans flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar (macOS System Settings style) */}
      <aside className="w-full md:w-64 bg-white/50 dark:bg-white/5 border-r border-black/5 dark:border-white/10 flex flex-col flex-shrink-0 backdrop-blur-3xl">
        <div className="h-14 px-4 flex items-center gap-2 border-b border-black/5 dark:border-white/10">
          <Logo className="w-5 h-5" iconClassName="w-3 h-3" />
          <span className="font-semibold text-sm tracking-tight text-black/80 dark:text-white/80">
            Admin Console
          </span>
        </div>
        
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="text-[10px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider px-2 mb-2">Counters</div>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium transition-colors">
            <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
            Counter 01
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium transition-colors">
            <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
            Counter 02
          </button>
        </div>

        <div className="p-3 border-t border-black/5 dark:border-white/10 flex flex-col gap-1">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg">
            <span className="text-xs font-medium text-black/60 dark:text-white/60">Appearance</span>
            <ThemeToggle />
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-medium transition-colors">
            <span className="material-symbols-outlined text-[14px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-black/5 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-black/90 dark:text-white/90">Counter 01: Administrasi Akademik</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Online
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
            <span className="material-symbols-outlined text-[14px]">person</span>
            Drs. Ahmad Fauzi
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-[500px]">
            {/* Left Panel: Active Serving (1 col) */}
            <div className="xl:col-span-1 flex flex-col gap-4">
              <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
                <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 bg-black/2 dark:bg-white/2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">Now Serving</span>
                  <span className="font-mono text-xs text-blue-600 dark:text-blue-500">{currentServing.duration}</span>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-center items-center text-center">
                  <div className="font-mono text-5xl font-semibold tracking-tight text-blue-600 dark:text-blue-500 mb-4">
                    {currentServing.ticketNumber}
                  </div>
                  <h2 className="text-sm font-semibold text-black dark:text-white mb-1">{currentServing.studentName}</h2>
                  <p className="text-xs text-black/50 dark:text-white/50 font-mono mb-4">{currentServing.studentId}</p>
                  
                  <div className="w-full text-left p-3 rounded-lg bg-[#f5f5f7] dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <div className="text-[10px] font-semibold text-black/40 dark:text-white/40 uppercase mb-1">Service Required</div>
                    <div className="text-xs font-medium text-black/80 dark:text-white/80 mb-2">{currentServing.serviceType}</div>
                    <div className="text-[10px] font-semibold text-black/40 dark:text-white/40 uppercase mb-1">Notes</div>
                    <div className="text-xs text-black/60 dark:text-white/60 italic leading-relaxed">"{currentServing.note}"</div>
                  </div>
                </div>

                <div className="p-4 border-t border-black/5 dark:border-white/10 flex flex-col gap-2">
                  <button onClick={handleComplete} className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors">
                    Mark as Complete
                  </button>
                  <button onClick={handleSkip} className="w-full py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/70 dark:text-white/70 text-xs font-medium transition-colors">
                    Skip / No Show
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel: Queue Table (2 cols) */}
            <div className="xl:col-span-2 flex flex-col">
              <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
                <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 bg-black/2 dark:bg-white/2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-black/60 dark:text-white/60">Waiting Queue</span>
                    <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-medium text-black/60 dark:text-white/60">
                      {queueList.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search queue..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 px-2 py-1 text-[11px] rounded bg-white dark:bg-black border border-black/10 dark:border-white/10 focus:outline-none focus:border-blue-500"
                    />
                    <button onClick={handleCallNext} className="px-3 py-1 rounded bg-black dark:bg-white text-white dark:text-black text-[11px] font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">navigate_next</span>
                      Call Next
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto bg-white dark:bg-black">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur border-b border-black/5 dark:border-white/10 z-10">
                      <tr>
                        <th className="px-4 py-2 font-medium text-black/50 dark:text-white/50 w-20">Ticket</th>
                        <th className="px-4 py-2 font-medium text-black/50 dark:text-white/50">Student</th>
                        <th className="px-4 py-2 font-medium text-black/50 dark:text-white/50">Service</th>
                        <th className="px-4 py-2 font-medium text-black/50 dark:text-white/50 w-24">Wait Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                      {queueList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-black/40 dark:text-white/40">No one is waiting in the queue.</td>
                        </tr>
                      ) : (
                        queueList
                          .filter((q) => q.name.toLowerCase().includes(searchQuery.toLowerCase()) || q.studentId.includes(searchQuery))
                          .map((item) => (
                            <tr key={item.id} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors group">
                              <td className="px-4 py-3 font-mono font-medium text-black dark:text-white">{item.ticketNumber}</td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-black/90 dark:text-white/90">{item.name}</div>
                                <div className="text-[10px] text-black/40 dark:text-white/40 font-mono mt-0.5">{item.studentId}</div>
                              </td>
                              <td className="px-4 py-3 text-black/70 dark:text-white/70 truncate">{item.serviceType}</td>
                              <td className="px-4 py-3 text-black/60 dark:text-white/60">{item.waitTime}</td>
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
      </main>
    </div>
  );
}
