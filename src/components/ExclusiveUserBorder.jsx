import React from 'react';

export const EXCLUSIVE_USER_EMAILS = [
  {
    // === 1. TIER DEWA (DEVELOPER) - LEVEL MAX 999 (DISCORD NITRO STYLE) ===
    emails: ['allzxxott@gmail.com', 'allzxxo@gmail.com', 'developer@finclass.id'],
    label: 'DEVELOPER',
    accent: 'from-[#111827] via-[#9CA3AF] to-[#F9FAFB]',
    chip: 'bg-gradient-to-r from-slate-900 via-zinc-700 to-slate-200 text-white border border-white/40 font-black shadow-lg shadow-slate-500/30',
    glow: 'shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_35px_rgba(255,255,255,0.9),0_0_65px_rgba(156,163,175,0.7)]',
    isDeveloper: true
  },
  {
    // === 2. TIM DEVELOPER (DEV TEAM) - ANIMASI SPIN BIRU/PUTIH AKSELERASI ===
    emails: ['team@finclass.id', 'staff@finclass.id', 'jancok123@gmail.com', 'ayubganda@gmail.com', 'ayyubrashifpamungkas@gmail.com'],
    label: 'DEV TEAM',
    accent: 'from-[#38BDF8] via-[#818CF8] to-[#6366F1]',
    chip: 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white border border-white/50 font-black shadow-md shadow-blue-500/40',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.8),0_0_15px_rgba(56,189,248,0.7),0_0_35px_rgba(99,102,241,0.5)]',
    isDevTeam: true // Flag khusus untuk memicu animasi Dev Team
  },
  {
    // === 3. DONATUR (SUPPORTER) ===
    emails: ['wahyuhanindio@gmail.com'],
    label: 'DONATUR',
    accent: 'from-[#FDE047] via-[#F59E0B] to-[#EA580C]',
    chip: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 text-white border border-white/50 font-black shadow-md shadow-amber-500/40',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.8),0_0_15px_rgba(253,224,71,0.7),0_0_35px_rgba(234,88,12,0.5)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(253,224,71,0.8),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(234,88,12,0.7),_transparent_35%)]'
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

export function ExclusiveProfileShell({ email, className = '', children, variant = 'card' }) {
  const preset = getExclusiveUserPreset(email);

  if (!preset) {
    return <div className={className}>{children}</div>;
  }

  // Cek flag role
  const isDeveloper = preset.isDeveloper;
  const isDevTeam = preset.isDevTeam;
  const isRegular = !isDeveloper && !isDevTeam;

  // --- STYLE UNTUK FOTO PROFIL (AVATAR) ---
  if (variant === 'avatar') {
    return (
      <div className="relative inline-block">
        
        {/* === AURA HALO PULSE KHUSUS DEVELOPER (Di Luar Border Utama) === */}
        {isDeveloper && (
          <div className="absolute -inset-1 rounded-[inherit] border border-white/60 animate-[haloPulse_3s_ease-out_infinite] z-0" />
        )}

        {/* === WADAH UTAMA === */}
        <div 
          className={`group relative isolate overflow-hidden p-[3px] 
            ${isDeveloper ? 'bg-transparent animate-[smoothMorph_6s_ease-in-out_infinite] rounded-full' : ''} 
            ${isDevTeam ? 'bg-transparent rounded-full' : ''} 
            ${isRegular ? `bg-gradient-to-br ${preset.accent} rounded-full` : ''} 
            ${preset.glow} ${className} transition-all duration-300 hover:scale-105 z-10`}
        >
          
          {/* ======================================= */}
          {/* 1. EFEK DEVELOPER (LEVEL MAX 999)       */}
          {/* ======================================= */}
          {isDeveloper && (
            <>
              {/* Liquid Platinum Conic Gradient (Berputar Mulus) */}
              <div className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#E5E7EB_20%,#374151_40%,#FFFFFF_50%,#000000_70%,#D1D5DB_90%,#000000_100%)] opacity-95" />
              
              {/* 3D Reverse Orbiting Ring (Garis putus-putus berlawanan arah) */}
              <div className="absolute -inset-[2px] animate-[spin_5s_linear_infinite_reverse] border-[1.5px] border-dashed border-white/50 rounded-full opacity-70 pointer-events-none" />

              {/* Kilat Petir */}
              <div className="absolute inset-0 bg-white opacity-0 animate-[lightningFlash_4s_steps(2,start)_infinite]" />
              
              {/* Glow Berdenyut Dalam */}
              <div className="absolute inset-0 bg-white/20 animate-[pulse_2.5s_ease-in-out_infinite]" />
            </>
          )}

          {/* ======================================= */}
          {/* 2. EFEK DEV TEAM (BIRU PUTIH AKSELERASI)*/}
          {/* ======================================= */}
          {isDevTeam && (
            <>
              {/* Border berputar dengan timing pelan lalu ngebut! (ease-in-out) */}
              <div className="absolute -inset-[150%] animate-[devTeamSpin_3s_ease-in-out_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_25%,#6366F1_50%,#FFFFFF_75%,#38BDF8_100%)] opacity-90" />
            </>
          )}

          {/* ======================================= */}
          {/* 3. EFEK ROLE REGULAR (DONATUR DLL)      */}
          {/* ======================================= */}
          {isRegular && (
            <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
          )}
          
          {/* === WADAH FOTO PROFIL (TETAP AMAN BULAT SEMPURNA) === */}
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-inner z-20">
            {/* Couter Morph cuma nyala buat Developer biar gambarnya gak penyok */}
            <div className={`w-full h-full ${isDeveloper ? 'animate-[counterSmooth_6s_ease-in-out_infinite]' : ''}`}>
              {children}
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* EFEK NITRO SPARKLES (KHUSUS DEVELOPER)  */}
        {/* ======================================= */}
        {isDeveloper && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            <span className="absolute -top-2 left-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_2px_#ffffff] animate-[sparkleFloat_2.5s_ease-in-out_infinite]" />
            <span className="absolute top-1/4 -right-2 w-2 h-2 bg-slate-100 rounded-full shadow-[0_0_12px_2px_#ffffff] animate-[sparkleFloat_3s_ease-in-out_infinite_0.8s]" />
            <span className="absolute -bottom-2 left-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_1px_#ffffff] animate-[sparkleFloat_2s_ease-in-out_infinite_1.5s]" />
            <span className="absolute bottom-1/4 -left-2 w-2 h-2 bg-zinc-200 rounded-full shadow-[0_0_10px_2px_#ffffff] animate-[sparkleFloat_3.5s_ease-in-out_infinite_0.4s]" />
            {/* Sparkles tambahan untuk Level Max */}
            <span className="absolute top-0 right-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_6px_#ffffff] animate-[sparkleFloat_2.2s_ease-in-out_infinite_1.1s]" />
            <span className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-slate-300 rounded-full shadow-[0_0_8px_#ffffff] animate-[sparkleFloat_2.8s_ease-in-out_infinite_0.7s]" />
          </div>
        )}

        {/* === KUMPULAN CSS KEYFRAMES LEVEL MAX === */}
        <style>{`
          /* Animasi Morph Developer */
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
          
          /* Animasi Putar Dev Team (Pelan -> Ngebut -> Pelan) */
          @keyframes devTeamSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Efek Cincin Aura Berdenyut (Halo) */
          @keyframes haloPulse {
            0% { transform: scale(1); opacity: 0.8; border-width: 2px; }
            50% { transform: scale(1.25); opacity: 0; border-width: 0px; }
            100% { transform: scale(1); opacity: 0; border-width: 0px; }
          }

          /* Animasi Petir Developer */
          @keyframes lightningFlash {
            0%, 85%, 89%, 93% { opacity: 0; }
            87%, 91% { opacity: 0.6; }
          }

          /* Partikel Terbang */
          @keyframes sparkleFloat {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(0.5); opacity: 0; }
            30% { opacity: 1; }
            50% { transform: translateY(-15px) translateX(5px) scale(1.3); opacity: 1; }
            80% { opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // --- STYLE UNTUK KOTAK (CARD) ---
  return (
    <div className={`group relative isolate overflow-hidden rounded-[28px] border-2 border-white/60 p-[2.5px] ${preset.glow} ${className} transition-all duration-300
      ${isDeveloper ? 'bg-transparent' : ''} 
      ${isDevTeam ? 'bg-transparent' : ''} 
      ${isRegular ? `bg-gradient-to-r ${preset.accent}` : ''}`}
    >
      {/* Background Card Developer */}
      {isDeveloper && (
        <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#E5E7EB_20%,#374151_40%,#FFFFFF_50%,#000000_70%,#D1D5DB_90%,#000000_100%)] opacity-95" />
      )}
      
      {/* Background Card Dev Team */}
      {isDevTeam && (
        <div className="absolute -inset-[150%] animate-[devTeamSpin_5s_ease-in-out_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_25%,#6366F1_50%,#FFFFFF_75%,#38BDF8_100%)] opacity-90" />
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