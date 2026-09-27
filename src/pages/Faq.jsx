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
  faCode,
  faTimes,
  faCrown,
  faUsers,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';

export default function Faq() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [showCreditModal, setShowCreditModal] = useState(false);

  const toggleFaq = (e, index) => {
    // Mencegah browser melakukan auto-scroll / jumping fokus
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
        <div className="flex items-center gap-3 pt-2">
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

        {/* Tombol Modal Kredit Pengembang */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 rounded-2xl shadow-md text-white flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[9px] font-bold text-indigo-300">
              <FontAwesomeIcon icon={faCode} /> Development Team
            </span>
            <h3 className="text-xs font-black tracking-wide">Kredit & Tim Pengembang</h3>
            <p className="text-[10px] text-slate-300 font-medium">Mengenal sosok di balik layar aplikasi FinClass</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreditModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-xl shadow-lg shadow-indigo-600/30 transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            Lihat Kredit
          </button>
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

      {/* Modal Overlay Kredit Pengembang */}
      {showCreditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 text-sm">
                  <FontAwesomeIcon icon={faCode} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wide">Kredit Pengembang</h3>
                  <p className="text-[10px] text-slate-400">Tim balik layar ekosistem FinClass</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreditModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-left">
              
              {/* Lead Developer */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/80 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-md shadow-indigo-600/20">
                    <FontAwesomeIcon icon={faCrown} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-slate-900">Aldo Rendy (Allzxxo)</h4>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-wider">
                        Fullstack Developer
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      Penanggung jawab utama perancangan arsitektur sistem, pengembangan antarmuka (Frontend), infrastruktur server (Backend API), integrasi database, serta pengelolaan keamanan data sistem secara menyeluruh.
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Team Header */}
              <div className="pt-1 pb-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUsers} className="text-indigo-500" /> Tim Pendukung & Kolaborator
                </span>
              </div>

              {/* Contributor 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                  AR
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Ayyub Rashif</h5>
                  <p className="text-[10px] text-indigo-600 font-bold mb-0.5">Support & Quality Assurance</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Memberikan dukungan teknis, analisis pengujian fungsionalitas aplikasi, dan pengujian kualitas sistem.
                  </p>
                </div>
              </div>

              {/* Contributor 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                  GS
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Gaung Sabilillah</h5>
                  <p className="text-[10px] text-indigo-600 font-bold mb-0.5">Development Support</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Mendukung operasional alur kerja pengembangan serta validasi kebutuhan pengguna harian.
                  </p>
                </div>
              </div>

              {/* Contributor 3 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                  BA
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Brian Adira</h5>
                  <p className="text-[10px] text-indigo-600 font-bold mb-0.5">Ideation & Product Strategy</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Penyedia kontribusi ide awal, perancangan konsep produk, serta masukan alur fungsionalitas manajemen kas.
                  </p>
                </div>
              </div>

              {/* App Philosophy Footer Note */}
              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                  <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" /> FinClass — Diciptakan untuk efisiensi dan transparansi kas kelas.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center shrink-0">
              <button
                type="button"
                onClick={() => setShowCreditModal(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
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