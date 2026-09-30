import React from 'react';

const PRESET_BORDER_TYPES = {
  DEVELOPER: {
    label: 'DEVELOPER',
    accent: 'from-[#111827] via-[#9CA3AF] to-[#F9FAFB]',
    chip: 'bg-gradient-to-r from-slate-900 via-zinc-700 to-slate-200 text-white border border-white/40 font-black shadow-lg shadow-slate-500/30',
    glow: 'shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.9),0_0_75px_rgba(156,163,175,0.8)]',
    isDeveloper: true,
  },
  DEV_TEAM: {
    label: 'DEV TEAM',
    accent: 'from-[#38BDF8] via-[#818CF8] to-[#6366F1]',
    chip: 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white border border-white/50 font-black shadow-md shadow-blue-500/40',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.8),0_0_20px_rgba(56,189,248,0.8),0_0_45px_rgba(99,102,241,0.6)]',
    isDevTeam: true,
  },
  DONATUR: {
    label: 'DONATUR',
    accent: 'from-[#FDE047] via-[#F59E0B] to-[#EA580C]',
    chip: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 text-white border border-white/50 font-black shadow-md shadow-amber-500/40',
    glow: 'shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_25px_rgba(253,224,71,0.8),0_0_50px_rgba(234,88,12,0.6)]',
    isDonatur: true,
  },
  EXCLUSIVE: {
    label: 'EXCLUSIVE',
    accent: 'from-[#D946EF] via-[#A855F7] to-[#6366F1]',
    chip: 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white border border-white/40 font-bold shadow-md shadow-purple-500/30',
    glow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_0_15px_rgba(217,70,239,0.6),0_0_30px_rgba(99,102,241,0.4)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(217,70,239,0.7),_transparent_35%),linear-gradient(135deg,_rgba(168,85,247,0.3),_rgba(79,70,229,0.3))]',
    isExclusivePurple: true,
  },
  SECRET_PURPLE: {
    label: '',
    accent: 'from-[#7E22CE] via-[#A855F7] to-[#6B21A8]',
    chip: 'hidden',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.7),0_0_20px_rgba(168,85,247,0.8),0_0_40px_rgba(126,34,206,0.5)]',
    isPurpleBorder: true,
  },
  SECRET_PINK: {
    label: '',
    accent: 'from-[#F472B6] via-[#F9A8D4] to-[#FDA4AF]',
    chip: 'hidden',
    glow: 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.9),0_0_18px_rgba(244,114,182,0.95),0_0_42px_rgba(249,168,212,0.8),0_0_68px_rgba(253,164,175,0.45)]',
    isPinkBorder: true,
  },
};

const HEX_COLOR_RE = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const normalizeBorderValue = (value = '') => {
  if (value === null || value === undefined) return '';

  const raw = String(value).trim();
  if (!raw) return '';

  if (HEX_COLOR_RE.test(raw)) {
    return raw.toUpperCase();
  }

  const normalized = raw.replace(/\s+/g, '').toUpperCase();
  return Object.prototype.hasOwnProperty.call(PRESET_BORDER_TYPES, normalized) ? normalized : '';
};

export const getExclusiveUserPreset = (value) => {
  const token = normalizeBorderValue(value);
  if (!token) return null;

  if (token.startsWith('#')) {
    return {
      kind: 'hex',
      value: token,
      label: '',
      accent: '',
      chip: 'hidden',
      glow: '',
      color: token,
    };
  }

  return {
    ...PRESET_BORDER_TYPES[token],
    kind: 'preset',
    value: token,
  };
};

export const getUserBorderValue = (user = {}) => normalizeBorderValue(user?.custom_border_color || user?.border_type || '');

const PROFILE_FRAME_COLORS = {
  DEVELOPER: ['#111827', '#F9FAFB', '#9CA3AF'],
  DEV_TEAM: ['#38BDF8', '#FFFFFF', '#6366F1'],
  DONATUR: ['#F59E0B', '#FEF3C7', '#EA580C'],
  EXCLUSIVE: ['#D946EF', '#F5D0FE', '#6366F1'],
  SECRET_PURPLE: ['#7E22CE', '#E9D5FF', '#9333EA'],
  SECRET_PINK: ['#EC4899', '#FCE7F3', '#F472B6'],
};

