import React from 'react';

export const EXCLUSIVE_USER_EMAILS = [
  {
    email: 'allzxxott@gmail.com',
    label: 'VIP',
    accent: 'from-cyan-400 via-sky-500 to-violet-500',
    chip: 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white border border-white/30',
    glow: 'shadow-[0_0_0_1px_rgba(34,211,238,0.55),0_0_18px_rgba(59,130,246,0.22)]'
  },
  {
    email: 'admin@finclass.id',
    label: 'EXCLUSIVE',
    accent: 'from-fuchsia-500 via-violet-500 to-indigo-500',
    chip: 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white border border-white/30',
    glow: 'shadow-[0_0_0_1px_rgba(168,85,247,0.55),0_0_18px_rgba(168,85,247,0.22)]'
  },
  {
    email: 'rizky@gmail.com',
    label: 'ELITE',
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    chip: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border border-white/30',
    glow: 'shadow-[0_0_0_1px_rgba(16,185,129,0.55),0_0_18px_rgba(45,212,191,0.2)]'
  }
];

export const normalizeEmail = (email = '') => String(email || '').trim().toLowerCase();

export const getExclusiveUserPreset = (email) => {
  const target = normalizeEmail(email);
  return EXCLUSIVE_USER_EMAILS.find(({ email: allowedEmail }) => normalizeEmail(allowedEmail) === target) || null;
};

export function ExclusiveProfileShell({ email, className = '', children, variant = 'card' }) {
  const preset = getExclusiveUserPreset(email);

  if (!preset) {
    return <div className={className}>{children}</div>;
  }

  if (variant === 'avatar') {
    return (
      <div className={`relative overflow-hidden rounded-full p-[2px] bg-gradient-to-br ${preset.accent} ${preset.glow} ${className}`}>
        <div className="relative h-full w-full overflow-hidden rounded-full bg-white/90">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-[26px] border border-white/40 bg-gradient-to-r ${preset.accent} p-[1.5px] ${preset.glow} ${className}`}>
      <div className="relative h-full w-full rounded-[24px] bg-white/90 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
