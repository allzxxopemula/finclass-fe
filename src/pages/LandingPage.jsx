import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  Bell, 
  FileSpreadsheet, 
  Heart, 
  Sparkles,
  Users,
  Lock,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between font-sans scroll-smooth">
      {/* Navbar Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-1 text-lg md:text-xl font-extrabold tracking-tight cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <span className="text-indigo-600">FIN</span>
            <span className="text-slate-400 font-medium">CLASS</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#home" className="hover:text-indigo-600 transition-colors">Home</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#donation" className="hover:text-indigo-600 transition-colors">Support Dev</a>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-full shadow-md shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
            >
              Start
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto w-full px-5 py-8 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Column */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100">
            <Sparkles size={13} /> Platform Kas Kelas SaaS Modern
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Kelola Kas Kelas <br />
            <span className="text-indigo-500">Dengan Transparan</span>
          </h1>

          <p className="text-slate-500 text-sm md:text-lg max-w-md font-normal leading-relaxed">
            Otomatisasi pencatatan uang kas, pantau tunggakan siswa secara real-time, dan sajikan laporan keuangan kelas yang akurat serta anti-kecurangan.
          </p>

          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            Mulai Sekarang <ArrowRight size={18} />
          </button>

          {/* Stats Bar */}
          <div className="pt-6 grid grid-cols-3 gap-3 md:gap-6 border-t border-slate-100 w-full max-w-md">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">100+</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium">Transaksi</p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">50+</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium">Siswa Aktif</p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">100%</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium">Transparan</p>
            </div>
          </div>
        </div>

        {/* Right Column - Custom Image Placeholder (Ukuran Mobile Diperkecil) */}
        <div className="relative flex items-center justify-center order-first md:order-last">
          <img 
            src="/hero-img.png" 
            alt="FinClass Hero Illustration" 
            className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-lg h-auto object-contain drop-shadow-lg"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-slate-50 py-12 md:py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Solusi Masalah Transparansi Keuangan di Sekolah
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              <strong>FinClass</strong> hadir untuk memecahkan kendala klasik pencatatan kas kelas yang serba manual, sering hilang, atau tidak transparan. 
            </p>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Dengan arsitektur modern berbasis web, Bendahara, Wali Kelas, hingga Siswa memiliki akses pantau secara terintegrasi dengan tingkat keamanan data yang terjamin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 space-y-1.5">
              <Users className="text-indigo-500" size={24} />
              <h4 className="font-bold text-slate-800 text-sm md:text-base">Multi-Role Access</h4>
              <p className="text-xs text-slate-400">Hak akses terpisah untuk Bendahara, Siswa, dan Wali Kelas.</p>
            </div>
            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 space-y-1.5">
              <Lock className="text-indigo-500" size={24} />
              <h4 className="font-bold text-slate-800 text-sm md:text-base">Audit Trail System</h4>
              <p className="text-xs text-slate-400">Riwayat transaksi tercatat riil untuk mencegah manipulasi.</p>
            </div>
            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 space-y-1.5">
              <Zap className="text-indigo-500" size={24} />
              <h4 className="font-bold text-slate-800 text-sm md:text-base">Kalkulasi Otomatis</h4>
              <p className="text-xs text-slate-400">Tunggakan berkelipatan dihitung otomatis tiap minggu.</p>
            </div>
            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 space-y-1.5">
              <ShieldCheck className="text-indigo-500" size={24} />
              <h4 className="font-bold text-slate-800 text-sm md:text-base">Laporan Akurat</h4>
              <p className="text-xs text-slate-400">Export PDF/Excel otomatis sekali klik tanpa rumus rumit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-24 max-w-7xl mx-auto px-5 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Fitur Unggulan Modern</h2>
          <p className="text-slate-500 text-xs md:text-base">Dirancang khusus untuk mempermudah tugas bendahara & menjaga kepercayaan sekelas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-5 md:p-6 bg-white border border-slate-100 rounded-3xl shadow-md md:shadow-lg shadow-slate-100 space-y-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
              <QrCode size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">QRIS & Auto-Checklist</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Siswa bisa bayar via e-wallet/QRIS mandiri. Sistem otomatis men-checklist nama siswa tanpa input manual bendahara.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 md:p-6 bg-white border border-slate-100 rounded-3xl shadow-md md:shadow-lg shadow-slate-100 space-y-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
              <Bell size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">WhatsApp Auto Reminder</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Kirim pesan pengingat tagihan tunggakan kas otomatis ke WhatsApp siswa atau grup kelas bagi yang belum membayar.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 md:p-6 bg-white border border-slate-100 rounded-3xl shadow-md md:shadow-lg shadow-slate-100 space-y-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
              <FileSpreadsheet size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">Export Laporan & OCR Nota</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Catat pengeluaran lengkap dengan foto nota. Didukung scan otomatis OCR dan laporan PDF/Excel rapi untuk Wali Kelas.
            </p>
          </div>
        </div>
      </section>

      {/* Donation / Support Dev Section */}
      <section id="donation" className="bg-indigo-600 text-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-5 text-center space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/50 rounded-full text-xs font-semibold border border-indigo-400/30">
            <Heart size={12} className="text-rose-300 fill-rose-300" /> Support Developer
          </div>
          <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight">
            Dukung Pengembangan FinClass
          </h2>
          <p className="text-indigo-100 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            FinClass dapat digunakan secara gratis. Jika aplikasi ini membantu pengelolaan kas kelasmu, pertimbangkan untuk memberikan donasi kecil guna mendukung pengembangan fitur baru!
          </p>

          <a 
            href="https://saweria.co" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-indigo-600 text-xs md:text-sm font-bold rounded-2xl shadow-xl hover:bg-indigo-50 transition-all active:scale-95 w-full sm:w-auto"
          >
            <Heart size={16} className="text-rose-500 fill-rose-500" /> Support via Saweria / Trakteer
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-slate-400 border-t border-slate-100">
        © 2026 FinClass — Platform Kas Kelas Modern.
      </footer>
    </div>
  );
}