import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

export default function Faq() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-5 pb-2">
        
        {/* Top Header dengan Tombol Kembali */}
        <div className="flex items-center gap-3 pt-2">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900">Bantuan & FAQ</h1>
            <p className="text-[10px] text-slate-400 font-semibold">Panduan penggunaan aplikasi kas</p>
          </div>
        </div>

        {/* Konten FAQ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
            <FontAwesomeIcon icon={faCircleQuestion} />
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-1">
              <h4 className="font-bold text-slate-800 text-xs">Bagaimana cara ganti nama siswa?</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Saat ini Anda bisa menghapusnya terlebih dahulu di menu "Kelola Anggota", lalu menambahkannya ulang.</p>
            </div>
            
            <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-1">
              <h4 className="font-bold text-slate-800 text-xs">Apakah siswa bisa melihat saldo?</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Bisa. Siswa cukup mendaftar akun sebagai "Siswa", lalu masukkan Kode Akses Publik dari Bendahara kelas.</p>
            </div>
            
            <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-1">
              <h4 className="font-bold text-slate-800 text-xs">Kenapa saya tidak bisa hapus siswa?</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Pastikan Anda adalah Bendahara dan memiliki koneksi internet yang stabil untuk menggunakan fitur ini.</p>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}