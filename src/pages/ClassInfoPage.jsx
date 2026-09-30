import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { ExclusiveProfileBanner, ExclusiveProfileShell, getExclusiveUserPreset } from '../components/ExclusiveUserBorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faBuildingColumns, 
  faCalendarDays, 
  faUsers,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';

const PROFILE_TABLE_KEY = 'finclass-user-profiles';

const readProfileTable = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_TABLE_KEY) || '{}');
  } catch {
    return {};
  }
};

const getStoredProfile = (userId) => {
  if (!userId) return null;
  return readProfileTable()[userId] || null;
};

const buildUsername = (name, fallback = 'user') => {
  if (!name) return fallback;
  const generated = String(name).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return generated || fallback;
};

export default function ClassInfoPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [kelasData, setKelasData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (!savedUser) {
      navigate('/login');
      return;
    }

    setUser(savedUser);

    if (!savedUser.kelas_id) {
      setKelasData(null);
      setOwnerData(null);
      setMembers([]);
      setLoading(false);
      return;
    }

    API.get(`/dashboard?user_id=${savedUser.id}`)
      .then((res) => {
        if (res.data.status === 'success') {
          const bendahara = res.data.bendahara || null;
          const allMembers = Array.isArray(res.data.members) ? res.data.members : [];
          setKelasData(res.data.kelas);
          setOwnerData(bendahara);
          setMembers(allMembers.filter((member) => member && member.id));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const ownerLocal = ownerData?.id ? getStoredProfile(ownerData.id) : null;
  const ownerName = ownerData?.name || ownerLocal?.name || 'Bendahara Kelas';
  const ownerUsername = ownerData?.username || ownerLocal?.username || buildUsername(ownerName, 'bendahara');
  const ownerAvatar = ownerLocal?.image || ownerData?.profile_image_url || '';
  const ownerBanner = ownerLocal?.banner || ownerData?.banner || '';
  const ownerBorderToken = ownerData?.custom_border_color || ownerData?.border_type || ownerLocal?.custom_border_color || ownerLocal?.border_type || '';
  const ownerExclusivePreset = getExclusiveUserPreset(ownerBorderToken);

  const memberList = members
    .map((member) => {
      const local = getStoredProfile(member.id);
      const email = member.email || local?.email || '';
      const name = member.name || local?.name || 'Anggota';
      const username = member.username || local?.username || buildUsername(name, 'user');
      const avatar = local?.image || member.profile_image_url || '';
      const banner = local?.banner || member.banner || '';
      const customBorderColor = member.custom_border_color || member.border_type || local?.custom_border_color || local?.border_type || '';
      const preset = getExclusiveUserPreset(customBorderColor || email);

      return {
        ...member,
        email,
        displayName: name,
        displayUsername: username,
        displayAvatar: avatar,
        displayBanner: banner,
        customBorderColor,
        exclusivePreset: preset,
      };
    })
    .filter((member) => member.displayName && member.id !== ownerData?.id);

  const handleOpenProfile = (profile, roleLabel) => {
    if (!profile) return;

    const createdAt = profile.created_at || profile.createdAt || null;
    const borderVal = profile.customBorderColor || profile.custom_border_color || profile.border_type || profile.email || '';

    setSelectedProfile({
      ...profile,
      roleLabel,
      displayName: profile.displayName || profile.name || 'Pengguna',
      displayUsername: profile.displayUsername || profile.username || buildUsername(profile.displayName || profile.name || 'user', 'user'),
      displayAvatar: profile.displayAvatar || profile.image || profile.profile_image_url || '',
      banner: profile.displayBanner || profile.banner || profile.banner_url || '',
      createdAt,
      email: profile.email || '',
      customBorderColor: borderVal,
      exclusivePreset: profile.exclusivePreset || getExclusiveUserPreset(borderVal),
      kelasName: kelasData?.nama_kelas || 'Belum ada kelas',
    });
  };

  const closeProfileModal = () => setSelectedProfile(null);

  return (
    <MainLayout>
      <div className="space-y-4 pb-6">
        
        {/* Header Top Bar */}
        <div className="sticky top-0 z-30 -mx-4 -mt-4 border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            </button>

            <div>
              <h1 className="text-sm font-bold text-slate-800">Info Kelas</h1>
              <p className="text-[10px] text-slate-400 font-medium">Owner kelas, anggota, dan detail room</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-32 rounded-2xl bg-slate-100" />
            <div className="h-64 rounded-2xl bg-slate-100" />
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Card 1: Informasi Kelas & Statistik */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-1.5 w-full bg-indigo-600"></div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl border border-indigo-100 shrink-0 shadow-sm">
                    <FontAwesomeIcon icon={faBuildingColumns} />
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-lg font-bold text-slate-800 leading-snug truncate">
                      {kelasData?.nama_kelas || 'Belum ada kelas'}
                    </h2>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      Ruang Kelas Terdaftar
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100"></div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
                      <span>Dibuat Pada</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {kelasData?.created_at
                        ? new Date(kelasData.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <FontAwesomeIcon icon={faUsers} className="text-slate-400" />
                      <span>Total Anggota</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {memberList.length + 1} Siswa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Daftar Anggota Kelas */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800">Struktur Anggota</h3>
                <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                  {memberList.length + 1} Terdaftar
                </span>
              </div>

              <div className="p-2 flex flex-col gap-2">
                
                {/* 1. Bendahara (Owner) */}
                <button
                  type="button"
                  onClick={() => handleOpenProfile({
                    ...ownerData,
                    displayName: ownerName,
                    displayUsername: ownerUsername,
                    displayAvatar: ownerAvatar,
                    displayBanner: ownerBanner,
                    banner: ownerBanner,
                    email: ownerData?.email || user?.email || '',
                    customBorderColor: ownerBorderToken,
                    exclusivePreset: ownerExclusivePreset,
                    created_at: ownerData?.created_at || null,
                  }, 'Bendahara')}
                  className="flex w-full items-center gap-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100 p-3 text-left transition-all hover:bg-indigo-50/80 active:scale-[0.98] cursor-pointer"
                >
                  <div className="relative z-0 shrink-0">
                    <ExclusiveProfileShell 
                      email={ownerData?.email || user?.email} 
                      customBorderColor={ownerBorderToken} 
                      borderValue={ownerBorderToken}
                      variant="avatar" 
                      className="h-16 w-16"
                    >
                      <div className="h-full w-full overflow-hidden rounded-full bg-white border border-slate-200">
                        {ownerAvatar ? (
                          <img src={ownerAvatar} alt={ownerName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-indigo-600 text-sm font-bold">
                            {ownerName ? ownerName.charAt(0).toUpperCase() : 'B'}
                          </div>
                        )}
                      </div>
                    </ExclusiveProfileShell>
                    <div className="absolute -bottom-1 -right-1 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-indigo-600 text-white text-[10px] shadow-md ring-2 ring-white">
                      <FontAwesomeIcon icon={faTrophy} />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-bold text-slate-800">{ownerName}</p>
                      {Boolean(ownerExclusivePreset?.label && String(ownerExclusivePreset.label).trim()) && (
                        <span className={`rounded-md px-1.5 py-0.5 text-[8px] font-bold text-white bg-gradient-to-r ${ownerExclusivePreset.accent} shadow-sm`}>
                          {ownerExclusivePreset.label}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[10px] font-medium text-slate-500 mt-0.5">@{ownerUsername}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-indigo-100 border border-indigo-200 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                    Bendahara
                  </span>
                </button>

                {/* Garis Pemisah */}
                {memberList.length > 0 && (
                  <div className="w-full px-2 py-0.5">
                    <div className="h-px w-full bg-slate-100"></div>
                  </div>
                )}

                {/* 2. Daftar Anggota Biasa */}
                {memberList.length === 0 ? (
                  <div className="p-4 text-center text-xs font-medium text-slate-400">
                    Belum ada anggota lain di kelas ini.
                  </div>
                ) : (
                  memberList.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleOpenProfile(member, 'Siswa')}
                      className="flex w-full items-center gap-3.5 rounded-2xl p-3 bg-white border border-transparent hover:border-slate-200 hover:bg-slate-50 text-left transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <ExclusiveProfileShell 
                        email={member.email} 
                        customBorderColor={member.customBorderColor} 
                        borderValue={member.customBorderColor}
                        variant="avatar" 
                        className="h-14 w-14 shrink-0"
                      >
                        <div className="h-full w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                          {member.displayAvatar ? (
                            <img src={member.displayAvatar} alt={member.displayName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500 text-xs font-bold">
                              {member.displayName ? member.displayName.charAt(0).toUpperCase() : 'A'}
                            </div>
                          )}
                        </div>
                      </ExclusiveProfileShell>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs font-bold text-slate-800">{member.displayName}</p>
                          {Boolean(member.exclusivePreset?.label && String(member.exclusivePreset.label).trim()) && (
                            <span className={`rounded-md px-1.5 py-0.5 text-[8px] font-bold text-white bg-gradient-to-r ${member.exclusivePreset.accent} shadow-sm`}>
                              {member.exclusivePreset.label}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[10px] font-medium text-slate-500 mt-0.5">@{member.displayUsername}</p>
                      </div>

                      <span className="shrink-0 rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        Siswa
                      </span>
                    </button>
                  ))
                )}

              </div>
            </div>

          </div>
        )}

        {/* Modal Detail Profil (Persis Sesuai Style Profile.jsx) */}
        {selectedProfile && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity"
            onClick={closeProfileModal}
          >
            <div
              className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Banner Profil Popup */}
              <ExclusiveProfileBanner
                bannerUrl={selectedProfile.banner}
                borderValue={selectedProfile.customBorderColor}
                className="relative h-36"
              >
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    type="button" 
                    onClick={closeProfileModal} 
                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition border border-white/20 cursor-pointer shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              </ExclusiveProfileBanner>

              {/* Konten Profil Popup */}
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between items-end -mt-10 mb-4">
                  <div className="p-1.5 bg-white rounded-full">
                    <ExclusiveProfileShell 
                      email={selectedProfile.email}
                      borderValue={selectedProfile.customBorderColor} 
                      customBorderColor={selectedProfile.customBorderColor} 
                      variant="avatar" 
                      className="h-24 w-24"
                    >
                      <div className="h-full w-full overflow-hidden rounded-full bg-slate-100">
                        {selectedProfile.displayAvatar ? (
                          <img src={selectedProfile.displayAvatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-2xl font-bold text-slate-400">
                            {selectedProfile.displayName ? selectedProfile.displayName.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                    </ExclusiveProfileShell>
                  </div>
                  
                  {selectedProfile.exclusivePreset && selectedProfile.exclusivePreset.label && String(selectedProfile.exclusivePreset.label).trim() && (
                    <span className={`rounded-lg px-3 py-1 mb-2 text-[10px] font-bold text-white bg-gradient-to-r ${selectedProfile.exclusivePreset.accent} shadow-sm`}>
                      {selectedProfile.exclusivePreset.label}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-[19px] font-black text-slate-800">{selectedProfile.displayName}</h3>
                    <p className="text-[13px] text-slate-500 font-medium">@{selectedProfile.displayUsername}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 shadow-sm">
                      <p className="text-[10px] font-semibold text-slate-500 mb-1">Status</p>
                      <p className="text-sm font-bold text-slate-800 capitalize">{selectedProfile.roleLabel}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 shadow-sm">
                      <p className="text-[10px] font-semibold text-slate-500 mb-1">Kelas</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{selectedProfile.kelasName}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-4 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Bergabung sejak</p>
                      <p className="text-sm font-bold text-slate-800">
                        {selectedProfile.createdAt
                          ? new Date(selectedProfile.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Belum tersedia'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}