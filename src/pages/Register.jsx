import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTie, 
  faGraduationCap, 
  faChalkboardUser, 
  faEnvelope, 
  faLock, 
  faUser, 
  faArrowRight, 
  faShieldHalved,
  faTriangleExclamation, 
  faSpinner,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('bendahara');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const payload = { 
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role 
      };

      const response = await API.post('/register', payload);

      if (response.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Gagal mendaftar akun. Coba email lain!');
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
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/finclassicon.png" alt="FinClass Logo" className="w-7 h-7 object-contain" />
          <div className="text-xl font-extrabold tracking-tight">
            <span className="text-indigo-600">FIN</span>
            <span className="text-slate-400 font-medium">CLASS</span>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 flex items-center gap-1.5">
          <FontAwesomeIcon icon={faShieldHalved} size="xs" /> Secure Access
        </span>
      </div>

      {/* Register Card Form */}
      <div className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-100 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Buat Akun Baru</h1>
            <p className="text-slate-400 text-xs">Pilih peran kamu di bawah ini:</p>
          </div>

          {/* Tab Pilihan Role */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('bendahara')}
              className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                role === 'bendahara' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FontAwesomeIcon icon={faUserTie} />
              <span>Bendahara</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('siswa')}
              className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                role === 'siswa' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FontAwesomeIcon icon={faGraduationCap} />
              <span>Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('wali_kelas')}
              className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                role === 'wali_kelas' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FontAwesomeIcon icon={faChalkboardUser} />
              <span>Wali Kelas</span>
            </button>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Field Nama Lengkap */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faUser} className="absolute left-3.5 text-slate-400 text-xs" />
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="contoh: Aldo Rendy" 
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-800" 
                />
              </div>
            </div>

            {/* Field Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 text-slate-400 text-xs" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="contoh: aldo@gmail.com" 
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-800" 
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faLock} className="absolute left-3.5 text-slate-400 text-xs" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  required 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Minimal 6 Karakter" 
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-800" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="xs" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sebagai {role.replace('_', ' ').toUpperCase()}</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>
          </form>

          {/* Divider & Link to Login */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Sudah punya akun?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Masuk Di Sini
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