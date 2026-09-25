import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { ExclusiveProfileShell, getExclusiveUserPreset } from '../components/ExclusiveUserBorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowUp,
  faArrowDown,
  faChevronRight,
  faShieldHalved,
  faCircleCheck,
  faCopy,
  faUserPen,
  faUsersCog,
  faCircleQuestion,
  faCheck,
  faSliders,
  faPlus,
  faRightToBracket,
  faWallet,
  faPalette,
  faQrcode,
  faImage,
  faTrash,
  faExternalLinkAlt,
  faInfoCircle,
  faComments
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [kelasData, setKelasData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('finclass-theme') || 'blue');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [qrisUrl, setQrisUrl] = useState('');
  const [qrisDraft, setQrisDraft] = useState('');
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [qrisError, setQrisError] = useState('');
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

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

  const displayUsername = user?.username || getUserUsername(user);
  const userAvatar = user?.profile_image_url || user?.profile_image || getStoredProfile(user)?.image || getStoredProfile(user)?.profile_image_url || user?.avatar_url || '';
  const exclusivePreset = getExclusiveUserPreset(user?.email);

  const getQrisStorageKey = (currentUser) => `finclass-qris-${currentUser?.id || currentUser?.email || 'guest'}`;

  const loadUserData = () => {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (savedUser) {
      const storedProfile = getStoredProfile(savedUser);
      const mergedUser = {
        ...savedUser,
        ...storedProfile,
        username: savedUser.username || storedProfile?.username || getUserUsername(savedUser),
        profile_image: storedProfile?.image || savedUser.profile_image || '',
        profile_image_url: savedUser.profile_image_url || storedProfile?.profile_image_url || storedProfile?.image || savedUser.profile_image || ''
      };

      setUser(mergedUser);
      const savedQrisUrl = localStorage.getItem(getQrisStorageKey(mergedUser)) || '';
      setQrisUrl(savedQrisUrl);
      setQrisDraft(savedQrisUrl);
      if (savedUser.kelas_id) {
        API.get(`/dashboard?user_id=${savedUser.id}`)
          .then(async (res) => {
            if (res.data.status === 'success') {
              setKelasData(res.data.kelas);
              setDashboardData(res.data);

              const memberList = res.data?.members || [];
              const freshMember = memberList.find(member => Number(member.id) === Number(savedUser.id)) || res.data?.bendahara;

              if (freshMember) {
                const refreshedUser = {
                  ...savedUser,
                  ...freshMember,
                  username: freshMember.username || savedUser.username || getUserUsername(savedUser),
                  profile_image_url: freshMember.profile_image_url || savedUser.profile_image_url || '',
                  profile_image: freshMember.profile_image_url || savedUser.profile_image || ''
                };
                setUser(refreshedUser);
                localStorage.setItem('user', JSON.stringify(refreshedUser));
                await loadChatUnreadCount(refreshedUser);
              } else {
                await loadChatUnreadCount(savedUser);
              }
            }
          })
          .catch(err => console.error(err))
          .finally(() => setLoadingProfile(false));
      } else {
        setKelasData(null);
        setDashboardData(null);
        setLoadingProfile(false);
      }
    } else {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    localStorage.setItem('finclass-theme', theme);
    document.documentElement.dataset.appTheme = theme;
  }, [theme]);

  const handleCopyKode = () => {
    if (kelasData?.kode_akses_publik) {
      navigator.clipboard.writeText(kelasData.kode_akses_publik);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openQrisModal = () => {
    setQrisDraft(qrisUrl);
    setQrisError('');
    setShowQrisModal(true);
  };

  const handleSaveQris = (event) => {
    event.preventDefault();
    const trimmedUrl = qrisDraft.trim();

    if (!trimmedUrl) {
      localStorage.removeItem(getQrisStorageKey(user));
      setQrisUrl('');
      setShowQrisModal(false);
      return;
    }

    try {
      const parsedUrl = new URL(trimmedUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Invalid protocol');
    } catch {
      setQrisError('Masukkan URL gambar yang valid, contoh https://domain.com/qris.png');
      return;
    }

    localStorage.setItem(getQrisStorageKey(user), trimmedUrl);
    setQrisUrl(trimmedUrl);
    setQrisError('');
    setShowQrisModal(false);
  };

  const handleRemoveQris = () => {
    localStorage.removeItem(getQrisStorageKey(user));
    setQrisUrl('');
    setQrisDraft('');
    setShowQrisModal(false);
  };

  const loadChatUnreadCount = async (currentUser) => {
    if (!currentUser?.id) {
      setChatUnreadCount(0);
      return;
    }

    try {
      const response = await API.get(`/chat-room?user_id=${currentUser.id}`);
      if (response.data.status === 'success') {
        setChatUnreadCount(Number(response.data.unread_count || 0));
      } else {
        setChatUnreadCount(0);
      }
    } catch (error) {
      console.error('Gagal memuat unread chat:', error);
      setChatUnreadCount(0);
    }
  };


  // Menghasilkan angka saja; label Rp ditambahkan sekali di tampilan.
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(number) || 0);
  };

  const MenuItem = ({ icon, title, description, badgeColor, onClick, rightBadge = null, cardClassName = '' }) => (
    <div 
      onClick={onClick} 
      className={`group flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-2xl cursor-pointer transition-all active:scale-[0.98] shadow-sm hover:shadow-md ${cardClassName}`}
    >
      <div className="flex items-center gap-3.5">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base transition-transform group-hover:scale-105 shadow-inner ${badgeColor}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">{title}</h4>
          <p className="text-[10px] text-slate-400 font-medium">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rightBadge !== null && rightBadge > 0 && (
          <span className="min-w-[20px] rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[9px] font-black text-white shadow-sm">
            {rightBadge}
          </span>
        )}
        <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
          <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 group-hover:text-indigo-600 text-xs transition-colors" />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-4 pb-2">
        {/* === HEADER PROFESSIONAL MODERN (LAYOUT HORIZONTAL) === */}
        <div className="bg-indigo-600 pt-5 pb-16 px-5 -mx-4 -mt-4 rounded-b-[36px] relative shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-black text-lg tracking-tight">Profil Saya</h2>
            <span className="text-[10px] bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-indigo-100 font-bold border border-white/10">
              FinClass
            </span>
          </div>
          
          {/* User Info Container: Avatar Kiri, Nama & Info Kanan */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <ExclusiveProfileShell email={user?.email} variant="avatar" className="w-20 h-20 bg-white/20 p-1 rounded-full shadow-xl backdrop-blur-sm">
                <div className="w-full h-full bg-white/10 rounded-full">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={displayUsername || 'Foto profil'}
                      className="w-full h-full rounded-full object-cover border border-white/20 shadow-inner"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                        const fallback = event.currentTarget.nextSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white text-2xl font-black border border-white/20 shadow-inner ${userAvatar ? 'hidden' : 'flex'}`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
              </ExclusiveProfileShell>

              {kelasData && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-indigo-600 shadow-md">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" />
                </div>
              )}
            </div>

            <div className="text-left space-y-1.5 overflow-hidden">
              <h3 className="text-white font-black text-xl tracking-tight truncate leading-snug">
                {user?.name || 'Pengguna'}
              </h3>

              {displayUsername && (
                <p className="text-[11px] font-medium text-indigo-100/90">
                  @{displayUsername}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-lg text-white text-[9px] font-black uppercase tracking-wider border border-white/15">
                  {user?.role?.replace('_', ' ')}
                </span>

                {exclusivePreset && (
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-wider border border-white/20 bg-gradient-to-r ${exclusivePreset.accent} text-white`}>
                    {exclusivePreset.label}
                  </span>
                )}

                {kelasData && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/25 backdrop-blur-md rounded-lg text-emerald-200 text-[9px] font-black tracking-wider border border-emerald-400/30 truncate max-w-[140px]">
                    {kelasData.nama_kelas}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* === MAIN CONTENT === */}
        <div className="-mt-10 space-y-4 relative z-20">
          
          {/* Ringkasan Keuangan */}
          {kelasData && (
            <div className="bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-2 divide-x divide-slate-100">
              <div className="flex items-center gap-3 pl-1 pr-1">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shadow-sm shrink-0">
                  <FontAwesomeIcon icon={faArrowUp} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Uang Masuk</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 truncate">
                    Rp {formatRupiah(dashboardData?.pemasukan_minggu_ini || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-sm font-black shadow-sm shrink-0">
                  <FontAwesomeIcon icon={faArrowDown} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Pengeluaran</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 truncate">
                    Rp {formatRupiah(dashboardData?.total_pengeluaran || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Banner Copy Kode Akses */}
          {kelasData && (
            <div 
              onClick={handleCopyKode}
              className="bg-indigo-600 text-white p-4 rounded-3xl flex justify-between items-center cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all border border-indigo-500/30"
            >
              <div className="space-y-0.5">
                <p className="text-[9px] text-indigo-200 font-extrabold uppercase tracking-widest">
                  KODE AKSES KELAS
                </p>
                <p className="text-lg font-black tracking-widest font-mono">{kelasData.kode_akses_publik}</p>
              </div>
              <div className="px-3.5 py-2 bg-white/20 backdrop-blur-md rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10 active:bg-white/30">
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                <span>{copied ? 'Tersalin' : 'Copy'}</span>
              </div>
            </div>
          )}

          {loadingProfile ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4, 5].map(item => <div key={item} className="h-16 rounded-2xl bg-slate-200" />)}
            </div>
          ) : (
            <>
          {/* Menu Settings */}
          <div className="space-y-2 pt-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Pengaturan & Pengelolaan</p>

            <div className="space-y-2">
              <MenuItem 
                icon={faUserPen} 
                title="Setting Profil" 
                description="Ubah nama tampilan & informasi diri"
                badgeColor="bg-blue-50 text-blue-600"
                onClick={() => navigate('/settings/profile')} 
              />
              
              {/* TOMBOL UNTUK USER YANG BELUM PUNYA KELAS */}
              {!kelasData && (
                <MenuItem 
                  icon={user?.role === 'bendahara' ? faPlus : faRightToBracket} 
                  title={user?.role === 'bendahara' ? "Buat Room Kelas Baru" : "Gabung Room Kelas"} 
                  description={user?.role === 'bendahara' ? "Buat ruang kas untuk kelasmu" : "Masukkan kode unik dari Bendahara"}
                  badgeColor={user?.role === 'bendahara' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"}
                  onClick={() => navigate('/settings/aksi-kelas')} 
                />
              )}

              {/* KHUSUS BENDAHARA: KELOLA ANGGOTA & SALDO KAS AWAL */}
              {user?.role === 'bendahara' && kelasData && (
                <>
                  <MenuItem 
                    icon={faUsersCog} 
                    title="Kelola Anggota & Nominal" 
                    description="Atur nominal kas mingguan & daftar siswa"
                    badgeColor="bg-emerald-50 text-emerald-600"
                    onClick={() => navigate('/settings/anggota')} 
                  />
                  <MenuItem 
                    icon={faWallet} 
                    title="Input Saldo Kas Awal" 
                    description="Masukkan sisa kas fisik (buku manual)"
                    badgeColor="bg-teal-50 text-teal-600"
                    onClick={() => navigate('/settings/input-saldo-awal')} 
                  />
                </>
              )}

              {/* JIKA USER SUDAH PUNYA KELAS: SETTING KELAS */}
              {kelasData && (
                <>
                  <MenuItem 
                    icon={faSliders} 
                    title="Setting Akun Kelas" 
                    description="Keluar dari kelas atau hapus room kelas"
                    badgeColor="bg-indigo-50 text-indigo-600"
                    onClick={() => navigate('/settings/kelas')} 
                  />
                  <MenuItem
                    icon={faInfoCircle}
                    title="Info Kelas"
                    description="Lihat pembuat kelas dan tanggal dibuat"
                    badgeColor="bg-cyan-50 text-cyan-600"
                    onClick={() => navigate('/settings/info-kelas')}
                  />
                  <MenuItem
                    icon={faComments}
                    title="Room Chat Kelas"
                    description="Diskusi cepat antar anggota kelas"
                    badgeColor="bg-violet-50 text-violet-600"
                    onClick={() => navigate('/chat-room')}
                    rightBadge={chatUnreadCount}
                    cardClassName="border-violet-200/80 bg-gradient-to-r from-violet-50/80 via-white to-indigo-50/80 shadow-[0_0_0_1px_rgba(167,139,250,0.2),0_14px_32px_rgba(124,58,237,0.12)] hover:border-violet-300 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.28),0_16px_36px_rgba(124,58,237,0.18)]"
                  />
                </>
              )}

              <MenuItem 
                icon={faShieldHalved} 
                title="Proteksi Akun" 
                description="Perbarui kata sandi untuk keamanan"
                badgeColor="bg-amber-50 text-amber-600"
                onClick={() => navigate('/settings/security')} 
              />

              <MenuItem 
                icon={faCircleQuestion} 
                title="Bantuan & FAQ" 
                description="Panduan penggunaan aplikasi kas"
                badgeColor="bg-purple-50 text-purple-600"
                onClick={() => navigate('/settings/faq')} 
              />
            </div>
          </div>

          <div className="pt-2 pb-2">
            <div className="mb-2">
              <MenuItem
                icon={faQrcode}
                title="QRIS Pembayaran"
                description={qrisUrl ? 'QRIS tersimpan, siap ditunjukkan' : 'Simpan URL gambar QRIS untuk pembayaran'}
                badgeColor="bg-emerald-50 text-emerald-600"
                onClick={openQrisModal}
              />
              {qrisUrl && (
                <div className="mt-2 overflow-hidden rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">QRIS Aktif</p>
                      <p className="mt-1 text-xs font-bold text-slate-700">Tunjukkan gambar ini saat menerima pembayaran</p>
                    </div>
                    <FontAwesomeIcon icon={faQrcode} className="text-xl text-emerald-500" />
                  </div>
                  <div className="flex justify-center rounded-2xl bg-slate-50 p-3">
                    <img
                      src={qrisUrl}
                      alt="QRIS pembayaran"
                      className="h-52 w-52 rounded-xl object-contain"
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <a href={qrisUrl} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-600">
                    <FontAwesomeIcon icon={faExternalLinkAlt} /> Buka gambar QRIS
                  </a>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowThemeModal(true)}
              className="mb-2 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/30"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><FontAwesomeIcon icon={faPalette} /></span>
                <span><strong className="block text-xs text-slate-800">Warna Aplikasi</strong><small className="text-[10px] text-slate-400">Tema tersimpan otomatis</small></span>
              </span>
              <FontAwesomeIcon icon={faChevronRight} className="text-xs text-slate-300" />
            </button>
          </div>
            </>
          )}

          {showThemeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div><h3 className="text-base font-black text-slate-900">Pilih Warna Aplikasi</h3><p className="mt-1 text-[10px] text-slate-400">Pilihan tersimpan saat kamu memilih.</p></div>
                  <button type="button" onClick={() => setShowThemeModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500" aria-label="Tutup pilihan warna">&times;</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['blue', 'Biru', '#2563eb'],
                    ['pink', 'Pink', '#db2777'],
                    ['green', 'Hijau', '#059669'],
                    ['purple', 'Ungu', '#7c3aed']
                  ].map(([value, label, color]) => (
                    <button key={value} type="button" onClick={() => { setTheme(value); setShowThemeModal(false); }} className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${theme === value ? 'border-slate-900 ring-2 ring-slate-200' : 'border-slate-200 hover:border-slate-300'}`}>
                      <span className="h-8 w-8 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs font-black text-slate-700">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showQrisModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">QRIS Pembayaran</h3>
                    <p className="mt-1 text-[10px] text-slate-400">Masukkan URL langsung menuju gambar QRIS kamu.</p>
                  </div>
                  <button type="button" onClick={() => setShowQrisModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500" aria-label="Tutup QRIS">&times;</button>
                </div>
                <form onSubmit={handleSaveQris} className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="qris-url">URL gambar QRIS</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <FontAwesomeIcon icon={faImage} className="text-slate-400" />
                    <input id="qris-url" type="url" value={qrisDraft} onChange={(event) => { setQrisDraft(event.target.value); setQrisError(''); }} placeholder="https://contoh.com/qris.png" className="min-w-0 flex-1 bg-transparent text-xs text-slate-800 outline-none" />
                  </div>
                  {qrisError && <p className="text-[10px] font-semibold text-rose-500">{qrisError}</p>}
                  {qrisDraft && !qrisError && (
                    <div className="flex justify-center rounded-2xl bg-slate-50 p-3">
                      <img src={qrisDraft} alt="Preview QRIS" className="h-44 w-44 rounded-xl object-contain" />
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    {qrisUrl && <button type="button" onClick={handleRemoveQris} className="flex-1 rounded-2xl bg-rose-50 px-3 py-3 text-xs font-black text-rose-600"><FontAwesomeIcon icon={faTrash} className="mr-1.5" />Hapus</button>}
                    <button type="submit" className="flex-1 rounded-2xl bg-indigo-600 px-3 py-3 text-xs font-black text-white shadow-lg shadow-indigo-200">Simpan QRIS</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="pb-1 pt-2 text-center text-[10px] font-medium tracking-wide text-slate-400 print:hidden">FinClass by Allzxxo Dev and Team</footer>
    </MainLayout>
  );
}