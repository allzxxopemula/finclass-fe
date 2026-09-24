import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBuildingColumns, faUser, faIdBadge, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

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
  return readProfileTable()[currentUser.id] || null;
};

const getDisplayUsername = (currentUser) => {
  const storedProfile = getStoredProfile(currentUser);
  if (currentUser?.username) return currentUser.username;
  if (storedProfile?.username) return storedProfile.username;

  const raw = currentUser?.name || currentUser?.email || 'bendahara';
  return String(raw).trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'bendahara';
};

export default function ClassInfoPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [kelasData, setKelasData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
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
      setLoading(false);
      return;
    }

    API.get(`/dashboard?user_id=${savedUser.id}`)
      .then((res) => {
        if (res.data.status === 'success') {
          const bendahara = res.data.bendahara || null;
          setKelasData(res.data.kelas);
          setOwnerData(bendahara);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const localProfile = ownerData?.id ? getStoredProfile({ id: ownerData.id }) : null;
  const generatedUsername = (() => {
    const sourceName = ownerData?.name || localProfile?.name || user?.name || 'bendahara';
    return String(sourceName).trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'bendahara';
  })();
  const ownerName = ownerData?.name || localProfile?.name || 'Bendahara Kelas';
  const ownerUsername = localProfile?.username || ownerData?.username || generatedUsername;
  const ownerAvatar = localProfile?.image || ownerData?.profile_image_url || '';

  return (
    <MainLayout>
      <div className="space-y-4 pb-2">
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
            <p className="text-[10px] text-slate-400">Owner kelas dan detail room</p>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-28 rounded-3xl bg-slate-200" />
            <div className="h-24 rounded-3xl bg-slate-200" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[28px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 overflow-hidden rounded-2xl bg-white border border-cyan-100 shadow-sm flex items-center justify-center">
                  {ownerAvatar ? (
                    <img src={ownerAvatar} alt={ownerName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cyan-600 text-white text-xl font-black">
                      {ownerName ? ownerName.charAt(0).toUpperCase() : 'K'}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">Nama Kelas</p>
                  <h2 className="mt-1 text-lg font-black text-slate-900 truncate">{kelasData?.nama_kelas || 'Belum ada kelas'}</h2>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Nama lengkap bendahara</p>
                  <p className="mt-1 text-base font-black text-slate-900 break-words">{ownerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <FontAwesomeIcon icon={faIdBadge} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Username bendahara</p>
                  <p className="mt-1 text-base font-black text-slate-900 break-words">@{ownerUsername}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <FontAwesomeIcon icon={faCalendarDays} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Tanggal dibuat</p>
                  <p className="mt-1 text-base font-black text-slate-900 break-words">
                    {kelasData?.created_at
                      ? new Date(kelasData.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'Belum diketahui'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
