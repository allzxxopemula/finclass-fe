import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
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
  const ownerUsername = ownerLocal?.username || buildUsername(ownerName, 'bendahara');
  const ownerAvatar = ownerLocal?.image || ownerData?.profile_image_url || '';

  const memberList = members
    .map((member) => {
      const local = getStoredProfile(member.id);
      const name = member.name || local?.name || 'Anggota';
      const username = local?.username || buildUsername(name, 'user');
      const avatar = local?.image || member.profile_image_url || '';

      return {
        ...member,
        displayName: name,
        displayUsername: username,
        displayAvatar: avatar,
      };
    })
    .filter((member) => member.displayName && member.id !== ownerData?.id);

  return (
    <MainLayout>
      <div className="space-y-4 pb-4">
        
        {/* Header Tetap Sama Persis */}
        <div className="flex items-center gap-3 pt-2">
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

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 rounded-2xl bg-slate-200" />
            <div className="h-64 rounded-2xl bg-slate-200" />
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Card 1: Informasi Kelas & Statistik (Clean, Solid, No Gradient) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Garis Aksen Tema di Atas */}
              <div className="h-1.5 w-full bg-indigo-500"></div>
              
              <div className="p-5 space-y-5">
                {/* Header Kelas */}
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

                {/* Divider */}
                <div className="h-px w-full bg-slate-100"></div>

                {/* Statistik Kelas */}
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

            {/* Card 2: Daftar Anggota Kelas (List View Rapih) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800">Struktur Anggota</h3>
                <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                  {memberList.length + 1} Terdaftar
                </span>
              </div>

              <div className="p-2 flex flex-col gap-2.5">
                
                {/* 1. Bendahara (Owner) */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/30 border border-indigo-50">
                  <div className="relative">
                    <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-indigo-100 bg-white shrink-0">
                      {ownerAvatar ? (
                        <img src={ownerAvatar} alt={ownerName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-indigo-600 text-sm font-black">
                          {ownerName ? ownerName.charAt(0).toUpperCase() : 'B'}
                        </div>
                      )}
                    </div>
                    {/* Badge Crown Bendahara */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[9px] border-2 border-white">
                      <FontAwesomeIcon icon={faCrown} />
                    </div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{ownerName}</p>
                    <p className="truncate text-[11px] font-medium text-slate-500">@{ownerUsername}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                    Bendahara
                  </span>
                </div>

                {/* Garis Pemisah (Jika ada anggota) */}
                {memberList.length > 0 && (
                  <div className="w-full px-4 py-2">
                    <div className="h-px w-full bg-slate-100"></div>
                  </div>
                )}

                {/* 2. Daftar Anggota Biasa */}
                {memberList.length === 0 ? (
                  <div className="p-5 text-center text-xs font-medium text-slate-400">
                    Belum ada anggota lain di kelas ini.
                  </div>
                ) : (
                  memberList.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shrink-0">
                        {member.displayAvatar ? (
                          <img src={member.displayAvatar} alt={member.displayName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-600 text-xs font-black">
                            {member.displayName ? member.displayName.charAt(0).toUpperCase() : 'A'}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{member.displayName}</p>
                        <p className="truncate text-[11px] font-medium text-slate-500">@{member.displayUsername}</p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        Siswa
                      </span>
                    </div>
                  ))
                )}

              </div>
            </div>

          </div>
        )}
      </div>
    </MainLayout>
  );
}