import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faShieldHalved, 
  faLock,
  faEye,
  faEyeSlash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

export default function ProteksiAkun() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('user'));

  // State Form & Loading
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [loading, setLoading] = useState(false);

  // State Show/Hide Password Toggle
  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (passwordBaru.length < 6) {
      alert('Password baru minimal 6 karakter!');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/update-password', {
        user_id: savedUser?.id,
        password_lama: passwordLama,
        password_baru: passwordBaru
      });

      if (res.data.status === 'success') {
        alert('Password berhasil diperbarui di database! Silakan gunakan password baru kamu.');
        navigate('/profile');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui password! Cek kembali password lamamu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4 pb-2">
        
        {/* Top Navigation */}
        <div className="flex items-center gap-3 pt-2">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900">Proteksi Akun</h1>
            <p className="text-[10px] text-slate-400 font-semibold">Perbarui kata sandi untuk keamanan akun</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl flex gap-3 text-xs border border-amber-100 shadow-sm">
            <FontAwesomeIcon icon={faShieldHalved} className="text-xl text-amber-600 shrink-0" />
            <p className="leading-relaxed">
              Jaga kerahasiaan password Anda. Jangan pernah bagikan kepada siapapun, termasuk pihak sekolah.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <form onSubmit={handleUpdate} className="space-y-4">
              
              {/* Field Password Lama */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password Saat Ini</label>
                <div className="relative flex items-center">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 text-slate-400 text-xs" />
                  <input 
                    type={showPasswordLama ? "text" : "password"} 
                    required 
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-600" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswordLama(!showPasswordLama)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={showPasswordLama ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {/* Field Password Baru */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password Baru</label>
                <div className="relative flex items-center">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 text-slate-400 text-xs" />
                  <input 
                    type={showPasswordBaru ? "text" : "password"} 
                    required 
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-600" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={showPasswordBaru ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-extrabold rounded-2xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}