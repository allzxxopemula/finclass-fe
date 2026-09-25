import React from 'react';

export const EXCLUSIVE_USER_EMAILS = [
  {
    // === 1. TIER DEWA (DEVELOPER) - DISCORD NITRO STYLE & SPARKS ===
    emails: ['allzxxott@gmail.com', 'allzxxo@gmail.com', 'developer@finclass.id'],
    label: 'DEVELOPER',
    accent: 'from-[#111827] via-[#9CA3AF] to-[#F9FAFB]',
    chip: 'bg-gradient-to-r from-slate-900 via-zinc-700 to-slate-200 text-white border border-white/40 font-black shadow-lg shadow-slate-500/30',
    glow: 'shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.8),0_0_60px_rgba(156,163,175,0.6)]',
    isDeveloper: true
  },
  {
    // === 2. TIM DEVELOPER (DEV TEAM) ===
    emails: ['team@finclass.id', 'staff@finclass.id', 'jancok123@gmail.com', 'ayubganda@gmail.com', 'ayyubrashifpamungkas@gmail.com'],
    label: 'DEV TEAM',
    accent: 'from-[#38BDF8] via-[#818CF8] to-[#6366F1]',
    chip: 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white border border-white/50 font-black shadow-md shadow-blue-500/40',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.8),0_0_15px_rgba(56,189,248,0.7),0_0_35px_rgba(99,102,241,0.5)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.8),_transparent_35%),linear-gradient(135deg,_rgba(129,140,248,0.4),_rgba(79,70,229,0.4))]'
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

  // --- STYLE UNTUK FOTO PROFIL (AVATAR) ---
  if (variant === 'avatar') {
    return (
      <div className="relative inline-block">
        {/* Container Utama dengan Efek Nitro Sparkles & Smooth Morphing khusus Developer */}
        <div className={`group relative isolate overflow-hidden rounded-full p-[3px] ${preset.isDeveloper ? 'bg-transparent animate-[smoothMorph_6s_ease-in-out_infinite]' : `bg-gradient-to-br ${preset.accent}`} ${preset.glow} ${className} transition-all duration-300 hover:scale-105`}>
          
          {/* Khusus Developer: Efek Double Ring & Monokrom Berputar */}
          {preset.isDeveloper && (
            <>
              {/* Ring Luar Berputar Searah Jarum Jam */}
              <div className="absolute -inset-[150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0deg,#FFFFFF_90deg,#4B5563_180deg,#FFFFFF_270deg,#000000_360deg)] opacity-95" />
              
              {/* Ring Dalam Berputar Berlawanan Arah (Effek 3D Nitro) */}
              <div className="absolute -inset-[100%] animate-[spin_4s_linear_infinite_reverse] border border-white/30 rounded-full opacity-60 pointer-events-none" />

              {/* Kilat Petir */}
              <div className="absolute inset-0 bg-white opacity-0 animate-[lightningFlash_4s_steps(2,start)_infinite]" />
              
              {/* Glow Berdenyut */}
              <div className="absolute inset-0 bg-white/25 animate-[pulse_2.5s_ease-in-out_infinite]" />
            </>
          )}

          {/* Untuk Role Lain */}
          {!preset.isDeveloper && (
            <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
          )}
          
          {/* Wadah Foto Profil Aman & Stabil */}
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-inner z-10">
            <div className={`w-full h-full ${preset.isDeveloper ? 'animate-[counterSmooth_6s_ease-in-out_infinite]' : ''}`}>
              {children}
            </div>
          </div>
        </div>

        {/* EFEK PERCIKAN CAHAYA (SPARKLES / PARTIKEL NITRO DI LUAR BORDER) */}
        {preset.isDeveloper && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            <span className="absolute -top-1.5 left-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff] animate-[sparkleFloat_2.5s_ease-in-out_infinite]" />
            <span className="absolute top-1/3 -right-1 w-2 h-2 bg-slate-200 rounded-full shadow-[0_0_10px_#ffffff] animate-[sparkleFloat_3s_ease-in-out_infinite_0.8s]" />
            <span className="absolute -bottom-1 left-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff] animate-[sparkleFloat_2s_ease-in-out_infinite_1.5s]" />
            <span className="absolute bottom-1/4 -left-1 w-2 h-2 bg-zinc-300 rounded-full shadow-[0_0_10px_#ffffff] animate-[sparkleFloat_3.5s_ease-in-out_infinite_0.4s]" />
          </div>
        )}

        {/* CSS Keyframes Tambahan untuk Sparkles & Double Ring */}
        <style>{`
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
          @keyframes lightningFlash {
            0%, 85%, 89%, 93% { opacity: 0; }
            87%, 91% { opacity: 0.6; }
          }
          @keyframes sparkleFloat {
            0%, 100% { transform: translateY(0px) scale(0.6); opacity: 0.2; }
            50% { transform: translateY(-12px) scale(1.2); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // --- STYLE UNTUK KOTAK (CARD) ---
  return (
    <div className={`group relative isolate overflow-hidden rounded-[28px] border-2 border-white/60 ${preset.isDeveloper ? 'bg-transparent' : `bg-gradient-to-r ${preset.accent}`} p-[2.5px] ${preset.glow} ${className} transition-all duration-300`}>
      {preset.isDeveloper ? (
        <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0deg,#FFFFFF_90deg,#6B7280_180deg,#FFFFFF_270deg,#000000_360deg)] opacity-95" />
      ) : (
        <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
      )}
      
      <div className="relative h-full w-full rounded-[24px] bg-white/90 backdrop-blur-md ring-1 ring-white/50 z-10">
        {children}
      </div>
    </div>
  );
}