import React from 'react';

export const EXCLUSIVE_USER_EMAILS = [
  {
    // === 1. TIER DEWA (DEVELOPER) - LEVEL INFINITY (COMET ORBIT) ===
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
    isDonatur: true // Trigger khusus Sultan
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

// SVG Komponen: Bintang Discord Nitro
const StarSparkle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C12 0 12 9.5 17.5 12C12 14.5 12 24 12 24C12 24 12 14.5 6.5 12C12 9.5 12 0 12 0Z" />
  </svg>
);

// SVG Komponen: Sayap Naga Monokrom — hanya overlay dekoratif untuk Developer
const DragonWing = ({ side = 'left', className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 180 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform={side === 'right' ? 'translate(180 0) scale(-1 1)' : undefined}>
      <path
        d="M166 12C151 6 133 10 118 19C101 29 86 43 73 58C58 75 45 96 29 113C22 121 14 129 6 136C16 128 27 120 36 111C50 97 57 83 60 69C62 57 58 47 52 39C68 44 79 52 86 63C94 76 95 91 91 108C103 93 111 78 113 61C114 48 109 36 101 27C119 34 132 45 139 59C145 72 145 87 142 103C154 88 162 69 164 51C166 37 165 24 166 12Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M154 19C136 26 120 38 106 52C92 67 82 82 75 101"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M124 25C130 40 132 54 128 68C125 80 118 92 108 103"
        stroke="white"
        strokeOpacity="0.13"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M94 31C103 45 108 58 106 72C104 84 99 95 91 108"
        stroke="white"
        strokeOpacity="0.1"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

// SVG Komponen: Naga Kecil — silhouette monokrom yang terbang melewati avatar
const MiniDragon = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 150 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g fill="currentColor">
      {/* sayap */}
      <path d="M61 30C45 5 27 4 10 13C25 17 36 25 44 36C50 32 55 30 61 30Z" />
      <path d="M89 30C105 5 123 4 140 13C125 17 114 25 106 36C100 32 95 30 89 30Z" />
      {/* badan */}
      <path d="M45 35C55 26 73 25 87 34C96 40 101 45 112 44C104 54 93 57 80 52C67 47 56 46 45 50C39 46 39 40 45 35Z" />
      {/* kepala + moncong */}
      <path d="M39 34C32 28 23 31 21 37C27 36 30 39 34 43C40 42 44 39 45 35L39 34Z" />
      <path d="M21 37L13 39L21 42L27 40Z" />
      {/* tanduk */}
      <path d="M31 31L29 21L36 29Z" />
      <path d="M37 29L39 20L43 32Z" />
      {/* ekor */}
      <path d="M82 48C102 56 120 59 136 50C125 65 104 66 84 57L76 52Z" />
      {/* kaki */}
      <path d="M58 47L54 58L60 55L64 62L67 50Z" />
      <path d="M79 49L78 60L84 56L88 62L89 51Z" />
    </g>
    <circle cx="29" cy="36" r="1.8" fill="white" />
  </svg>
);

// SVG Komponen: Koin Emas Sultan (Donatur)
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

  // --- STYLE UNTUK FOTO PROFIL (AVATAR) ---
  if (variant === 'avatar') {
    return (
      <div className="relative inline-block">
        
        {/* === DOUBLE RIPPLE PULSE (KHUSUS DEVELOPER) === */}
        {isDeveloper && (
          <>
            <div className="absolute -inset-1 rounded-full border-[1.5px] border-white/80 animate-[rippleFast_2s_ease-out_infinite] pointer-events-none z-0" />
            <div className="absolute -inset-1 rounded-full border-2 border-slate-300/60 animate-[rippleSlow_2.5s_ease-out_infinite_0.8s] pointer-events-none z-0" />
          </>
        )}

        {/* === WADAH UTAMA === */}
        <div 
          className={`group relative isolate overflow-hidden rounded-full p-[3.5px] 
            ${isDeveloper ? 'bg-transparent animate-[smoothMorph_6s_ease-in-out_infinite]' : ''} 
            ${isDevTeam ? 'bg-transparent' : ''} 
            ${isDonatur ? 'bg-transparent' : ''} 
            ${isRegular ? `bg-gradient-to-br ${preset.accent}` : ''} 
            ${preset.glow} ${className} transition-all duration-300 hover:scale-105 z-10`}
        >
          
          {/* ======================================= */}
          {/* 1. DEVELOPER EFEK (LEVEL INFINITY)      */}
          {/* ======================================= */}
          {isDeveloper && (
            <>
              {/* Liquid Platinum Conic Gradient */}
              <div className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#E5E7EB_15%,#111827_35%,#FFFFFF_50%,#000000_65%,#D1D5DB_85%,#000000_100%)] opacity-100" />
              
              {/* Orbiting Comet (Komet Mengelilingi Border) */}
              <div className="absolute inset-[-4px] animate-[spin_1.5s_linear_infinite] pointer-events-none rounded-full z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_4px_#ffffff] blur-[1px]" />
                {/* Trail/Ekor Komet */}
                <div className="absolute top-0 left-1/2 w-16 h-2 bg-gradient-to-l from-white to-transparent opacity-70 origin-left rounded-full blur-[2px]" />
              </div>

              {/* 3D Reverse Orbiting Ring */}
              <div className="absolute -inset-[3px] rounded-full animate-[spin_5s_linear_infinite_reverse] border-[2px] border-dashed border-white/60 opacity-80 pointer-events-none" />
              <div className="absolute inset-0 bg-white opacity-0 animate-[lightningFlash_4s_steps(2,start)_infinite]" />
              <div className="absolute inset-0 bg-white/30 animate-[pulse_2.5s_ease-in-out_infinite]" />
            </>
          )}

          {/* ======================================= */}
          {/* 2. EFEK DEV TEAM (TURBO ACCELERATION)   */}
          {/* ======================================= */}
          {isDevTeam && (
            <div className="absolute -inset-[150%] animate-[devTeamSpin_3s_cubic-bezier(0.68,-0.55,0.27,1.55)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_20%,#6366F1_50%,#FFFFFF_80%,#38BDF8_100%)] opacity-95" />
          )}

          {/* ======================================= */}
          {/* 3. EFEK DONATUR (SULTAN TIER)           */}
          {/* ======================================= */}
          {isDonatur && (
            <>
              {/* Golden Spin Border yang Elegan & Lambat */}
              <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#F59E0B_0%,#FDE047_25%,#EA580C_50%,#FDE047_75%,#F59E0B_100%)] opacity-100" />
              {/* Golden Shimmer Pulse */}
              <div className="absolute inset-0 bg-yellow-200 opacity-0 animate-[pulse_3s_ease-in-out_infinite]" />
              {/* Inner Glowing Ring */}
              <div className="absolute inset-1 rounded-full border border-yellow-300/50 shadow-[inset_0_0_10px_rgba(253,224,71,0.5)] z-10 pointer-events-none" />
            </>
          )}

          {/* ======================================= */}
          {/* 4. EFEK ROLE REGULAR                    */}
          {/* ======================================= */}
          {isRegular && (
            <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
          )}
          
          {/* === WADAH FOTO PROFIL === */}
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-inner z-20">
            <div className={`w-full h-full ${isDeveloper ? 'animate-[counterSmooth_6s_ease-in-out_infinite]' : ''}`}>
              {children}
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* DRAGON WINGS + MINI DRAGON — DEVELOPER DECORATION ONLY */}
        {/* Tidak mengubah border/effect asli di dalam avatar.      */}
        {/* ====================================================== */}
        {isDeveloper && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-40" aria-hidden="true">
            {/* Sayap kiri: muncul dari luar -> melipat masuk -> menghilang */}
            <DragonWing
              side="left"
              className="absolute left-[-74px] top-1/2 -translate-y-1/2 w-[150px] h-[128px] text-[#111827] drop-shadow-[0_0_8px_rgba(255,255,255,0.28)] animate-[dragonWingLeft_6.2s_cubic-bezier(0.22,0.75,0.25,1)_infinite]"
            />

            {/* Sayap kanan: mirror dari sayap kiri */}
            <DragonWing
              side="right"
              className="absolute right-[-74px] top-1/2 -translate-y-1/2 w-[150px] h-[128px] text-[#111827] drop-shadow-[0_0_8px_rgba(255,255,255,0.28)] animate-[dragonWingRight_6.2s_cubic-bezier(0.22,0.75,0.25,1)_infinite_0.18s]"
            />

            {/* Naga utama: lintasan melengkung melewati foto */}
            <MiniDragon
              className="absolute left-1/2 top-1/2 w-[54px] h-auto text-[#0B0B0C] drop-shadow-[0_0_7px_rgba(255,255,255,0.22)] animate-[dragonFlight_7.5s_cubic-bezier(0.45,0.05,0.25,1)_infinite]"
            />

            {/* Naga kedua lebih kecil, delay agar lintasannya terasa hidup */}
            <MiniDragon
              className="absolute left-1/2 top-1/2 w-[34px] h-auto text-[#2A2A2D] opacity-70 drop-shadow-[0_0_5px_rgba(255,255,255,0.18)] animate-[dragonFlightAlt_9.5s_cubic-bezier(0.45,0.05,0.25,1)_infinite_3.2s]"
            />
          </div>
        )}

        {/* ======================================= */}
        {/* EFEK NITRO STAR SPARKLES (DEVELOPER)    */}
        {/* ======================================= */}
        {isDeveloper && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            <StarSparkle className="absolute -top-3 left-1/4 w-3.5 h-3.5 text-white filter drop-shadow-[0_0_5px_#ffffff] animate-[starFloat_2.5s_ease-in-out_infinite]" />
            <StarSparkle className="absolute top-1/4 -right-3 w-4 h-4 text-slate-100 filter drop-shadow-[0_0_8px_#ffffff] animate-[starFloat_3s_ease-in-out_infinite_0.7s]" />
            <StarSparkle className="absolute -bottom-2 left-1/3 w-3 h-3 text-white filter drop-shadow-[0_0_4px_#ffffff] animate-[starFloat_2s_ease-in-out_infinite_1.4s]" />
            <StarSparkle className="absolute bottom-1/4 -left-3 w-4 h-4 text-zinc-200 filter drop-shadow-[0_0_6px_#ffffff] animate-[starFloat_3.5s_ease-in-out_infinite_0.4s]" />
            <StarSparkle className="absolute top-0 right-1/4 w-2 h-2 text-white filter drop-shadow-[0_0_3px_#ffffff] animate-[starFloat_2.2s_ease-in-out_infinite_1.1s]" />
            <StarSparkle className="absolute bottom-0 right-1/4 w-2.5 h-2.5 text-slate-200 filter drop-shadow-[0_0_5px_#ffffff] animate-[starFloat_2.8s_ease-in-out_infinite_0.9s]" />
          </div>
        )}

        {/* ======================================= */}
        {/* EFEK KOIN EMAS SULTAN (DONATUR)         */}
        {/* ======================================= */}
        {isDonatur && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            {/* Hujan Koin Emas Melayang ke Atas */}
            <GoldenCoin className="absolute -bottom-2 left-1/4 w-4 h-4 filter drop-shadow-[0_0_4px_#F59E0B] animate-[coinRise_3s_ease-in_infinite]" />
            <GoldenCoin className="absolute -bottom-1 right-1/4 w-3 h-3 filter drop-shadow-[0_0_3px_#F59E0B] animate-[coinRise_3.5s_ease-in_infinite_1s]" />
            <GoldenCoin className="absolute top-1/2 -left-3 w-3.5 h-3.5 filter drop-shadow-[0_0_5px_#F59E0B] animate-[coinRise_2.5s_ease-in_infinite_0.5s]" />
            {/* Sparkle Bintang Emas */}
            <StarSparkle className="absolute -top-2 right-1/3 w-3 h-3 text-yellow-300 filter drop-shadow-[0_0_5px_#FDE047] animate-[starFloat_3s_ease-in-out_infinite_0.2s]" />
            <StarSparkle className="absolute bottom-1/3 -right-2 w-2.5 h-2.5 text-yellow-100 filter drop-shadow-[0_0_5px_#FDE047] animate-[starFloat_2.5s_ease-in-out_infinite_1.2s]" />
          </div>
        )}

        {/* === KUMPULAN CSS KEYFRAMES === */}
        <style>{`
          /* =========================================================
             DRAGON DECORATION — Developer only
             Semua ini overlay terpisah; border asli tidak disentuh.
          ========================================================= */

          @keyframes dragonWingLeft {
            0%, 8% {
              opacity: 0;
              transform: translate3d(-34px, -50%, 0) scale(0.58) rotate(-13deg);
              filter: blur(2px);
            }
            18% {
              opacity: 0.96;
              transform: translate3d(-7px, -50%, 0) scale(0.96) rotate(-2deg);
              filter: blur(0);
            }
            34% {
              opacity: 0.9;
              transform: translate3d(5px, -50%, 0) scale(1) rotate(2deg);
            }
            52% {
              opacity: 0.72;
              transform: translate3d(-1px, -50%, 0) scale(0.96) rotate(-2deg);
            }
            68%, 100% {
              opacity: 0;
              transform: translate3d(-42px, -50%, 0) scale(0.58) rotate(-15deg);
              filter: blur(2px);
            }
          }

          @keyframes dragonWingRight {
            0%, 8% {
              opacity: 0;
              transform: translate3d(34px, -50%, 0) scale(0.58) rotate(13deg);
              filter: blur(2px);
            }
            18% {
              opacity: 0.96;
              transform: translate3d(7px, -50%, 0) scale(0.96) rotate(2deg);
              filter: blur(0);
            }
            34% {
              opacity: 0.9;
              transform: translate3d(-5px, -50%, 0) scale(1) rotate(-2deg);
            }
            52% {
              opacity: 0.72;
              transform: translate3d(1px, -50%, 0) scale(0.96) rotate(2deg);
            }
            68%, 100% {
              opacity: 0;
              transform: translate3d(42px, -50%, 0) scale(0.58) rotate(15deg);
              filter: blur(2px);
            }
          }

          @keyframes dragonFlight {
            0% {
              opacity: 0;
              transform: translate3d(-105px, 48px, 0) rotate(-12deg) scale(0.55);
            }
            10% {
              opacity: 0.92;
            }
            28% {
              opacity: 1;
              transform: translate3d(-38px, -42px, 0) rotate(9deg) scale(0.82);
            }
            46% {
              opacity: 1;
              transform: translate3d(10px, 26px, 0) rotate(-7deg) scale(1);
            }
            66% {
              opacity: 0.9;
              transform: translate3d(62px, -30px, 0) rotate(11deg) scale(0.84);
            }
            82% {
              opacity: 0.52;
              transform: translate3d(112px, 42px, 0) rotate(-8deg) scale(0.62);
            }
            100% {
              opacity: 0;
              transform: translate3d(150px, -18px, 0) rotate(4deg) scale(0.42);
            }
          }

          @keyframes dragonFlightAlt {
            0% {
              opacity: 0;
              transform: translate3d(105px, 40px, 0) rotate(14deg) scale(0.5);
            }
            12% {
              opacity: 0.72;
            }
            30% {
              opacity: 0.9;
              transform: translate3d(38px, -35px, 0) rotate(-8deg) scale(0.8);
            }
            52% {
              opacity: 0.8;
              transform: translate3d(-22px, 22px, 0) rotate(8deg) scale(1);
            }
            74% {
              opacity: 0.58;
              transform: translate3d(-72px, -38px, 0) rotate(-12deg) scale(0.76);
            }
            100% {
              opacity: 0;
              transform: translate3d(-142px, 30px, 0) rotate(8deg) scale(0.4);
            }
          }

          /* Ripple Rings (Developer) */
          @keyframes rippleFast {
            0% { transform: scale(1); opacity: 0.8; border-width: 2px; }
            100% { transform: scale(1.35); opacity: 0; border-width: 0px; }
          }
          @keyframes rippleSlow {
            0% { transform: scale(1); opacity: 0.6; border-width: 3px; }
            100% { transform: scale(1.6); opacity: 0; border-width: 0px; }
          }

          /* Morphing Base (Developer) */
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
          
          /* Turbo Spin (Dev Team) */
          @keyframes devTeamSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Lightning (Developer) */
          @keyframes lightningFlash {
            0%, 85%, 89%, 93% { opacity: 0; }
            87%, 91% { opacity: 0.7; }
          }

          /* Bintang Mengambang (Developer & Donatur) */
          @keyframes starFloat {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(0.5) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            50% { transform: translateY(-20px) translateX(8px) scale(1.2) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 10px currentColor); }
            80% { opacity: 0; }
          }

          /* Koin Emas Melayang (Donatur) */
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

  // --- STYLE UNTUK KOTAK (CARD) ---
  return (
    <div className={`group relative isolate overflow-hidden rounded-[28px] border-2 border-white/60 p-[2.5px] ${preset.glow} ${className} transition-all duration-300
      ${isDeveloper || isDevTeam || isDonatur ? 'bg-transparent' : `bg-gradient-to-r ${preset.accent}`}`}
    >
      {/* Background Card Developer */}
      {isDeveloper && (
        <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#E5E7EB_15%,#111827_35%,#FFFFFF_50%,#000000_65%,#D1D5DB_85%,#000000_100%)] opacity-95" />
      )}
      
      {/* Background Card Dev Team */}
      {isDevTeam && (
        <div className="absolute -inset-[150%] animate-[devTeamSpin_3s_cubic-bezier(0.68,-0.55,0.27,1.55)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_20%,#6366F1_50%,#FFFFFF_80%,#38BDF8_100%)] opacity-95" />
      )}

      {/* Background Card Donatur */}
      {isDonatur && (
        <div className="absolute -inset-[150%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#F59E0B_0%,#FDE047_25%,#EA580C_50%,#FDE047_75%,#F59E0B_100%)] opacity-95" />
      )}

      {/* Background Card Reguler */}
      {isRegular && (
        <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
      )}
      
      <div className="relative h-full w-full rounded-[24px] bg-white/90 backdrop-blur-md ring-1 ring-white/50 z-10">
        {children}
      </div>
    </div>
  );
}