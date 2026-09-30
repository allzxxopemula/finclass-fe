import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ConfirmModal from '../components/ConfirmModal';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRightFromBracket, 
  faTrash, 
  faSpinner,
  faSchool,
  faPenToSquare,
  faKey,
  faCalendarDays,
  faBuildingColumns
} from '@fortawesome/free-solid-svg-icons';

export default function SettingKelas() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [kelasData, setKelasData] = useState(null);
  const [loading, setLoading] = useState(false);

  // State Form Edit Kelas (Khusus Bendahara)
  const [namaKelasInput, setNamaKelasInput] = useState('');
  const [kodeAksesInput, setKodeAksesInput] = useState('');
  const [hariPenarikan, setHariPenarikan] = useState('Rabu');
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      if (savedUser.kelas_id) {
        API.get(`/dashboard?user_id=${savedUser.id}`)
          .then(res => {
            if (res.data.status === 'success') {
              setKelasData(res.data.kelas);
              setNamaKelasInput(res.data.kelas.nama_kelas);
              setKodeAksesInput(res.data.kelas.kode_akses_publik);
              setHariPenarikan(res.data.kelas.hari_penarikan || 'Rabu');
            }
          })
          .catch(err => console.error(err));
      } else {
        navigate('/home');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Handler Update Kelas (Bendahara)
  const handleUpdateKelas = async (e) => {
    e.preventDefault();
    if (!namaKelasInput || !kodeAksesInput) {
      alert("Nama kelas dan kode akses tidak boleh kosong!");
      return;
    }

    setLoadingEdit(true);
    try {
      const res = await API.post('/update-kelas', {
        kelas_id: kelasData.id,
        user_id: user.id,
        nama_kelas: namaKelasInput,
        kode_akses_publik: kodeAksesInput,
        hari_penarikan: hariPenarikan
      });

      if (res.data.status === 'success') {
        setKelasData(res.data.kelas);
        alert("Pengaturan kelas berhasil diperbarui!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui kelas! Kemungkinan kode akses sudah digunakan kelas lain.");
    } finally {
      setLoadingEdit(false);
    }
  };

  // Handler Keluar dari Kelas (Siswa & Wali Kelas)
  const handleKeluarKelas = async () => {
    setLoading(true);
    try {
      const res = await API.post('/keluar-kelas', { user_id: user.id });
      if (res.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Berhasil keluar dari kelas!");
        navigate('/home');
      }
    } catch (err) {
      alert("Gagal keluar dari kelas!");
    } finally {
      setLoading(false);
    }
  };

  // Handler Hapus Room Kelas Permanen (Bendahara)
  const handleHapusKelas = async () => {
    setLoading(true);
    try {
      const res = await API.post('/hapus-kelas', { 
        user_id: user.id,
        kelas_id: kelasData.id 
      });
      if (res.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Room kelas berhasil dihapus permanen! Kamu sekarang bisa membuat kelas baru.");
        navigate('/home');
      }
    } catch (err) {
      alert("Gagal menghapus room kelas!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4 pb-6">
        
        {/* Header Top Bar */}
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
              <h1 className="text-sm font-bold text-slate-800">Setting Akun Kelas</h1>
              <p className="text-[10px] text-slate-400 font-medium">Pengaturan room & keanggotaan kelas</p>
            </div>
          </div>
        </div>

        {/* Card Informasi Kelas */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-sm shadow-sm shadow-indigo-600/20 shrink-0">
              <FontAwesomeIcon icon={faSchool} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Kelas Aktif</p>
              <h3 className="text-xs sm:text-sm font-bold text-indigo-950 truncate">{kelasData?.nama_kelas || 'Memuat...'}</h3>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-400 font-bold">Kode Akses</p>
            <p className="text-xs font-mono font-bold text-indigo-600 tracking-wider">{kelasData?.kode_akses_publik || '-'}</p>
          </div>
        </div>

        {/* Form Edit Kelas (Khusus Bendahara) */}
        {user?.role === 'bendahara' && (
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-xs pb-2 border-b border-slate-100">
              <FontAwesomeIcon icon={faPenToSquare} className="text-indigo-600 text-sm" />
              <span>Edit Informasi Kelas & Kode Akses</span>
            </div>

            <form onSubmit={handleUpdateKelas} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Kelas</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faBuildingColumns} className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                  <input 
                    type="text" 
                    value={namaKelasInput} 
                    onChange={e => setNamaKelasInput(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kode Akses Publik (Unik)</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faKey} className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                  <input 
                    type="text" 
                    value={kodeAksesInput} 
                    onChange={e => setKodeAksesInput(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase font-mono text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hari Penarikan Kas</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faCalendarDays} className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                  <select 
                    value={hariPenarikan} 
                    onChange={e => setHariPenarikan(e.target.value)} 
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors appearance-none"
                  >
                    {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 font-medium">Kolom penarikan kas otomatis disesuaikan tiap tanggal {hariPenarikan}.</p>
              </div>

              <button 
                type="submit" 
                disabled={loadingEdit}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] mt-2"
              >
                {loadingEdit ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Simpan Perubahan Kelas'}
              </button>
            </form>
          </div>
        )}

        {/* Opsi Tindakan Keanggotaan */}
        <div className="space-y-2.5 pt-1">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Tindakan Keanggotaan</h4>

          {/* Jika Siswa / Wali Kelas: Tampilkan Tombol Keluar Kelas */}
          {(user?.role === 'siswa' || user?.role === 'wali_kelas') && (
            <button
              type="button"
              onClick={() => setConfirmAction('keluar')}
              disabled={loading}
              className="w-full px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer border border-slate-200 active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-xs shrink-0">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Keluar dari Kelas</p>
                  <p className="text-[10px] text-slate-400 font-medium">Lepas keterhubungan akunmu dari room kelas ini</p>
                </div>
              </div>
              {loading && <FontAwesomeIcon icon={faSpinner} spin className="text-slate-400" />}
            </button>
          )}

          {/* Jika Bendahara: Tampilkan Tombol Hapus Room Kelas */}
          {user?.role === 'bendahara' && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xs shrink-0">
                  <FontAwesomeIcon icon={faTrash} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Hapus Room Kelas Permanen</p>
                  <p className="text-[10px] text-slate-500 font-medium">Hapus seluruh room beserta data siswa dan kas sekelas</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmAction('hapus')}
                disabled={loading}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm shadow-rose-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Hapus Room Permanen'}
              </button>
            </div>
          )}
        </div>

      </div>

      <ConfirmModal
        open={Boolean(confirmAction)}
        title={confirmAction === 'hapus' ? 'Hapus room kelas?' : 'Keluar dari kelas?'}
        message={confirmAction === 'hapus' ? 'Seluruh anggota, transaksi, dan riwayat kelas akan dihapus permanen.' : 'Akunmu akan terlepas dari kelas dan perlu kode akses untuk bergabung lagi.'}
        confirmLabel={confirmAction === 'hapus' ? 'Hapus permanen' : 'Keluar kelas'}
        danger={confirmAction === 'hapus'}
        onCancel={() => setConfirmAction(null)}
        onConfirm={async () => { const action = confirmAction; setConfirmAction(null); if (action === 'hapus') await handleHapusKelas(); else await handleKeluarKelas(); }}
      />
    </MainLayout>
  );
}