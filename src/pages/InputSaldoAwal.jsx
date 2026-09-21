import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faWallet, 
  faPlus, 
  faSpinner,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';

export default function InputSaldoAwal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [kelas, setKelas] = useState(null);
  const [nominal, setNominal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      // Hanya Bendahara dengan kelas_id yang bisa akses
      if (savedUser.role === 'bendahara' && savedUser.kelas_id) {
        API.get(`/dashboard?user_id=${savedUser.id}`)
          .then(res => {
            if (res.data.status === 'success') {
              setKelas(res.data.kelas);
            }
          })
          .catch(err => console.error(err));
      } else {
        navigate('/profile');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nominal || nominal <= 0) {
      alert("Masukkan nominal saldo awal yang valid!");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/tambah-saldo-awal', {
        kelas_id: kelas.id,
        user_id: user.id,
        nominal: nominal
      });

      if (res.data.status === 'success') {
        alert("Saldo awal kas berhasil ditambahkan!");
        navigate('/profile');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memasukkan saldo awal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4 pb-2">
        
        {/* Header dengan Tombol Kembali */}
        <div className="flex items-center gap-3 pt-2">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900">Input Saldo Kas Awal</h1>
            <p className="text-[10px] text-slate-400 font-semibold">Migrasi pencatatan dari kas fisik/buku manual</p>
          </div>
        </div>

        {/* Information Card */}
        <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-start gap-3 shadow-sm">
          <div className="w-9 h-9 bg-teal-600 text-white rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
            <FontAwesomeIcon icon={faWallet} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-teal-900">Tentang Saldo Awal</h4>
            <p className="text-[10px] text-teal-700 leading-relaxed">
              Fitur ini digunakan jika kelasmu sudah memiliki uang kas fisik dari hasil pencatatan manual sebelum menggunakan aplikasi ini.
            </p>
          </div>
        </div>

        {/* Form Saldo Awal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nominal Saldo Kas Manual (Rp)</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faMoneyBillWave} className="absolute left-4 text-slate-400 text-xs" />
                <input 
                  type="number" 
                  required 
                  min="1"
                  value={nominal} 
                  onChange={e => setNominal(e.target.value)} 
                  placeholder="Contoh: 150000" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600" 
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-2"
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <><FontAwesomeIcon icon={faPlus} /> Tambahkan ke Kas Sistem</>}
              </button>
            </div>
          </form>
        </div>

      </div>
    </MainLayout>
  );
}