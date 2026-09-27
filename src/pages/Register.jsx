import React, { useState, useEffect } from 'react';
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
  
  // State untuk Modal & Cooldown
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const roleLabel = role
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  // Memicu munculnya modal confirm
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    setCountdown(5); // Reset waktu ke 5 detik setiap kali modal dibuka
    setErrorMessage('');
  };

  // Eksekusi Pendaftaran (Hanya bisa ditekan setelah cooldown selesai)
  const confirmRoleRegistration = async () => {
    setIsLoading(true);
    
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
      setShowConfirmModal(false); // Tutup modal jika error
    } finally {
      setIsLoading(false);
    }
  };

  // Efek Countdown
  useEffect(() => {
    if (!showConfirmModal || countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showConfirmModal, countdown]);

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
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 flex items-center gap-1.5 shadow-sm">
          <FontAwesomeIcon icon={faShieldHalved} size="xs" /> Secure Access
        </span>
      </div>

      {/* Register Card Form */}
      <div className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-100/50 space-y-6 relative overflow-hidden">
          
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Buat Akun Baru</h1>
            <p className="text-slate-400 text-xs">Pilih peran kamu di bawah ini:</p>
          </div>

          {/* Tab Pilihan Role */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('bendahara')}
              className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                role === 'bendahara' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FontAwesomeIcon icon={faUserTie} className="text-sm" />
              <span>Bendahara</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('siswa')}
              className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                role === 'siswa' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FontAwesomeIcon icon={faGraduationCap} className="text-sm" />
              <span>Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('wali_kelas')}
              className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                role === 'wali_kelas' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FontAwesomeIcon icon={faChalkboardUser} className="text-sm" />
              <span>Wali Kelas</span>
            </button>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faUser} className="absolute left-3.5 text-slate-400 text-xs" />
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Masukkan nama lengkap"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800" 
                />
              </div>
            </div>

            {/* Field Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Valid</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 text-slate-400 text-xs" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="contoh@gmail.com" 
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800" 
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="space-y-1.5">
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
                  className="w-full pl-9 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="xs" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              <span>Daftar Sebagai {roleLabel}</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </form>

          {/* Divider & Link to Login */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Sudah punya akun?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors cursor-pointer"
              >
                Masuk Di Sini
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL KONFIRMASI (DENGAN COOLDOWN 5 DETIK & TOMBOL BATAL) */}
      {/* ========================================================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl overflow-hidden relative">
            
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-xl" />
            </div>

            <h2 className="text-center text-sm font-black text-slate-400 tracking-wider">KONFIRMASI PERAN</h2>
            <p className="mt-1 text-center text-xl font-black text-slate-900">
              {roleLabel}
            </p>

            <div className="mt-5 rounded-2xl border border-indigo-100 bg-slate-50 p-4 text-center">
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                Apakah kamu yakin ingin mendaftar dengan peran <span className="text-indigo-600 font-black">{roleLabel}</span>?
              </p>
              <p className="mt-2 text-[10px] font-semibold text-slate-500 leading-relaxed">
                Pastikan peran yang kamu pilih sudah benar, karena peran ini akan menentukan hak akses dan fitur yang bisa kamu gunakan di dalam aplikasi.
              </p>
            </div>

            {/* Status Tunggu / Konfirmasi */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-black">
              {countdown > 0 ? (
                <>
                  <span className="text-slate-400">Harap baca dalam</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-700">{countdown}</span>
                  <span className="text-slate-400">detik</span>
                </>
              ) : (
                <span className="text-indigo-600 animate-pulse">Silakan konfirmasi sekarang!</span>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              {/* Tombol Batal SELALU AKTIF */}
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 py-3 text-xs font-bold text-slate-600 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Batal
              </button>
              
              {/* Tombol Lanjut (Aktif setelah countdown 0) */}
              <button
                type="button"
                onClick={confirmRoleRegistration}
                disabled={countdown > 0 || isLoading}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  'Ya, Lanjutkan'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-[10px] font-bold text-slate-400 pb-2">
        © 2026 FinClass — Platform Kas Kelas Modern
      </footer>
      
    </div>
  );
}