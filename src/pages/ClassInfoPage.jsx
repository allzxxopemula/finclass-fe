import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { ExclusiveProfileShell, getExclusiveUserPreset } from '../components/ExclusiveUserBorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faBuildingColumns, 
  faCalendarDays, 
  faUsers,
  faCrown
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
      kelasName: kelasData?.nama_kelas || 'Kelas belum ditentukan',
    });
  };

  const closeProfileModal = () => setSelectedProfile(null);

  return (
    <MainLayout>
      <div className="space-y-4 pb-4">
        
        {/* Header */}
        <div className="sticky top-0 z-30 -mx-4 -mt-4 border-b border-slate-100 bg-slate-50/95 px-4 pb-3 pt-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            <div>
              <h1 className="text-base font-black text-slate-900">Info Kelas</h1>
              <p className="text-[10px] text-slate-400">Owner kelas, anggota, dan detail room</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 rounded-2xl bg-slate-200" />
            <div className="h-64 rounded-2xl bg-slate-200" />
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Card 1: Informasi Kelas & Statistik */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-1.5 w-full bg-indigo-500"></div>

              <div className="p-5 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl border border-indigo-100 shadow-inner">
                    <FontAwesomeIcon icon={faBuildingColumns} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">
                      {kelasData?.nama_kelas || 'Belum ada kelas'}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      Ruang Kelas Terdaftar
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100"></div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-slate-300" />
                      <span>Dibuat Pada</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {kelasData?.created_at
                        ? new Date(kelasData.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <FontAwesomeIcon icon={faUsers} className="text-slate-300" />
                      <span>Total Anggota</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {memberList.length + 1} Siswa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Daftar Anggota Kelas */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800">Struktur Anggota</h3>
                <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg">
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
                  className="flex w-full items-center gap-3 rounded-xl bg-indigo-50/30 border border-indigo-50 p-3 text-left transition-all hover:bg-indigo-50/60 hover:shadow-sm focus:outline-none cursor-pointer"
                >
                  <div className="relative">
                    <ExclusiveProfileShell 
                      email={ownerData?.email || user?.email} 
                      customBorderColor={ownerBorderToken} 
                      borderValue={ownerBorderToken}
                      variant="avatar" 
                      className="h-14 w-14 shrink-0"
                    >
                      <div className="h-full w-full overflow-hidden rounded-full bg-white">
                        {ownerAvatar ? (
                          <img src={ownerAvatar} alt={ownerName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-indigo-600 text-sm font-black">
                            {ownerName ? ownerName.charAt(0).toUpperCase() : 'B'}
                          </div>
                        )}
                      </div>
                    </ExclusiveProfileShell>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[9px] border-2 border-white">
                      <FontAwesomeIcon icon={faCrown} />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-900">{ownerName}</p>
                      {Boolean(ownerExclusivePreset?.label && String(ownerExclusivePreset.label).trim()) && (
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-black text-white bg-gradient-to-r ${ownerExclusivePreset.accent} border border-white/30 shadow-sm`}>
                          {ownerExclusivePreset.label}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[11px] font-medium text-slate-500">@{ownerUsername}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                    Bendahara
                  </span>
                </button>

                {/* Garis Pemisah */}
                {memberList.length > 0 && (
                  <div className="w-full px-4 py-1">
                    <div className="h-px w-full bg-slate-100"></div>
                  </div>
                )}

                {/* 2. Daftar Anggota Biasa */}
                {memberList.length === 0 ? (
                  <div className="p-5 text-center text-xs font-medium text-slate-400">
                    Belum ada anggota lain di kelas ini.
                  </div>
                ) : (
                  memberList.map((member, index) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleOpenProfile(member, 'Siswa')}
                      className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-slate-50 focus:outline-none cursor-pointer ${index > 0 ? '-mt-0.5' : ''}`}
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
                            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-600 text-xs font-black">
                              {member.displayName ? member.displayName.charAt(0).toUpperCase() : 'A'}
                            </div>
                          )}
                        </div>
                      </ExclusiveProfileShell>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold text-slate-800">{member.displayName}</p>
                          {Boolean(member.exclusivePreset?.label && String(member.exclusivePreset.label).trim()) && (
                            <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black text-white bg-gradient-to-r ${member.exclusivePreset.accent} border border-white/30`}>
                              {member.exclusivePreset.label}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[11px] font-medium text-slate-500">@{member.displayUsername}</p>
                      </div>

                      <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        Siswa
                      </span>
                    </button>
                  ))
                )}

              </div>
            </div>

          </div>
        )}

        {/* Modal Detail Profil */}
        {selectedProfile && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
            onClick={closeProfileModal}
          >
            <div
              className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/30 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className={`relative h-28 overflow-hidden bg-gradient-to-br ${selectedProfile.exclusivePreset?.accent || 'from-indigo-600 via-indigo-500 to-sky-500'}`}>
                {selectedProfile.banner ? (
                  <img src={selectedProfile.banner} alt={selectedProfile.displayName || 'Banner profil'} className="h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_35%)]" />
                )}
                <button
                  type="button"
                  onClick={closeProfileModal}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-black text-white backdrop-blur-sm transition hover:bg-white/20 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="relative -mt-12 px-5 pb-5">
                <div className="flex items-end justify-between gap-3">
                  <ExclusiveProfileShell 
                    email={selectedProfile.email}
                    borderValue={selectedProfile.customBorderColor} 
                    customBorderColor={selectedProfile.customBorderColor} 
                    variant="avatar" 
                    className="h-24 w-24 shadow-[0_18px_30px_rgba(79,70,229,0.25)]"
                  >
                    <div className="h-full w-full overflow-hidden rounded-full border-[2px] border-white bg-slate-100">
                      {selectedProfile.displayAvatar ? (
                        <img src={selectedProfile.displayAvatar} alt={selectedProfile.displayName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-200 text-2xl font-black text-slate-700">
                          {selectedProfile.displayName ? selectedProfile.displayName.charAt(0).toUpperCase() : 'A'}
                        </div>
                      )}
                    </div>
                  </ExclusiveProfileShell>

                  {Boolean(selectedProfile.exclusivePreset?.label && String(selectedProfile.exclusivePreset.label).trim()) && (
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-black text-white bg-gradient-to-r ${selectedProfile.exclusivePreset.accent} border border-white/40 shadow-md`}>
                      {selectedProfile.exclusivePreset.label}
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedProfile.displayName}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">@{selectedProfile.displayUsername}</p>
                  </div>

                  <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
                    {selectedProfile.roleLabel}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Kelas</p>
                      <p className="mt-1 text-sm font-black text-slate-800 line-clamp-2">{selectedProfile.kelasName}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Role</p>
                      <p className="mt-1 text-sm font-black text-slate-800">{selectedProfile.roleLabel}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Tanggal akun dibuat</p>
                    <p className="mt-2 text-sm font-bold text-slate-800">
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
        )}
      </div>
    </MainLayout>
  );
}