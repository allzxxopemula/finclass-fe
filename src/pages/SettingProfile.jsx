import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faSpinner, faImage, faCamera, faRightFromBracket, faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const IMGBB_API_KEY = '4bee746ba64cbd55467c63342a529be0';
const PROFILE_TABLE_KEY = 'finclass-user-profiles';

const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
const MAX_GIF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const fixImgbbUrl = (url) => {
  if (!url) return '';
  return url.replace(/i\.ibb\.co(?!\.com)/g, 'i.ibb.co.com');
};

const suspiciousUrlPattern = /(porn|xxx|adult|nsfw|nude|sexy|erotic|hentai|gore|lewd|fuck)/i;

const validateRemoteImageUrl = (url, label = 'Gambar') => new Promise((resolve, reject) => {
  const cleanUrl = String(url || '').trim();

  if (!cleanUrl) {
    reject(new Error(`${label} tidak boleh kosong.`));
    return;
  }

  if (!/^https?:\/\//i.test(cleanUrl)) {
    reject(new Error(`${label} harus menggunakan URL yang valid.`));
    return;
  }

  if (suspiciousUrlPattern.test(cleanUrl)) {
    reject(new Error(`${label} terdeteksi berisi konten yang tidak aman.`));
    return;
  }

  const image = new Image();
  const timer = setTimeout(() => {
    reject(new Error(`${label} tidak bisa dimuat atau bukan file gambar yang valid.`));
  }, 8000);

  image.onload = () => {
    clearTimeout(timer);
    resolve(cleanUrl);
  };

  image.onerror = () => {
    clearTimeout(timer);
    reject(new Error(`${label} tidak bisa dimuat atau bukan file gambar yang valid.`));
  };

  image.src = `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}cacheBust=${Date.now()}`;
});

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
    const rawImage = storedProfile?.image || savedUser?.profile_image || '';
    return fixImgbbUrl(rawImage);
  });
  const [bannerUrl, setBannerUrl] = useState(() => {
    const storedProfile = getStoredProfile(savedUser);
    return storedProfile?.banner || savedUser?.banner || '';
  });
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Upload Confirm Modal State
  const [showUploadConfirmModal, setShowUploadConfirmModal] = useState(false);
  const [uploadCountdown, setUploadCountdown] = useState(5);
  const [pendingUploadFile, setPendingUploadFile] = useState(null);

  useEffect(() => {
    if (!savedUser) {
      navigate('/login');
    }
  }, [savedUser, navigate]);

  useEffect(() => {
    if (!showUploadConfirmModal || uploadCountdown === 0) return;
    const timer = setTimeout(() => setUploadCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [showUploadConfirmModal, uploadCountdown]);

  const persistProfile = (nextUser) => {
    const safeImageUrl = fixImgbbUrl(nextUser.profile_image_url || nextUser.profile_image || '');
    
    const profileData = {
      name: nextUser.name,
      username: nextUser.username,
      image: safeImageUrl,
      profile_image_url: safeImageUrl,
      banner: nextUser.banner || ''
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

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isGif = file.type === 'image/gif';
    const maxSize = isGif ? MAX_GIF_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;

    if (file.size > maxSize) {
      alert(`Ukuran file terlalu besar. Maksimal untuk ${isGif ? 'GIF adalah 10 MB' : 'gambar adalah 3 MB'}.`);
      event.target.value = '';
      return;
    }

    setPendingUploadFile(file);
    setUploadCountdown(5);
    setShowUploadConfirmModal(true);
    event.target.value = ''; 
  };

  const executeUpload = async () => {
    if (!pendingUploadFile) return;
    
    setLoading(true);
    setShowUploadConfirmModal(false);
    try {
      const uploadedUrl = await uploadToImgBB(pendingUploadFile);
      setProfileImage(fixImgbbUrl(uploadedUrl)); 
      appendHistoryEvent('Ganti foto profil');
    } catch (error) {
      alert(error.message || 'Gagal mengunggah foto profil');
    } finally {
      setLoading(false);
      setPendingUploadFile(null);
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
    const safeProfileImage = fixImgbbUrl(profileImage);

    let safeBannerUrl = '';
    if (bannerUrl && bannerUrl.trim()) {
      try {
        safeBannerUrl = await validateRemoteImageUrl(bannerUrl, 'Banner');
      } catch (error) {
        alert(error.message || 'Banner tidak dapat digunakan.');
        return;
      }
    }

    const nextUser = {
      ...savedUser,
      name: cleanedName,
      username: cleanedUsername,
      profile_image: safeProfileImage,
      profile_image_url: safeProfileImage,
      banner: safeBannerUrl || ''
    };

    setLoading(true);
    try {
      const response = await API.post('/update-profile', {
        user_id: savedUser?.id,
        name: cleanedName,
        username: cleanedUsername,
        profile_image_url: safeProfileImage || null,
        banner: safeBannerUrl || null
      });

      const savedProfileUser = response?.data?.user || nextUser;
      persistProfile(savedProfileUser);
      appendHistoryEvent('Ganti nama profil');
      if (safeProfileImage) {
        appendHistoryEvent('Ganti foto profil');
      }
      if (safeBannerUrl) {
        appendHistoryEvent('Ganti banner profil');
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

  const deleteConfirmationText = `Saya ingin menghapus akun ${savedUser?.username || username || getGeneratedUsername(savedUser)} secara permanen`;

  const handleDeleteAccount = async () => {
    if (!savedUser?.id) return;

    const normalizedInput = deleteConfirmText.trim();
    const normalizedExpected = deleteConfirmationText.trim();

    if (normalizedInput.toLowerCase() !== normalizedExpected.toLowerCase()) {
      alert('Ketik ulang kalimat konfirmasi dengan benar untuk menghapus akun.');
      return;
    }

    setLoading(true);

    try {
      const response = await API.delete('/delete-account', {
        data: {
          user_id: savedUser.id,
          confirmation_text: normalizedInput,
        },
      });

      if (response.data.status === 'success') {
        const profileTable = readProfileTable();
        delete profileTable[savedUser.id];
        writeProfileTable(profileTable);

        localStorage.removeItem('user');
        localStorage.removeItem(`finclass-history-${savedUser.id}`);
        localStorage.removeItem(`finclass-qris-${savedUser.id}`);
        navigate('/login');
        return;
      }

      alert(response.data.message || 'Gagal menghapus akun.');
    } catch (error) {
      alert(error?.response?.data?.message || 'Gagal menghapus akun.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4 pb-2">
        <div className="sticky top-0 z-30 -mx-4 -mt-4 border-b border-slate-100 bg-slate-50/95 px-4 pb-3 pt-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
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
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Foto Profil</label>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-inner">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Preview foto profil" 
                      className="h-full w-full object-cover" 
                      onError={(event) => { event.currentTarget.style.display = 'none'; }} 
                    />
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
                  <input id="profile-image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  <p className="mt-2 text-[10px] text-slate-400">JPG/PNG maks 3MB, GIF maks 10MB.</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">URL Foto Profil</label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(fixImgbbUrl(e.target.value))}
                placeholder="https://example.com/foto.jpg"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">URL Banner Profil</label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
              />
              {bannerUrl && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="h-24 w-full bg-slate-100">
                    <img src={bannerUrl} alt="Preview banner profil" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                  </div>
                </div>
              )}
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

        <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-red-50 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Danger Zone</p>
              <p className="text-[10px] text-slate-500">Tindakan ini bersifat permanen.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="w-full rounded-2xl border border-rose-200 bg-rose-600 px-4 py-3 text-xs font-black text-white shadow-md shadow-rose-200 transition hover:bg-rose-700 active:scale-[0.98]"
          >
            <span className="inline-flex items-center gap-2">
              <FontAwesomeIcon icon={faTrash} />
              Hapus Akun Saya
            </span>
          </button>
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

      {/* MODAL KONFIRMASI UPLOAD */}
      {showUploadConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl overflow-hidden relative">
            
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
              <FontAwesomeIcon icon={faImage} className="text-xl" />
            </div>

            <h2 className="text-center text-sm font-black text-slate-400 tracking-wider">KONFIRMASI UPLOAD</h2>
            <p className="mt-1 text-center text-lg font-black text-slate-900">
              Unggah Foto Profil?
            </p>

            <div className="mt-4 rounded-2xl border border-indigo-100 bg-slate-50 p-4 text-center">
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                File akan diunggah ke server. Pastikan gambar mematuhi pedoman komunitas.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-black">
              {uploadCountdown > 0 ? (
                <>
                  <span className="text-slate-400">Harap baca dalam</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-700">{uploadCountdown}</span>
                  <span className="text-slate-400">detik</span>
                </>
              ) : (
                <span className="text-indigo-600 animate-pulse">Siap diunggah!</span>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowUploadConfirmModal(false);
                  setPendingUploadFile(null);
                }}
                disabled={loading}
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 py-3 text-xs font-bold text-slate-600 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Batal
              </button>
              
              <button
                type="button"
                onClick={executeUpload}
                disabled={uploadCountdown > 0 || loading}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  'Ya, Unggah'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>

            <h2 className="mt-4 text-center text-base font-black text-slate-900">Hapus akun secara permanen?</h2>
            <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">
              Semua data akun, chat, dan riwayat yang terkait akan dihapus. Tindakan ini tidak bisa dibatalkan.
            </p>

            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-rose-600">Konfirmasi</p>
              <p className="mt-2 text-xs text-slate-700">Ketik kalimat berikut untuk melanjutkan:</p>
              <p className="mt-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 break-words">
                {deleteConfirmationText}
              </p>
            </div>

            <label className="mt-4 block text-[10px] font-black uppercase tracking-wider text-slate-500">Ketik ulang konfirmasi</label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(event) => setDeleteConfirmText(event.target.value)}
              placeholder={deleteConfirmationText}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-rose-500 focus:bg-white"
            />

            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-600">Batal</button>
              <button type="button" onClick={handleDeleteAccount} disabled={loading} className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Menghapus...' : 'Hapus akun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}