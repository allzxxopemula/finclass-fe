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

  return (
    <div
      className={`profile-shell group relative isolate overflow-visible rounded-[28px] p-[3px] ${preset.glow || ''} ${className} transition-all duration-500 ease-out
        ${isHexBorder ? '' : `bg-gradient-to-r ${preset.accent}`}`}
      style={{
        ...customHexStyle,
        '--hover-c1': isPinkBorder ? '#FDF2F8' : isPurpleBorder ? '#E9D5FF' : isExclusivePurple ? '#F5F3FF' : isDonatur ? '#FEF3C7' : isDevTeam ? '#E0F2FE' : isDeveloper ? '#F9FAFB' : isHexBorder ? resolvedBorderValue : '#FFFFFF',
        '--hover-c2': isPinkBorder ? '#F472B6' : isPurpleBorder ? '#A855F7' : isExclusivePurple ? '#C026D3' : isDonatur ? '#F59E0B' : isDevTeam ? '#38BDF8' : isDeveloper ? '#9CA3AF' : isHexBorder ? resolvedBorderValue : '#A855F7',
        '--hover-c3': isPinkBorder ? '#FDA4AF' : isPurpleBorder ? '#6B21A8' : isExclusivePurple ? '#6366F1' : isDonatur ? '#EA580C' : isDevTeam ? '#6366F1' : isDeveloper ? '#111827' : isHexBorder ? resolvedBorderValue : '#6366F1',
      }}
    >
      {/* ULTRA HOVER PROFILE OUTLINE — OUTER SHELL ONLY.
          Avatar/photo and its border remain completely untouched. */}
      <div className="profile-hover-system pointer-events-none absolute -inset-[18px] rounded-[46px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true">
        {/* Thick atmospheric glow */}
        <div className="profile-hover-aura absolute -inset-[3px] rounded-[39px]" />

        {/* Main thick animated outline */}
        <div className="profile-hover-ring profile-hover-ring-main absolute -inset-[1px] rounded-[35px]" />
        <div className="profile-hover-ring profile-hover-ring-inner absolute inset-[3px] rounded-[31px]" />
        <div className="profile-hover-ring profile-hover-ring-outer absolute -inset-[7px] rounded-[41px]" />

        {/* Different path: SVG dash travels around the whole profile instead of simply spinning a gradient */}
        <svg className="profile-hover-path absolute -inset-[11px] h-[calc(100%+22px)] w-[calc(100%+22px)] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect x="5" y="5" width="90" height="90" rx="20" fill="none" pathLength="1000" className="profile-hover-trace profile-hover-trace-a" />
          <rect x="9" y="9" width="82" height="82" rx="17" fill="none" pathLength="1000" className="profile-hover-trace profile-hover-trace-b" />
        </svg>

        {/* Four independent light runners — each follows a different route */}
        <span className="profile-hover-runner runner-a" />
        <span className="profile-hover-runner runner-b" />
        <span className="profile-hover-runner runner-c" />
        <span className="profile-hover-runner runner-d" />

        {/* Corner energy brackets */}
        <span className="profile-hover-corner corner-tl" />
        <span className="profile-hover-corner corner-tr" />
        <span className="profile-hover-corner corner-bl" />
        <span className="profile-hover-corner corner-br" />

        {/* Floating particles around the outline */}
        <span className="profile-hover-particle particle-1" />
        <span className="profile-hover-particle particle-2" />
        <span className="profile-hover-particle particle-3" />
        <span className="profile-hover-particle particle-4" />
        <span className="profile-hover-particle particle-5" />
        <span className="profile-hover-particle particle-6" />

        {/* Diagonal energy sweep */}
        <div className="profile-hover-sweep absolute -inset-[20px] overflow-hidden rounded-[50px]">
          <div className="profile-hover-sweep-beam" />
        </div>
      </div>
      {isDeveloper && (
        <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#E5E7EB_15%,#111827_35%,#FFFFFF_50%,#000000_65%,#D1D5DB_85%,#000000_100%)] opacity-95" />
      )}
      {isDevTeam && (
        <div className="absolute -inset-[150%] animate-[devTeamSpin_3s_cubic-bezier(0.68,-0.55,0.27,1.55)_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#38BDF8_0%,#FFFFFF_20%,#6366F1_50%,#FFFFFF_80%,#38BDF8_100%)] opacity-95" />
      )}
      {isDonatur && (
        <div className="absolute -inset-[150%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#F59E0B_0%,#FDE047_25%,#EA580C_50%,#FDE047_75%,#F59E0B_100%)] opacity-95" />
      )}
      {isExclusivePurple && (
        <div className="absolute -inset-[150%] animate-[spinReverse_7s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#C026D3_0%,#F5F3FF_25%,#A855F7_50%,#F5F3FF_75%,#C026D3_100%)] opacity-95" />
      )}
      {isPurpleBorder && (
        <div className="absolute -inset-[150%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#6B21A8_0%,#D8B4FE_20%,#9333EA_50%,#D8B4FE_80%,#6B21A8_100%)] opacity-95" />
      )}
      {isPinkBorder && (
        <>
          <div className="absolute -inset-[150%] animate-[spinReverse_7s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#F472B6_0%,#FDF2F8_25%,#F9A8D4_50%,#FDF2F8_75%,#F472B6_100%)] opacity-95" />
          <div className="absolute inset-[2px] rounded-[26px] border border-white/80 shadow-[inset_0_0_18px_rgba(249,168,212,0.65)] pointer-events-none z-[5]" />
          <div className="absolute inset-0 rounded-[28px] bg-pink-300/10 animate-[pinkHalo_3s_ease-in-out_infinite] pointer-events-none z-[5]" />
          <div className="absolute inset-0 overflow-hidden rounded-[28px] pointer-events-none z-[6]">
            <div className="absolute -inset-full h-[250%] w-[250%] rotate-[35deg] animate-[pinkShimmer_4.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/65 to-transparent" />
          </div>
          <div className="absolute -top-1 left-1/4 z-[7] pointer-events-none animate-[pinkGleam_2.4s_ease-in-out_infinite]">
            <StarSparkle className="h-3.5 w-3.5 text-white drop-shadow-[0_0_7px_#F472B6]" />
          </div>
          <div className="absolute -bottom-1 right-1/4 z-[7] pointer-events-none animate-[pinkGleam_3s_ease-in-out_infinite_0.7s]">
            <StarSparkle className="h-3 w-3 text-pink-100 drop-shadow-[0_0_7px_#F9A8D4]" />
          </div>
        </>
      )}

      <div className="relative h-full w-full rounded-[24px] bg-white/90 backdrop-blur-md ring-1 ring-white/50 z-10">
        {children}
      </div>
      <style>{`
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

        /* =========================================================
           ULTRA PROFILE SHELL HOVER SYSTEM
           Outer shell only — avatar/photo is never modified.
           ========================================================= */
        .profile-shell {
          --hover-c1: #ffffff;
          --hover-c2: #a855f7;
          --hover-c3: #6366f1;
          transform: translateZ(0);
          isolation: isolate;
          will-change: transform, filter;
        }

        .profile-shell:hover {
          transform: translateY(-3px) scale(1.008);
          filter: saturate(1.12) brightness(1.025);
        }

        .profile-hover-system {
          z-index: 0;
          transform: translateZ(0);
          overflow: visible;
        }

        .profile-hover-aura {
          background:
            radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--hover-c1) 45%, transparent), transparent 28%),
            radial-gradient(circle at 88% 22%, color-mix(in srgb, var(--hover-c2) 48%, transparent), transparent 30%),
            radial-gradient(circle at 75% 88%, color-mix(in srgb, var(--hover-c3) 42%, transparent), transparent 32%);
          filter: blur(14px);
          opacity: .72;
          animation: hoverAuraPulse 2.8s ease-in-out infinite;
        }

        .profile-hover-ring {
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            var(--hover-c1) 38deg,
            var(--hover-c2) 82deg,
            transparent 132deg,
            var(--hover-c3) 196deg,
            var(--hover-c1) 238deg,
            transparent 286deg,
            var(--hover-c2) 330deg,
            transparent 360deg
          );
          padding: 4px;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          filter: drop-shadow(0 0 7px var(--hover-c2)) drop-shadow(0 0 22px color-mix(in srgb, var(--hover-c3) 70%, transparent));
        }

        .profile-hover-ring-main {
          animation: hoverRingOrbit 4.6s linear infinite;
          opacity: .98;
        }

        .profile-hover-ring-inner {
          padding: 2px;
          opacity: .72;
          animation: hoverRingPulse 1.9s ease-in-out infinite;
          filter: drop-shadow(0 0 8px var(--hover-c1));
        }

        .profile-hover-ring-outer {
          padding: 2px;
          opacity: .42;
          animation: hoverOuterDrift 6.5s ease-in-out infinite alternate;
          filter: blur(.25px) drop-shadow(0 0 12px var(--hover-c3));
        }

        .profile-hover-path {
          z-index: 4;
          overflow: visible;
          filter: drop-shadow(0 0 5px var(--hover-c2)) drop-shadow(0 0 13px var(--hover-c3));
        }

        .profile-hover-trace {
          fill: none;
          stroke-linecap: round;
          vector-effect: non-scaling-stroke;
        }

        .profile-hover-trace-a {
          stroke: var(--hover-c1);
          stroke-width: 1.4;
          stroke-dasharray: 115 55 24 42 8 18;
          stroke-dashoffset: 0;
          opacity: .95;
          animation: hoverTraceTravel 4.2s linear infinite;
        }

        .profile-hover-trace-b {
          stroke: var(--hover-c2);
          stroke-width: 2.1;
          stroke-dasharray: 36 18 8 68;
          opacity: .72;
          animation: hoverTraceTravelReverse 5.7s linear infinite;
        }

        .profile-hover-runner {
          position: absolute;
          width: 34px;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, var(--hover-c1), var(--hover-c2), transparent);
          box-shadow: 0 0 8px var(--hover-c1), 0 0 22px var(--hover-c2), 0 0 42px var(--hover-c3);
          opacity: .95;
          filter: blur(.15px);
        }

        .runner-a { top: 0; left: 8%; animation: runnerTop 2.7s cubic-bezier(.55,.08,.35,.92) infinite; }
        .runner-b { right: 0; top: 15%; width: 6px; height: 34px; animation: runnerRight 3.15s cubic-bezier(.55,.08,.35,.92) .35s infinite; }
        .runner-c { bottom: 0; right: 10%; animation: runnerBottom 2.95s cubic-bezier(.55,.08,.35,.92) .7s infinite; }
        .runner-d { left: 0; bottom: 18%; width: 6px; height: 34px; animation: runnerLeft 3.35s cubic-bezier(.55,.08,.35,.92) 1s infinite; }

        .profile-hover-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border-color: var(--hover-c1);
          filter: drop-shadow(0 0 6px var(--hover-c2)) drop-shadow(0 0 15px var(--hover-c3));
          opacity: .95;
          animation: cornerPulse 1.8s ease-in-out infinite;
        }

        .corner-tl { left: -1px; top: -1px; border-left: 4px solid; border-top: 4px solid; border-radius: 10px 0 0 0; }
        .corner-tr { right: -1px; top: -1px; border-right: 4px solid; border-top: 4px solid; border-radius: 0 10px 0 0; animation-delay: .25s; }
        .corner-bl { left: -1px; bottom: -1px; border-left: 4px solid; border-bottom: 4px solid; border-radius: 0 0 0 10px; animation-delay: .5s; }
        .corner-br { right: -1px; bottom: -1px; border-right: 4px solid; border-bottom: 4px solid; border-radius: 0 0 10px 0; animation-delay: .75s; }

        .profile-hover-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--hover-c1);
          box-shadow: 0 0 5px var(--hover-c1), 0 0 13px var(--hover-c2), 0 0 26px var(--hover-c3);
          opacity: 0;
        }

        .particle-1 { left: 13%; top: -7px; animation: particleOrbitA 2.8s ease-in-out infinite; }
        .particle-2 { right: 19%; top: -10px; width: 3px; height: 3px; animation: particleOrbitB 3.4s ease-in-out .3s infinite; }
        .particle-3 { right: -8px; top: 42%; animation: particleOrbitC 2.5s ease-in-out .6s infinite; }
        .particle-4 { right: 24%; bottom: -9px; width: 3px; height: 3px; animation: particleOrbitD 3.1s ease-in-out .9s infinite; }
        .particle-5 { left: -7px; bottom: 23%; animation: particleOrbitE 3.7s ease-in-out 1.2s infinite; }
        .particle-6 { left: 31%; top: 50%; width: 3px; height: 3px; animation: particleOrbitF 2.9s ease-in-out 1.5s infinite; }

        .profile-hover-sweep { opacity: .9; z-index: 3; }
        .profile-hover-sweep-beam {
          position: absolute;
          width: 18%;
          height: 180%;
          left: -28%;
          top: -40%;
          transform: rotate(28deg);
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--hover-c1) 85%, transparent), color-mix(in srgb, var(--hover-c2) 60%, transparent), transparent);
          filter: blur(7px);
          opacity: 0;
        }

        .profile-shell:hover .profile-hover-sweep-beam {
          animation: hoverBeamTravel 2.2s cubic-bezier(.2,.7,.2,1) infinite;
        }

        @keyframes hoverAuraPulse {
          0%, 100% { opacity: .45; transform: scale(.98); filter: blur(15px); }
          50% { opacity: .9; transform: scale(1.045); filter: blur(11px); }
        }

        @keyframes hoverRingOrbit {
          0% { transform: rotate(0deg) scale(.99); }
          50% { transform: rotate(180deg) scale(1.015); }
          100% { transform: rotate(360deg) scale(.99); }
        }

        @keyframes hoverRingPulse {
          0%, 100% { opacity: .42; transform: scale(.995); }
          50% { opacity: .95; transform: scale(1.025); }
        }

        @keyframes hoverOuterDrift {
          0% { transform: translate(-2px, 1px) rotate(-1deg) scale(.985); }
          50% { transform: translate(2px, -2px) rotate(1deg) scale(1.015); }
          100% { transform: translate(-1px, 2px) rotate(-.5deg) scale(1); }
        }

        @keyframes hoverTraceTravel { to { stroke-dashoffset: -1000; } }
        @keyframes hoverTraceTravelReverse { to { stroke-dashoffset: 1000; } }

        @keyframes runnerTop {
          0% { transform: translateX(0) scaleX(.7); opacity: 0; }
          12% { opacity: 1; }
          55% { transform: translateX(420%) scaleX(1.2); opacity: 1; }
          100% { transform: translateX(560%) scaleX(.5); opacity: 0; }
        }
        @keyframes runnerRight {
          0% { transform: translateY(0) scaleY(.7); opacity: 0; }
          12% { opacity: 1; }
          55% { transform: translateY(260%) scaleY(1.2); opacity: 1; }
          100% { transform: translateY(390%) scaleY(.5); opacity: 0; }
        }
        @keyframes runnerBottom {
          0% { transform: translateX(0) scaleX(.7); opacity: 0; }
          12% { opacity: 1; }
          55% { transform: translateX(-430%) scaleX(1.2); opacity: 1; }
          100% { transform: translateX(-570%) scaleX(.5); opacity: 0; }
        }
        @keyframes runnerLeft {
          0% { transform: translateY(0) scaleY(.7); opacity: 0; }
          12% { opacity: 1; }
          55% { transform: translateY(-270%) scaleY(1.2); opacity: 1; }
          100% { transform: translateY(-400%) scaleY(.5); opacity: 0; }
        }

        @keyframes cornerPulse {
          0%, 100% { opacity: .5; filter: drop-shadow(0 0 3px var(--hover-c2)); transform: scale(.92); }
          50% { opacity: 1; filter: drop-shadow(0 0 8px var(--hover-c2)) drop-shadow(0 0 18px var(--hover-c3)); transform: scale(1.08); }
        }

        @keyframes particleOrbitA { 0%,100% { transform: translate(0,0) scale(.4); opacity: 0; } 25% { opacity: 1; } 55% { transform: translate(25px,-13px) scale(1.3); opacity: 1; } 100% { transform: translate(58px,8px) scale(.2); opacity: 0; } }
        @keyframes particleOrbitB { 0%,100% { transform: translate(0,0) scale(.3); opacity: 0; } 30% { opacity: 1; } 60% { transform: translate(-30px,17px) scale(1.2); opacity: .9; } 100% { transform: translate(-50px,45px) scale(.2); opacity: 0; } }
        @keyframes particleOrbitC { 0%,100% { transform: translate(0,0) scale(.4); opacity: 0; } 35% { opacity: 1; } 70% { transform: translate(15px,28px) scale(1.4); opacity: .8; } 100% { transform: translate(-18px,52px) scale(.1); opacity: 0; } }
        @keyframes particleOrbitD { 0%,100% { transform: translate(0,0) scale(.2); opacity: 0; } 25% { opacity: 1; } 65% { transform: translate(-38px,-18px) scale(1.2); opacity: .9; } 100% { transform: translate(-65px,-3px) scale(.1); opacity: 0; } }
        @keyframes particleOrbitE { 0%,100% { transform: translate(0,0) scale(.3); opacity: 0; } 30% { opacity: 1; } 65% { transform: translate(28px,-30px) scale(1.25); opacity: .9; } 100% { transform: translate(55px,-8px) scale(.1); opacity: 0; } }
        @keyframes particleOrbitF { 0%,100% { transform: translate(0,0) scale(.2); opacity: 0; } 35% { opacity: 1; } 65% { transform: translate(18px,24px) scale(1.3); opacity: .8; } 100% { transform: translate(-12px,46px) scale(.1); opacity: 0; } }

        @keyframes hoverBeamTravel {
          0% { left: -35%; opacity: 0; }
          12% { opacity: .8; }
          58% { opacity: .95; }
          100% { left: 125%; opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-shell,
          .profile-hover-outline,
          .profile-hover-outline::before,
          .profile-hover-outline::after,
          .profile-hover-sweep,
          .profile-hover-dots {
            animation: none !important;
            transition: none !important;
          }

          .profile-shell:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}