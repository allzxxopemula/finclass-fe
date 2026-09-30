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
  faCoins,
  faUsers,
  faPlus,
  faCheck
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

  // Simpan Siswa Massal
  const handleSaveBatchSiswa = async (e) => {
    e.preventDefault();
    const validNames = listInputSiswa.map(nama => nama.trim()).filter(nama => nama !== '');
    
    if (validNames.length === 0) {
      alert('Nama siswa tidak boleh kosong!');
      return;
    }

    setLoading(true);
    try {
      for (const nama of validNames) {
        await API.post('/tambah-siswa', { 
          kelas_id: kelasData.id, 
          user_id: user.id,
          nama_siswa: nama 
        });
      }

      setModeTambah(false);
      setJumlahSiswaInput('');
      setListInputSiswa([]);
      alert('Anggota baru berhasil ditambahkan!');
      fetchData(user.id);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menambahkan sebagian siswa ke database!');
      fetchData(user.id);
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
              <h1 className="text-sm font-bold text-slate-800">Kelola Anggota</h1>
              <p className="text-[10px] text-slate-400 font-medium">Atur nominal kas & daftar siswa</p>
            </div>
          </div>
        </div>

        {/* Pengaturan Nominal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xs shrink-0">
              <FontAwesomeIcon icon={faCoins} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Nominal Kas Mingguan</h3>
              <p className="text-[10px] text-slate-400 font-medium">Besaran iuran kas yang ditagih tiap minggu</p>
            </div>
          </div>

          <form onSubmit={handleSaveNominal} className="flex gap-2 pt-1">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
              <input 
                type="number" 
                value={tempNominal}
                onChange={(e) => setTempNominal(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center min-w-[70px]"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Simpan'}
            </button>
          </form>
        </div>

        {/* Daftar & Tambah Siswa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-indigo-600 text-xs" />
              <h3 className="text-xs font-bold text-slate-800">Daftar Anggota ({siswas.length})</h3>
            </div>
            <button 
              type="button"
              onClick={() => setModeTambah(!modeTambah)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[11px] rounded-xl active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-indigo-100"
            >
              <FontAwesomeIcon icon={modeTambah ? faPlus : faUserPlus} className={modeTambah ? "rotate-45 transition-transform" : ""} />
              <span>{modeTambah ? 'Tutup Form' : 'Tambah Massal'}</span>
            </button>
          </div>

          {/* Form Tambah Massal */}
          {modeTambah && (
            <div className="bg-indigo-50/60 p-4 rounded-xl space-y-3 border border-indigo-100">
              {listInputSiswa.length === 0 ? (
                <form onSubmit={handleGenerateKolom} className="flex gap-2">
                  <input 
                    type="number" required min="1" max="50"
                    value={jumlahSiswaInput} onChange={(e) => setJumlahSiswaInput(e.target.value)}
                    placeholder="Jumlah siswa (Misal: 5)"
                    className="w-full px-3.5 py-2 bg-white rounded-xl text-xs border border-indigo-200 font-medium text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm shadow-indigo-600/20 shrink-0">
                    Buat Kolom
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSaveBatchSiswa} className="space-y-2.5">
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
                        className="w-full px-3.5 py-2 bg-white rounded-xl text-xs border border-indigo-200 font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setListInputSiswa([])} className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Batal</button>
                    <button type="submit" disabled={loading} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm shadow-indigo-600/20 flex items-center justify-center gap-1.5">
                      {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <><FontAwesomeIcon icon={faCheck} /> Simpan Anggota</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* List Siswa */}
          <div className="space-y-2 pt-1">
            {siswas.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs font-medium text-slate-400">
                Belum ada anggota di kelas ini.
              </div>
            ) : (
              siswas.map((s, idx) => (
                <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center shadow-2xs hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-500 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate">{s.nama_siswa}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setConfirmDelete({ id: s.id, nama: s.nama_siswa })}
                    className="w-8 h-8 bg-rose-50 border border-rose-100 text-rose-500 rounded-lg flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all cursor-pointer shrink-0 active:scale-95"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
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