export function ExclusiveProfileFrame({ borderValue = '', customBorderColor = '', borderType = '', className = '', onClick, children }) {
  const token = normalizeBorderValue(borderType || customBorderColor || borderValue);
  const isHex = token.startsWith('#');
  const colors = PROFILE_FRAME_COLORS[token];
  const isPremium = Boolean(colors);

  return (
    <div
      className={`relative isolate overflow-hidden rounded-[30px] ${isPremium ? 'p-[3px]' : isHex ? 'p-px' : 'border border-slate-200'} ${className}`}
      style={isPremium ? { boxShadow: `0 12px 40px ${colors[0]}30, 0 2px 10px ${colors[2]}25` } : isHex ? { backgroundColor: token } : undefined}
    >
      {isPremium && (
        <div
          className="profile-frame-spin absolute inset-0 animate-[profileFrameSpin_5s_linear_infinite] opacity-100"
          style={{ backgroundImage: `conic-gradient(from 0deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[0]})` }}
        />
      )}
      <div
        className={`relative z-10 overflow-hidden rounded-[28px] bg-white ${isPremium ? 'ring-1 ring-white/80' : ''}`}
        onClick={onClick}
      >
        {children}
      </div>
      {isPremium && (
        <style>{`
          @keyframes profileFrameSpin {
            to { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            .profile-frame-spin { animation: none !important; }
          }
        `}</style>
      )}
    </div>
  );
}

const PROFILE_BANNER_GRADIENTS = {
  DEVELOPER: 'from-slate-300 via-slate-700 to-slate-200',
  DEV_TEAM: 'from-sky-100 via-indigo-300 to-sky-400',
  DONATUR: 'from-yellow-100 via-amber-300 to-orange-300',
  EXCLUSIVE: 'from-fuchsia-100 via-purple-300 to-indigo-300',
  SECRET_PURPLE: 'from-violet-100 via-purple-300 to-fuchsia-200',
  SECRET_PINK: 'from-pink-100 via-rose-200 to-fuchsia-200',
};

