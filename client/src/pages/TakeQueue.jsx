import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import AnimatedGrid from '../components/ui/AnimatedGrid';

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

  const handleTakeTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/loket/${id}/take-ticket`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        // Pass the created ticket data to the status page
        navigate(`/status/${id}`, { state: { ticket: data.data } });
      } else {
        const errorData = await response.json();
        alert(`Error taking ticket: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to take ticket');
    }
  };

  return (
    <div className="min-h-screen font-sans pb-20 relative bg-transparent">
      <AnimatedGrid />
      
      <header className="sticky top-0 z-50 bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-xl border-b border-text-light/15 dark:border-text-dark/15 mb-8">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
            <Logo />
            <span className="font-semibold text-sm tracking-tight text-text-light dark:text-text-dark">
              CampusQueue
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/admin/login')}
              className="flex items-center gap-2 h-10 px-3 sm:px-4 rounded-full bg-text-light/5 dark:bg-text-dark/5 hover:bg-text-light/10 dark:hover:bg-text-dark/10 text-xs font-semibold text-text-light dark:text-text-dark transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span className="hidden sm:inline">Admin dashboard</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <section className="pt-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-text-light dark:text-text-dark leading-[1.05]">
                Digital Queueing,<br /> Perfected.
              </h1>
              <p className="text-base md:text-lg text-neutral-500 dark:text-white/60 max-w-lg mb-10 leading-relaxed">
                Get your queue number instantly from your device. Monitor your live position, estimated wait time, and approach the counter exactly when it's your turn.
              </p>
              
              <button 
                onClick={() => window.scrollTo({ top: document.getElementById('counters').offsetTop - 80, behavior: 'smooth' })}
                className="h-12 px-8 rounded-full bg-accent hover:bg-text-light text-white font-medium text-sm transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                Take a Number
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </button>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="w-full aspect-[4/3] rounded-[32px] overflow-hidden bg-text-light/5 dark:bg-text-dark/5 border border-text-light/15 dark:border-slate-700">
                <img 
                  src="/campus_hero.jpg" 
                  alt="Campus Student Life & Services" 
                  className="w-full h-full object-cover grayscale-[20%]" 
                  loading="eager"
                />
              </div>
            </div>
          </div>
          
          {/* Brutalist Flat Bento Grid Live Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0 mb-16 border-t border-l border-text-light/20 dark:border-text-dark/20 shadow-[8px_8px_0px_rgba(11,25,44,0.1)] dark:shadow-[8px_8px_0px_rgba(0,240,255,0.1)]">
            <div className="flex flex-col bg-bg-light dark:bg-bg-dark border-r border-b border-text-light/20 dark:border-text-dark/20 p-6 md:p-8 transition-colors">
              <span className="text-[10px] md:text-[11px] font-bold text-neutral-500 dark:text-white/60 uppercase tracking-[0.2em] mb-6 md:mb-8">
                Students Served
              </span>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter text-accent dark:text-accent-dark mt-auto truncate">
                5,204
              </span>
            </div>
            
            <div className="flex flex-col bg-bg-light dark:bg-bg-dark border-r border-b border-text-light/20 dark:border-text-dark/20 p-6 md:p-8 transition-colors">
              <span className="text-[10px] md:text-[11px] font-bold text-neutral-500 dark:text-white/60 uppercase tracking-[0.2em] mb-6 md:mb-8">
                Avg Wait Time
              </span>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter text-text-light dark:text-text-dark mt-auto truncate">
                8<span className="text-2xl lg:text-4xl text-text-muted-light dark:text-text-dark/40 ml-1 font-light">min</span>
              </span>
            </div>
            
            <div className="flex flex-col bg-bg-light dark:bg-bg-dark border-r border-b border-text-light/20 dark:border-text-dark/20 p-6 md:p-8 transition-colors col-span-2 md:col-span-1 relative overflow-hidden group">
              <span className="text-[10px] md:text-[11px] font-bold text-neutral-500 dark:text-white/60 uppercase tracking-[0.2em] mb-6 md:mb-8 relative z-10">
                Satisfaction
              </span>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter text-accent dark:text-accent-dark mt-auto truncate relative z-10">
                99%
              </span>
              {/* Subtle background graphic for the last card to make it pop */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-accent/5 dark:bg-accent-dark/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors"></div>
            </div>
          </div>
        </section>

        <div id="counters" className="mb-8 pt-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2 text-text-light dark:text-text-dark">Service Counters</h2>
            <p className="text-sm text-text-dark/50 dark:text-text-muted-dark max-w-xl leading-relaxed">
              Select a service below to join the digital queue.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {SERVICES.map((service) => {
            const isOpen = service.status === 'open';

            return (
              <div
                key={service.id}
                onClick={isOpen ? () => handleTakeTicket(service.id) : undefined}
                className={`bg-bg-light dark:bg-bg-dark border border-text-light/15 dark:border-text-dark/15 rounded-none flex flex-col transition-colors ${
                  isOpen ? 'hover:bg-bg-light dark:hover:bg-text-dark/10 cursor-pointer shadow-[4px_4px_0px_rgba(11,25,44,0.1)] dark:shadow-[4px_4px_0px_rgba(0,240,255,0.1)] hover:shadow-[6px_6px_0px_rgba(11,25,44,0.15)] dark:hover:shadow-[6px_6px_0px_rgba(0,240,255,0.15)] hover:-translate-y-0.5 hover:-translate-x-0.5' : 'opacity-40 grayscale select-none cursor-not-allowed'
                }`}
              >
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-none bg-text-light/5 dark:bg-text-dark/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-text-light/80 dark:text-text-dark/70 text-[20px]">
                          {service.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight text-text-light dark:text-text-dark leading-tight mb-0.5">{service.name}</h3>
                        <span className="text-[13px] font-medium text-text-dark/50 dark:text-text-muted-dark">
                          {service.counterNumber}
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                      <div className="px-2 py-1 border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 rounded uppercase text-[10px] font-bold tracking-wider text-indigo-700 dark:text-accent-dark">
                        OPEN
                      </div>
                    ) : (
                      <div className="px-2 py-1 border border-text-light/15 dark:border-slate-700 bg-bg-light dark:bg-text-dark/5/50 rounded uppercase text-[10px] font-bold tracking-wider text-neutral-500 dark:text-white/60">
                        CLOSED
                      </div>
                    )}
                  </div>

                  <p className="text-[15px] text-neutral-500 dark:text-white/60 leading-relaxed mb-10 flex-1">
                    {service.desc}
                  </p>

                  <div className="flex items-end justify-between pt-6 border-t border-slate-100 dark:border-text-dark/15">
                    <div>
                      <div className="text-[10px] font-bold text-neutral-500 dark:text-white/60 uppercase tracking-[0.15em] mb-1">Now Serving</div>
                      <div className="font-mono text-lg font-medium text-text-light dark:text-text-dark">
                        {service.nowServing}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-neutral-500 dark:text-white/60 uppercase tracking-[0.15em] mb-1">Wait Time</div>
                      <div className="text-[15px] font-medium text-neutral-500 dark:text-white/60">
                        {isOpen ? (
                          <>
                            <span className="font-semibold text-text-light dark:text-text-dark">{service.waitingCount}</span> ahead
                            <span className="text-slate-300 dark:text-text-muted-light mx-1.5">/</span>
                            ~{service.waitEst}
                          </>
                        ) : (
                          '---'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* System Log */}
          <div className="lg:col-span-8 flex flex-col">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/60 mb-5">
              System Log
            </h3>
            
            <div className="bg-bg-light dark:bg-bg-dark border border-text-light/15 dark:border-text-dark/15 rounded-none overflow-hidden shadow-[4px_4px_0px_rgba(11,25,44,0.1)] dark:shadow-[4px_4px_0px_rgba(0,240,255,0.1)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-bg-light dark:bg-bg-dark text-[11px] text-neutral-500 dark:text-white/60 font-semibold uppercase tracking-wider border-b border-text-light/15 dark:border-text-dark/15">
                  <tr>
                    <th className="px-6 py-4 w-32">Ticket</th>
                    <th className="px-6 py-4">Destination</th>
                    <th className="px-6 py-4 text-right w-32">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {RECENT_CALLS.map((call, idx) => (
                    <tr key={idx} className="hover:bg-bg-light0 dark:hover:bg-text-dark/5/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-[13px] font-medium text-text-light dark:text-text-dark">
                        {call.ticket}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-medium text-neutral-500 dark:text-white/60">
                        {call.counter}
                      </td>
                      <td className="px-6 py-4 text-right text-[13px] text-neutral-500 dark:text-white/60 font-mono">
                        {call.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Minimalist Guidelines */}
          <div className="lg:col-span-4 flex flex-col">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/60 mb-5">
              Rules
            </h3>
            <div className="bg-text-light/5 dark:bg-bg-dark rounded-none p-6 lg:p-8 h-full flex flex-col justify-between border border-transparent dark:border-text-dark/15">
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="text-neutral-500 dark:text-white/60 font-mono text-xs mt-0.5">01</span>
                  <p className="text-[14px] text-neutral-500 dark:text-white/60 leading-relaxed">
                    Keep your digital ticket open. Leaving the page does not cancel your spot.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="text-neutral-500 dark:text-white/60 font-mono text-xs mt-0.5">02</span>
                  <p className="text-[14px] text-neutral-500 dark:text-white/60 leading-relaxed">
                    Approach the physical counter only when your ticket flashes as <strong className="font-semibold text-text-light dark:text-text-dark">Now Serving</strong>.
                  </p>
                </li>
              </ul>
              
              <div className="mt-8 pt-5 border-t border-text-light/15 dark:border-text-dark/15 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-white/60">
                <span>Rectorate</span>
                <span>Floor 1</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

