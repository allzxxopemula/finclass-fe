import React, { useEffect } from 'react';
import BottomNav from '../components/BottomNav';

export default function MainLayout({ children }) {
  useEffect(() => {
    const theme = localStorage.getItem('finclass-theme') || 'blue';
    document.documentElement.dataset.appTheme = theme;
    return () => {
      delete document.documentElement.dataset.appTheme;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      {/* Hapus min-h-screen, ganti dengan min-h-full dan pb-28 agar pas mentok di atas BottomNav */}
      <div className="w-full bg-slate-50 min-h-full flex flex-col justify-between pb-28 relative">
        <main className="w-full p-4 sm:p-6 md:p-8 space-y-6">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}