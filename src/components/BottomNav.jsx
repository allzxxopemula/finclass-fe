import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faHandHoldingDollar, 
  faClockRotateLeft, 
  faUser 
} from '@fortawesome/free-solid-svg-icons';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-6 py-2.5 shadow-lg">
      <div className="w-full flex items-center justify-around max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            isActive('/home') ? 'text-indigo-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FontAwesomeIcon icon={faHouse} className="text-lg" />
          <span className="text-[10px]">Beranda</span>
        </button>

        <button
          onClick={() => navigate('/penarikan')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            isActive('/penarikan') ? 'text-indigo-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FontAwesomeIcon icon={faHandHoldingDollar} className="text-lg" />
          <span className="text-[10px]">Tarik Kas</span>
        </button>

        <button
          onClick={() => navigate('/history')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            isActive('/history') ? 'text-indigo-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FontAwesomeIcon icon={faClockRotateLeft} className="text-lg" />
          <span className="text-[10px]">Riwayat</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            isActive('/profile') ? 'text-indigo-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FontAwesomeIcon icon={faUser} className="text-lg" />
          <span className="text-[10px]">Profil</span>
        </button>
      </div>
    </div>
  );
}