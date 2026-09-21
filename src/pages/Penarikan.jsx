import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandHoldingDollar, 
  faClockRotateLeft, 
  faTriangleExclamation,
  faPlus,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

export default function Penarikan() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [riwayatPenarikan, setRiwayatPenarikan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0, 7));
  const [hariPenarikan, setHariPenarikan] = useState('Rabu');
  const [loadingBook, setLoadingBook] = useState(false);
  const [loadingLog, setLoadingLog] = useState(true);

  const fetchPenarikanLog = async (kelasId) => {
    try {
      // Endpoint untuk mengambil riwayat/log log penarikan kas yang pernah dilakukan bendahara
      const res = await API.get(`/penarikan-log?kelas_id=${kelasId}`);
      if (res.data.status === 'success') {
        setRiwayatPenarikan(res.data.data || []);
      }
    } catch (err) {
      console.error("Gagal mengambil log penarikan:", err);
    } finally {
      setLoadingLog(false);
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      if (savedUser.kelas_id) {
        fetchPenarikanLog(savedUser.kelas_id);
        API.get(`/dashboard?user_id=${savedUser.id}`).then(res => {
          if (res.data.status === 'success') setHariPenarikan(res.data.kelas.hari_penarikan || 'Rabu');
        });
      }
    }
  }, []);

  return (
    <MainLayout>
      <div className="space-y-4 pb-2">
        {/* Top Bar Header */}
        <div className="flex justify-between items-center pt-2">
          <div>
            <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faHandHoldingDollar} className="text-indigo-600" />
              Penarikan Kas
            </h1>
            <p className="text-xs text-slate-400">Riwayat log pencatatan dan penarikan kas kelas</p>
          </div>
        </div>

        {user?.role !== 'bendahara' && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs space-y-1">
            <p className="font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} /> Mode Hanya Lihat
            </p>
            <p className="text-[11px] text-amber-700">
              Hanya Bendahara yang dapat melakukan penarikan dan checklist kas siswa.
            </p>
          </div>
        )}

        {/* List Riwayat / Log Penarikan Kas */}
        <div className="space-y-2 pb-2">
          {loadingLog ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map(item => <div key={item} className="h-20 rounded-2xl bg-slate-200" />)}
            </div>
          ) : riwayatPenarikan.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl text-center text-xs text-slate-400 border border-slate-100 shadow-sm space-y-2">
              <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl text-slate-300" />
              <p>Belum ada riwayat penarikan kas yang dicatat.</p>
            </div>
          ) : (
            riwayatPenarikan.map((item) => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/penarikan/tambah?bulan=${item.tahun}-${String(item.bulan).padStart(2, '0')}`)}
                className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm hover:border-slate-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                    <FontAwesomeIcon icon={faCalendarCheck} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.judul || 'Penarikan Kas Mingguan'}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {item.jumlah_tanggal || 0} tanggal penarikan tersedia
                    </p>
                    <p className="mt-1 text-[9px] font-bold text-indigo-500">Ketuk untuk buka dan koreksi buku kas</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">
                    + Rp {Number(item.total_nominal || 0).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-bold">
                    {item.jumlah_siswa || 0} Siswa Lunas
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* FLOATING ACTION BUTTON (+) UNTUK MASUK KE HALAMAN CHECKLIST */}
      {/* ========================================================= */}
      {user?.role === 'bendahara' && user?.kelas_id && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center text-xl cursor-pointer transition-all active:scale-95 z-40 border-2 border-white"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-5 shadow-2xl">
            <div>
              <h2 className="text-base font-black text-slate-900">Buka Buku Kas</h2>
              <p className="mt-1 text-[10px] text-slate-400">Pilih bulan. Kolom tanggal dibuat otomatis sesuai hari penarikan kelas.</p>
            </div>
            <label className="block text-xs font-bold text-slate-700">Bulan dan tahun
              <input type="month" value={bulan} onChange={event => setBulan(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold" />
            </label>
            <div className="rounded-2xl bg-indigo-50 p-3 text-xs text-indigo-800">
              Hari penarikan kelas: <strong>{hariPenarikan}</strong>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowModal(false)} className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-600">Batal</button>
              <button type="button" disabled={loadingBook} onClick={async () => {
                setLoadingBook(true);
                try {
                  const [year, month] = bulan.split('-');
                  await API.post('/penarikan/buku', { user_id: user.id, kelas_id: user.kelas_id, bulan: Number(month), tahun: Number(year) });
                  navigate(`/penarikan/tambah?bulan=${bulan}`);
                } catch (err) {
                  alert(err.response?.data?.message || 'Buku kas gagal dibuat.');
                } finally {
                  setLoadingBook(false);
                }
              }} className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white disabled:opacity-50">{loadingBook ? 'Membuat...' : 'Buat & Buka Buku'}</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}