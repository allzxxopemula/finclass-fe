import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDragon } from '@fortawesome/free-solid-svg-icons';

export const EXCLUSIVE_USER_EMAILS = [
  {
    // === 1. TIER DEWA (DEVELOPER) - SUPREME DRAGON LEVEL ===
    emails: ['allzxxott@gmail.com', 'allzxxo@gmail.com', 'developer@finclass.id'],
    label: 'DEVELOPER',
    // Tema Naga Kosmik (Obsidian, Cyan, Indigo)
    accent: 'from-[#083344] via-[#06b6d4] to-[#312e81]',
    chip: 'bg-gradient-to-r from-slate-900 via-cyan-900 to-indigo-950 text-cyan-300 border border-cyan-400/50 font-black shadow-lg shadow-cyan-500/50',
    glow: 'shadow-[0_0_0_2px_rgba(34,211,238,0.8),0_0_30px_rgba(34,211,238,0.6),0_0_75px_rgba(99,102,241,0.8)]',
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
    // === 3. DONATUR (SULTAN TIER) - GOLDEN COINS ===
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

// =======================================================
// SVG KOMPONEN: BINTANG NITRO & KOIN
// =======================================================
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

// =======================================================
// SVG KOMPONEN: SAYAP NAGA (DRAGON WING)
// =======================================================
const DragonWing = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Engsel sayap ada di koordinat Kanan Tengah (M100,50), menjuntai ke kiri */}
    <path 
      d="M100,50 Q80,15 20,5 C40,30 35,45 10,55 C35,60 40,75 20,95 C50,85 75,85 100,50 Z" 
      fill="url(#dragonWingGradient)" 
      stroke="#22D3EE" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    {/* Urat Sayap Naga */}
    <path d="M100,50 Q60,40 20,5 M100,50 Q50,55 10,55 M100,50 Q60,70 20,95" stroke="#06B6D4" strokeWidth="1" opacity="0.6" />
    <defs>
      <linearGradient id="dragonWingGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F172A" />
        <stop offset="0.5" stopColor="#312E81" />
        <stop offset="1" stopColor="#0891B2" />
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
      <div className="relative inline-block z-10">
        
        {/* ======================================================= */}
        {/* EFEK TIER DEWA: SAYAP NAGA & NAGA MENGORBIT             */}
        {/* ======================================================= */}
        {isDeveloper && (
          <>
            {/* 1. Aura Panas Kosmik di belakang sayap */}
            <div className="absolute inset-[-10px] bg-cyan-500/40 blur-xl rounded-full animate-[pulse_3s_ease-in-out_infinite] z-[-2] pointer-events-none" />

            {/* 2. Animasi Sayap Mengepak dari Kiri dan Kanan */}
            <div className="absolute inset-0 flex items-center justify-center z-[-1] pointer-events-none">
              {/* Sayap Kiri */}
              <DragonWing className="absolute right-[35%] w-[200%] h-[200%] animate-[wingRevealLeft_8s_ease-in-out_infinite] origin-right drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
              {/* Sayap Kanan (di-flip menggunakan scaleX(-1) di dalam keyframes) */}
              <DragonWing className="absolute left-[35%] w-[200%] h-[200%] animate-[wingRevealRight_8s_ease-in-out_infinite] origin-left drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            </div>

            {/* 3. Dua Naga Mengorbit (Yin-Yang Style) */}
            <div className="absolute inset-[-4px] z-20 pointer-events-none flex items-center justify-center animate-[spin_4.5s_linear_infinite]">
              {/* Naga Biru (Atas) */}
              <FontAwesomeIcon 
                icon={faDragon} 
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-cyan-400 text-[10px] -scale-x-100 filter drop-shadow-[0_0_8px_#22d3ee] animate-[dragonPulse_2s_ease-in-out_infinite]" 
              />
              {/* Naga Ungu (Bawah) */}
              <FontAwesomeIcon 
                icon={faDragon} 
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-indigo-400 text-[10px] scale-x-100 rotate-180 filter drop-shadow-[0_0_8px_#818cf8] animate-[dragonPulse_2s_ease-in-out_infinite_1s]" 
              />
            </div>
          </>
        )}


        {/* === WADAH UTAMA FOTO PROFIL === */}
        <div 
          className={`group relative isolate overflow-hidden rounded-full p-[3.5px] 
            ${isDeveloper ? 'bg-transparent shadow-[inset_0_0_15px_rgba(34,211,238,0.6)] border border-cyan-400/50' : ''} 
            ${isDevTeam ? 'bg-transparent' : ''} 
            ${isDonatur ? 'bg-transparent' : ''} 
            ${isRegular ? `bg-gradient-to-br ${preset.accent}` : ''} 
            ${preset.glow} ${className} transition-all duration-300 hover:scale-105 z-10`}
        >
          
          {/* Efek Lingkaran Kosmik (Murni untuk Developer) */}
          {isDeveloper && (
            <>
              <div className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#22D3EE_15%,#0F172A_35%,#FFFFFF_50%,#000000_65%,#818CF8_85%,#000000_100%)] opacity-100" />
              <div className="absolute -inset-[3px] rounded-full animate-[spin_5s_linear_infinite_reverse] border-[2px] border-dashed border-cyan-300/80 opacity-80 pointer-events-none" />
              <div className="absolute inset-0 bg-cyan-200 opacity-0 animate-[lightningFlash_4s_steps(2,start)_infinite]" />
            </>
          )}

          {/* EFEK DEV TEAM (TURBO ACCELERATION) */}
          {isDevTeam && (
            <div className="absolute -inset-[150%] animate-[devTeamSpin_3s_cubic-bezier(0.68,-0.55,0.27,1.55)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_20%,#6366F1_50%,#FFFFFF_80%,#38BDF8_100%)] opacity-95" />
          )}

          {/* EFEK DONATUR (SULTAN TIER) */}
          {isDonatur && (
            <>
              <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#F59E0B_0%,#FDE047_25%,#EA580C_50%,#FDE047_75%,#F59E0B_100%)] opacity-100" />
              <div className="absolute inset-0 bg-yellow-200 opacity-0 animate-[pulse_3s_ease-in-out_infinite]" />
              <div className="absolute inset-1 rounded-full border border-yellow-300/50 shadow-[inset_0_0_10px_rgba(253,224,71,0.5)] z-10 pointer-events-none" />
            </>
          )}

          {isRegular && (
            <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
          )}
          
          {/* Avatar Core */}
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-inner z-20">
            <div className={`w-full h-full ${isDeveloper ? 'animate-[pulse_4s_ease-in-out_infinite]' : ''}`}>
              {children}
            </div>
          </div>
        </div>

        {/* EFEK KOIN EMAS SULTAN (DONATUR) */}
        {isDonatur && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            <GoldenCoin className="absolute -bottom-2 left-1/4 w-4 h-4 filter drop-shadow-[0_0_4px_#F59E0B] animate-[coinRise_3s_ease-in_infinite]" />
            <GoldenCoin className="absolute -bottom-1 right-1/4 w-3 h-3 filter drop-shadow-[0_0_3px_#F59E0B] animate-[coinRise_3.5s_ease-in_infinite_1s]" />
            <GoldenCoin className="absolute top-1/2 -left-3 w-3.5 h-3.5 filter drop-shadow-[0_0_5px_#F59E0B] animate-[coinRise_2.5s_ease-in_infinite_0.5s]" />
          </div>
        )}

        {/* === KUMPULAN CSS KEYFRAMES (MASUKKAN ANIMASI SAYAP DI SINI) === */}
        <style>{`
          /* Animasi Sayap Kiri (Keluar, Kepak, Masuk, Hilang) */
          @keyframes wingRevealLeft {
            0%, 100% { transform: perspective(400px) rotateY(-90deg) scale(0.5); opacity: 0; filter: drop-shadow(0 0 0px #22d3ee); }
            15%, 85% { transform: perspective(400px) rotateY(0deg) scale(1); opacity: 1; filter: drop-shadow(0 0 8px #22d3ee); }
            30%, 50%, 70% { transform: perspective(400px) rotateY(45deg) scale(1.05); filter: drop-shadow(0 0 15px #22d3ee); }
            40%, 60% { transform: perspective(400px) rotateY(10deg) scale(1); filter: drop-shadow(0 0 8px #22d3ee); }
          }
          
          /* Animasi Sayap Kanan (Dicerminkan menggunakan scaleX(-1)) */
          @keyframes wingRevealRight {
            0%, 100% { transform: perspective(400px) scaleX(-1) rotateY(-90deg) scale(0.5); opacity: 0; filter: drop-shadow(0 0 0px #22d3ee); }
            15%, 85% { transform: perspective(400px) scaleX(-1) rotateY(0deg) scale(1); opacity: 1; filter: drop-shadow(0 0 8px #22d3ee); }
            30%, 50%, 70% { transform: perspective(400px) scaleX(-1) rotateY(45deg) scale(1.05); filter: drop-shadow(0 0 15px #22d3ee); }
            40%, 60% { transform: perspective(400px) scaleX(-1) rotateY(10deg) scale(1); filter: drop-shadow(0 0 8px #22d3ee); }
          }

          /* Denyut Cahaya Naga Kecil */
          @keyframes dragonPulse {
            0%, 100% { transform: scale(1) translateX(-50%); opacity: 0.8; }
            50% { transform: scale(1.2) translateX(-50%); opacity: 1; filter: drop-shadow(0 0 12px currentColor); }
          }

          /* Flash Petir (Kosmik) */
          @keyframes lightningFlash {
            0%, 85%, 89%, 93% { opacity: 0; }
            87%, 91% { opacity: 0.7; }
          }
          
          /* Turbo Spin (Dev Team) */
          @keyframes devTeamSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
      {/* Background Card Developer (Cosmic Glow) */}
      {isDeveloper && (
        <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#22D3EE_15%,#0F172A_35%,#FFFFFF_50%,#000000_65%,#818CF8_85%,#000000_100%)] opacity-95" />
      )}
      
      {/* Background Card Dev Team */}
      {isDevTeam && (
        <div className="absolute -inset-[150%] animate-[devTeamSpin_3s_cubic-bezier(0.68,-0.55,0.27,1.55)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_20%,#6366F1_50%,#FFFFFF_80%,#38BDF8_100%)] opacity-95" />
      )}

      {/* Background Card Donatur */}
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