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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (!savedUser) {
      navigate('/login');
      return;
    }

    const storedProfile = getStoredProfile(savedUser);
    const mergedUser = {
      ...savedUser,
      ...storedProfile,
      username: savedUser.username || storedProfile?.username || getDisplayUsername(savedUser)
    };

    setUser(mergedUser);

    if (savedUser.kelas_id) {
      API.get(`/dashboard?user_id=${savedUser.id}`)
        .then((res) => {
          if (res.data.status === 'success') {
            setKelasData(res.data.kelas);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
      return;
    }

    setKelasData(null);
    setLoading(false);
  }, [navigate]);

  const creatorName = user?.name || 'Bendahara Kelas';
  const creatorUsername = user?.username || getDisplayUsername(user) || 'bendahara';

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
            <p className="text-[10px] text-slate-400">Data pembuat dan detail kelas</p>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-28 rounded-3xl bg-slate-200" />
            <div className="h-24 rounded-3xl bg-slate-200" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-3xl border border-cyan-100 bg-cyan-50/60 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-sm">
                  <FontAwesomeIcon icon={faBuildingColumns} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">Nama Kelas</p>
                  <h2 className="mt-1 text-lg font-black text-slate-900">{kelasData?.nama_kelas || 'Belum ada kelas'}</h2>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Nama lengkap</p>
                  <p className="mt-1 text-base font-black text-slate-900">{creatorName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <FontAwesomeIcon icon={faIdBadge} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Username bendahara</p>
                  <p className="mt-1 text-base font-black text-slate-900">@{creatorUsername}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FontAwesomeIcon icon={faCalendarDays} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Tanggal dibuat</p>
                  <p className="mt-1 text-base font-black text-slate-900">
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
