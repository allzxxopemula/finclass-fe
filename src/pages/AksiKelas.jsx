import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faPlus, 
  faRightToBracket, 
  faSchool, 
  faMoneyBillWave, 
  faKey, 
  faSpinner 
} from '@fortawesome/free-solid-svg-icons';

export default function AksiKelas() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State Buat Kelas (Bendahara)
  const [namaKelas, setNamaKelas] = useState('');
  const [nominalMingguan, setNominalMingguan] = useState('');
  const [hariPenarikan, setHariPenarikan] = useState('Rabu');

  // Form State Join Kelas (Siswa / Wali)
  const [kodeAkses, setKodeAkses] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      // Jika user ternyata sudah punya kelas, kembalikan ke profil
      if (savedUser.kelas_id) {
        navigate('/profile');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Handler Bendahara Membuat Kelas Baru
  const handleBuatKelas = async (e) => {
    e.preventDefault();
    if (!namaKelas || !nominalMingguan) {
      alert("Harap isi nama kelas dan nominal mingguan!");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/buat-kelas', {
        user_id: user.id,
        nama_kelas: namaKelas,
        nominal_mingguan: nominalMingguan,
        hari_penarikan: hariPenarikan
      });

      if (res.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Kelas berhasil dibuat!");
        navigate('/profile');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membuat kelas baru!");
    } finally {
      setLoading(false);
    }
  };

  // Handler Siswa / Wali Join Kelas via Kode
  const handleJoinKelas = async (e) => {
    e.preventDefault();
    if (!kodeAkses) {
      alert("Harap masukkan kode akses kelas!");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/join-kelas', {
        user_id: user.id,
        kode_akses_publik: kodeAkses
      });

      if (res.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Berhasil bergabung ke kelas!");
        navigate('/profile');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Kode kelas tidak ditemukan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex justify-center pb-10">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl border-x border-slate-200">
        
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900">
              {user?.role === 'bendahara' ? 'Buat Room Kelas' : 'Gabung Room Kelas'}
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold">
              {user?.role === 'bendahara' ? 'Buat ruang kas baru untuk kelasmu' : 'Masukkan kode unik untuk masuk ke kelas'}
            </p>
          </div>
        </div>

        <div className="p-6">
          
          {/* BENDAHARA: FORM BUAT KELAS */}
          {user?.role === 'bendahara' ? (
            <form onSubmit={handleBuatKelas} className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-sm">
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-900">Ruang Kelas Baru</h4>
                  <p className="text-[10px] text-indigo-500 font-medium">Kamu bertindak sebagai Bendahara Kelas</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Kelas</label>
                <div className="relative flex items-center">
                  <FontAwesomeIcon icon={faSchool} className="absolute left-4 text-slate-400 text-sm" />
                  <input 
                    type="text" 
                    required 
                    value={namaKelas} 
                    onChange={e => setNamaKelas(e.target.value)} 
                    placeholder="Contoh: XI RPL 2" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-indigo-600" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nominal Kas Mingguan (Rp)</label>
                <div className="relative flex items-center">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="absolute left-4 text-slate-400 text-sm" />
                  <input 
                    type="number" 
                    required 
                    value={nominalMingguan} 
                    onChange={e => setNominalMingguan(e.target.value)} 
                    placeholder="Contoh: 5000" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-indigo-600" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Hari Penarikan Kas</label>
                  <select value={hariPenarikan} onChange={e => setHariPenarikan(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-indigo-600">
                    {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm shadow-md active:scale-95 transition-all cursor-pointer mt-4 flex justify-center items-center gap-2"
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Buat Room Kelas Sekarang'}
              </button>
            </form>
          ) : (
            /* SISWA / WALI KELAS: FORM JOIN KELAS */
            <form onSubmit={handleJoinKelas} className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-sm">
                  <FontAwesomeIcon icon={faRightToBracket} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Gabung Kelas</h4>
                  <p className="text-[10px] text-emerald-600 font-medium">Minta kode akses ke Bendahara Kelasmu</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kode Akses Kelas</label>
                <div className="relative flex items-center">
                  <FontAwesomeIcon icon={faKey} className="absolute left-4 text-slate-400 text-sm" />
                  <input 
                    type="text" 
                    required 
                    value={kodeAkses} 
                    onChange={e => setKodeAkses(e.target.value.toUpperCase())} 
                    placeholder="Contoh: X7AB82" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black tracking-widest text-slate-800 focus:outline-none focus:border-indigo-600 uppercase" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow-md active:scale-95 transition-all cursor-pointer mt-4 flex justify-center items-center gap-2"
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Gabung Kelas Sekarang'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}