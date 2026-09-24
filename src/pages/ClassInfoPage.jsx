import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBuildingColumns, faUser, faIdBadge, faCalendarDays, faUsers } from '@fortawesome/free-solid-svg-icons';

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
            <p className="text-[10px] text-slate-400">Owner kelas, anggota, dan detail room</p>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-28 rounded-3xl bg-slate-200" />
            <div className="h-24 rounded-3xl bg-slate-200" />
            <div className="h-32 rounded-3xl bg-slate-200" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Room kelas</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">{kelasData?.nama_kelas || 'Belum ada kelas'}</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                  <FontAwesomeIcon icon={faBuildingColumns} />
                </div>
              </div>

              <div className="rounded-[24px] border border-cyan-100 bg-gradient-to-r from-cyan-50 to-indigo-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
                    {ownerAvatar ? (
                      <img src={ownerAvatar} alt={ownerName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-cyan-600 text-xl font-black text-white">
                        {ownerName ? ownerName.charAt(0).toUpperCase() : 'K'}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">Bendahara kelas</p>
                    <p className="mt-1 truncate text-lg font-black text-slate-900">{ownerName}</p>
                    <p className="text-xs font-semibold text-slate-500">@{ownerUsername}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FontAwesomeIcon icon={faCalendarDays} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tanggal dibuat</p>
                  </div>
                </div>
              </div>

              <p className="text-base font-black text-slate-900">
                {kelasData?.created_at
                  ? new Date(kelasData.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : 'Belum diketahui'}
              </p>
            </div>

            <div className="rounded-[30px] border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Anggota kelas</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                  {memberList.length + 1} orang
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-cyan-100 bg-cyan-50 shadow-sm">
                    {ownerAvatar ? (
                      <img src={ownerAvatar} alt={ownerName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-cyan-600 text-sm font-black text-white">
                        {ownerName ? ownerName.charAt(0).toUpperCase() : 'K'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">{ownerName}</p>
                    <p className="truncate text-[11px] font-medium text-slate-500">@{ownerUsername}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-cyan-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-cyan-700">
                    Bendahara
                  </span>
                </div>

                {memberList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs font-medium text-slate-400">
                    Belum ada anggota lain yang bergabung ke kelas ini.
                  </div>
                ) : (
                  memberList.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                      <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        {member.displayAvatar ? (
                          <img src={member.displayAvatar} alt={member.displayName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-sm font-black text-white">
                            {member.displayName ? member.displayName.charAt(0).toUpperCase() : 'A'}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-900">{member.displayName}</p>
                        <p className="truncate text-[11px] font-medium text-slate-500">@{member.displayUsername}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-600">
                        {member.role === 'bendahara' ? 'Bendahara' : member.role || 'Anggota'}
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
