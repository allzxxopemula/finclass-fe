import React from 'react';

export const EXCLUSIVE_USER_EMAILS = [
  {
    emails: ['allzxxott@gmail.com', 'allzxxo@gmail.com', 'developer@finclass.id'],
    label: 'DEVELOPER',
    accent: 'from-[#00f5ff] via-[#7c3aed] to-[#f59e0b]',
    chip: 'bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-white border border-white/30',
    glow: 'shadow-[0_0_0_1px_rgba(34,211,238,0.75),0_0_24px_rgba(34,211,238,0.55),0_0_44px_rgba(124,58,237,0.42),0_0_70px_rgba(245,158,11,0.15)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.95),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.85),_transparent_28%),linear-gradient(135deg,_rgba(34,211,238,0.2),_rgba(124,58,237,0.38),_rgba(245,158,11,0.22))]'
  },
  {
    email: 'aldorendyjulian@gmail.com',
    label: 'EXCLUSIVE',
    accent: 'from-fuchsia-500 via-violet-500 to-indigo-500',
    chip: 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white border border-white/30',
    glow: 'shadow-[0_0_0_1px_rgba(168,85,247,0.55),0_0_18px_rgba(168,85,247,0.22)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(217,70,239,0.65),_transparent_22%),linear-gradient(135deg,_rgba(168,85,247,0.22),_rgba(49,46,129,0.25))]'
  },
  {
    email: 'rizky@gmail.com',
    label: 'ELITE',
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    chip: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border border-white/30',
    glow: 'shadow-[0_0_0_1px_rgba(16,185,129,0.55),0_0_18px_rgba(45,212,191,0.2)]',
    shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.7),_transparent_22%),linear-gradient(135deg,_rgba(16,185,129,0.22),_rgba(6,182,212,0.24))]'
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

  if (variant === 'avatar') {
    return (
      <div className={`group relative isolate overflow-hidden rounded-full p-[2px] bg-gradient-to-br ${preset.accent} ${preset.glow} ${className}`}>
        <div className={`absolute inset-0 opacity-95 ${preset.shell} animate-[pulse_3s_ease-in-out_infinite]`} />
        <div className="relative h-full w-full overflow-hidden rounded-full bg-white/90">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative isolate overflow-hidden rounded-[28px] border border-white/55 bg-gradient-to-r ${preset.accent} p-[1.5px] ${preset.glow} ${className}`}>
      <div className={`absolute inset-0 opacity-90 ${preset.shell} animate-[pulse_3s_ease-in-out_infinite]`} />
      <div className="relative h-full w-full rounded-[26px] bg-white/85 backdrop-blur-sm ring-1 ring-white/40">
        {children}
      </div>
    </div>
  );
}