export function ExclusiveProfileBanner({ bannerUrl = '', borderValue = '', customBorderColor = '', borderType = '', className = '', children }) {
  const token = normalizeBorderValue(borderType || customBorderColor || borderValue);
  const isHex = token.startsWith('#');
  const gradient = PROFILE_BANNER_GRADIENTS[token] || 'from-indigo-100 via-sky-200 to-cyan-100';
  const style = isHex ? { '--profile-border-color': token } : undefined;

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {bannerUrl ? (
        <img src={bannerUrl} alt="Banner profil" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-r ${isHex ? 'profile-banner-hex' : gradient} bg-[length:220%_220%] animate-[profileBannerFlow_12s_ease-in-out_infinite]`}
          style={style}
        />
      )}
      {!bannerUrl && <div className="absolute inset-0 bg-white/10" />}
      {children}
      <style>{`
        @keyframes profileBannerFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .profile-banner-hex {
          background-image: linear-gradient(115deg,
            color-mix(in srgb, var(--profile-border-color) 18%, white),
            color-mix(in srgb, var(--profile-border-color) 38%, white),
            color-mix(in srgb, var(--profile-border-color) 12%, #f8fafc));
        }
      `}</style>
    </div>
  );
}

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

const Firefly = ({ className, color = '#FFFFFF' }) => (
  <div 
    className={`absolute rounded-full ${className}`} 
    style={{ backgroundColor: color, boxShadow: `0 0 8px 2px ${color}` }} 
  />
);

export function ExclusiveProfileShell({ email, className = '', children, variant = 'card', customBorderColor = '', borderValue = '', borderType = '' }) {
  const resolvedBorderValue = normalizeBorderValue(customBorderColor || borderValue || borderType || email || '');
  const preset = getExclusiveUserPreset(resolvedBorderValue);
  const isHexBorder = preset?.kind === 'hex';
  const isDeveloper = preset?.kind === 'preset' && preset.value === 'DEVELOPER';
  const isDevTeam = preset?.kind === 'preset' && preset.value === 'DEV_TEAM';
  const isDonatur = preset?.kind === 'preset' && preset.value === 'DONATUR';
  const isExclusivePurple = preset?.kind === 'preset' && preset.value === 'EXCLUSIVE';
  const isPurpleBorder = preset?.kind === 'preset' && preset.value === 'SECRET_PURPLE';
  const isPinkBorder = preset?.kind === 'preset' && preset.value === 'SECRET_PINK';

  const customHexStyle = isHexBorder ? {
    backgroundColor: preset.color,
    boxShadow: `0 0 12px ${preset.color}88, 0 2px 8px rgba(0,0,0,0.15)`,
  } : undefined;

  if (!preset) {
    return (
      <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}>
        {children}
      </div>
    );
  }

  // JANGAN UBAH KODE AVATAR DI BAWAH INI SESUAI PERMINTAAN
  if (variant === 'avatar') {
    return (
      <div className="relative inline-block">
        {isDeveloper && (
          <>
            <div className="absolute -inset-1 rounded-full border-[1.5px] border-white/80 animate-[rippleFast_2s_ease-out_infinite] pointer-events-none z-0" />
            <div className="absolute -inset-1 rounded-full border-2 border-slate-300/60 animate-[rippleSlow_2.5s_ease-out_infinite_0.8s] pointer-events-none z-0" />
          </>
        )}

        <div
          className={`group relative isolate overflow-hidden rounded-full p-[3px]
            ${isDeveloper ? 'animate-[smoothMorph_6s_ease-in-out_infinite]' : ''}
            ${isHexBorder ? '' : `bg-gradient-to-br ${preset.accent}`}
            ${preset.glow || ''} ${className} transition-all duration-300 hover:scale-105 z-10`}
          style={customHexStyle}
        >
          {isDeveloper && (
            <>
              <div className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#E5E7EB_15%,#111827_35%,#FFFFFF_50%,#000000_65%,#D1D5DB_85%,#000000_100%)] opacity-100" />
              <div className="absolute inset-[-4px] animate-[spin_1.5s_linear_infinite] pointer-events-none rounded-full z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_4px_#ffffff] blur-[1px]" />
                <div className="absolute top-0 left-1/2 w-16 h-2 bg-gradient-to-l from-white to-transparent opacity-70 origin-left rounded-full blur-[2px]" />
              </div>
              <div className="absolute -inset-[3px] rounded-full animate-[spin_5s_linear_infinite_reverse] border-[2px] border-dashed border-white/60 opacity-80 pointer-events-none" />
              <div className="absolute inset-0 bg-white opacity-0 animate-[lightningFlash_4s_steps(2,start)_infinite]" />
              <div className="absolute inset-0 bg-white/30 animate-[pulse_2.5s_ease-in-out_infinite]" />
            </>
          )}

          {isDevTeam && (
            <div className="absolute -inset-[150%] animate-[devTeamSpin_3s_cubic-bezier(0.68,-0.55,0.27,1.55)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_20%,#6366F1_50%,#FFFFFF_80%,#38BDF8_100%)] opacity-95" />
          )}

          {isDonatur && (
            <>
              <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#F59E0B_0%,#FDE047_25%,#EA580C_50%,#FDE047_75%,#F59E0B_100%)] opacity-100" />
              <div className="absolute inset-0 bg-yellow-200 opacity-0 animate-[pulse_3s_ease-in-out_infinite]" />
              <div className="absolute inset-1 rounded-full border border-yellow-300/50 shadow-[inset_0_0_10px_rgba(253,224,71,0.5)] z-10 pointer-events-none" />
            </>
          )}

          {isExclusivePurple && (
            <>
              <div className="absolute -inset-[150%] animate-[spinReverse_5s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#C026D3_0%,#FFFFFF_25%,#A855F7_50%,#FFFFFF_75%,#C026D3_100%)] opacity-100" />
              <div className="absolute inset-1 rounded-full border border-purple-200/50 shadow-[inset_0_0_15px_rgba(168,85,247,0.4)] z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-purple-400/10 animate-[pulse_3s_ease-in-out_infinite] pointer-events-none" />
            </>
          )}

          {isPurpleBorder && (
            <>
              <div className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#6B21A8_0%,#D8B4FE_20%,#9333EA_50%,#D8B4FE_80%,#6B21A8_100%)] opacity-100" />
              <div className="absolute inset-1 rounded-full border border-purple-300/40 shadow-[inset_0_0_15px_rgba(168,85,247,0.4)] z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-purple-500/10 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" />
            </>
          )}

          {isPinkBorder && (
            <>
              <div className="absolute -inset-[150%] animate-[spinReverse_5s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#F472B6_0%,#FFFFFF_25%,#F9A8D4_50%,#FFFFFF_75%,#F472B6_100%)] opacity-100" />
              <div className="absolute inset-[1px] rounded-full border border-white/80 shadow-[inset_0_0_8px_rgba(255,255,255,0.9),inset_0_0_22px_rgba(244,114,182,0.7)] z-10 pointer-events-none" />
              <div className="absolute inset-[3px] rounded-full border border-pink-100/70 animate-[pinkHalo_2.8s_ease-in-out_infinite] pointer-events-none z-10" />
              <div className="absolute -inset-[2px] rounded-full border border-dashed border-pink-100/70 animate-[spin_14s_linear_infinite] pointer-events-none z-10" />
              <div className="absolute inset-0 bg-pink-400/15 animate-[pulse_2.2s_ease-in-out_infinite] pointer-events-none" />
              <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none z-30">
                <div className="absolute -inset-full h-[250%] w-[250%] rotate-[35deg] animate-[pinkShimmer_3.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              </div>
            </>
          )}

          <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-inner z-20">
            <div className={`w-full h-full ${isDeveloper ? 'animate-[counterSmooth_6s_ease-in-out_infinite]' : ''}`}>
              {children}
            </div>

            {isDeveloper && (
              <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-full">
                <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/70 to-transparent rotate-[35deg] animate-[thinGlassSweep_8s_ease-in-out_infinite]" />
              </div>
            )}
          </div>
        </div>

        {isDeveloper && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-[100]">
            <StarSparkle className="absolute -top-3 left-1/4 w-3.5 h-3.5 text-white filter drop-shadow-[0_0_5px_#ffffff] animate-[starFloat_2.5s_ease-in-out_infinite]" />
            <StarSparkle className="absolute top-1/4 -right-3 w-4 h-4 text-slate-100 filter drop-shadow-[0_0_8px_#ffffff] animate-[starFloat_3s_ease-in-out_infinite_0.7s]" />
            <StarSparkle className="absolute -bottom-2 left-1/3 w-3 h-3 text-white filter drop-shadow-[0_0_4px_#ffffff] animate-[starFloat_2s_ease-in-out_infinite_1.4s]" />
            <StarSparkle className="absolute bottom-1/4 -left-3 w-4 h-4 text-zinc-200 filter drop-shadow-[0_0_6px_#ffffff] animate-[starFloat_3.5s_ease-in-out_infinite_0.4s]" />
          </div>
        )}

        {isDonatur && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            <GoldenCoin className="absolute -bottom-2 left-1/4 w-4 h-4 filter drop-shadow-[0_0_4px_#F59E0B] animate-[coinRise_3s_ease-in_infinite]" />
            <GoldenCoin className="absolute -bottom-1 right-1/4 w-3 h-3 filter drop-shadow-[0_0_3px_#F59E0B] animate-[coinRise_3.5s_ease-in_infinite_1s]" />
            <GoldenCoin className="absolute top-1/2 -left-3 w-3.5 h-3.5 filter drop-shadow-[0_0_5px_#F59E0B] animate-[coinRise_2.5s_ease-in_infinite_0.5s]" />
            <StarSparkle className="absolute -top-2 right-1/3 w-3 h-3 text-yellow-300 filter drop-shadow-[0_0_5px_#FDE047] animate-[starFloat_3s_ease-in-out_infinite_0.2s]" />
          </div>
        )}

        {isExclusivePurple && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            <StarSparkle className="absolute -top-2 right-1/4 w-3.5 h-3.5 text-purple-200 filter drop-shadow-[0_0_5px_#A855F7] animate-[starFloat_3s_ease-in-out_infinite]" />
            <StarSparkle className="absolute top-1/4 -left-2 w-2.5 h-2.5 text-white filter drop-shadow-[0_0_5px_#C084FC] animate-[starFloat_2.5s_ease-in-out_infinite_0.5s]" />
            <StarSparkle className="absolute -bottom-1 left-1/3 w-3 h-3 text-purple-100 filter drop-shadow-[0_0_6px_#A855F7] animate-[starFloat_4s_ease-in-out_infinite_1s]" />
            <Firefly className="w-1 h-1 -bottom-2 right-1/4 animate-[fireflyFloat_3.5s_ease-in-out_infinite_0.2s]" color="#E9D5FF" />
          </div>
        )}

        {isPurpleBorder && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            <StarSparkle className="absolute -top-2 left-1/3 w-3.5 h-3.5 text-purple-200 filter drop-shadow-[0_0_6px_#C084FC] animate-[starFloat_2.8s_ease-in-out_infinite]" />
            <StarSparkle className="absolute top-1/3 -right-2.5 w-3 h-3 text-white filter drop-shadow-[0_0_5px_#D8B4FE] animate-[starFloat_3.2s_ease-in-out_infinite_0.6s]" />
            <Firefly className="w-1.5 h-1.5 -bottom-2 left-1/4 animate-[fireflyFloat_4s_ease-in-out_infinite]" color="#D8B4FE" />
            <Firefly className="w-1 h-1 bottom-1/3 -left-2 animate-[fireflyFloat_4.5s_ease-in-out_infinite_1.5s]" color="#E9D5FF" />
          </div>
        )}

        {isPinkBorder && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            <StarSparkle className="absolute -top-2 right-1/4 w-3.5 h-3.5 text-pink-200 filter drop-shadow-[0_0_5px_#F472B6] animate-[starFloat_3s_ease-in-out_infinite]" />
            <StarSparkle className="absolute top-1/4 -left-2 w-2.5 h-2.5 text-white filter drop-shadow-[0_0_5px_#F9A8D4] animate-[starFloat_2.5s_ease-in-out_infinite_0.5s]" />
            <StarSparkle className="absolute -bottom-1 left-1/3 w-3 h-3 text-pink-100 filter drop-shadow-[0_0_6px_#F472B6] animate-[starFloat_4s_ease-in-out_infinite_1s]" />
            <StarSparkle className="absolute top-0 left-1/3 w-2.5 h-2.5 text-white filter drop-shadow-[0_0_7px_#F472B6] animate-[starFloat_2.4s_ease-in-out_infinite_0.8s]" />
            <StarSparkle className="absolute bottom-1/4 -right-2 w-3 h-3 text-pink-50 filter drop-shadow-[0_0_7px_#F9A8D4] animate-[starFloat_3.2s_ease-in-out_infinite_1.3s]" />
            <Firefly className="w-1 h-1 -bottom-2 right-1/4 animate-[fireflyFloat_3.5s_ease-in-out_infinite_0.2s]" color="#FBCFE8" />
            <Firefly className="w-1.5 h-1.5 top-1/3 -right-1 animate-[fireflyFloat_3s_ease-in-out_infinite_0.7s]" color="#F9A8D4" />
            <Firefly className="w-1 h-1 top-0 left-1/4 animate-[fireflyFloat_4s_ease-in-out_infinite_1.1s]" color="#FFFFFF" />
          </div>
        )}

        <style>{`
          @keyframes thinGlassSweep {
            0% { transform: translateX(-180%) translateY(-180%); opacity: 0; }
            10% { opacity: 0.9; }
            25% { transform: translateX(180%) translateY(180%); opacity: 0; }
            100% { transform: translateX(180%) translateY(180%); opacity: 0; }
          }
          @keyframes spinReverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes pinkHalo {
            0%, 100% { opacity: 0.4; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1.02); }
          }
          @keyframes pinkShimmer {
            0%, 12% { transform: translateX(-70%) translateY(-45%) rotate(35deg); opacity: 0; }
            35% { opacity: 0.85; }
            62%, 100% { transform: translateX(70%) translateY(45%) rotate(35deg); opacity: 0; }
          }
          @keyframes pinkGleam {
            0%, 100% { opacity: 0.45; transform: rotate(0deg) scale(0.92); }
            50% { opacity: 1; transform: rotate(180deg) scale(1.04); }
          }
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
            50% { transform: translateY(-15px) translateX(8px) scale(1.2) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 10px currentColor); }
            80% { opacity: 0; }
          }
          @keyframes coinRise {
            0% { transform: translateY(10px) rotate(0deg) scale(0.5); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(-30px) rotate(360deg) scale(1.1); opacity: 0; }
          }
          @keyframes fireflyFloat {
            0%, 100% { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
            25% { transform: translateY(-8px) translateX(6px) scale(1.2); opacity: 1; }
            50% { transform: translateY(-16px) translateX(-4px) scale(0.8); opacity: 0.7; }
            75% { transform: translateY(-24px) translateX(4px) scale(1.1); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // PREMIUM AUTO AURA CARD - MODIFIED
  // Efek border membesar-mengecil (breathing) & partikel burst dari bawah
  const aura = (() => {
    if (isPinkBorder) return { a:'#F472B6', b:'#F9A8D4', c:'#FDA4AF', glow:'rgba(244,114,182,0.95)', soft:'rgba(249,168,212,0.55)' };
    if (isPurpleBorder) return { a:'#7E22CE', b:'#A855F7', c:'#C084FC', glow:'rgba(168,85,247,0.95)', soft:'rgba(216,180,254,0.55)' };
    if (isExclusivePurple) return { a:'#C026D3', b:'#A855F7', c:'#6366F1', glow:'rgba(168,85,247,0.95)', soft:'rgba(217,70,239,0.55)' };
    if (isDonatur) return { a:'#F59E0B', b:'#FDE047', c:'#EA580C', glow:'rgba(245,158,11,0.95)', soft:'rgba(253,224,71,0.55)' };
    if (isDevTeam) return { a:'#38BDF8', b:'#818CF8', c:'#6366F1', glow:'rgba(56,189,248,0.95)', soft:'rgba(129,140,248,0.55)' };
    if (isDeveloper) return { a:'#9CA3AF', b:'#FFFFFF', c:'#111827', glow:'rgba(255,255,255,0.95)', soft:'rgba(156,163,175,0.55)' };
    if (isHexBorder) return { a:preset.color, b:preset.color, c:'#FFFFFF', glow:preset.color, soft:`${preset.color}88` };
    return { a:'#60A5FA', b:'#A78BFA', c:'#22D3EE', glow:'rgba(96,165,250,0.85)', soft:'rgba(167,139,250,0.45)' };
  })();

  return (
    <div
      className={`premium-aura-shell group relative isolate rounded-[30px] ${className}`}
      style={{
        '--aura-a': aura.a,
        '--aura-b': aura.b,
        '--aura-c': aura.c,
        '--aura-glow': aura.glow,
        '--aura-soft': aura.soft,
        '--aura-border': isHexBorder ? preset.color : aura.a,
      }}
    >
      {/* Outer Outline with elegant breathing effect */}
      <div className="absolute -inset-[5px] rounded-[35px] premium-aura-outline pointer-events-none z-0" />
      <div className="absolute -inset-[2px] rounded-[32px] premium-aura-core pointer-events-none z-[1]" />

      {/* Burst Particles Container (Berulang dengan jeda berkat durasi animasi) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[8] rounded-[30px]">
        <b className="card-up-particle cup1" />
        <b className="card-up-particle cup2" />
        <b className="card-up-particle cup3" />
        <b className="card-up-particle cup4" />
        <b className="card-up-particle cup5" />
        <b className="card-up-particle cup6" />
        <b className="card-up-particle cup7" />
        <StarSparkle className="card-up-star cstar1 text-white" />
        <StarSparkle className="card-up-star cstar2 text-white" />
      </div>

      {/* Main Content Card */}
      <div className="relative h-full w-full rounded-[28px] bg-white/95 backdrop-blur-md ring-1 ring-white/60 z-10 overflow-hidden shadow-inner">
        {children}
      </div>

      <style>{`
        .premium-aura-shell {
          isolation: isolate;
          transform: translateZ(0);
        }

        /* Border Membesar Mengecil (Breath & Glow) tanpa muter-muter aneh */
        .premium-aura-outline {
          background: linear-gradient(135deg, var(--aura-a), var(--aura-b), var(--aura-c), var(--aura-a));
          background-size: 200% 200%;
          box-shadow: 0 0 15px var(--aura-soft), 0 0 30px var(--aura-glow);
          animation: cardBreathGlow 4s ease-in-out infinite, gradientFlow 8s linear infinite;
        }

        .premium-aura-core {
          border: 2px solid rgba(255,255,255,0.6);
          box-shadow: inset 0 0 10px rgba(255,255,255,0.5), inset 0 0 15px var(--aura-soft);
          animation: cardCoreBreath 4s ease-in-out infinite;
        }

        /* Konfigurasi bentuk Particle dan Star untuk melayang ke atas */
        .card-up-particle {
          position: absolute;
          bottom: 0px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 8px #fff, 0 0 15px var(--aura-glow);
          opacity: 0;
        }

        .card-up-star {
          position: absolute;
          bottom: -5px;
          width: 14px;
          height: 14px;
          filter: drop-shadow(0 0 8px var(--aura-glow));
          opacity: 0;
        }

        /* Animasi Naik & Fade - Durasi diset 6s agar ada jeda ~4.5 detik setelah partikel selesai */
        @keyframes particleBurstUp {
          0% { opacity: 0; transform: translateY(15px) scale(0.5); }
          5% { opacity: 1; transform: translateY(0px) scale(1.2); }
          15% { opacity: 0.8; transform: translateY(-80px) scale(1); }
          25% { opacity: 0; transform: translateY(-160px) scale(0.3); }
          100% { opacity: 0; transform: translateY(-160px) scale(0); }
        }

        /* Varian gerakan sedikit menyamping */
        @keyframes particleBurstUpAlt {
          0% { opacity: 0; transform: translateY(20px) scale(0.4) rotate(0deg); }
          6% { opacity: 0.9; transform: translateY(-5px) scale(1.1) rotate(45deg); }
          18% { opacity: 0.7; transform: translateY(-100px) scale(0.9) rotate(90deg); }
          28% { opacity: 0; transform: translateY(-200px) scale(0.2) rotate(135deg); }
          100% { opacity: 0; transform: translateY(-200px) scale(0) rotate(135deg); }
        }

        /* Timing bervariasi agar kemunculannya berbarengan di setiap wave per 6s */
        .cup1 { left: 15%; animation: particleBurstUp 6s ease-out infinite 0.1s; }
        .cup2 { left: 35%; width: 4px; height: 4px; animation: particleBurstUpAlt 6s ease-out infinite 0.3s; }
        .cup3 { left: 55%; width: 5px; height: 5px; animation: particleBurstUp 6s ease-out infinite 0s; }
        .cup4 { left: 75%; animation: particleBurstUpAlt 6s ease-out infinite 0.2s; }
        .cup5 { left: 85%; width: 4px; height: 4px; animation: particleBurstUp 6s ease-out infinite 0.4s; }
        .cup6 { left: 25%; animation: particleBurstUpAlt 6s ease-out infinite 0.15s; }
        .cup7 { left: 65%; width: 7px; height: 7px; animation: particleBurstUp 6s ease-out infinite 0.35s; }

        .cstar1 { left: 20%; animation: particleBurstUpAlt 6s ease-out infinite 0.25s; }
        .cstar2 { left: 70%; animation: particleBurstUp 6s ease-out infinite 0.05s; }

        @keyframes cardBreathGlow {
          0%, 100% {
            transform: scale(0.995);
            box-shadow: 0 0 15px var(--aura-soft), 0 0 30px var(--aura-glow);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.015);
            box-shadow: 0 0 20px var(--aura-soft), 0 0 45px var(--aura-glow), 0 0 70px var(--aura-soft);
            opacity: 1;
          }
        }

        @keyframes cardCoreBreath {
          0%, 100% { opacity: 0.7; transform: scale(0.995); }
          50% { opacity: 1; transform: scale(1.015); }
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .premium-aura-shell *, .premium-aura-shell { animation:none !important; transition:none !important; }
        }
      `}</style>
    </div>
  );
}