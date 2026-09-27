import React from 'react';

export const EXCLUSIVE_USER_EMAILS = [
  {
    // === 1. TIER DEWA (DEVELOPER) - LEVEL INFINITY (DARK FLAME TEMPEST) ===
    emails: ['allzxxott@gmail.com', 'allzxxo@gmail.com', 'developer@finclass.id'],
    label: 'DEVELOPER',
    accent: 'from-[#111827] via-[#9CA3AF] to-[#F9FAFB]',
    chip: 'bg-gradient-to-r from-slate-900 via-zinc-700 to-slate-200 text-white border border-white/40 font-black shadow-lg shadow-slate-500/30',
    glow: 'shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.9),0_0_75px_rgba(156,163,175,0.8)]',
    isDeveloper: true
  },
  {
    // === 2. TIM DEVELOPER (DEV TEAM) - TURBO SPIN ===
    emails: ['team@finclass.id', 'staff@finclass.id', 'jancok123@gmail.com', 'ayubganda@gmail.com', 'ayyubrashifpamungkas@gmail.com'],
    label: 'DEV TEAM',
    accent: 'from-[#38BDF8] via-[#818CF8] to-[#6366F1]',
    chip: 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white border border-white/50 font-black shadow-md shadow-blue-500/40',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.8),0_0_20px_rgba(56,189,248,0.8),0_0_45px_rgba(99,102,241,0.6)]',
    isDevTeam: true
  },
  {
    // === 3. DONATUR (SULTAN TIER) - GOLDEN COINS & MAJESTIC SPIN ===
    emails: ['wahyuhanindio@gmail.com'],
    label: 'DONATUR',
    accent: 'from-[#FDE047] via-[#F59E0B] to-[#EA580C]',
    chip: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 text-white border border-white/50 font-black shadow-md shadow-amber-500/40',
    glow: 'shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_25px_rgba(253,224,71,0.8),0_0_50px_rgba(234,88,12,0.6)]',
    isDonatur: true 
  },
  {
    // === 4. EXCLUSIVE ===
    emails: ['aldorendyjulian@gmail.com'],
    label: 'EXCLUSIVE',
    accent: 'from-[#D946EF] via-[#A855F7] to-[#6366F1]',
    chip: 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white border border-white/40 font-bold shadow-md shadow-purple-500/30',
    glow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_0_15px_rgba(217,70,239,0.6),0_0_30px_rgba(99,102,241,0.4)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(217,70,239,0.7),_transparent_35%),linear-gradient(135deg,_rgba(168,85,247,0.3),_rgba(79,70,229,0.3))]'
  }
];

export const normalizeEmail = (email = '') => String(email || '').trim().toLowerCase();

export const getExclusiveUserPreset = (email) => {
  const target = normalizeEmail(email);

  return EXCLUSIVE_USER_EMAILS.find((item) => {
    const allowedEmails = item.emails ? item.emails : [item.email];
    return allowedEmails.some((allowedEmail) => normalizeEmail(allowedEmail) === target);
  }) || null;
};

// ==========================================
// ASSET SVG EKSKLUSIF (BINTANG & KOIN)[cite: 6]
// ==========================================
const StarSparkle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C12 0 12 9.5 17.5 12C12 14.5 12 24 12 24C12 24 12 14.5 6.5 12C12 9.5 12 0 12 0Z" />
  </svg>
);

const GoldenCoin = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="url(#goldGradient)" stroke="#FDE047" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="6" stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" opacity="0.8"/>
    <path d="M12 7V17" stroke="#FDE047" strokeWidth="2" strokeLinecap="round"/>
    <defs>
      <linearGradient id="goldGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#EA580C" />
      </linearGradient>
    </defs>
  </svg>
);


