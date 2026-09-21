import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import ConfirmModal from '../components/ConfirmModal';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClockRotateLeft, 
  faArrowUp, 
  faArrowDown,
  faPlus,
  faSpinner,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

export default function History() {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('semua');
  const [riwayat, setRiwayat] = useState([]);
  const [aktivitas, setAktivitas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form Pengeluaran
  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [hiddenHistoryIds, setHiddenHistoryIds] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const key = savedUser?.id && savedUser?.kelas_id ? `finclass-hidden-history-${savedUser.id}-${savedUser.kelas_id}` : '';
    return key ? JSON.parse(localStorage.getItem(key) || '[]') : [];
  });

  const getHistoryKey = () => user?.id && user?.kelas_id ? `finclass-hidden-history-${user.id}-${user.kelas_id}` : null;
  const visibleItems = items => items.filter(item => !hiddenHistoryIds.includes(item.id));

  const fetchRiwayat = async (kelasId) => {
    try {
      const res = await API.get(`/riwayat?kelas_id=${kelasId}`);
      if (res.data.status === 'success') {
        setRiwayat(visibleItems(res.data.riwayat));
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat transaksi:", err);
    } finally {
      setLoadingRiwayat(false);
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      if (savedUser.kelas_id) {
        fetchRiwayat(savedUser.kelas_id);
        API.get(`/aktivitas?user_id=${savedUser.id}`)
          .then(res => setAktivitas(visibleItems(res.data.aktivitas || [])))
          .catch(err => console.error(err));
      }
    }
  }, []);

  const handleTambahPengeluaran = async (e) => {
    e.preventDefault();
    if (!deskripsi || !nominal) {
      alert("Harap isi deskripsi dan nominal pengeluaran!");
      return;
    }

    if (!user?.kelas_id) {
      alert("Kamu belum terhubung ke room kelas!");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/tambah-pengeluaran', {
        kelas_id: user.kelas_id,
        user_id: user.id,
        deskripsi: deskripsi.trim(),
        nominal: Number(nominal) // Konversi string ke angka murni
      });

      if (res.data.status === 'success') {
        setShowModal(false);
        setDeskripsi('');
        setNominal('');
        alert("Pengeluaran kas berhasil dicatat!");
        fetchRiwayat(user.kelas_id);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Pengeluaran belum tersimpan. Periksa koneksi lalu coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Menghasilkan angka saja; label Rp ditambahkan sekali di tampilan.
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(number) || 0);
  };

  // Batasi tampilan timeline menjadi 20 kartu terbaru.
  const semuaAktivitas = [...riwayat, ...aktivitas]
    .sort((a, b) => {
      if (a.tipe === 'keluar' && b.tipe !== 'keluar') return -1;
      if (a.tipe !== 'keluar' && b.tipe === 'keluar') return 1;
      return Number(b.raw_id) - Number(a.raw_id);
    })
    .slice(0, 20);
  const filteredRiwayat = semuaAktivitas.filter(item => {
    if (filter === 'masuk') return item.tipe === 'masuk';
    if (filter === 'keluar') return item.tipe === 'keluar';
    return true;
  });

  const clearHistoryView = () => {
    const ids = [...riwayat, ...aktivitas].map(item => item.id);
    const nextHiddenIds = [...new Set([...hiddenHistoryIds, ...ids])];
    const key = getHistoryKey();
    if (key) localStorage.setItem(key, JSON.stringify(nextHiddenIds));
    setHiddenHistoryIds(nextHiddenIds);
    setRiwayat(current => current.filter(item => !ids.includes(item.id)));
    setAktivitas(current => current.filter(item => !ids.includes(item.id)));
    setShowClearModal(false);
  };

  return (
    <MainLayout>
      <div className="space-y-4 pb-2">
        {/* Top Bar Header */}
        <div className="flex justify-between items-center pt-2">
          <div>
            <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faClockRotateLeft} className="text-indigo-600" />
              Riwayat Transaksi
            </h1>
            <p className="text-xs text-slate-400">Pemasukan kas, pengeluaran & saldo awal</p>
          </div>

          {user?.role === 'bendahara' && user?.kelas_id && (
            <button 
              onClick={() => setShowModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Pengeluaran</span>
            </button>
          )}
        </div>

        {/* Filter Navigation Tab */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/60 rounded-xl text-xs font-bold">
          <button 
            onClick={() => setFilter('semua')} 
            className={`py-2 rounded-lg transition-colors ${filter === 'semua' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Semua
          </button>
          <button 
            onClick={() => setFilter('masuk')} 
            className={`py-2 rounded-lg transition-colors ${filter === 'masuk' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
          >
            Pemasukan
          </button>
          <button 
            onClick={() => setFilter('keluar')} 
            className={`py-2 rounded-lg transition-colors ${filter === 'keluar' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
          >
            Pengeluaran
          </button>
        </div>

        {/* List Data Riwayat Transaksi */}
        <div className="space-y-2 pb-2">
          {loadingRiwayat ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3, 4].map(item => <div key={item} className="h-16 rounded-2xl bg-slate-200" />)}
            </div>
          ) : filteredRiwayat.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl text-center text-xs text-slate-400 border border-slate-100 shadow-sm">
              Belum ada riwayat transaksi.
            </div>
          ) : (
            filteredRiwayat.map((item) => (
              <div key={item.id} className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm hover:border-slate-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                    item.tipe === 'masuk' ? 'bg-emerald-50 text-emerald-600' : item.tipe === 'aktivitas' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    <FontAwesomeIcon icon={item.tipe === 'masuk' ? faArrowUp : item.tipe === 'aktivitas' ? faClockRotateLeft : faArrowDown} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.judul}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{item.tanggal}</p>
                  </div>
                </div>
                {item.tipe === 'aktivitas' ? (
                  <span className="text-[10px] font-bold text-indigo-500">Aktivitas</span>
                ) : (
                  <span className={`text-xs font-black ${item.tipe === 'masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.tipe === 'masuk' ? '+' : '-'} Rp {formatRupiah(item.nominal)}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {user?.kelas_id && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[10px] font-bold text-slate-500 shadow-sm transition hover:border-rose-200 hover:text-rose-600"
            >
              Bersihkan Tampilan Riwayat
            </button>
          </div>
        )}
      </div>

      {/* Modal Overlay Input Pengeluaran Kas */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-4 relative shadow-2xl">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <h3 className="text-base font-bold text-slate-900">Catat Pengeluaran Kas</h3>
            <form onSubmit={handleTambahPengeluaran} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Deskripsi Pengeluaran</label>
                <input 
                  type="text" 
                  required 
                  value={deskripsi} 
                  onChange={e => setDeskripsi(e.target.value)} 
                  placeholder="Contoh: Beli Spidol & Penghapus" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600" 
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Nominal Pengeluaran (Rp)</label>
                <input 
                  type="number" 
                  required 
                  value={nominal} 
                  onChange={e => setNominal(e.target.value)} 
                  placeholder="Contoh: 15000" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600" 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="w-full py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex justify-center items-center"
                >
                  {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showClearModal}
        title="Bersihkan tampilan riwayat?"
        message="Daftar riwayat hanya akan disembunyikan dari tampilan ini. Data di database tidak akan dihapus."
        confirmLabel="Bersihkan tampilan"
        onCancel={() => setShowClearModal(false)}
        onConfirm={clearHistoryView}
      />
    </MainLayout>
  );
}