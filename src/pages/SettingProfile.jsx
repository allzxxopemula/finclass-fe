import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faSpinner, faImage, faCamera, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const IMGBB_API_KEY = '4bee746ba64cbd55467c63342a529be0';
const PROFILE_TABLE_KEY = 'finclass-user-profiles';

const readProfileTable = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_TABLE_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeProfileTable = (table) => {
  localStorage.setItem(PROFILE_TABLE_KEY, JSON.stringify(table));
};

const getStoredProfile = (currentUser) => {
  if (!currentUser?.id) return null;
  const table = readProfileTable();
  return table[currentUser.id] || null;
};

const getGeneratedUsername = (currentUser) => {
  const rawValue = currentUser?.name || currentUser?.email || 'user';
  const generated = String(rawValue).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return generated || 'user';
};

export default function SettingProfile() {
  const navigate = useNavigate();
  const [savedUser, setSavedUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const [name, setName] = useState(savedUser?.name || '');
  const [username, setUsername] = useState(savedUser?.username || getGeneratedUsername(savedUser));
  const [profileImage, setProfileImage] = useState(() => {
    const storedProfile = getStoredProfile(savedUser);
    return storedProfile?.image || savedUser?.profile_image || '';
  });
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!savedUser) {
      navigate('/login');
    }
  }, [savedUser, navigate]);

  const persistProfile = (nextUser) => {
    const profileData = {
      name: nextUser.name,
      username: nextUser.username,
      image: nextUser.profile_image || nextUser.profile_image_url || '',
      profile_image_url: nextUser.profile_image_url || nextUser.profile_image || ''
    };

    const profileTable = readProfileTable();
    profileTable[nextUser.id] = profileData;
    writeProfileTable(profileTable);
    localStorage.setItem('user', JSON.stringify(nextUser));
  };

  const appendHistoryEvent = (title) => {
    if (!savedUser?.id) return;
    const key = `finclass-history-${savedUser.id}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift({
      id: `local-${Date.now()}`,
      judul: title,
      tanggal: new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      tipe: 'aktivitas',
      nominal: 0,
      timestamp: Date.now()
    });
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 25)));
  };

  const uploadToImgBB = async (file) => {
    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
      reader.readAsDataURL(file);
    });

    const base64 = await base64Promise;
    const cleanBase64 = String(base64).replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const form = new FormData();
    form.append('key', IMGBB_API_KEY);
    form.append('image', cleanBase64);

    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: form
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error?.message || 'Upload foto gagal');
    }

    return result.data?.url || '';
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const uploadedUrl = await uploadToImgBB(file);
      setProfileImage(uploadedUrl);
      appendHistoryEvent('Ganti foto profil');
    } catch (error) {
      alert(error.message || 'Gagal mengunggah foto profil');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Nama tidak boleh kosong!');
      return;
    }

    const cleanedName = name.trim();
    const cleanedUsername = (username || getGeneratedUsername(savedUser)).trim() || getGeneratedUsername(savedUser);

    const nextUser = {
      ...savedUser,
      name: cleanedName,
      username: cleanedUsername,
      profile_image: profileImage || savedUser?.profile_image || '',
      profile_image_url: profileImage || savedUser?.profile_image_url || ''
    };

    setLoading(true);
    try {
      await API.post('/update-profile', {
        user_id: savedUser?.id,
        name: cleanedName,
        profile_image_url: profileImage || null
      }).catch(() => null);

      persistProfile(nextUser);
      appendHistoryEvent('Ganti nama profil');
      if (profileImage) {
        appendHistoryEvent('Ganti foto profil');
      }
      alert('Profil berhasil diperbarui!');
      navigate('/profile');
    } catch (err) {
      alert('Profil belum berhasil diperbarui. Periksa koneksi lalu coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const profileTable = readProfileTable();
    if (savedUser?.id) delete profileTable[savedUser.id];
    writeProfileTable(profileTable);

    localStorage.removeItem('user');
    localStorage.removeItem(`finclass-history-${savedUser?.id}`);
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="space-y-4 pb-2">
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900">Setting Profil</h1>
            <p className="text-[10px] text-slate-400">Atur foto, username, dan data profilmu</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Foto Profil</label>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-inner">
                  {profileImage ? (
                    <img src={profileImage} alt="Preview foto profil" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
                      <FontAwesomeIcon icon={faCamera} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="profile-image-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-[10px] font-bold text-indigo-600">
                    <FontAwesomeIcon icon={faImage} /> Pilih Foto
                  </label>
                  <input id="profile-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <p className="mt-2 text-[10px] text-slate-400">Dukung upload dari file atau sisipkan URL foto langsung.</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">URL Foto Profil</label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/foto.jpg"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 text-xs">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-4 top-3.5 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Akun (Tidak dapat diubah)</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-3.5 text-slate-400 text-xs" />
                <input
                  type="email"
                  value={savedUser?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 text-slate-400 border border-slate-200 rounded-2xl text-xs font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-2"
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Simpan Perubahan'}
              </button>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold rounded-2xl text-xs shadow-sm active:scale-[0.98] transition-all cursor-pointer border border-rose-100 flex justify-center items-center gap-2"
              >
                <FontAwesomeIcon icon={faRightFromBracket} /> Keluar Akun
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={showLogoutModal}
        title="Keluar akun?"
        message="Kamu bisa masuk lagi kapan saja dengan email dan password yang sama."
        confirmLabel="Ya, keluar"
        danger={true}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
      />
    </MainLayout>
  );
}