export function ExclusiveProfileShell({ email, className = '', children, variant = 'card' }) {
  const preset = getExclusiveUserPreset(email);

  if (!preset) {
    return (
      <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}>
        {children}
      </div>
    );
  }

  const isDeveloper = preset.isDeveloper;
  const isDevTeam = preset.isDevTeam;
  const isDonatur = preset.isDonatur;
  const isRegular = !isDeveloper && !isDevTeam && !isDonatur;

  if (variant === 'avatar') {
    return (
      <div className="relative inline-block">
        
        {/* ======================================= */}
        {/* EFEK RIPPLE PULSE KHUSUS DEVELOPER[cite: 6] */}
        {/* ======================================= */}
        {isDeveloper && (
          <>
            <div className="absolute -inset-1 rounded-full border-[1.5px] border-white/80 animate-[rippleFast_2s_ease-out_infinite] pointer-events-none z-0" />
            <div className="absolute -inset-1 rounded-full border-2 border-slate-300/60 animate-[rippleSlow_2.5s_ease-out_infinite_0.8s] pointer-events-none z-0" />
          </>
        )}

        {/* ==================================================================== */}
        /* 🔥 EFEK API MONOCHROME (MUNCUL TEPAT DI GARIS BAWAH, MENYEBAR KE KIRI-KANAN-ATAS) */
        /* ==================================================================== */}
        {isDeveloper && (
          <div className="absolute inset-[-2px] pointer-events-none overflow-visible z-[5]">
            {/* Titik Asal: Pangkalan Bawah Profil, Menyebar ke Sisi Kiri */}
            <div className="absolute bottom-1 left-3 w-1.5 h-1.5 bg-black rounded-full shadow-[0_0_5px_rgba(0,0,0,0.9)] animate-[emberSpreadLeft_2.8s_ease-in-out_infinite_0s]" />
            <div className="absolute bottom-0 left-1 w-1 h-1 bg-slate-800 rounded-full animate-[emberSpreadLeft_3.4s_ease-in-out_infinite_1.2s]" />
            <div className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_3px_#fff] animate-[emberSpreadLeft_2.2s_ease-in-out_infinite_0.7s]" />

            {/* Titik Asal: Pas di Tengah Bawah Profil, Naik dan Membelah ke Kiri-Kanan */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full shadow-[0_0_6px_#000] animate-[emberSpreadCenter_3s_ease-in-out_infinite_0.2s]" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-700 rounded-full animate-[emberSpreadCenter_3.6s_ease-in-out_infinite_1.5s]" />

            {/* Titik Asal: Pangkalan Bawah Profil, Menyebar ke Sisi Kanan */}
            <div className="absolute bottom-1 right-3 w-1.5 h-1.5 bg-black rounded-full shadow-[0_0_5px_rgba(0,0,0,0.9)] animate-[emberSpreadRight_3s_ease-in-out_infinite_0.4s]" />
            <div className="absolute bottom-0 right-1 w-1 h-1 bg-slate-800 rounded-full animate-[emberSpreadRight_3.8s_ease-in-out_infinite_1.6s]" />
            <div className="absolute bottom-2 right-4 w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_3px_#fff] animate-[emberSpreadRight_2.5s_ease-in-out_infinite_1s]" />
          </div>
        )}

        {/* === WADAH UTAMA FOTO PROFIL (z-10, DI ATAS ABU API) === */}
        <div 
          className={`group relative isolate overflow-hidden rounded-full p-[3.5px] 
            ${isDeveloper ? 'bg-transparent animate-[smoothMorph_6s_ease-in-out_infinite]' : ''} 
            ${isDevTeam ? 'bg-transparent' : ''} 
            ${isDonatur ? 'bg-transparent' : ''} 
            ${isRegular ? `bg-gradient-to-br ${preset.accent}` : ''} 
            ${preset.glow} ${className} transition-all duration-300 hover:scale-105 z-10`}
        >
          
          {/* Efek Lingkaran Developer[cite: 6] */}
          {isDeveloper && (
            <>
              {/* Spinning Base Gradient */}
              <div className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#E5E7EB_15%,#111827_35%,#FFFFFF_50%,#000000_65%,#D1D5DB_85%,#000000_100%)] opacity-100" />
              
              {/* Orbiting White Comet[cite: 6] */}
              <div className="absolute inset-[-4px] animate-[spin_1.5s_linear_infinite] pointer-events-none rounded-full z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_4px_#ffffff] blur-[1px]" />
                <div className="absolute top-0 left-1/2 w-16 h-2 bg-gradient-to-l from-white to-transparent opacity-70 origin-left rounded-full blur-[2px]" />
              </div>

              <div className="absolute -inset-[3px] rounded-full animate-[spin_5s_linear_infinite_reverse] border-[2px] border-dashed border-white/60 opacity-80 pointer-events-none" />
              <div className="absolute inset-0 bg-white opacity-0 animate-[lightningFlash_4s_steps(2,start)_infinite]" />
              <div className="absolute inset-0 bg-white/30 animate-[pulse_2.5s_ease-in-out_infinite]" />
            </>
          )}

          {/* Efek Dev Team[cite: 6] */}
          {isDevTeam && (
            <div className="absolute -inset-[150%] animate-[devTeamSpin_3s_cubic-bezier(0.68,-0.55,0.27,1.55)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_20%,#6366F1_50%,#FFFFFF_80%,#38BDF8_100%)] opacity-95" />
          )}

          {/* Efek Donatur[cite: 6] */}
          {isDonatur && (
            <>
              <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#F59E0B_0%,#FDE047_25%,#EA580C_50%,#FDE047_75%,#F59E0B_100%)] opacity-100" />
              <div className="absolute inset-0 bg-yellow-200 opacity-0 animate-[pulse_3s_ease-in-out_infinite]" />
              <div className="absolute inset-1 rounded-full border border-yellow-300/50 shadow-[inset_0_0_10px_rgba(253,224,71,0.5)] z-10 pointer-events-none" />
            </>
          )}

          {/* Efek Reguler[cite: 6] */}
          {isRegular && (
            <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
          )}
          
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-inner z-20">
            <div className={`w-full h-full ${isDeveloper ? 'animate-[counterSmooth_6s_ease-in-out_infinite]' : ''}`}>
              {children}
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* BINTANG SPARKLE (DEVELOPER, z-[100])[cite: 6] */}
        {/* ======================================= */}
        {isDeveloper && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-[100]">
            <StarSparkle className="absolute -top-3 left-1/4 w-3.5 h-3.5 text-white filter drop-shadow-[0_0_5px_#ffffff] animate-[starFloat_2.5s_ease-in-out_infinite]" />
            <StarSparkle className="absolute top-1/4 -right-3 w-4 h-4 text-slate-100 filter drop-shadow-[0_0_8px_#ffffff] animate-[starFloat_3s_ease-in-out_infinite_0.7s]" />
            <StarSparkle className="absolute -bottom-2 left-1/3 w-3 h-3 text-white filter drop-shadow-[0_0_4px_#ffffff] animate-[starFloat_2s_ease-in-out_infinite_1.4s]" />
            <StarSparkle className="absolute bottom-1/4 -left-3 w-4 h-4 text-zinc-200 filter drop-shadow-[0_0_6px_#ffffff] animate-[starFloat_3.5s_ease-in-out_infinite_0.4s]" />
          </div>
        )}

        {/* EFEK KOIN EMAS SULTAN (DONATUR)[cite: 6] */}
        {isDonatur && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            <GoldenCoin className="absolute -bottom-2 left-1/4 w-4 h-4 filter drop-shadow-[0_0_4px_#F59E0B] animate-[coinRise_3s_ease-in_infinite]" />
            <GoldenCoin className="absolute -bottom-1 right-1/4 w-3 h-3 filter drop-shadow-[0_0_3px_#F59E0B] animate-[coinRise_3.5s_ease-in_infinite_1s]" />
            <GoldenCoin className="absolute top-1/2 -left-3 w-3.5 h-3.5 filter drop-shadow-[0_0_5px_#F59E0B] animate-[coinRise_2.5s_ease-in_infinite_0.5s]" />
            <StarSparkle className="absolute -top-2 right-1/3 w-3 h-3 text-yellow-300 filter drop-shadow-[0_0_5px_#FDE047] animate-[starFloat_3s_ease-in-out_infinite_0.2s]" />
          </div>
        )}

        {/* === KUMPULAN CSS KEYFRAMES === */}
        <style>{`
          /* ========================================================
             🔥 EFEK EMBER / API MONOCHROME (MENYEBAR DARI BAWAH PROFIL)
             ======================================================== */
          
          @keyframes emberSpreadLeft {
            0% { transform: translate(0px, 0px) scale(0.3); opacity: 0; }
            20% { opacity: 1; transform: translate(-4px, -8px) scale(1.1); }
            60% { opacity: 0.8; transform: translate(-14px, -20px) scale(1.3); }
            100% { transform: translate(-22px, -35px) scale(0.2); opacity: 0; }
          }

          @keyframes emberSpreadCenter {
            0% { transform: translate(0px, 0px) scale(0.4); opacity: 0; }
            25% { opacity: 1; transform: translate(0px, -10px) scale(1.3); }
            65% { opacity: 0.9; transform: translate(0px, -25px) scale(1); }
            100% { transform: translate(0px, -42px) scale(0.2); opacity: 0; }
          }

          @keyframes emberSpreadRight {
            0% { transform: translate(0px, 0px) scale(0.3); opacity: 0; }
            20% { opacity: 1; transform: translate(4px, -8px) scale(1.1); }
            60% { opacity: 0.8; transform: translate(14px, -20px) scale(1.3); }
            100% { transform: translate(22px, -35px) scale(0.2); opacity: 0; }
          }

          /* ========================================================
             BASE ANIMATIONS (UTUH TIDAK DIUBAH)[cite: 6]
             ======================================================== */
          @keyframes rippleFast {
            0% { transform: scale(1); opacity: 0.8; border-width: 2px; }
            100% { transform: scale(1.35); opacity: 0; border-width: 0px; }
          }
          @keyframes rippleSlow {
            0% { transform: scale(1); opacity: 0.6; border-width: 3px; }
            100% { transform: scale(1.6); opacity: 0; border-width: 0px; }
          }
          @keyframes smoothMorph {
            0%, 100% { border-radius: 50%; transform: scale(1); }
            25% { border-radius: 42% 58% 65% 35% / 55% 42% 58% 45%; transform: scale(1.03, 0.97); }
            50% { border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; transform: scale(1); }
            75% { border-radius: 58% 42% 35% 65% / 45% 58% 42% 55%; transform: scale(0.97, 1.03); }
          }
          @keyframes counterSmooth {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(0.97, 1.03); }
            50% { transform: scale(1); }
            75% { transform: scale(1.03, 0.97); }
          }
          @keyframes devTeamSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes lightningFlash {
            0%, 85%, 89%, 93% { opacity: 0; }
            87%, 91% { opacity: 0.7; }
          }
          @keyframes starFloat {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(0.5) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            50% { transform: translateY(-20px) translateX(8px) scale(1.2) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 10px currentColor); }
            80% { opacity: 0; }
          }
          @keyframes coinRise {
            0% { transform: translateY(10px) rotate(0deg) scale(0.5); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(-30px) rotate(360deg) scale(1.1); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // --- STYLE UNTUK KOTAK (CARD)[cite: 6] ---
  return (
    <div className={`group relative isolate overflow-hidden rounded-[28px] border-2 border-white/60 p-[2.5px] ${preset.glow} ${className} transition-all duration-300
      ${isDeveloper || isDevTeam || isDonatur ? 'bg-transparent' : `bg-gradient-to-r ${preset.accent}`}`}
    >
      {isDeveloper && (
        <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#E5E7EB_15%,#111827_35%,#FFFFFF_50%,#000000_65%,#D1D5DB_85%,#000000_100%)] opacity-95" />
      )}
      
      {isDevTeam && (
        <div className="absolute -inset-[150%] animate-[devTeamSpin_3s_cubic-bezier(0.68,-0.55,0.27,1.55)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_20%,#6366F1_50%,#FFFFFF_80%,#38BDF8_100%)] opacity-95" />
      )}

      {isDonatur && (
        <div className="absolute -inset-[150%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#F59E0B_0%,#FDE047_25%,#EA580C_50%,#FDE047_75%,#F59E0B_100%)] opacity-95" />
      )}

      {isRegular && (
        <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
      )}
      
      <div className="relative h-full w-full rounded-[24px] bg-white/90 backdrop-blur-md ring-1 ring-white/50 z-10">
        {children}
      </div>
    </div>
  );
}