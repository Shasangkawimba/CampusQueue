import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const SERVICES = [
  {
    id: 1,
    code: 'A',
    counterNumber: 'Loket 01',
    name: 'Administrasi Akademik',
    desc: 'Legalisir ijazah, surat aktif kuliah, cuti semester, dan pengurusan revisi KRS.',
    nowServing: 'A-042',
    waitEst: '12 min',
    waitingCount: 4,
    status: 'open',
    icon: 'school',
  },
  {
    id: 2,
    code: 'B',
    counterNumber: 'Loket 02',
    name: 'Keuangan & Pembayaran',
    desc: 'Validasi slip pembayaran semester, dispensasi UKT, dan pencairan beasiswa.',
    nowServing: 'B-118',
    waitEst: '5 min',
    waitingCount: 2,
    status: 'open',
    icon: 'payments',
  },
  {
    id: 3,
    code: 'C',
    counterNumber: 'Loket 03',
    name: 'Admisi & Registrasi',
    desc: 'Pendaftaran mahasiswa baru, pencetakan KTM fisik, dan aktivasi akun portal.',
    nowServing: 'C-089',
    waitEst: '20 min',
    waitingCount: 7,
    status: 'open',
    icon: 'how_to_reg',
  },
  {
    id: 4,
    code: 'D',
    counterNumber: 'Loket 04',
    name: 'Konseling Mahasiswa',
    desc: 'Konsultasi beasiswa prestasi, bimbingan akademik, dan konseling mahasiswa.',
    nowServing: '---',
    waitEst: 'Closed',
    waitingCount: 0,
    status: 'closed',
    icon: 'support_agent',
  },
];

const RECENT_CALLS = [
  { ticket: 'A-042', counter: 'Loket 01', time: 'Just now' },
  { ticket: 'B-118', counter: 'Loket 02', time: '3m ago' },
  { ticket: 'C-089', counter: 'Loket 03', time: '6m ago' },
];

export default function TakeQueue() {
  const navigate = useNavigate();

  const handleTakeTicket = (id) => {
    navigate(`/status/${id}`);
  };

  return (
    <div className="min-h-screen font-sans pb-20">
      <header className="sticky top-0 z-50 glass-panel !rounded-none !border-x-0 !border-t-0 border-b border-black/5 dark:border-white/10 mb-8">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
            <Logo />
            <span className="font-semibold text-sm tracking-tight">
              CampusQueue
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-xs font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            >
              Staff Portal
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <section className="pt-12 pb-20 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-black dark:text-white max-w-3xl leading-[1.1]">
            Digital Queueing,<br /> Perfected.
          </h1>
          <p className="text-base md:text-lg text-black/60 dark:text-white/60 max-w-2xl mb-10">
            Get your queue number instantly from your device. Monitor your live position, estimated wait time, and approach the counter exactly when it's your turn.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <button 
              onClick={() => window.scrollTo({ top: document.getElementById('counters').offsetTop - 80, behavior: 'smooth' })}
              className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all active:scale-[0.98] shadow-[0_4px_12px_rgba(0,102,204,0.3)] flex items-center justify-center gap-2"
            >
              Take a Number
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
            </button>
          </div>
          
          <div className="w-full max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 dark:border-white/10 h-[300px] md:h-[420px] bg-black/5 dark:bg-white/5">
            <img 
              src="/campus_hero.jpg" 
              alt="Campus Student Life & Services" 
              className="w-full h-full object-cover" 
              loading="eager"
            />
          </div>
          
          {/* Live Metrics */}
          <div className="glass-panel px-8 py-5 flex flex-col sm:flex-row items-center gap-8 justify-center w-fit border-black/5 dark:border-white/10">
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-3xl font-semibold tracking-tight text-black dark:text-white">5,204</span>
              <span className="text-[11px] font-medium text-black/50 dark:text-white/50 uppercase tracking-wider mt-1">Students Served</span>
            </div>
            <div className="w-px h-10 bg-black/10 dark:bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-3xl font-semibold tracking-tight text-black dark:text-white">8<span className="text-xl text-black/50 dark:text-white/50 font-normal">m</span></span>
              <span className="text-[11px] font-medium text-black/50 dark:text-white/50 uppercase tracking-wider mt-1">Avg Wait Time</span>
            </div>
            <div className="w-px h-10 bg-black/10 dark:bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-3xl font-semibold tracking-tight text-black dark:text-white">99%</span>
              <span className="text-[11px] font-medium text-black/50 dark:text-white/50 uppercase tracking-wider mt-1">Satisfaction</span>
            </div>
          </div>
        </section>

        <div id="counters" className="mb-8 pt-10 border-t border-black/5 dark:border-white/10">
          <h2 className="text-2xl font-semibold tracking-tight mb-2 text-black dark:text-white">Service Counters</h2>
          <p className="text-sm text-black/50 dark:text-white/50 max-w-xl leading-relaxed">
            Select a service below to join the digital queue. Your wait time and ticket number will be generated instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {SERVICES.map((service) => {
            const isOpen = service.status === 'open';

            return (
              <div
                key={service.id}
                className={`glass-panel p-6 flex flex-col justify-between transition-transform duration-200 ${
                  isOpen ? 'hover:scale-[1.01] cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={isOpen ? () => handleTakeTicket(service.id) : undefined}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-black/70 dark:text-white/70 text-lg">
                          {service.icon}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-base font-semibold leading-tight">{service.name}</h2>
                        <span className="text-xs font-medium text-black/50 dark:text-white/50">
                          {service.counterNumber}
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                      <span className="h-6 px-2.5 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-semibold flex items-center">
                        Open
                      </span>
                    ) : (
                      <span className="h-6 px-2.5 rounded-full bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50 text-[11px] font-semibold flex items-center">
                        Closed
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-black/40 dark:text-white/40 uppercase tracking-wider mb-0.5">Now Serving</span>
                    <span className="font-mono text-sm font-semibold">{service.nowServing}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-medium text-black/40 dark:text-white/40 uppercase tracking-wider mb-0.5">Wait Time</span>
                    <span className="text-sm font-medium">
                      {isOpen ? `${service.waitingCount} ahead (~${service.waitEst})` : '---'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5 md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Live Activity
            </h3>
            <div className="space-y-1">
              {RECENT_CALLS.map((call, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium w-12">{call.ticket}</span>
                    <span className="text-sm text-black/70 dark:text-white/70">Called to {call.counter}</span>
                  </div>
                  <span className="text-xs text-black/40 dark:text-white/40">{call.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50 mb-4">
                Guidelines
              </h3>
              <ul className="text-sm text-black/60 dark:text-white/60 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 text-xs">●</span>
                  Keep this page open to track your live position.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 text-xs">●</span>
                  Approach the counter when 1 person is ahead.
                </li>
              </ul>
            </div>
            <div className="text-[10px] text-black/40 dark:text-white/40 mt-6 pt-4 border-t border-black/5 dark:border-white/10">
              Rectorate Building, Floor 1
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
