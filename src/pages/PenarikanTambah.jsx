import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faCheck, 
  faTriangleExclamation,
  faClipboardList,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export default function PenarikanTambah() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [kelas, setKelas] = useState(null);
  const [siswas, setSiswas] = useState([]);
  const [tanggalKolom, setTanggalKolom] = useState([]);
  const [bulan, setBulan] = useState(searchParams.get('bulan') || new Date().toISOString().slice(0, 7));
  const canEdit = user?.role === 'bendahara';
  const [loadingBook, setLoadingBook] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBook, setDeletingBook] = useState(false);

  const fetchData = async (userId) => {
    try {
      const dashboard = await API.get(`/dashboard?user_id=${userId}`);
      if (dashboard.data.status !== 'success') return;
      setKelas(dashboard.data.kelas);

      // Form selalu mengambil status sesi terbaru, termasuk jumlah tunggakan.
      const res = await API.get(`/penarikan-form?kelas_id=${dashboard.data.kelas.id}&bulan=${Number(bulan.slice(5))}&tahun=${Number(bulan.slice(0, 4))}`);
      if (res.data.status === 'success') {
        setKelas(res.data.kelas);
        setTanggalKolom(res.data.tanggal_kolom || []);
        setSiswas(res.data.siswas || []);
      }
    } catch (err) {
      console.error("Gagal mengambil data siswa:", err);
    } finally {
      setLoadingBook(false);
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      if (savedUser.id) {
        fetchData(savedUser.id);
      }
    } else {
      setLoadingBook(false);
    }
  }, []);

  // Semua kotak adalah CRUD detail buku, termasuk tanggal yang baru dibuat.
  const handleHistoryToggle = async (date, siswaId, sudahBayar) => {
    try {
      await API.patch(`/penarikan/${date}/siswa/${siswaId}`, {
        user_id: user.id,
        kelas_id: kelas.id,
        sudah_bayar: !sudahBayar
      });
      setSiswas(current => current.map(siswa => {
        if (siswa.id !== siswaId) return siswa;
        const tanggal = { ...siswa.tanggal, [date]: !sudahBayar };
        const today = new Date().toISOString().slice(0, 10);
        return { ...siswa, tanggal, tunggakan: Object.entries(tanggal).filter(([date, paid]) => date <= today && !paid).length };
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Koreksi pembayaran gagal disimpan.');
    }
  };

  const handleDeleteBook = async () => {
    setDeletingBook(true);
    try {
      await API.delete(`/penarikan/buku/${bulan.slice(0, 4)}/${Number(bulan.slice(5))}`, {
        data: { user_id: user.id, kelas_id: kelas.id }
      });
      navigate('/penarikan');
    } catch (err) {
      alert(err.response?.data?.message || 'Buku kas belum berhasil dihapus.');
    } finally {
      setDeletingBook(false);
      setShowDeleteModal(false);
    }
  };

  // Menghitung siswa yang belum bayar secara realtime berdasarkan data 'siswas'
  const siswaBelumBayar = siswas.map(siswa => {
    const tanggalUnpaid = tanggalKolom.filter(date => !siswa.tanggal?.[date]);
    return {
      ...siswa,
      tanggalUnpaid
    };
  }).filter(siswa => siswa.tanggalUnpaid.length > 0);

  return (
    <MainLayout>
      <div className="space-y-4 pb-4">
        
        {/* Top Header dengan Tombol Kembali */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/penarikan')}
              className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
              <h1 className="text-base font-black text-slate-900">Buku Kas Bulanan</h1>
              <p className="text-[10px] text-slate-400">Centang pembayaran pada tanggal yang sesuai</p>
            </div>
          </div>
        </div>

        {/* Periode dipilih dari modal sebelum halaman ini dibuka. */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700">Periode Buku Kas</label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-indigo-600">{bulan}</span>
              {canEdit && <button type="button" onClick={() => setShowDeleteModal(true)} className="rounded-xl bg-rose-50 px-3 py-2 text-[10px] font-bold text-rose-600">Hapus Buku</button>}
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Klik kotak pada tanggal yang sesuai untuk mencatat pembayaran. Perubahan tersimpan otomatis.</p>
        </div>

        {/* Buku kas: setiap tanggal penarikan menjadi satu kolom. */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Buku Kas Bulanan</p>
          {loadingBook ? (
            <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 h-10 rounded-xl bg-slate-200" />
              {[1, 2, 3, 4, 5, 6].map(item => (
                <div key={item} className="flex gap-3 border-t border-slate-100 py-3">
                  <div className="h-8 flex-1 rounded-lg bg-slate-200" />
                  <div className="h-8 w-16 rounded-lg bg-slate-200" />
                  <div className="h-8 w-16 rounded-lg bg-slate-200" />
                  <div className="h-8 w-16 rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          ) : siswas.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl text-center text-xs text-slate-400 border border-slate-100">
              Belum ada data siswa di kelas ini.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-max w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="sticky left-0 z-10 min-w-[170px] bg-slate-900 px-3 py-3 text-left font-black">Nama Siswa</th>
                    {tanggalKolom.map(date => (
                      <th key={date} className="min-w-[80px] px-2 py-3 text-center font-black">
                        {new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {siswas.map((siswa, idx) => (
                    <tr key={siswa.id} className="border-t border-slate-200">
                      <td className="sticky left-0 z-10 bg-white px-3 py-3 font-bold text-slate-800">
                        <span className="mr-2 text-[10px] text-slate-400">{idx + 1}.</span>{siswa.nama_siswa}
                        {siswa.tunggakan > 0 && <span className="block pl-5 text-[9px] font-semibold text-rose-500">{siswa.tunggakan} tunggakan</span>}
                      </td>
                      {tanggalKolom.map(date => {
                        const checked = Boolean(siswa.tanggal?.[date]);
                        return (
                          <td key={date} className="min-w-[66px] border-l border-slate-200 bg-indigo-50/20 text-center">
                            <button type="button" disabled={!canEdit} aria-label={`Koreksi ${siswa.nama_siswa} tanggal ${date}`} onClick={() => handleHistoryToggle(date, siswa.id, checked)} className={`mx-auto flex h-7 w-7 items-center justify-center rounded-md border-2 ${checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-slate-50'} disabled:cursor-default`}>
                              {checked && <FontAwesomeIcon icon={faCheck} className="text-[11px]" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Container Catatan Realtime Siswa Belum Bayar */}
        {!loadingBook && siswas.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3 mt-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-rose-600 font-black text-xs">
                <FontAwesomeIcon icon={faClipboardList} />
                <span>Catatan Belum Bayar ({siswaBelumBayar.length} Siswa)</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Realtime Update</span>
            </div>

            {siswaBelumBayar.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-emerald-600 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Lunas! Semua siswa sudah membayar kas periode ini.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {siswaBelumBayar.map(siswa => (
                  <div key={siswa.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">{siswa.nama_siswa}</p>
                      <div className="flex flex-wrap gap-1">
                        {siswa.tanggalUnpaid.map(date => (
                          <span key={date} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                            {new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-rose-500 whitespace-nowrap bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                      {siswa.tanggalUnpaid.length} x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      <ConfirmModal
        open={showDeleteModal}
        title="Hapus buku kas bulan ini?"
        message="Semua kolom tanggal dan checklist pembayaran pada bulan ini akan dihapus permanen."
        confirmLabel={deletingBook ? 'Menghapus...' : 'Hapus buku'}
        danger
        onCancel={() => !deletingBook && setShowDeleteModal(false)}
        onConfirm={handleDeleteBook}
      />
    </MainLayout>
  );
}