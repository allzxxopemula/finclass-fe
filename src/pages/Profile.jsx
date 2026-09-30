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
  faComments,
  faCrown
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
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [qrisUrl, setQrisUrl] = useState('');
  const [qrisDraft, setQrisDraft] = useState('');
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [qrisError, setQrisError] = useState('');
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [showBorderModal, setShowBorderModal] = useState(false);
  const [selectedBorderColor, setSelectedBorderColor] = useState('#6366F1');
  const [borderError, setBorderError] = useState('');

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
  const userBanner = user?.banner || getStoredProfile(user)?.banner || '';
  const borderToken = user?.custom_border_color || user?.border_type || '';
  
  const exclusivePreset = getExclusiveUserPreset(borderToken);
  const hasExclusiveBorder = exclusivePreset?.kind === 'preset'; 

  const customBorderColor = user?.custom_border_color || user?.border_type || '';
  const [showProfileModal, setShowProfileModal] = useState(false);

  const normalizeCreatedAtForDate = (rawValue) => {
    if (!rawValue) return null;

    const normalized = String(rawValue).trim();
    if (!normalized) return null;

    const isoLike = normalized.includes(' ') ? normalized.replace(' ', 'T') : normalized;
    const timestamp = new Date(isoLike).getTime();

    if (Number.isNaN(timestamp)) {
      return null;
    }

    return timestamp;
  };

  const rawCreatedAt = user?.created_at || user?.createdAt;
  const createdAtTimestamp = normalizeCreatedAtForDate(rawCreatedAt);
  const accountAgeInDays = createdAtTimestamp && createdAtTimestamp <= Date.now()
    ? Math.max(0, Math.floor((Date.now() - createdAtTimestamp) / (1000 * 60 * 60 * 24)))
    : 0;

  const canUseCustomBorder = accountAgeInDays >= 3;
  const borderColors = ['#6366F1', '#EC4899', '#8B5CF6', '#14B8A6', '#F59E0B', '#EF4444', '#22C55E', '#3B82F6'];

  const getQrisStorageKey = (currentUser) => `finclass-qris-${currentUser?.id || currentUser?.email || 'guest'}`;

  const loadUserData = () => {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (savedUser) {
      const storedProfile = getStoredProfile(savedUser);
      const mergedUser = {
        ...savedUser,
        ...storedProfile,
        created_at: savedUser.created_at || storedProfile?.created_at || null,
        username: savedUser.username || storedProfile?.username || getUserUsername(savedUser),
        profile_image: storedProfile?.image || savedUser.profile_image || '',
        profile_image_url: savedUser.profile_image_url || storedProfile?.profile_image_url || storedProfile?.image || savedUser.profile_image || '',
        banner: savedUser.banner || storedProfile?.banner || '',
        custom_border_color: savedUser.custom_border_color || storedProfile?.custom_border_color || ''
      };

      setUser(mergedUser);
      const savedQrisUrl = localStorage.getItem(getQrisStorageKey(mergedUser)) || '';
      setQrisUrl(savedQrisUrl);
      setQrisDraft(savedQrisUrl);
      
      if (savedUser.kelas_id) {
        API.get(`/dashboard?user_id=${savedUser.id}`)
          .then((res) => {
            if (res.data.status === 'success') {
              setKelasData(res.data.kelas);
              setDashboardData(res.data);

              const memberList = res.data?.members || [];
              const freshMember = memberList.find(member => Number(member.id) === Number(savedUser.id)) || res.data?.bendahara;

              if (freshMember) {
                const refreshedUser = {
                  ...savedUser,
                  ...freshMember,
                  created_at: freshMember.created_at || savedUser.created_at || null,
                  username: freshMember.username || savedUser.username || getUserUsername(savedUser),
                  profile_image_url: freshMember.profile_image_url || savedUser.profile_image_url || '',
                  profile_image: freshMember.profile_image_url || savedUser.profile_image || '',
                  banner: freshMember.banner || savedUser.banner || '',
                  custom_border_color: freshMember.custom_border_color || savedUser.custom_border_color || ''
                };
                setUser(refreshedUser);
                localStorage.setItem('user', JSON.stringify(refreshedUser));
                loadChatUnreadCount(refreshedUser); 
              } else {
                loadChatUnreadCount(savedUser); 
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

  const handleOpenBorderModal = () => {
    setSelectedBorderColor(user?.custom_border_color || '#6366F1');
    setBorderError('');
    setShowBorderModal(true);
  };

  const handleSaveBorderColor = async () => {
    if (!user?.id) return;

    if (hasExclusiveBorder) {
      setBorderError('Akun kamu adalah akun dengan border eksklusif, kamu tidak dapat menggantinya.');
      return;
    }

    if (!canUseCustomBorder) {
      setBorderError('Akses kustom border terkunci! Akun kamu harus berusia minimal 3 hari.');
      return;
    }

    try {
      const response = await API.post('/update-border-color', {
        user_id: user.id,
        custom_border_color: selectedBorderColor,
      });

      const updatedUser = { 
        ...user, 
        ...response.data.user, 
        created_at: user.created_at, 
        custom_border_color: response.data.user?.custom_border_color || selectedBorderColor 
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setShowBorderModal(false);
      setBorderError('');
    } catch (error) {
      setBorderError(error?.response?.data?.message || 'Gagal menyimpan warna border.');
    }
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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(number) || 0);
  };

  const getChatUnreadLabel = (count) => {
    if (!count || count <= 0) {
      return 'Semua sudah dibaca';
    }

    return count === 1 ? '1 pesan baru' : `${count} pesan baru`;
  };

  const changelogEntries = [
    {
      version: 'v1.0.0-beta',
      date: 'September 2026',
      label: 'Release & Core Ecosystem',
      summary: 'Peluncuran perdana platform FinClass sebagai solusi digital terpadu untuk pengelolaan administrasi keuangan kelas yang modern, cepat, transparan, dan terhubung secara real-time.',
      bullets: [
        'Sistem Identitas & Profil Pengguna: Penambahan fitur pengaturan Username personal untuk identitas akun yang unik di dalam sistem.',
        'Dukungan fleksibel pengunggahan foto profil (Avatar), yang dapat diakses melalui tautan URL eksternal maupun diunggah langsung dari galeri perangkat.',
        'Manajemen Kas & Informasi Kelas Terpusat: Modul pencatatan uang masuk dan pengeluaran kas secara terstruktur bagi Bendahara.',
        'Kehadiran fitur Info Kelas komprehensif untuk memantau ringkasan data, status anggota, dan transparansi saldo secara menyeluruh.',
        'Room Chat Kelas Interaktif Berperforma Tinggi: Sistem obrolan langsung real-time yang dioptimalkan untuk koordinasi dan komunikasi antar anggota kelas.',
        'Implementasi LocalStorage Caching cerdas agar riwayat obrolan dan data aplikasi tersimpan serta termuat lebih cepat.',
        'Fitur interaktif Lihat Profil Pengguna, di mana anggota dapat langsung mengecek profil dan informasi pengguna lain melalui daftar anggota di dalam Info Kelas.',
        'Pusat Bantuan & Panduan Pengguna: Pembaruan halaman Bantuan & FAQ yang lebih lengkap, interaktif, dan informatif.'
      ]
    },
    {
      version: 'v0.9.0-alpha',
      date: 'September 2026',
      label: 'Internal Phase & Optimization',
      summary: 'Fase pengujian internal, penyesuaian alur kerja aplikasi, dan stabilisasi sistem secara menyeluruh.',
      bullets: [
        'Penyempurnaan Antarmuka (UI/UX): Pengujian stabilitas tampilan responsif yang disesuaikan secara optimal untuk perangkat seluler maupun komputer.',
        'Optimalisasi Kinerja Sistem: Peningkatan kecepatan muat aplikasi dan perbaikan logika sinkronisasi data agar berjalan lebih presisi dan mulus.'
      ]
    }
  ];

  const MenuItem = ({ icon, title, description, iconColorClass, onClick, rightBadge = null, rightText = null, cardClassName = '' }) => (
    <div 
      onClick={onClick} 
      className={`group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-[20px] cursor-pointer transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:border-slate-300 ${cardClassName}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-[16px] flex items-center justify-center text-lg transition-transform group-hover:scale-105 bg-slate-50 border border-slate-100 ${iconColorClass}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 transition-colors">{title}</h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {rightText ? (
          <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-bold ${rightBadge > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
            {rightText}
          </span>
        ) : (
          rightBadge !== null && rightBadge > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
              {rightBadge}
            </span>
          )
        )}
        <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
          <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-5 pb-6">
        
        {/* === HEADER PROFESSIONAL MODERN === */}
        <div className="bg-[var(--theme-color)] pt-6 pb-20 px-5 -mx-4 -mt-4 rounded-b-[40px] relative shadow-md">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white font-bold text-xl tracking-tight">Profil Pengguna</h2>
          </div>
          
          <button type="button" onClick={() => setShowProfileModal(true)} className="flex items-center gap-5 text-left w-full cursor-pointer group">
            <div className="relative shrink-0 z-10 transition-transform group-active:scale-95">
              <ExclusiveProfileShell borderValue={borderToken} customBorderColor={customBorderColor} variant="avatar" className="w-20 h-20 shadow-lg ring-4 ring-white/20">
                <div className="w-full h-full bg-white rounded-full overflow-hidden">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={displayUsername || 'Foto profil'}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                        const fallback = event.currentTarget.nextSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-slate-100 flex items-center justify-center text-slate-600 text-2xl font-bold ${userAvatar ? 'hidden' : 'flex'}`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
              </ExclusiveProfileShell>

              {kelasData && (
                <div className="absolute -bottom-1 -right-1 bg-white text-[var(--theme-color)] rounded-full w-6 h-6 flex items-center justify-center shadow-md z-20">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[11px]" />
                </div>
              )}
            </div>

            <div className="text-left space-y-1 overflow-hidden z-10 flex-1">
              <h3 className="text-white font-bold text-xl tracking-tight truncate leading-snug">
                {user?.name || 'Pengguna'}
              </h3>

              {displayUsername && (
                <p className="text-sm font-medium text-white/80">
                  @{displayUsername}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-white/10 rounded-lg text-white text-[10px] font-semibold uppercase tracking-wide">
                  {user?.role?.replace('_', ' ')}
                </span>

                {exclusivePreset && exclusivePreset.label && String(exclusivePreset.label).trim() && (
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-semibold tracking-wide bg-gradient-to-r ${exclusivePreset.accent} text-white`}>
                    {exclusivePreset.label}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-white/60 group-hover:text-white transition-colors pl-2">
              <FontAwesomeIcon icon={faChevronRight} className="text-lg" />
            </div>
          </button>
        </div>

        {/* === MAIN CONTENT === */}
        <div className="-mt-14 space-y-5 relative z-20 px-1">
          
          {/* Ringkasan Keuangan */}
          {kelasData && (
            <div className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-200 grid grid-cols-2 divide-x divide-slate-100">
              <div className="flex items-center gap-3.5 pr-3">
                <div className="w-12 h-12 rounded-[16px] bg-slate-50 text-slate-600 border border-slate-100 flex items-center justify-center text-lg shadow-sm shrink-0">
                  <FontAwesomeIcon icon={faArrowUp} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-500 font-medium">Uang Masuk</p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5 truncate">
                    Rp {formatRupiah(dashboardData?.pemasukan_minggu_ini || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pl-4">
                <div className="w-12 h-12 rounded-[16px] bg-slate-50 text-slate-600 border border-slate-100 flex items-center justify-center text-lg shadow-sm shrink-0">
                  <FontAwesomeIcon icon={faArrowDown} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-500 font-medium">Pengeluaran</p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5 truncate">
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
              className="bg-[var(--theme-color)] text-white p-5 rounded-[24px] flex justify-between items-center cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
            >
              <div className="space-y-1">
                <p className="text-[10px] text-white/80 font-medium tracking-wide">
                  Kode Akses Kelas
                </p>
                <p className="text-xl font-bold tracking-widest">{kelasData.kode_akses_publik}</p>
              </div>
              <div className="px-4 py-2.5 bg-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors active:bg-white/20">
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                <span>{copied ? 'Tersalin' : 'Copy'}</span>
              </div>
            </div>
          )}

          {loadingProfile ? (
            <div className="animate-pulse space-y-3 pt-2">
              {[1, 2, 3, 4, 5].map(item => <div key={item} className="h-[76px] rounded-[20px] bg-slate-100" />)}
            </div>
          ) : (
            <>
          {/* Menu Settings */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-800 px-1">Pengaturan Akun</h3>

            <div className="space-y-2.5">
              <MenuItem 
                icon={faUserPen} 
                title="Setting Profil" 
                description="Ubah nama tampilan & identitas"
                iconColorClass="text-slate-600"
                onClick={() => navigate('/settings/profile')} 
              />
              
              {!kelasData && (
                <MenuItem 
                  icon={user?.role === 'bendahara' ? faPlus : faRightToBracket} 
                  title={user?.role === 'bendahara' ? "Buat Room Kelas Baru" : "Gabung Room Kelas"} 
                  description={user?.role === 'bendahara' ? "Mulai kelola kas untuk kelasmu" : "Gunakan kode unik dari bendahara"}
                  iconColorClass="text-[var(--theme-color)]"
                  onClick={() => navigate('/settings/aksi-kelas')} 
                />
              )}

              {user?.role === 'bendahara' && kelasData && (
                <>
                  <MenuItem 
                    icon={faUsersCog} 
                    title="Kelola Anggota & Kas" 
                    description="Atur nominal & daftar anggota"
                    iconColorClass="text-slate-600"
                    onClick={() => navigate('/settings/anggota')} 
                  />
                  <MenuItem 
                    icon={faWallet} 
                    title="Input Saldo Awal" 
                    description="Pindahkan sisa kas fisik ke digital"
                    iconColorClass="text-slate-600"
                    onClick={() => navigate('/settings/input-saldo-awal')} 
                  />
                </>
              )}

              {kelasData && (
                <>
                  <MenuItem 
                    icon={faSliders} 
                    title="Setting Kelas" 
                    description="Manajemen status kelas kamu"
                    iconColorClass="text-slate-600"
                    onClick={() => navigate('/settings/kelas')} 
                  />
                  <MenuItem
                    icon={faInfoCircle}
                    title="Info Kelas"
                    description="Detail dan statistik kelas"
                    iconColorClass="text-slate-600"
                    onClick={() => navigate('/settings/info-kelas')}
                  />
                  <MenuItem
                    icon={faComments}
                    title="Room Chat Kelas"
                    description="Diskusi dengan anggota lain"
                    iconColorClass="text-[var(--theme-color)]"
                    onClick={() => navigate('/chat-room')}
                    rightBadge={chatUnreadCount}
                    rightText={getChatUnreadLabel(chatUnreadCount)}
                    cardClassName="border-slate-200"
                  />
                </>
              )}

              <MenuItem 
                icon={faShieldHalved} 
                title="Proteksi Akun" 
                description="Perbarui kata sandi"
                iconColorClass="text-slate-600"
                onClick={() => navigate('/settings/security')} 
              />
            </div>
          </div>

          <div className="space-y-3 pt-3">
             <h3 className="text-sm font-bold text-slate-800 px-1">Lainnya</h3>
             <div className="space-y-2.5">
              <MenuItem 
                icon={faCircleQuestion} 
                title="Bantuan & FAQ" 
                description="Panduan penggunaan aplikasi"
                iconColorClass="text-slate-600"
                onClick={() => navigate('/settings/faq')} 
              />
              <MenuItem
                icon={faQrcode}
                title="QRIS Pembayaran"
                description={qrisUrl ? 'QRIS tersimpan dan aktif' : 'Simpan URL gambar QRIS'}
                iconColorClass="text-slate-600"
                onClick={openQrisModal}
              />
              
              {qrisUrl && (
                <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm mt-1 mb-2">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">QRIS Aktif</p>
                      <p className="mt-0.5 text-xs text-slate-500">Siap untuk ditunjukkan</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                      <FontAwesomeIcon icon={faQrcode} className="text-lg" />
                    </div>
                  </div>
                  <div className="flex justify-center rounded-[16px] bg-slate-50 border border-slate-100 p-4">
                    <img
                      src={qrisUrl}
                      alt="QRIS pembayaran"
                      className="h-48 w-48 rounded-lg object-contain"
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <a href={qrisUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-800">
                    <FontAwesomeIcon icon={faExternalLinkAlt} /> Buka gambar penuh
                  </a>
                </div>
              )}
              
              <button
                onClick={() => setShowThemeModal(true)}
                className="flex w-full items-center justify-between p-4 bg-white border border-slate-200 rounded-[20px] cursor-pointer transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:border-slate-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[16px] flex items-center justify-center text-lg bg-slate-50 border border-slate-100 text-[var(--theme-color)]">
                    <FontAwesomeIcon icon={faPalette} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-800">Warna Tema</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Sesuaikan tampilan aplikasi</p>
                  </div>
                </div>
                <div className="text-slate-300">
                  <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                </div>
              </button>
             </div>
          </div>
            </>
          )}

          {showProfileModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity" onClick={() => setShowProfileModal(false)}>
              <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
                
                {/* Banner Profil Popup */}
                <div className="relative h-32 bg-[var(--theme-color)] overflow-hidden">
                  {userBanner ? (
                    <img src={userBanner} alt="Banner profil" className="h-full w-full object-cover opacity-90" />
                  ) : null}
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => { setShowProfileModal(false); handleOpenBorderModal(); }} 
                      className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold hover:bg-white/30 transition border border-white/20 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPalette} /> Border
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowProfileModal(false)} 
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition border border-white/20 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Konten Profil Popup */}
                <div className="px-6 pb-6 relative">
                  <div className="flex justify-between items-end -mt-10 mb-4">
                    <div className="p-1.5 bg-white rounded-full">
                      <ExclusiveProfileShell borderValue={borderToken} customBorderColor={customBorderColor} variant="avatar" className="h-20 w-20">
                        <div className="h-full w-full overflow-hidden rounded-full bg-slate-100">
                          {userAvatar ? (
                            <img src={userAvatar} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-2xl font-bold text-slate-400">
                              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                        </div>
                      </ExclusiveProfileShell>
                    </div>
                    
                    {exclusivePreset && exclusivePreset.label && String(exclusivePreset.label).trim() && (
                      <span className={`rounded-lg px-3 py-1 mb-2 text-[10px] font-bold text-white bg-gradient-to-r ${exclusivePreset.accent} shadow-sm`}>
                        {exclusivePreset.label}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{user?.name || 'Pengguna'}</h3>
                      <p className="text-sm text-slate-500 font-medium">@{displayUsername}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                        <p className="text-[10px] font-semibold text-slate-500 mb-1">Status</p>
                        <p className="text-sm font-bold text-slate-800 capitalize">{user?.role?.replace('_', ' ') || 'Pengguna'}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                        <p className="text-[10px] font-semibold text-slate-500 mb-1">Kelas</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{kelasData?.nama_kelas || 'Belum ada'}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-white p-4 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Bergabung sejak</p>
                        <p className="text-sm font-bold text-slate-800">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showBorderModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setShowBorderModal(false)}>
              <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Warna Border</h3>
                    <p className="text-xs text-slate-500 mt-1">Sesuaikan bingkai profil kamu.</p>
                  </div>
                  <button type="button" onClick={() => setShowBorderModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">&times;</button>
                </div>

                {hasExclusiveBorder ? (
                  <div className="mb-6 flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600">
                      <FontAwesomeIcon icon={faCrown} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Akses Eksklusif</p>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        Akun ini menggunakan border eksklusif dan tidak dapat diubah ke warna standar.
                      </p>
                    </div>
                  </div>
                ) : !canUseCustomBorder ? (
                  <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-800">Belum Tersedia</p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      Fitur ini terbuka setelah akun berusia minimal 3 hari. Saat ini: {accountAgeInDays} hari.
                    </p>
                  </div>
                ) : null}

                <div className={`grid grid-cols-4 gap-4 mb-6 ${hasExclusiveBorder ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                  {borderColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      disabled={hasExclusiveBorder || !canUseCustomBorder}
                      onClick={() => setSelectedBorderColor(color)}
                      className={`h-12 w-full rounded-2xl transition-all border-2 ${selectedBorderColor === color ? 'border-slate-800 scale-105 shadow-md' : 'border-transparent hover:scale-105'} ${(!canUseCustomBorder || hasExclusiveBorder) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Warna ${color}`}
                    />
                  ))}
                </div>

                {borderError && <p className="mb-4 text-xs font-semibold text-rose-500 text-center">{borderError}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowBorderModal(false)} className="flex-1 rounded-xl bg-slate-100 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer">
                    {hasExclusiveBorder ? 'Kembali' : 'Batal'}
                  </button>
                  
                  {!hasExclusiveBorder && (
                    <button type="button" disabled={!canUseCustomBorder} onClick={handleSaveBorderColor} className="flex-1 rounded-xl bg-[var(--theme-color)] py-3.5 text-sm font-bold text-white hover:opacity-90 transition disabled:opacity-50 cursor-pointer">
                      Simpan
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {showThemeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setShowThemeModal(false)}>
              <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Tema Aplikasi</h3>
                    <p className="text-xs text-slate-500 mt-1">Pilih aksen warna antarmuka.</p>
                  </div>
                  <button type="button" onClick={() => setShowThemeModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">&times;</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['blue', 'Ocean Blue', '#2563eb'],
                    ['pink', 'Rose Pink', '#db2777'],
                    ['green', 'Emerald Green', '#059669'],
                    ['purple', 'Royal Purple', '#7c3aed']
                  ].map(([value, label, color]) => (
                    <button 
                      key={value} 
                      type="button" 
                      onClick={() => { setTheme(value); setShowThemeModal(false); }} 
                      className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all cursor-pointer ${theme === value ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <span className="h-10 w-10 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                      <span className="text-xs font-bold text-slate-700">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showQrisModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setShowQrisModal(false)}>
              <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">QRIS Pembayaran</h3>
                    <p className="text-xs text-slate-500 mt-1">Simpan URL QRIS statis.</p>
                  </div>
                  <button type="button" onClick={() => setShowQrisModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">&times;</button>
                </div>
                <form onSubmit={handleSaveQris} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2" htmlFor="qris-url">Tautan Gambar (URL)</label>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-slate-400 focus-within:bg-white transition-colors">
                      <FontAwesomeIcon icon={faImage} className="text-slate-400" />
                      <input 
                        id="qris-url" 
                        type="url" 
                        value={qrisDraft} 
                        onChange={(event) => { setQrisDraft(event.target.value); setQrisError(''); }} 
                        placeholder="https://contoh.com/qris.jpg" 
                        className="w-full bg-transparent text-sm text-slate-800 outline-none" 
                      />
                    </div>
                  </div>
                  {qrisError && <p className="text-xs font-semibold text-rose-500">{qrisError}</p>}
                  
                  {qrisDraft && !qrisError && (
                    <div className="flex justify-center rounded-2xl bg-slate-50 border border-slate-100 p-4">
                      <img src={qrisDraft} alt="Preview QRIS" className="h-40 w-40 rounded-lg object-contain" />
                    </div>
                  )}
                  
                  <div className="flex gap-3 pt-2">
                    {qrisUrl && (
                      <button type="button" onClick={handleRemoveQris} className="px-4 rounded-xl bg-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                    <button type="submit" className="flex-1 rounded-xl bg-[var(--theme-color)] py-3.5 text-sm font-bold text-white hover:opacity-90 transition cursor-pointer">
                      Simpan QRIS
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showChangelogModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setShowChangelogModal(false)}>
              <div className="w-full max-w-2xl rounded-[28px] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 shrink-0">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Log Pembaruan</h3>
                    <p className="text-xs text-slate-500 mt-1">Riwayat versi FinClass</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowChangelogModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="overflow-y-auto px-6 py-2">
                  <div className="space-y-8 my-4">
                    {changelogEntries.map((entry) => (
                      <section key={entry.version} className="relative">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                          <h4 className="text-base font-bold text-slate-800">{entry.version}</h4>
                          <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">{entry.date}</span>
                        </div>
                        <div className="mb-4">
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                            {entry.label}
                          </span>
                          <p className="text-sm text-slate-600 leading-relaxed">{entry.summary}</p>
                        </div>
                        <ul className="space-y-2.5">
                          {entry.bullets.map((bullet, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="pb-4 pt-4 text-center print:hidden">
        <div className="flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowChangelogModal(true)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            Lihat Changelog
          </button>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">FinClass App</span>
        </div>
      </footer>
    </MainLayout>
  );
}