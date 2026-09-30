import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ExclusiveProfileShell, getExclusiveUserPreset } from '../components/ExclusiveUserBorder';
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

const PROFILE_TABLE_KEY = 'finclass-user-profiles';

const readProfileTable = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_TABLE_KEY) || '{}');
  } catch {
    return {};
  }
};

const getStoredProfile = (currentUser) => {
  if (!currentUser?.id) return null;
  const table = readProfileTable();
  return table[currentUser.id] || null;
};

const getUserUsername = (currentUser) => {
  const storedProfile = getStoredProfile(currentUser);
  if (currentUser?.username) return currentUser.username;
  if (storedProfile?.username) return storedProfile.username;

  const rawValue = currentUser?.name || currentUser?.email || 'user';
  const generated = String(rawValue).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return generated || 'user';
};

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [bannerStartX, setBannerStartX] = useState(null);

  const banners = [
    { image: '/banner-1.png', color: '#2563eb', href: 'https://saweria.co/Allzxxo' },
    { image: '/banner-2.png', color: '#0f766e', href: 'https://saweria.co/Allzxxo' },
    { image: '/banner-3.png', color: '#be185d', href: '/profile' },
    { image: '/banner-4.png', color: '#6d28d9', href: '/profile' }
  ];

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (savedUser) {
      const storedProfile = getStoredProfile(savedUser);
      const mergedUser = {
        ...savedUser,
        ...storedProfile,
        username: savedUser.username || storedProfile?.username || getUserUsername(savedUser),
        profile_image: storedProfile?.image || savedUser.profile_image || '',
        profile_image_url: savedUser.profile_image_url || storedProfile?.profile_image_url || storedProfile?.image || savedUser.profile_image || '',
        banner: savedUser.banner || storedProfile?.banner || ''
      };

      setUser(mergedUser);
      API.get(`/dashboard?user_id=${savedUser.id}`)
        .then(res => {
          setDashboardData(res.data);

          const memberList = res.data?.members || [];
          const freshMember = memberList.find(member => Number(member.id) === Number(savedUser.id)) || res.data?.bendahara;

          if (freshMember) {
            const refreshedUser = {
              ...savedUser,
              ...freshMember,
              username: freshMember.username || savedUser.username || getUserUsername(savedUser),
              profile_image_url: freshMember.profile_image_url || savedUser.profile_image_url || '',
              profile_image: freshMember.profile_image_url || savedUser.profile_image || '',
              banner: freshMember.banner || savedUser.banner || ''
            };
            setUser(refreshedUser);
            localStorage.setItem('user', JSON.stringify(refreshedUser));
          }
        })
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
  const userAvatar = user?.profile_image_url || user?.profile_image || getStoredProfile(user)?.image || getStoredProfile(user)?.profile_image_url || user?.avatar_url || '';
  const displayUsername = user?.username || getUserUsername(user);
  const borderToken = user?.custom_border_color || user?.border_type || '';
  const exclusivePreset = getExclusiveUserPreset(borderToken);
  const customBorderColor = borderToken;

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
      {/* Top Header & Profile Section */}
      <div className="flex items-center justify-between pt-4 pb-2 px-1">
        <div className="flex items-center gap-3.5">
          <ExclusiveProfileShell borderValue={borderToken} customBorderColor={customBorderColor} variant="avatar" className="h-[46px] w-[46px] shadow-sm">
            <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 overflow-hidden border border-slate-200">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={displayUsername || 'Foto profil'}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                    const fallback = event.currentTarget.nextSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <span className={`h-full w-full items-center justify-center ${userAvatar ? 'hidden' : 'flex'}`}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </ExclusiveProfileShell>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                {user?.role?.replace('_', ' ') || 'User'}
              </span>
              {exclusivePreset && exclusivePreset.label && String(exclusivePreset.label).trim() && (
                <span className={`rounded-md px-1.5 py-0.5 text-[8px] font-bold text-white bg-gradient-to-r ${exclusivePreset.accent}`}>
                  {exclusivePreset.label}
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-slate-800 line-clamp-1">{user?.name || 'Pengguna'}</h2>
          </div>
        </div>

        <div className="px-3 py-1.5 bg-[var(--theme-color)]/10 border border-[var(--theme-color)]/20 rounded-[12px] text-[var(--theme-color)] text-[10px] font-bold flex items-center gap-1.5 max-w-[120px]">
          <FontAwesomeIcon icon={faBuildingColumns} />
          <span className="truncate">{dashboardData?.kelas?.nama_kelas || 'Kelas'}</span>
        </div>
      </div>

      {loading ? (
        <div className="my-5 space-y-4 animate-pulse px-1">
          <div className="h-40 rounded-[24px] bg-slate-200" />
          <div className="h-28 rounded-[20px] bg-slate-100" />
          <div className="h-48 rounded-[20px] bg-slate-100" />
        </div>
      ) : !dashboardData?.kelas ? (
        <div className="p-8 bg-white border border-slate-200 rounded-[24px] text-center space-y-4 shadow-sm my-6">
          <div className="w-14 h-14 bg-amber-50 border border-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-sm">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Kelas</h3>
            <p className="text-slate-500 text-sm leading-relaxed mt-2 max-w-xs mx-auto">
              {user?.role === 'bendahara' 
                ? 'Buat Room Kelas baru di profil untuk mulai mengelola kas.'
                : 'Minta kode akses dari bendahara untuk bergabung.'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-[var(--theme-color)] text-white font-bold rounded-[14px] text-sm inline-flex items-center gap-2 shadow-md hover:opacity-90 transition active:scale-95"
          >
            <span>Buka Profil</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      ) : (
        <div className="space-y-5 px-1 mt-3 pb-4">
          
          {/* Kartu Saldo Kas */}
          <div className="bg-[var(--theme-color)] text-white p-6 rounded-[28px] shadow-lg relative overflow-hidden print:bg-white print:text-slate-900 print:border print:border-slate-200 print:shadow-none">
            {/* Dekorasi Latar Belakang */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-1">Total Kas Kelas</p>
                <h1 className="text-[32px] leading-none font-bold">
                  Rp {Number(dashboardData?.saldo || 0).toLocaleString('id-ID')}
                </h1>
              </div>
              <div className="w-11 h-11 bg-white/20 rounded-[16px] flex items-center justify-center backdrop-blur-md shadow-sm border border-white/20">
                <FontAwesomeIcon icon={faWallet} className="text-white text-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 shrink-0">
                  <FontAwesomeIcon icon={faArrowUp} className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-white/80">Pemasukan (Minggu)</p>
                  <p className="text-sm font-bold mt-0.5">Rp {Number(dashboardData?.pemasukan_minggu_ini || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-white border border-black/5 shrink-0">
                  <FontAwesomeIcon icon={faArrowDown} className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-white/80">Total Pengeluaran</p>
                  <p className="text-sm font-bold mt-0.5">Rp {Number(dashboardData?.total_pengeluaran || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Ringkasan Status */}
          <div className="grid grid-cols-4 gap-3 bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm">
            {[
              [faUsers, 'Anggota', dashboardData?.jumlah_siswa || members.length, 'text-slate-600 bg-slate-50 border-slate-100'],
              [faUserCheck, 'Lunas', paidMembers, 'text-slate-600 bg-slate-50 border-slate-100'],
              [faUserClock, 'Belum', Math.max(0, members.length - paidMembers), 'text-slate-600 bg-slate-50 border-slate-100'],
              [faCalendarDays, 'Tarik', dashboardData?.kelas?.hari_penarikan || 'Rabu', 'text-slate-600 bg-slate-50 border-slate-100']
            ].map(([icon, label, value, colorClass], index) => (
              <div key={label} className={`text-center py-2 relative ${index !== 3 ? 'after:content-[""] after:absolute after:right-0 after:top-[20%] after:h-[60%] after:w-[1px] after:bg-slate-100' : ''}`}>
                <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-[12px] border text-sm ${colorClass}`}>
                  <FontAwesomeIcon icon={icon} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wide">{label}</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Banner Slider */}
          <div
            className="relative overflow-hidden rounded-[24px] shadow-sm touch-pan-y group"
            onPointerDown={handleBannerPointerDown}
            onPointerUp={handleBannerPointerUp}
          >
            <a href={banners[activeBanner].href} className="block bg-slate-100 aspect-[21/9] sm:aspect-[3/1] transition-transform duration-300" style={{ backgroundColor: banners[activeBanner].color }} aria-label={`Buka banner ${activeBanner + 1}`}>
              <img src={banners[activeBanner].image} alt="Banner FinClass" onError={event => { event.currentTarget.style.display = 'none'; }} className="block w-full h-full object-cover" draggable="false" />
            </a>
            
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5" aria-label={`Slide ${activeBanner + 1} dari ${banners.length}`}>
              {banners.map((banner, index) => (
                <span key={index} className={`h-1.5 rounded-full transition-all duration-300 ${activeBanner === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
              ))}
            </div>
          </div>

          {/* Pengingat Penarikan */}
          <button 
            onClick={() => navigate('/penarikan')} 
            className="flex w-full items-center gap-4 rounded-[20px] border border-[var(--theme-color)]/20 bg-[var(--theme-color)]/5 p-4 text-left transition-all active:scale-[0.98] hover:bg-[var(--theme-color)]/10"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--theme-color)] text-white shadow-sm">
              <FontAwesomeIcon icon={faBullhorn} className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800">Catat Kas Hari {dashboardData?.kelas?.hari_penarikan || 'Rabu'}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500 font-medium">Buka buku kas & tandai lunas.</p>
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="text-[var(--theme-color)]" />
          </button>

          {/* Progress & Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Progress Kas</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{paymentProgress}% anggota tercatat</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <FontAwesomeIcon icon={faReceipt} />
                </div>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[var(--theme-color)] transition-all duration-500" style={{ width: `${paymentProgress}%` }} />
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
               <h3 className="text-sm font-bold text-slate-800 mb-3">Aksi Cepat</h3>
               <div className="space-y-2.5">
                  <button 
                    onClick={() => navigate('/penarikan')} 
                    className="flex w-full items-center justify-between rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-left text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <FontAwesomeIcon icon={faHandHoldingDollar} className="text-[var(--theme-color)]" />
                      Buku Kas
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="text-slate-400" />
                  </button>
                  <button 
                    onClick={() => navigate('/history')} 
                    className="flex w-full items-center justify-between rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-left text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <FontAwesomeIcon icon={faReceipt} className="text-[var(--theme-color)]" />
                      Riwayat
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="text-slate-400" />
                  </button>
               </div>
            </div>
          </div>
          
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 flex items-start gap-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-amber-100 text-amber-600">
              <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 mb-1">Tips Akurasi Saldo</p>
              <p className="text-xs font-medium leading-relaxed text-slate-500">Catat semua pengeluaran kelas dan pemasukan dengan rinci agar saldo akhir selalu sinkron dengan uang fisik.</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[20px] bg-slate-900 p-4 shadow-md print:hidden mt-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
                 <FontAwesomeIcon icon={faPrint} />
               </div>
               <div>
                  <p className="text-sm font-bold text-white">Cetak Laporan</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Simpan halaman ini (PDF)</p>
               </div>
            </div>
            <button 
              onClick={handlePrintSummary} 
              className="rounded-[12px] bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-sm hover:bg-slate-100 transition"
            >
              Cetak
            </button>
          </div>
          
        </div>
      )}
      <footer className="pb-4 pt-2 text-center print:hidden">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">FinClass App</span>
      </footer>
    </MainLayout>
  );
}