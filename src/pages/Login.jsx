import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

// Import Font Awesome Components & Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash, 
  faArrowRight, 
  faShieldHalved, 
  faTriangleExclamation, 
  faSpinner,
  faCoins
} from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await API.post('/login', formData);
      if (response.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Tidak dapat terhubung saat ini. Periksa koneksi internet lalu coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans px-4 py-6">
      {/* Top Header Logo */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight cursor-pointer"
        >
          <FontAwesomeIcon icon={faCoins} className="text-indigo-600" />
          <div>
            <span className="text-indigo-600">FIN</span>
            <span className="text-slate-400 font-medium">CLASS</span>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 flex items-center gap-1.5">
          <FontAwesomeIcon icon={faShieldHalved} size="xs" /> Secure Access
        </span>
      </div>

      {/* Login Card Form */}
      <div className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              Masukkan email dan password untuk mengelola kas kelasmu.
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 text-slate-400 text-sm" />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contoh: bendahara@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button type="button" onClick={() => navigate('/lupa-password')} className="text-xs font-medium text-indigo-600 hover:underline">Lupa password?</button>
              </div>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faLock} className="absolute left-3.5 text-slate-400 text-sm" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Memeriksa Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>
          </form>

          {/* Divider & Link to Register */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Belum punya akun kas kelas?{' '}
              <button 
                onClick={() => navigate('/register')} 
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Daftar Akun Baru
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-400">
        © 2026 FinClass — Platform Kas Kelas Modern.
      </footer>
    </div>
  );
}