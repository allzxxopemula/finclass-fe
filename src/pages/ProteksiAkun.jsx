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
      <div className="space-y-4 pb-6">
        
        {/* Top Navigation */}
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
              <h1 className="text-sm font-bold text-slate-800">Proteksi Akun</h1>
              <p className="text-[10px] text-slate-400 font-medium">Perbarui kata sandi untuk keamanan akun</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl flex items-start gap-3.5 border border-amber-200/70 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faShieldHalved} className="text-sm" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 mb-0.5">Penting</p>
              <p className="text-[11px] leading-relaxed font-medium text-amber-800">
                Jaga kerahasiaan kata sandi Anda. Jangan pernah membagikannya kepada siapapun.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <form onSubmit={handleUpdate} className="space-y-4">
              
              {/* Field Password Lama */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password Saat Ini</label>
                <div className="relative flex items-center">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3.5 text-slate-400 text-xs" />
                  <input 
                    type={showPasswordLama ? "text" : "password"} 
                    required 
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswordLama(!showPasswordLama)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={showPasswordLama ? faEyeSlash : faEye} className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Field Password Baru */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password Baru</label>
                <div className="relative flex items-center">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3.5 text-slate-400 text-xs" />
                  <input 
                    type={showPasswordBaru ? "text" : "password"} 
                    required 
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={showPasswordBaru ? faEyeSlash : faEye} className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs shadow-sm shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-70 flex justify-center items-center gap-2"
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