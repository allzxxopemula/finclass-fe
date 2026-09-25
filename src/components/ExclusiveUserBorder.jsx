import React from 'react';

export const EXCLUSIVE_USER_EMAILS = [
  {
    // === 1. TIER DEWA (DEVELOPER) - PREMIUM MONOCHROME & LIGHTNING EFFECT ===
    emails: ['allzxxott@gmail.com', 'allzxxo@gmail.com', 'developer@finclass.id'],
    label: 'DEVELOPER',
    // Gradasi premium: Hitam pekat, abu-abu metalik, platinum, dan putih terang
    accent: 'from-[#111827] via-[#9CA3AF] to-[#F9FAFB]',
    chip: 'bg-gradient-to-r from-slate-900 via-zinc-700 to-slate-200 text-white border border-white/40 font-black shadow-lg shadow-slate-500/30',
    glow: 'shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_25px_rgba(255,255,255,0.7),0_0_50px_rgba(156,163,175,0.5)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(17,24,39,0.9),_transparent_40%)]',
    isDeveloper: true
  },
  {
    // === 2. TIM DEVELOPER (DEV TEAM) ===
    emails: ['team@finclass.id', 'staff@finclass.id', 'jancok123@gmail.com', 'ayubganda@gmail.com', 'ayyubrashifpamungkas@gmail.com'],
    label: 'DEV TEAM',
    accent: 'from-[#1E293B] via-[#64748B] to-[#CBD5E1]',
    chip: 'bg-gradient-to-r from-slate-800 to-slate-500 text-white border border-white/40 font-black shadow-md shadow-slate-500/30',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.8),0_0_15px_rgba(100,116,139,0.6)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(203,213,225,0.7),_transparent_35%),linear-gradient(135deg,_rgba(30,41,59,0.4),_rgba(100,116,139,0.4))]'
  },
  {
    // === 3. DONATUR (SUPPORTER) ===
    emails: ['wahyuhanindio@gmail.com'],
    label: 'DONATUR',
    accent: 'from-[#78716C] via-[#A8A29E] to-[#E7E5E4]',
    chip: 'bg-gradient-to-r from-stone-600 via-stone-400 to-stone-200 text-stone-900 border border-white/50 font-black shadow-md shadow-stone-500/30',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.8),0_0_15px_rgba(168,162,158,0.6)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(231,229,228,0.8),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(120,113,108,0.7),_transparent_35%)]'
  },
  {
    // === 4. EXCLUSIVE ===
    emails: ['aldorendyjulian@gmail.com'],
    label: 'EXCLUSIVE',
    accent: 'from-[#334155] via-[#94A3B8] to-[#F1F5F9]',
    chip: 'bg-gradient-to-r from-slate-700 to-slate-400 text-white border border-white/40 font-bold shadow-md shadow-slate-500/20',
    glow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_0_15px_rgba(148,163,184,0.5)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.7),_transparent_35%),linear-gradient(135deg,_rgba(51,65,85,0.3),_rgba(241,245,249,0.3))]'
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
      <div className={`group relative isolate overflow-hidden p-[3px] ${preset.isDeveloper ? 'bg-transparent rounded-full animate-[morphShape_4s_ease-in-out_infinite]' : `rounded-full bg-gradient-to-br ${preset.accent}`} ${preset.glow} ${className} transition-all duration-300 hover:scale-105`}>
        
        {/* Jika Developer: Efek Putar Premium + Kilatan Petir (Flash) + Animasi Bentuk Melebar Oval */}
        {preset.isDeveloper && (
          <>
            {/* Lapisan Gradient Monokrom Berputar */}
            <div className="absolute -inset-[150%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0deg,#FFFFFF_90deg,#6B7280_180deg,#FFFFFF_270deg,#000000_360deg)] opacity-95" />
            
            {/* Efek Kedip-kedip Kilat Petir Mendadak */}
            <div className="absolute inset-0 bg-white opacity-0 animate-[lightningFlash_2.5s_steps(2,start)_infinite]" />
            
            {/* Lapisan Glow Berdenyut */}
            <div className="absolute inset-0 bg-white/30 animate-[pulse_1.5s_ease-in-out_infinite]" />
          </>
        )}

        {/* Latar Belakang Non-Developer */}
        {!preset.isDeveloper && (
          <div className={`absolute inset-0 opacity-100 ${preset.shell} animate-[pulse_3s_ease-in-out_infinite]`} />
        )}
        
        {/* Wadah Foto Profil Asli (ikut mengikuti bentuk morphing agar proporsional) */}
        <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-inner z-10">
          {children}
        </div>

        {/* CSS Keyframes Kustom untuk Efek Kedip Petir & Morphing Oval */}
        <style>{`
          @keyframes morphShape {
            0%, 100% { border-radius: 9999px; transform: scale(1); }
            35% { border-radius: 40% 60% 70% 30% / 50% 30% 70% 50%; transform: scale(1.04, 0.96); } /* Bentuk Oval/Lonjong Unik */
            70% { border-radius: 60% 40% 30% 70% / 30% 70% 30% 70%; transform: scale(0.96, 1.04); }
          }
          @keyframes lightningFlash {
            0%, 90%, 94%, 98% { opacity: 0; }
            92%, 96% { opacity: 0.85; } /* Kilatan cahaya petir mendadak */
          }
        `}</style>
      </div>
    );
  }

  // --- STYLE UNTUK KOTAK (CARD) ---
  return (
    <div className={`group relative isolate overflow-hidden rounded-[28px] border-2 border-white/60 ${preset.isDeveloper ? 'bg-transparent' : `bg-gradient-to-r ${preset.accent}`} p-[2.5px] ${preset.glow} ${className} transition-all duration-300`}>
      {preset.isDeveloper ? (
        <div className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0deg,#FFFFFF_90deg,#6B7280_180deg,#FFFFFF_270deg,#000000_360deg)] opacity-95" />
      ) : (
        <div className={`absolute inset-0 opacity-100 ${preset.shell} animate-[pulse_3s_ease-in-out_infinite]`} />
      )}
      
      <div className="relative h-full w-full rounded-[24px] bg-white/90 backdrop-blur-md ring-1 ring-white/50 z-10">
        {children}
      </div>
    </div>
  );
}