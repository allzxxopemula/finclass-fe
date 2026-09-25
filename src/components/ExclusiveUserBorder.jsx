import React from 'react';

export const EXCLUSIVE_USER_EMAILS = [
  {
    // === 1. TIER DEWA (DEVELOPER) - ANIMASI BORDER MUTER-MUTER EPIS / BADAS ===
    emails: ['allzxxott@gmail.com', 'allzxxo@gmail.com', 'developer@finclass.id'],
    label: 'DEVELOPER',
    accent: 'from-[#00E1FF] via-[#FF00EA] to-[#FF9D00]',
    chip: 'bg-gradient-to-r from-[#00E1FF] via-[#FF00EA] to-[#FF9D00] text-white border border-white/60 font-black shadow-lg shadow-fuchsia-500/40',
    // Kita buat efek glow khusus developer
    glow: 'shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_25px_rgba(0,225,255,0.8),0_0_50px_rgba(255,0,234,0.6)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(0,225,255,0.9),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,157,0,0.9),_transparent_35%),radial-gradient(circle_at_center,_rgba(255,0,234,0.5),_transparent_50%)]',
    isDeveloper: true // Penanda khusus animasi putar
  },
  {
    // === 2. TIM DEVELOPER (DEV TEAM) - (Sudah termasuk email tambahanmu) ===
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
      <div className={`group relative isolate overflow-hidden rounded-full p-[3px] ${preset.isDeveloper ? 'bg-transparent' : `bg-gradient-to-br ${preset.accent}`} ${preset.glow} ${className} transition-all duration-300 hover:scale-105`}>
        
        {/* Jika Developer: Berikan animasi border muter-muter epik (cepat lalu melambat dinamis) */}
        {preset.isDeveloper && (
          <>
            {/* Lapisan Gradient yang Berputar Cepat-Lambat */}
            <div className="absolute -inset-[100%] animate-[spin_3s_cubic-bezier(0.4,0,0.2,1)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#00E1FF_0deg,#FF00EA_120deg,#FF9D00_240deg,#00E1FF_360deg)] opacity-90" />
            
            {/* Efek kilatan cahaya tambahan di belakang */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </>
        )}

        {/* Latar Belakang Cangkang Bergerak (Pulse) untuk Non-Developer */}
        {!preset.isDeveloper && (
          <div className={`absolute inset-0 opacity-100 ${preset.shell} animate-[pulse_3s_ease-in-out_infinite]`} />
        )}
        
        {/* Wadah Foto Profil Asli */}
        <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-inner z-10">
          {children}
        </div>
      </div>
    );
  }

  // --- STYLE UNTUK KOTAK (CARD) ---
  return (
    <div className={`group relative isolate overflow-hidden rounded-[28px] border-2 border-white/60 ${preset.isDeveloper ? 'bg-transparent' : `bg-gradient-to-r ${preset.accent}`} p-[2.5px] ${preset.glow} ${className} transition-all duration-300`}>
      {preset.isDeveloper ? (
        <div className="absolute -inset-[100%] animate-[spin_4s_cubic-bezier(0.4,0,0.2,1)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#00E1FF_0deg,#FF00EA_120deg,#FF9D00_240deg,#00E1FF_360deg)] opacity-90" />
      ) : (
        <div className={`absolute inset-0 opacity-100 ${preset.shell} animate-[pulse_3s_ease-in-out_infinite]`} />
      )}
      
      <div className="relative h-full w-full rounded-[24px] bg-white/90 backdrop-blur-md ring-1 ring-white/50 z-10">
        {children}
      </div>
    </div>
  );
}