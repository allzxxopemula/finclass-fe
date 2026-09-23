import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  FileSpreadsheet, 
  Heart, 
  Sparkles,
  Users,
  Smartphone,
  LayoutDashboard,
  CloudLightning
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans scroll-smooth overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-slate-50 -z-10 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-indigo-400/10 blur-3xl -z-10 pointer-events-none"></div>

      {/* Navbar Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100/80 px-4 md:px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-1 text-lg md:text-xl font-extrabold tracking-tight cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center mr-1 shadow-md shadow-indigo-200">
              <span className="text-sm">FC</span>
            </div>
            <span className="text-slate-800">Fin</span>
            <span className="text-indigo-600">Class</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#home" className="hover:text-indigo-600 transition-colors">Beranda</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">Tentang</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Fitur</a>
            <a href="#donation" className="hover:text-indigo-600 transition-colors">Dukung Kami</a>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs md:text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
            >
              Masuk
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-5 py-2 text-xs md:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
            >
              Daftar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto w-full px-5 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100/50 text-indigo-700 rounded-full text-[11px] md:text-xs font-bold border border-indigo-200/50">
            <Sparkles size={14} className="text-indigo-500" /> Platform Pengelola Kas Kelas
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Kelola Uang Kas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
              Lebih Rapi & Aman
            </span>
          </h1>

          <p className="text-slate-500 text-sm md:text-lg max-w-lg font-medium leading-relaxed">
            Tinggalkan buku kas fisik yang mudah hilang. Catat pemasukan, pantau siswa yang belum bayar, dan kelola keuangan kelas dengan simpel langsung dari HP-mu.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <button 
              onClick={() => navigate('/register')}
              className="group w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              Gunakan Sekarang Gratis 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('features').scrollIntoView()}
              className="w-full sm:w-auto px-7 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold rounded-2xl flex items-center justify-center transition-all cursor-pointer"
            >
              Lihat Fitur
            </button>
          </div>

          {/* Mini Stats / Trust Indicators */}
          <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-slate-200/60 w-full max-w-lg">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">100%</h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Transparan</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">Aman</h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Database Cloud</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">Gratis</h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Tanpa Biaya</p>
            </div>
          </div>
        </div>

        {/* Right Column - Hero Image (Dihide di HP, Muncul di MD/Layar Besar) */}
        <div className="relative hidden md:flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-60"></div>
          <img 
            src="/hero-img.png" 
            alt="FinClass Interface Illustration" 
            className="w-full md:max-w-md lg:max-w-lg h-auto object-contain relative z-10 drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16 md:py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="space-y-5 text-center lg:text-left order-last lg:order-first">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Kenapa Harus Pakai FinClass?
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              FinClass dibuat khusus untuk mengatasi masalah klasik bendahara kelas: buku kas terselip, susah menagih yang nunggak, dan kurangnya transparansi keuangan antar siswa.
            </p>
            <ul className="space-y-4 pt-2 text-left">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck size={14} />
                </div>
                <p className="text-sm font-medium text-slate-600"><strong className="text-slate-800">Anti Hilang:</strong> Data disimpan aman di server cloud.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={14} />
                </div>
                <p className="text-sm font-medium text-slate-600"><strong className="text-slate-800">Multi Role:</strong> Bendahara mengatur kas, siswa cukup pantau tagihan.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CloudLightning size={14} />
                </div>
                <p className="text-sm font-medium text-slate-600"><strong className="text-slate-800">Realtime:</strong> Begitu dicentang bayar, data otomatis update di semua HP.</p>
              </li>
            </ul>
          </div>

          {/* Decor Image / Dashboard Mockup placeholder */}
          <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 shadow-inner flex flex-col gap-4">
             <div className="w-full h-10 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center px-4 gap-3">
               <div className="w-3 h-3 rounded-full bg-rose-400"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
             </div>
             <div className="w-full h-40 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-300 font-medium">
                Sistem Transparan & Terpusat
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-28 max-w-7xl mx-auto px-5 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Fitur Sederhana, <br className="md:hidden"/> Manfaat Maksimal</h2>
          <p className="text-slate-500 text-sm md:text-base font-medium">Fokus pada kemudahan penggunaan tanpa fitur ribet yang membingungkan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 md:p-8 bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-100/50 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Smartphone size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Mobile-First Design</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Tampilan dioptimalkan penuh untuk layar HP. Buka aplikasi dari mana saja terasa senyaman aplikasi native.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 md:p-8 bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-100/50 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">UI/UX Mudah Dipahami</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Desain antarmuka bersih dan to-the-point. Bendahara maupun siswa baru dijamin langsung paham menggunakannya.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 md:p-8 bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-100/50 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Data Aman & Terpusat</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Seluruh catatan kas, uang masuk, dan uang keluar diamankan di database cloud. Tidak takut catatan fisik hilang atau rusak.
            </p>
          </div>

          {/* Feature 4 (Coming Soon) */}
          <div className="p-6 md:p-8 bg-slate-50 border border-slate-200 border-dashed rounded-3xl space-y-4 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-lg">
              Coming Soon
            </div>
            <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-2xl flex items-center justify-center font-bold">
              <FileSpreadsheet size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Export Laporan</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Fitur mengunduh rekap keuangan ke format PDF atau Excel secara otomatis sedang dalam tahap pengembangan.
            </p>
          </div>

        </div>
      </section>

      {/* Support Dev / Donation Section */}
      <section id="donation" className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/30 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-5 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold border border-white/10 backdrop-blur-sm">
            <Heart size={14} className="text-rose-400 fill-rose-400" /> Dukung Developer
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Suka dengan FinClass?
          </h2>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
            Aplikasi ini dikembangkan mandiri dan disediakan <strong>100% Gratis</strong>. Jika FinClass sangat membantu kelasmu, trakteer developer segelas kopi untuk bantu bayar server dan pengembangan fitur baru!
          </p>

          <div className="pt-4 flex justify-center">
            <a 
              href="https://saweria.co/Allzxxo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-amber-950 text-sm font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95 w-full sm:w-auto"
            >
              <img src="https://saweria.co/icon.png" alt="Saweria" className="w-5 h-5 brightness-0" onError={(e) => e.target.style.display='none'}/>
              Dukung via Saweria
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-lg font-black tracking-tight">
            <span className="text-slate-800">Fin</span>
            <span className="text-indigo-600">Class</span>
          </div>
          <p className="text-xs font-semibold text-slate-400">
            © 2026 FinClass — Platform Kas Kelas Modern.
          </p>
          <div className="flex gap-4 text-xs font-bold text-slate-400">
            <span className="hover:text-indigo-600 cursor-pointer">Bantuan</span>
            <span className="hover:text-indigo-600 cursor-pointer">Privasi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}