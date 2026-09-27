import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faCircleQuestion, 
  faChevronDown, 
  faChevronUp,
  faFlask,
  faTimes,
  faCode
} from '@fortawesome/free-solid-svg-icons';

export default function Faq() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [showCreditModal, setShowCreditModal] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const toggleFaq = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
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
      a: "Kode Akses Publik dapat dilihat oleh Bendahara pada halaman Pengaturan Kelas atau Dashboard Utama. Kode ini yang dibagikan kepada anggota kelas agar mereka bisa terhubung ke kelas Anda."
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
      a: "Aman. Semua data tersimpan di server database cloud secara terpusat, sehingga data Anda tidak akan hilang meskipun Anda berpindah perangkat atau melakukan logout."
    },
    {
      q: "Bagaimana jika ada bug atau kesalahan perhitungan di aplikasi?",
      a: "Karena aplikasi masih dalam tahap pengembangan (Beta), Anda bisa melaporkan bug atau kendala teknis langsung ke pengembang melalui kontak pengembang di halaman Profil."
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-4 pb-6">
        
        {/* Top Header dengan Tombol Kembali */}
        <div className="sticky top-0 z-30 -mx-4 -mt-4 border-b border-slate-100 bg-slate-50/95 px-4 pb-3 pt-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate('/profile')} 
              className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
              <h1 className="text-base font-black text-slate-900">Bantuan & FAQ</h1>
              <p className="text-[10px] text-slate-400 font-semibold">Panduan penggunaan aplikasi kas</p>
            </div>
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

        {/* Tombol Modal Kredit Pengembang (Dibuat Flat, Tanpa Gradient, Support Theme Dinamis) */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-black text-indigo-700">Kredit & Tim Pengembang</h3>
            <p className="text-[10px] text-indigo-600 font-medium">Mengenal sosok di balik layar aplikasi FinClass</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreditModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-xl shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            Lihat Tim
          </button>
        </div>

        {/* Konten FAQ */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="text-center space-y-1 py-1">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl mx-auto shadow-sm">
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
                    onClick={(e) => toggleFaq(e, index)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 font-bold text-slate-800 text-xs hover:bg-slate-100/60 transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <FontAwesomeIcon 
                      icon={isOpen ? faChevronUp : faChevronDown} 
                      className="text-[10px] text-slate-400 shrink-0" 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100/60 pt-2.5 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal Overlay Kredit Pengembang (Professional, Flat, Clean) */}
      {showCreditModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
                  <FontAwesomeIcon icon={faCode} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Tim Pengembang</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Ekosistem FinClass</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreditModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Modal Body (Clean Typography, No Cards) */}
            <div className="p-6 overflow-y-auto space-y-6 text-left">
              
              {/* Lead Developer */}
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  Aldo Rendy
                  <span className="text-[10px] font-bold text-slate-400">(Allzxxo)</span>
                </h4>
                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-wide mt-0.5">
                  Lead Fullstack Developer
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 font-medium">
                  Penanggung jawab utama perancangan arsitektur sistem, pengembangan antarmuka (Frontend), infrastruktur server (Backend API), integrasi database, serta pengelolaan keamanan data sistem secara menyeluruh.
                </p>
              </div>

              <hr className="border-slate-100" />

              {/* Contributor 1 */}
              <div>
                <h4 className="text-sm font-black text-slate-900">Ayyub Rashif</h4>
                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-wide mt-0.5">
                  Support & Quality Assurance
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 font-medium">
                  Memberikan dukungan teknis, analisis pengujian fungsionalitas aplikasi, dan memastikan standar kualitas sistem berjalan optimal.
                </p>
              </div>

              <hr className="border-slate-100" />

              {/* Contributor 2 */}
              <div>
                <h4 className="text-sm font-black text-slate-900">Gaung Sabilillah</h4>
                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-wide mt-0.5">
                  Development Support
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 font-medium">
                  Mendukung operasional alur kerja pengembangan serta validasi kebutuhan pengguna harian untuk fitur-fitur baru.
                </p>
              </div>

              <hr className="border-slate-100" />

              {/* Contributor 3 */}
              <div>
                <h4 className="text-sm font-black text-slate-900">Brian Adira</h4>
                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-wide mt-0.5">
                  Ideation & Product Strategy
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 font-medium">
                  Penyedia ide-ide krusial awal, perancangan konsep produk, serta masukan alur fungsionalitas manajemen kas sekolah.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-100 text-center shrink-0">
              <button
                type="button"
                onClick={() => setShowCreditModal(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </MainLayout>
  );
}