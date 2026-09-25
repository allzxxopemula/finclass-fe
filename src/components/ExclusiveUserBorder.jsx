import React from 'react';

export const EXCLUSIVE_USER_EMAILS = [
  {
    // === 1. TIER DEWA (DEVELOPER) - ANIMASI SPESIAL & PREMIUM MONOCHROME ===
    emails: ['allzxxott@gmail.com', 'allzxxo@gmail.com', 'developer@finclass.id'],
    label: 'DEVELOPER',
    accent: 'from-[#111827] via-[#9CA3AF] to-[#F9FAFB]',
    chip: 'bg-gradient-to-r from-slate-900 via-zinc-700 to-slate-200 text-white border border-white/40 font-black shadow-lg shadow-slate-500/30',
    glow: 'shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_25px_rgba(255,255,255,0.7),0_0_50px_rgba(156,163,175,0.5)]',
    isDeveloper: true
  },
  {
    // === 2. TIM DEVELOPER (DEV TEAM) - KEMBALI KE WARNA BIRU/INDIGO SEBELUMNYA ===
    emails: ['team@finclass.id', 'staff@finclass.id', 'jancok123@gmail.com', 'ayubganda@gmail.com', 'ayyubrashifpamungkas@gmail.com'],
    label: 'DEV TEAM',
    accent: 'from-[#38BDF8] via-[#818CF8] to-[#6366F1]',
    chip: 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white border border-white/50 font-black shadow-md shadow-blue-500/40',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.8),0_0_15px_rgba(56,189,248,0.7),0_0_35px_rgba(99,102,241,0.5)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.8),_transparent_35%],linear-gradient(135deg,_rgba(129,140,248,0.4),_rgba(79,70,229,0.4))]'
  },
  {
    // === 3. DONATUR (SUPPORTER) - KEMBALI KE WARNA GOLD/AMBER SEBELUMNYA ===
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
      <div className={`group relative isolate overflow-hidden rounded-full p-[3px] ${preset.isDeveloper ? 'bg-transparent animate-[morphShape_4s_ease-in-out_infinite]' : `bg-gradient-to-br ${preset.accent}`} ${preset.glow} ${className} transition-all duration-300 hover:scale-105`}>
        
        {/* Khusus Developer: Animasi Border Berputar, Kilat Petir, & Efek Monokrom */}
        {preset.isDeveloper && (
          <>
            <div className="absolute -inset-[150%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0deg,#FFFFFF_90deg,#6B7280_180deg,#FFFFFF_270deg,#000000_360deg)] opacity-95" />
            <div className="absolute inset-0 bg-white opacity-0 animate-[lightningFlash_2.5s_steps(2,start)_infinite]" />
            <div className="absolute inset-0 bg-white/30 animate-[pulse_1.5s_ease-in-out_infinite]" />
          </>
        )}

        {/* Untuk Role Lain: Shell diam standar tanpa animasi morphing */}
        {!preset.isDeveloper && (
          <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
        )}
        
        {/* WADAH FOTO PROFIL (DIJAMIN TETAP BULAT SEMPURNA, TIDAK IKUT GEPENG/OVAL) */}
        <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-inner z-10">
          <div className={`w-full h-full ${preset.isDeveloper ? 'animate-[counterMorph_4s_ease-in-out_infinite]' : ''}`}>
            {children}
          </div>
        </div>

        {/* CSS Keyframes Kustom: Border luar saja yang oval, foto di dalam tetap bulat */}
        <style>{`
          @keyframes morphShape {
            0%, 100% { border-radius: 9999px; transform: scale(1); }
            35% { border-radius: 40% 60% 70% 30% / 50% 30% 70% 50%; transform: scale(1.03, 0.97); }
            70% { border-radius: 60% 40% 30% 70% / 30% 70% 30% 70%; transform: scale(0.97, 1.03); }
          }
          @keyframes counterMorph {
            0%, 100% { transform: scale(1); }
            35% { transform: scale(0.97, 1.03); }
            70% { transform: scale(1.03, 0.97); }
          }
          @keyframes lightningFlash {
            0%, 90%, 94%, 98% { opacity: 0; }
            92%, 96% { opacity: 0.85; }
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
        <div className={`absolute inset-0 opacity-100 ${preset.shell}`} />
      )}
      
      <div className="relative h-full w-full rounded-[24px] bg-white/90 backdrop-blur-md ring-1 ring-white/50 z-10">
        {children}
      </div>
    </div>
  );
}