import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWallet, 
  faArrowUp, 
  faArrowDown, 
  faCircleCheck, 
  faTriangleExclamation,
  faBuildingColumns,
  faArrowRight,
  faUsers,
  faCalendarDays,
  faReceipt,
  faPrint,
  faHandHoldingDollar,
  faUserCheck,
  faUserClock,
  faBullhorn,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [bannerStartX, setBannerStartX] = useState(null);

  // Ubah href di sini untuk menentukan tujuan setiap banner.
  const banners = [
    { image: '/banner-1.png', color: '#2563eb', href: 'https://saweria.co/Allzxxo' },
    { image: '/banner-2.png', color: '#0f766e', href: 'https://saweria.co/Allzxxo' },
    { image: '/banner-3.png', color: '#be185d', href: '/profile' },
    { image: '/banner-4.png', color: '#6d28d9', href: '/profile' }
  ];

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      API.get(`/dashboard?user_id=${savedUser.id}`)
        .then(res => setDashboardData(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBanner(current => (current + 1) % banners.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  const members = dashboardData?.siswas || [];
  const paidMembers = Number(dashboardData?.jumlah_siswa_bayar || 0);
  const paymentProgress = members.length ? Math.round((paidMembers / members.length) * 100) : 0;

  const handlePrintSummary = () => {
    window.print();
  };

  const handleBannerPointerDown = event => setBannerStartX(event.clientX);
  const handleBannerPointerUp = event => {
    if (bannerStartX === null) return;
    const distance = event.clientX - bannerStartX;
    if (Math.abs(distance) > 40) {
      setActiveBanner(current => distance < 0 ? (current + 1) % banners.length : (current - 1 + banners.length) % banners.length);
    }
    setBannerStartX(null);
  };

  return (
    <MainLayout>
      {/* Top Banner */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {user?.role || 'User'}
            </p>
            <h2 className="text-sm font-bold text-slate-900">{user?.name || 'Pengguna'}</h2>
          </div>
        </div>

        <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold flex items-center gap-1">
          <FontAwesomeIcon icon={faBuildingColumns} />
          <span>{dashboardData?.kelas?.nama_kelas || 'Belum Ada Kelas'}</span>
        </div>
      </div>

      {/* JIKA BELUM TERHUBUNG KE KELAS MANAPUN */}
      {loading ? (
        <div className="my-4 space-y-4 animate-pulse">
          <div className="h-28 rounded-3xl bg-slate-200" />
          <div className="h-24 rounded-3xl bg-slate-200" />
        </div>
      ) : !dashboardData?.kelas ? (
        <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center space-y-3 shadow-sm my-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Belum Terhubung ke Kelas</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            {user?.role === 'bendahara' 
              ? 'Kamu belum membuat Room Kas Kelas. Silakan masuk ke Profil untuk membuat kelas baru.'
              : 'Kamu belum bergabung ke kelas manapun. Masukkan Kode Akses Kelas di menu Profil.'}
          </p>
          <button 
            onClick={() => navigate('/profile')}
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 shadow-md cursor-pointer"
          >
            <span>Buka Profil</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      ) : (
        /* JIKA SUDAH TERHUBUNG KELAS */
        <>
          <div className="bg-indigo-600 text-white p-5 rounded-3xl shadow-xl shadow-indigo-200 space-y-4 relative overflow-hidden print:bg-white print:text-slate-900 print:border print:border-slate-200 print:shadow-none">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-indigo-200 font-medium">Total Saldo Kas Kelas</p>
                <h1 className="text-3xl font-black mt-1">
                  Rp {Number(dashboardData?.saldo || 0).toLocaleString('id-ID')}
                </h1>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <FontAwesomeIcon icon={faWallet} className="text-white text-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faArrowUp} />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-200">Masuk Minggu Ini</p>
                    <p className="text-xs font-bold">Rp {Number(dashboardData?.pemasukan_minggu_ini || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faArrowDown} />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-200">Pengeluaran</p>
                    <p className="text-xs font-bold">Rp {Number(dashboardData?.total_pengeluaran || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
            {[
              [faUsers, 'Anggota', dashboardData?.jumlah_siswa || members.length, 'text-indigo-600 bg-indigo-50'],
              [faUserCheck, 'Lunas', paidMembers, 'text-emerald-600 bg-emerald-50'],
              [faUserClock, 'Belum', Math.max(0, members.length - paidMembers), 'text-amber-600 bg-amber-50'],
              [faCalendarDays, 'Tarik', dashboardData?.kelas?.hari_penarikan || 'Rabu', 'text-violet-600 bg-violet-50']
            ].map(([icon, label, value, color]) => (
              <div key={label} className="min-w-0 px-1.5 py-2 text-center">
                <div className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg text-[11px] ${color}`}><FontAwesomeIcon icon={icon} /></div>
                <p className="truncate text-[9px] font-bold text-slate-400">{label}</p>
                <p className="truncate text-xs font-black text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div
            className="relative select-none touch-pan-y"
            onPointerDown={handleBannerPointerDown}
            onPointerUp={handleBannerPointerUp}
          >
            <a href={banners[activeBanner].href} className="block overflow-hidden rounded-3xl bg-slate-200 shadow-lg" style={{ backgroundColor: banners[activeBanner].color }} aria-label={`Buka banner ${activeBanner + 1}`}>
              <img src={banners[activeBanner].image} alt="Banner FinClass" onError={event => { event.currentTarget.style.display = 'none'; }} className="block h-35 w-full object-cover sm:h-72 md:h-50" draggable="false" />
            </a>
            <div className="flex justify-center gap-1.5 pt-3" aria-label={`Slide ${activeBanner + 1} dari ${banners.length}`}>
              {banners.map((banner, index) => <span key={banner.image} className={`h-1.5 rounded-full transition-all ${activeBanner === index ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-300'}`} />)}
            </div>
          </div>

          <button onClick={() => navigate('/penarikan')} className="flex w-full items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-100/70">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white"><FontAwesomeIcon icon={faBullhorn} /></span>
            <span className="min-w-0 flex-1"><strong className="block text-xs font-black text-indigo-950">Jaga catatan kas tetap rapi</strong><small className="mt-0.5 block truncate text-[10px] text-indigo-700">Buka buku kas pada hari {dashboardData?.kelas?.hari_penarikan || 'Rabu'} dan tandai pembayaran anggota.</small></span>
            <FontAwesomeIcon icon={faArrowRight} className="text-indigo-500" />
          </button>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white"><FontAwesomeIcon icon={faLightbulb} /></div>
              <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-amber-700">Tips hari ini</p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-amber-950">Catat pengeluaran segera setelah transaksi agar saldo selalu akurat.</p>
            </div>

          <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress kas bulan ini</p>
                  <h3 className="mt-1 text-base font-black text-slate-900">{paymentProgress}% anggota tercatat</h3>
                </div>
                <FontAwesomeIcon icon={faReceipt} className="text-indigo-500" />
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${paymentProgress}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Gunakan menu Penarikan Kas untuk membuka atau memperbarui buku kas.</p>
            </div>

            <div className="rounded-3xl bg-indigo-50 p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white"><FontAwesomeIcon icon={faHandHoldingDollar} /></div>
              <h3 className="mt-3 text-sm font-black text-indigo-950">Aksi cepat</h3>
              <div className="mt-3 space-y-2">
                <button onClick={() => navigate('/penarikan')} className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2.5 text-left text-xs font-bold text-indigo-700 shadow-sm"><span>Buka buku kas</span><FontAwesomeIcon icon={faArrowRight} /></button>
                <button onClick={() => navigate('/history')} className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2.5 text-left text-xs font-bold text-indigo-700 shadow-sm"><span>Lihat transaksi</span><FontAwesomeIcon icon={faArrowRight} /></button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm print:hidden">
            <div>
              <p className="text-xs font-black text-slate-800">Ringkasan kelas siap dibagikan</p>
              <p className="text-[10px] text-slate-400">Cetak atau simpan halaman ini sebagai PDF.</p>
            </div>
            <button onClick={handlePrintSummary} className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"><FontAwesomeIcon icon={faPrint} /> Cetak / PDF</button>
          </div>
        </>
      )}
      <footer className="pb-1 pt-2 text-center text-[10px] font-medium tracking-wide text-slate-400 print:hidden">FinClass by allzxxo dev and team</footer>
    </MainLayout>
  );
}