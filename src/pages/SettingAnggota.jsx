import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ConfirmModal from '../components/ConfirmModal';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faTrash, 
  faUserPlus, 
  faSpinner, 
  faCoins
} from '@fortawesome/free-solid-svg-icons';

export default function SettingAnggota() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [kelasData, setKelasData] = useState(null);
  const [siswas, setSiswas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tempNominal, setTempNominal] = useState(0);
  const [jumlahSiswaInput, setJumlahSiswaInput] = useState('');
  const [listInputSiswa, setListInputSiswa] = useState([]);
  const [modeTambah, setModeTambah] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchData = async (userId) => {
    try {
      const res = await API.get(`/dashboard?user_id=${userId}`);
      if (res.data.status === 'success') {
        setKelasData(res.data.kelas);
        setSiswas(res.data.siswas || []);
        setTempNominal(res.data.kelas.nominal_mingguan);
      }
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      fetchData(savedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Update Nominal Kas
  const handleSaveNominal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/update-nominal', {
        kelas_id: kelasData.id,
        user_id: user.id,
        nominal_mingguan: tempNominal
      });
      if (res.data.status === 'success') {
        alert('Nominal berhasil diperbarui!');
        fetchData(user.id);
      }
    } catch (err) {
      alert('Gagal mengubah nominal kas!');
    } finally {
      setLoading(false);
    }
  };

  // Generate Kolom Input Massal
  const handleGenerateKolom = (e) => {
    e.preventDefault();
    const count = parseInt(jumlahSiswaInput);
    if (!count || count <= 0) return;
    setListInputSiswa(Array.from({ length: count }, () => ''));
  };

  // Simpan Siswa Massal (Fix Bug Error Alert padahal Masuk Database)
  const handleSaveBatchSiswa = async (e) => {
    e.preventDefault();
    const validNames = listInputSiswa.map(nama => nama.trim()).filter(nama => nama !== '');
    
    if (validNames.length === 0) {
      alert('Nama siswa tidak boleh kosong!');
      return;
    }

    setLoading(true);
    try {
      // Mengirim satu-persatu dengan aman menggunakan try-catch di dalam map atau endpoint batch
      for (const nama of validNames) {
        await API.post('/tambah-siswa', { 
          kelas_id: kelasData.id, 
          user_id: user.id,
          nama_siswa: nama 
        });
      }

      // Reset form setelah sukses sepenuhnya
      setModeTambah(false);
      setJumlahSiswaInput('');
      setListInputSiswa([]);
      alert('Anggota baru berhasil ditambahkan!');
      fetchData(user.id);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menambahkan sebagian siswa ke database!');
      fetchData(user.id); // Tetap fetch data agar siswa yang sempat masuk langsung kerender
    } finally {
      setLoading(false);
    }
  };

  // Fitur Hapus Siswa
  const handleHapusSiswa = async (siswaId, nama) => {
    try {
      const res = await API.delete(`/hapus-siswa/${siswaId}`, { data: { user_id: user.id } });
      if (res.data.status === 'success') {
        fetchData(user.id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan sistem saat menghapus!');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-5 pb-2">
        
        {/* Top Navigation */}
        <div className="flex items-center gap-3 pt-2">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900">Kelola Anggota</h1>
            <p className="text-[10px] text-slate-400 font-semibold">Atur nominal kas & daftar siswa</p>
          </div>
        </div>

        {/* Pengaturan Nominal */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faCoins} className="text-emerald-500" /> Pengaturan Nominal Kas Mingguan
          </h3>
          <form onSubmit={handleSaveNominal} className="flex gap-2">
            <input 
              type="number" 
              value={tempNominal}
              onChange={(e) => setTempNominal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Simpan'}
            </button>
          </form>
        </div>

        {/* Daftar & Tambah Siswa */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">Daftar Anggota ({siswas.length})</h3>
            <button 
              onClick={() => setModeTambah(!modeTambah)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[11px] rounded-xl active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faUserPlus} /> Tambah Massal
            </button>
          </div>

          {/* Form Tambah Massal */}
          {modeTambah && (
            <div className="bg-indigo-50/50 p-3.5 rounded-2xl space-y-3 border border-indigo-100">
              {listInputSiswa.length === 0 ? (
                <form onSubmit={handleGenerateKolom} className="flex gap-2">
                  <input 
                    type="number" required min="1" max="50"
                    value={jumlahSiswaInput} onChange={(e) => setJumlahSiswaInput(e.target.value)}
                    placeholder="Jumlah siswa (Misal: 5)"
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs border border-indigo-200 focus:outline-none focus:border-indigo-600"
                  />
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm">Buat Kolom</button>
                </form>
              ) : (
                <form onSubmit={handleSaveBatchSiswa} className="space-y-2">
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {listInputSiswa.map((nama, idx) => (
                      <input 
                        key={idx} type="text" required value={nama}
                        onChange={(e) => {
                          const newArr = [...listInputSiswa];
                          newArr[idx] = e.target.value;
                          setListInputSiswa(newArr);
                        }}
                        placeholder={`Nama Absen ${siswas.length + idx + 1}`}
                        className="w-full px-3 py-2 bg-white rounded-xl text-xs border border-indigo-200 focus:outline-none focus:border-indigo-600"
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setListInputSiswa([])} className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Batal</button>
                    <button type="submit" disabled={loading} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm flex items-center justify-center">
                      {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Simpan Anggota'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* List Siswa */}
          <div className="space-y-2 pt-1">
            {siswas.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-400">
                Belum ada anggota di kelas ini.
              </div>
            ) : (
              siswas.map((s, idx) => (
                <div key={s.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-slate-700">Absen {idx + 1}: {s.nama_siswa}</span>
                  <button 
                    onClick={() => setConfirmDelete({ id: s.id, nama: s.nama_siswa })}
                    className="w-8 h-8 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
      <ConfirmModal
        open={Boolean(confirmDelete)}
        title="Hapus anggota?"
        message={confirmDelete ? `Hapus ${confirmDelete.nama}? Riwayat kas anggota ini juga akan terhapus.` : ''}
        confirmLabel="Hapus anggota"
        danger
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => { const item = confirmDelete; setConfirmDelete(null); await handleHapusSiswa(item.id, item.nama); }}
      />
    </MainLayout>
  );
}