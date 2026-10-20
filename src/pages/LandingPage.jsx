import React, { useEffect, useState } from 'react';
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
  CloudLightning,
  CircleHelp,
  ChevronDown,
  X,
  Phone,
  LockKeyhole,
  ArrowUpRight
} from 'lucide-react';

const supportNumber = '0858 7852 8337';
const supportNumberForLink = '6285878528337';

const faqs = [
  {
    question: 'Bagaimana cara bergabung ke kelas?',
    answer: 'Daftar sebagai siswa, lalu masukkan Kode Akses Publik kelas yang diberikan oleh bendahara.'
  },
  {
    question: 'Siapa yang bisa mengubah data kas?',
    answer: 'Akun dengan peran Bendahara dapat mencatat pembayaran, pemasukan, pengeluaran, dan mengelola anggota kelas.'
  },
  {
    question: 'Apakah siswa bisa melihat transaksi kelas?',
    answer: 'Siswa yang sudah bergabung dapat melihat informasi kas dan riwayat kelas sesuai akses yang tersedia di aplikasi.'
  },
  {
    question: 'Apa yang harus dilakukan jika lupa kata sandi?',
    answer: 'Gunakan menu Lupa Password di halaman masuk untuk mengirim pengajuan bantuan melalui WhatsApp.'
  },
  {
    question: 'Data belum berubah setelah transaksi dicatat, bagaimana?',
    answer: 'Pastikan koneksi internet stabil, lalu muat ulang halaman. Jika kendala masih terjadi, hubungi tim bantuan dengan menyertakan detail masalah tanpa membagikan kata sandi.'
  },
  {
    question: 'Bagaimana cara melaporkan bug atau memberi saran?',
    answer: 'Hubungi tim FinClass melalui nomor bantuan di halaman ini. Sertakan langkah yang memicu kendala dan tangkapan layar bila diperlukan.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (!activeModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveModal(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans scroll-smooth overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[620px] bg-gradient-to-b from-sky-100/60 via-blue-50/30 to-transparent -z-10 pointer-events-none"></div>

      {/* Navbar Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-blue-100/80 px-4 md:px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-1 text-lg md:text-xl font-extrabold tracking-tight cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <img src="/finclassicon.png" alt="FinClass Logo" className="mr-1 h-8 w-8 object-contain" />
            <span className="text-slate-800">Fin</span>
            <span className="text-blue-600">Class</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#home" className="hover:text-blue-600 transition-colors">Beranda</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">Tentang</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#donation" className="hover:text-blue-600 transition-colors">Dukung Kami</a>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs md:text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
            >
              Masuk
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-5 py-2 text-xs md:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 cursor-pointer"
            >
              Daftar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="w-full bg-[#f5faff]">
        <div className="max-w-7xl mx-auto px-5 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/70 text-blue-700 rounded-full text-[11px] md:text-xs font-bold border border-blue-200/70">
            <Sparkles size={14} className="text-blue-600" /> Platform Pengelola Kas Kelas
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Kelola Uang Kas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
              Lebih Rapi & Aman
            </span>
          </h1>

          <p className="text-slate-500 text-sm md:text-lg max-w-lg font-medium leading-relaxed">
            Tinggalkan buku kas fisik yang mudah hilang. Catat pemasukan, pantau siswa yang belum bayar, dan kelola keuangan kelas dengan simpel langsung dari HP-mu.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <button 
              onClick={() => navigate('/register')}
              className="group w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              Gunakan Sekarang Gratis 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('features').scrollIntoView()}
              className="w-full sm:w-auto px-7 py-3.5 bg-white border border-blue-100 text-slate-700 hover:bg-blue-50 text-sm font-bold rounded-2xl flex items-center justify-center transition-all cursor-pointer"
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
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-sky-50 rounded-full blur-3xl opacity-80"></div>
          <img 
            src="/financial-hero.png" 
            alt="FinClass Interface Illustration" 
            className="w-full md:max-w-md lg:max-w-lg h-auto object-contain relative z-10 drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
          />
        </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-y border-slate-100 bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Tentang FinClass</p>
              <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">
                Kas kelas lebih mudah dikelola, bersama-sama.
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                FinClass adalah aplikasi untuk membantu bendahara dan siswa mengelola kas kelas dalam satu tempat. Catatan pembayaran, pemasukan, dan pengeluaran tersusun rapi sehingga informasi keuangan lebih mudah dipantau.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                Dirancang agar praktis digunakan dari ponsel, FinClass membantu mengganti pencatatan manual yang mudah tercecer dengan cara kerja yang lebih jelas dan transparan.
              </p>
            </div>

            <div className="rounded-3xl bg-[#f5f9ff] p-6 md:p-8">
              <h3 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">Mengapa harus pakai FinClass?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Semua yang dibutuhkan untuk mengelola kas kelas, tanpa proses yang berbelit.</p>
              <ul className="mt-6 space-y-5">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><ShieldCheck size={18} /></div>
                  <div><p className="text-sm font-bold text-slate-800">Catatan tersimpan rapi</p><p className="mt-1 text-sm leading-relaxed text-slate-500">Riwayat kas kelas tercatat dan mudah ditinjau kembali.</p></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><Users size={18} /></div>
                  <div><p className="text-sm font-bold text-slate-800">Bendahara dan siswa terhubung</p><p className="mt-1 text-sm leading-relaxed text-slate-500">Bendahara mengelola data, sementara siswa dapat memantau informasi kelas.</p></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><CloudLightning size={18} /></div>
                  <div><p className="text-sm font-bold text-slate-800">Informasi lebih transparan</p><p className="mt-1 text-sm leading-relaxed text-slate-500">Pembaruan catatan membantu seluruh anggota mengikuti kondisi kas.</p></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-[#f5f9ff] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Fitur Sederhana, <br className="md:hidden"/> Manfaat Maksimal</h2>
          <p className="text-slate-500 text-sm md:text-base font-medium">Fokus pada kemudahan penggunaan tanpa fitur ribet yang membingungkan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 md:p-8 bg-white border border-blue-100/70 rounded-3xl shadow-sm hover:shadow-lg hover:shadow-blue-100/70 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Smartphone size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Mobile-First Design</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Tampilan dioptimalkan penuh untuk layar HP. Buka aplikasi dari mana saja terasa senyaman aplikasi native.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 md:p-8 bg-white border border-blue-100/70 rounded-3xl shadow-sm hover:shadow-lg hover:shadow-blue-100/70 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">UI/UX Mudah Dipahami</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Desain antarmuka bersih dan to-the-point. Bendahara maupun siswa baru dijamin langsung paham menggunakannya.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 md:p-8 bg-white border border-blue-100/70 rounded-3xl shadow-sm hover:shadow-lg hover:shadow-blue-100/70 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Data Aman & Terpusat</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Seluruh catatan kas, uang masuk, dan uang keluar diamankan di database cloud. Tidak takut catatan fisik hilang atau rusak.
            </p>
          </div>

          {/* Feature 4 (Coming Soon) */}
          <div className="p-6 md:p-8 bg-slate-50 border border-slate-200 border-dashed rounded-3xl space-y-4 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2 py-1 bg-sky-100 text-sky-700 text-[9px] font-black uppercase rounded-lg">
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
        </div>
      </section>

      {/* Support Dev / Donation Section */}
      <section id="donation" className="border-y border-blue-100 bg-white py-14 md:py-18">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center md:flex-row md:justify-between md:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Heart size={15} className="fill-blue-100" /> Dukung pengembangan
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">Bantu FinClass terus berkembang</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 md:text-base">
              FinClass tersedia gratis. Dukunganmu membantu biaya server dan pengembangan fitur berikutnya.
            </p>
          </div>
          <a
            href="https://saweria.co/Allzxxo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:scale-95"
          >
            <Heart size={17} /> Dukung via Saweria <ArrowUpRight size={15} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:py-14">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-black tracking-tight">
              <img src="/finclassicon.png" alt="" className="h-9 w-9 object-contain" />
              <span className="text-slate-800">Fin<span className="text-blue-600">Class</span></span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Pengelolaan kas kelas yang lebih rapi, transparan, dan mudah diakses bersama.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-800">Jelajahi</h3>
            <div className="flex flex-col items-start gap-3 text-sm font-semibold text-slate-500">
              <a href="#about" className="transition-colors hover:text-blue-600">Tentang FinClass</a>
              <a href="#features" className="transition-colors hover:text-blue-600">Fitur aplikasi</a>
              <a href="#donation" className="transition-colors hover:text-blue-600">Dukung developer</a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-800">Informasi</h3>
            <div className="flex flex-col items-start gap-3">
              <button type="button" onClick={() => setActiveModal('help')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600">
                <CircleHelp size={16} /> Bantuan & FAQ
              </button>
              <button type="button" onClick={() => setActiveModal('privacy')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600">
                <LockKeyhole size={16} /> Kebijakan Privasi
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} FinClass. Dibuat untuk pengelolaan kas kelas yang lebih baik.</p>
            <p className="text-slate-400">Sederhana · Transparan · Bersama</p>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveModal(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="landing-modal-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-blue-100 bg-white shadow-2xl shadow-blue-950/20 sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-blue-100 bg-white/95 px-5 py-5 backdrop-blur sm:px-7">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  {activeModal === 'help' ? <CircleHelp size={22} /> : <LockKeyhole size={21} />}
                </div>
                <div>
                  <h2 id="landing-modal-title" className="text-lg font-black text-slate-900 sm:text-xl">
                    {activeModal === 'help' ? 'Pusat Bantuan' : 'Privasi & Data'}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                    {activeModal === 'help' ? 'Kami siap membantu penggunaan FinClass.' : 'Informasi singkat tentang penggunaan data di FinClass.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Tutup modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-7">
              {activeModal === 'help' ? (
                <>
                  <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Butuh bantuan langsung?</p>
                      <p className="mt-1 text-lg font-black text-slate-900">{supportNumber}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">Hubungi tim FinClass melalui WhatsApp. Jangan kirimkan kata sandi atau kode verifikasi.</p>
                    </div>
                    <a
                      href={`https://wa.me/${supportNumberForLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:mt-0 sm:w-auto"
                    >
                      <Phone size={16} /> Hubungi bantuan <ArrowUpRight size={15} />
                    </a>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-black text-slate-900">Pertanyaan yang sering diajukan</h3>
                    <div className="space-y-2">
                      {faqs.map((faq, index) => (
                        <div key={faq.question} className="overflow-hidden rounded-xl border border-slate-200">
                          <button
                            type="button"
                            aria-expanded={openFaq === index}
                            onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                            className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-bold text-slate-700 transition hover:bg-blue-50/70"
                          >
                            {faq.question}
                            <ChevronDown size={17} className={`shrink-0 text-blue-600 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                          </button>
                          {openFaq === index && (
                            <p className="border-t border-slate-100 bg-slate-50/70 px-4 py-3.5 text-sm leading-relaxed text-slate-600">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 text-sm leading-relaxed text-slate-600">
                  <p className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 font-medium text-slate-700">
                    FinClass menggunakan data yang kamu masukkan—seperti informasi akun, anggota kelas, dan catatan transaksi—untuk menyediakan fitur pengelolaan kas kelas.
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">1</span>
                      <p><strong className="text-slate-800">Gunakan seperlunya.</strong> Informasi dipakai untuk menjalankan fitur akun dan kelas yang kamu gunakan.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">2</span>
                      <p><strong className="text-slate-800">Jaga akses kelas.</strong> Bagikan Kode Akses Publik hanya kepada anggota kelas yang semestinya.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">3</span>
                      <p><strong className="text-slate-800">Lindungi akunmu.</strong> Jangan membagikan kata sandi atau kode verifikasi kepada siapa pun, termasuk pihak yang mengaku sebagai tim bantuan.</p>
                    </div>
                  </div>
                  <p className="border-t border-slate-100 pt-4 text-xs text-slate-500">
                    Ada pertanyaan atau permintaan terkait privasi? Hubungi bantuan FinClass di <a className="font-bold text-blue-600 hover:underline" href={`https://wa.me/${supportNumberForLink}`} target="_blank" rel="noopener noreferrer">{supportNumber}</a>.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}