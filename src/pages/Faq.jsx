import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faCircleQuestion, 
  faChevronDown, 
  faChevronUp,
  faFlask
} from '@fortawesome/free-solid-svg-icons';

export default function Faq() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqList = [
    {
      q: "Bagaimana cara ganti nama atau data siswa?",
      a: "Saat ini fitur edit nama siswa sedang dikembangkan. Untuk sementara, Anda bisa menghapus siswa terlebih dahulu di menu 'Kelola Anggota', lalu menambahkannya ulang dengan nama yang benar."
    },
    {
      q: "Apakah siswa biasa bisa melihat saldo dan transparansi kas?",
      a: "Bisa. Siswa cukup mendaftar akun dengan role 'Siswa', lalu masukkan Kode Akses Publik kelas yang diberikan oleh Bendahara. Siswa dapat melihat riwayat saldo, pencatatan kas, dan status tunggakan."
    },
    {
      q: "Siapa saja yang bisa menambah atau mengubah data pembayaran?",
      a: "Hanya akun dengan role 'Bendahara' yang memiliki hak akses penuh untuk mencatat uang masuk, pengeluaran, mencentang pembayaran kas bulanan, dan mengelola anggota kelas."
    },
    {
      q: "Di mana saya bisa menemukan Kode Akses Publik kelas?",
      a: "Kode Akses Publik dapat dilihat oleh Bendahara pada halaman Pengaturan Kelas atau Dashboard Utama. Kode ini yang bagikan kepada anggota kelas agar mereka bisa terhubung ke kelas Anda."
    },
    {
      q: "Kenapa saya tidak bisa menghapus siswa atau menambah transaksi?",
      a: "Pastikan Anda masuk sebagai Bendahara (bukan Siswa) dan memiliki koneksi internet yang lancar. Jika masih gagal, coba muat ulang (refresh) aplikasi."
    },
    {
      q: "Bagaimana cara kerja pencatatan Kas Bulanan?",
      a: "Bendahara memilih periode bulan, lalu cukup mengklik kotak tanggal pada nama siswa yang bersangkutan. Checklist akan berubah menjadi hijau dan otomatis menyimpan status pembayaran serta memperbarui rekap belum bayar."
    },
    {
      q: "Apakah data kas kelas aman jika saya logout?",
      a: "Aman. Semua data tersimpan di server database cloud secara terpusat, sehingga data Anda tidak akan hilang meskipun Anda berpangkat perangkat atau melakukan logout."
    },
    {
      q: "Bagaimana jika ada bug atau kesalahan perhitungan di aplikasi?",
      a: "Karena aplikasi masih dalam tahap pengembangan (Beta), Anda bisa melaporkan bug atau kendala teknis langsung ke pengembang melalui kontak pengembang di halaman Profil."
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-4 pb-4">
        
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

        {/* Disclaimer Beta App */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <FontAwesomeIcon icon={faFlask} className="text-sm" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-black text-amber-900">Versi Beta / Dalam Pengembangan</h3>
            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
              FinClass masih dalam tahap pengujian Beta. Fitur-fitur baru dan perbaikan akan terus diperbarui secara berkala. Jika Anda menemukan bug, keterlambatan data, atau memiliki saran, bantuan Anda sangat berarti untuk pengembangan aplikasi ini!
            </p>
          </div>
        </div>

        {/* Konten FAQ */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="text-center space-y-1 py-1">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl mx-auto shadow-inner">
              <FontAwesomeIcon icon={faCircleQuestion} />
            </div>
            <h2 className="text-sm font-black text-slate-800 pt-1">Pertanyaan Sering Diajukan</h2>
            <p className="text-[10px] text-slate-400">Klik pada pertanyaan untuk melihat jawaban</p>
          </div>

          <div className="space-y-2">
            {faqList.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="border border-slate-100 rounded-xl bg-slate-50/50 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 font-bold text-slate-800 text-xs hover:bg-slate-100/60 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <FontAwesomeIcon 
                      icon={isOpen ? faChevronUp : faChevronDown} 
                      className="text-[10px] text-slate-400 shrink-0" 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-0 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100/60 pt-2 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}