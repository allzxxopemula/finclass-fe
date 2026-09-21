import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function SettingProfile() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const [name, setName] = useState(savedUser?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }

    setLoading(true);
    try {
      // 1. SIMPAN KE DATABASE MYSQL
      const res = await API.post('/update-profile', {
        user_id: savedUser?.id,
        name: name
      });

      if (res.data.status === 'success') {
        // 2. SIMPAN KE LOCALSTORAGE FRONTEND
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Nama profil berhasil diperbarui secara permanen!");
        navigate('/profile');
      }
    } catch (err) {
      alert("Profil belum berhasil diperbarui. Periksa koneksi lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4 pb-2">
        {/* Top Header dengan Tombol Kembali */}
        <div className="flex items-center gap-3 pt-2">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900">Setting Profil</h1>
            <p className="text-[10px] text-slate-400">Perbarui nama tampilan akunmu</p>
          </div>
        </div>

        {/* Form Setting Profil */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
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

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-2"
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}