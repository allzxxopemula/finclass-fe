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

          {/* EXCLUSIVE PURPLE — SAME EFFECT STRUCTURE AS SECRET PINK */}
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

        {/* OVERLAYS PARTICLES */}
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

        {/* EXCLUSIVE PURPLE PARTICLES — SAME PATTERN AS PINK */}
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

  // PREMIUM AUTO AURA — no hover required. The outer profile frame breathes,
  // expands, contracts, pulses and emits particles continuously.
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
      {/* Wide breathing aura — deliberately NOT a rotating border. */}
      <div className="absolute -inset-[12px] rounded-[38px] premium-aura-bloom pointer-events-none" />
      <div className="absolute -inset-[7px] rounded-[35px] premium-aura-bloom-2 pointer-events-none" />

      {/* Thick premium outline */}
      <div className="absolute -inset-[5px] rounded-[35px] premium-aura-outline pointer-events-none" />
      <div className="absolute -inset-[2px] rounded-[32px] premium-aura-core pointer-events-none" />

      {/* Four independent energy runners. They follow the frame perimeter rather than spinning the whole border. */}
      <div className="absolute inset-[-7px] rounded-[37px] overflow-visible pointer-events-none z-[6]">
        <span className="aura-runner aura-runner-1" />
        <span className="aura-runner aura-runner-2" />
        <span className="aura-runner aura-runner-3" />
        <span className="aura-runner aura-runner-4" />
      </div>

      {/* Corner energy accents */}
      <div className="absolute -inset-[7px] rounded-[37px] pointer-events-none z-[7] overflow-visible">
        <i className="aura-corner aura-corner-tl" />
        <i className="aura-corner aura-corner-tr" />
        <i className="aura-corner aura-corner-br" />
        <i className="aura-corner aura-corner-bl" />
      </div>

      {/* Non-uniform particles: different paths, durations and delays. */}
      <div className="absolute -inset-[18px] pointer-events-none z-[8] overflow-visible">
        <b className="aura-particle p1" />
        <b className="aura-particle p2" />
        <b className="aura-particle p3" />
        <b className="aura-particle p4" />
        <b className="aura-particle p5" />
        <b className="aura-particle p6" />
        <b className="aura-particle p7" />
        <b className="aura-particle p8" />
      </div>

      {/* Slow diagonal energy wash. */}
      <div className="absolute inset-[-20%] rounded-[40px] overflow-hidden pointer-events-none z-[4]">
        <div className="aura-energy-wash" />
      </div>

      {/* Content stays untouched: this is the outer outline only. */}
      <div className="relative h-full w-full rounded-[27px] bg-white/90 backdrop-blur-md ring-1 ring-white/50 z-10 overflow-hidden">
        {children}
      </div>

      <style>{`
        .premium-aura-shell {
          isolation: isolate;
          transform: translateZ(0);
        }

        /* The frame changes thickness/glow continuously, but never snaps. */
        .premium-aura-outline {
          background: linear-gradient(118deg,
            var(--aura-a) 0%,
            var(--aura-b) 25%,
            var(--aura-c) 50%,
            var(--aura-b) 75%,
            var(--aura-a) 100%);
          background-size: 260% 260%;
          box-shadow:
            0 0 12px var(--aura-soft),
            0 0 28px var(--aura-glow),
            0 0 58px color-mix(in srgb, var(--aura-glow) 55%, transparent);
          animation: premiumAuraBreath 6.8s cubic-bezier(.45,0,.25,1) infinite,
                     premiumAuraGradient 11s cubic-bezier(.37,0,.22,1) infinite;
        }

        .premium-aura-core {
          border: 2px solid rgba(255,255,255,.78);
          box-shadow:
            inset 0 0 9px rgba(255,255,255,.65),
            inset 0 0 22px var(--aura-soft),
            0 0 10px var(--aura-glow);
          animation: premiumCorePulse 5.6s cubic-bezier(.4,0,.2,1) infinite;
        }

        .premium-aura-bloom {
          background: var(--aura-glow);
          filter: blur(18px);
          opacity: .26;
          animation: premiumBloom 7.5s cubic-bezier(.4,0,.2,1) infinite;
        }

        .premium-aura-bloom-2 {
          background: radial-gradient(circle, var(--aura-soft), transparent 66%);
          filter: blur(9px);
          opacity: .34;
          animation: premiumBloom2 5.9s cubic-bezier(.45,0,.25,1) infinite;
        }

        /* Runners use offset motion, not whole-frame rotation. */
        .aura-runner {
          position:absolute;
          display:block;
          width:25%;
          height:4px;
          border-radius:999px;
          background:linear-gradient(90deg, transparent, #fff 35%, var(--aura-b) 65%, transparent);
          box-shadow:0 0 10px #fff,0 0 22px var(--aura-glow),0 0 38px var(--aura-soft);
          opacity:.9;
        }
        .aura-runner-1 { top:-2px; left:-4%; animation:auraRunnerTop 7.2s cubic-bezier(.42,0,.18,1) infinite; }
        .aura-runner-2 { right:-2px; top:-4%; width:4px; height:25%; animation:auraRunnerRight 6.6s cubic-bezier(.42,0,.18,1) infinite .8s; }
        .aura-runner-3 { bottom:-2px; right:-4%; animation:auraRunnerBottom 7.8s cubic-bezier(.42,0,.18,1) infinite 1.5s; }
        .aura-runner-4 { left:-2px; bottom:-4%; width:4px; height:25%; animation:auraRunnerLeft 6.9s cubic-bezier(.42,0,.18,1) infinite 2.2s; }

        .aura-corner {
          position:absolute;
          width:18px;
          height:18px;
          border-color:var(--aura-b);
          filter:drop-shadow(0 0 7px var(--aura-glow));
          opacity:.95;
          animation:auraCornerPulse 4.8s cubic-bezier(.4,0,.2,1) infinite;
        }
        .aura-corner-tl { top:0; left:0; border-top:3px solid; border-left:3px solid; border-top-left-radius:8px; }
        .aura-corner-tr { top:0; right:0; border-top:3px solid; border-right:3px solid; border-top-right-radius:8px; animation-delay:.7s; }
        .aura-corner-br { bottom:0; right:0; border-bottom:3px solid; border-right:3px solid; border-bottom-right-radius:8px; animation-delay:1.4s; }
        .aura-corner-bl { bottom:0; left:0; border-bottom:3px solid; border-left:3px solid; border-bottom-left-radius:8px; animation-delay:2.1s; }

        .aura-particle {
          position:absolute;
          width:5px;
          height:5px;
          border-radius:50%;
          background:#fff;
          box-shadow:0 0 7px #fff,0 0 15px var(--aura-glow),0 0 24px var(--aura-soft);
          opacity:0;
        }
        .p1{top:4%;left:17%;animation:auraParticle1 5.7s cubic-bezier(.37,0,.22,1) infinite;}
        .p2{top:21%;right:2%;animation:auraParticle2 7.1s cubic-bezier(.37,0,.22,1) infinite 1s;}
        .p3{bottom:9%;right:21%;animation:auraParticle3 6.3s cubic-bezier(.37,0,.22,1) infinite 1.8s;}
        .p4{bottom:25%;left:1%;animation:auraParticle4 7.8s cubic-bezier(.37,0,.22,1) infinite .5s;}
        .p5{top:48%;left:10%;width:3px;height:3px;animation:auraParticle5 4.9s cubic-bezier(.37,0,.22,1) infinite 2.4s;}
        .p6{top:7%;right:30%;width:3px;height:3px;animation:auraParticle6 6.8s cubic-bezier(.37,0,.22,1) infinite 1.3s;}
        .p7{bottom:5%;left:35%;width:4px;height:4px;animation:auraParticle7 5.4s cubic-bezier(.37,0,.22,1) infinite 3s;}
        .p8{top:65%;right:7%;width:3px;height:3px;animation:auraParticle8 7.4s cubic-bezier(.37,0,.22,1) infinite 2s;}

        .aura-energy-wash {
          position:absolute;
          width:35%;
          height:180%;
          top:-40%;
          left:-45%;
          transform:rotate(24deg);
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),var(--aura-soft),rgba(255,255,255,.1),transparent);
          filter:blur(9px);
          opacity:0;
          animation:auraWash 9.5s cubic-bezier(.37,0,.22,1) infinite;
        }

        @keyframes premiumAuraBreath {
          0%,100% { transform:scale(.985); opacity:.76; background-position:0% 50%; box-shadow:0 0 10px var(--aura-soft),0 0 22px var(--aura-glow),0 0 42px var(--aura-soft); }
          24% { transform:scale(1.018); opacity:1; box-shadow:0 0 16px var(--aura-soft),0 0 36px var(--aura-glow),0 0 72px var(--aura-soft); }
          52% { transform:scale(1.032); opacity:.9; box-shadow:0 0 9px var(--aura-soft),0 0 25px var(--aura-glow),0 0 54px var(--aura-soft); }
          76% { transform:scale(1.005); opacity:1; box-shadow:0 0 20px var(--aura-soft),0 0 43px var(--aura-glow),0 0 82px var(--aura-soft); }
        }
        @keyframes premiumAuraGradient { 0%,100%{background-position:0% 40%;} 50%{background-position:100% 60%;} }
        @keyframes premiumCorePulse { 0%,100%{opacity:.7;transform:scale(.994);} 45%{opacity:1;transform:scale(1.014);} 72%{opacity:.82;transform:scale(1.004);} }
        @keyframes premiumBloom { 0%,100%{opacity:.18;transform:scale(.94);} 35%{opacity:.42;transform:scale(1.06);} 68%{opacity:.27;transform:scale(1.12);} }
        @keyframes premiumBloom2 { 0%,100%{opacity:.2;transform:scale(.96);} 50%{opacity:.5;transform:scale(1.09);} }

        @keyframes auraRunnerTop { 0%,10%{left:-28%;opacity:0;} 22%{opacity:1;} 54%{left:105%;opacity:.95;} 65%,100%{left:105%;opacity:0;} }
        @keyframes auraRunnerRight { 0%,10%{top:-28%;opacity:0;} 24%{opacity:1;} 57%{top:105%;opacity:.95;} 68%,100%{top:105%;opacity:0;} }
        @keyframes auraRunnerBottom { 0%,12%{right:-28%;opacity:0;} 25%{opacity:1;} 59%{right:105%;opacity:.95;} 70%,100%{right:105%;opacity:0;} }
        @keyframes auraRunnerLeft { 0%,9%{bottom:-28%;opacity:0;} 22%{opacity:1;} 56%{bottom:105%;opacity:.95;} 67%,100%{bottom:105%;opacity:0;} }
        @keyframes auraCornerPulse { 0%,100%{opacity:.45;transform:scale(.86);} 38%{opacity:1;transform:scale(1.14);} 62%{opacity:.72;transform:scale(1.02);} }

        @keyframes auraParticle1 { 0%,100%{transform:translate(0,0) scale(.3);opacity:0;} 18%{opacity:1;} 52%{transform:translate(28px,-18px) scale(1.15);opacity:.9;} 82%{transform:translate(52px,5px) scale(.55);opacity:0;} }
        @keyframes auraParticle2 { 0%,100%{transform:translate(0,0) scale(.2);opacity:0;} 22%{opacity:1;} 48%{transform:translate(-22px,31px) scale(1.2);opacity:1;} 78%{transform:translate(-4px,60px) scale(.4);opacity:0;} }
        @keyframes auraParticle3 { 0%,100%{transform:translate(0,0) scale(.25);opacity:0;} 20%{opacity:1;} 55%{transform:translate(-36px,-16px) scale(1.25);opacity:.9;} 83%{transform:translate(-58px,-40px) scale(.35);opacity:0;} }
        @keyframes auraParticle4 { 0%,100%{transform:translate(0,0) scale(.2);opacity:0;} 16%{opacity:1;} 50%{transform:translate(24px,-26px) scale(1.1);opacity:.8;} 80%{transform:translate(45px,-7px) scale(.3);opacity:0;} }
        @keyframes auraParticle5 { 0%,100%{transform:translate(0,0) scale(.2);opacity:0;} 35%{opacity:1;} 65%{transform:translate(19px,17px) scale(1.2);opacity:.8;} 90%{transform:translate(32px,-2px) scale(.2);opacity:0;} }
        @keyframes auraParticle6 { 0%,100%{transform:translate(0,0) scale(.2);opacity:0;} 25%{opacity:1;} 60%{transform:translate(-18px,21px) scale(1.1);opacity:.85;} 90%{transform:translate(-35px,35px) scale(.2);opacity:0;} }
        @keyframes auraParticle7 { 0%,100%{transform:translate(0,0) scale(.2);opacity:0;} 18%{opacity:1;} 55%{transform:translate(26px,-24px) scale(1.2);opacity:.85;} 84%{transform:translate(5px,-43px) scale(.25);opacity:0;} }
        @keyframes auraParticle8 { 0%,100%{transform:translate(0,0) scale(.2);opacity:0;} 22%{opacity:1;} 52%{transform:translate(-27px,-18px) scale(1.15);opacity:.9;} 86%{transform:translate(-42px,10px) scale(.25);opacity:0;} }
        @keyframes auraWash { 0%,15%{left:-45%;opacity:0;} 30%{opacity:.6;} 58%{left:125%;opacity:.25;} 68%,100%{left:125%;opacity:0;} }

        @media (prefers-reduced-motion: reduce) {
          .premium-aura-shell *, .premium-aura-shell { animation:none !important; transition:none !important; }
        }
      `}</style>
    </div>
  );
}