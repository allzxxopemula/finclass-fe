import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope, faUser, faMessage, faPaperPlane, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const ADMIN_WHATSAPP = '6285878528337';

export default function LupaPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: '', email: '', alasan: '' });

  const handleChange = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    const message = [
      'Halo Admin FinClass, saya ingin mengajukan reset password.',
      '',
      `Nama: ${form.nama}`,
      `Email akun: ${form.email}`,
      `Alasan: ${form.alasan}`,
      '',
      'Mohon dibantu reset password akun saya. Terima kasih.'
    ].join('\n');
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 font-sans">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => navigate('/login')} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600" aria-label="Kembali ke login">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-600" />
            <span><span className="text-indigo-600">FIN</span><span className="font-medium text-slate-400">CLASS</span></span>
          </div>
          <span className="w-9" aria-hidden="true" />
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
              <FontAwesomeIcon icon={faMessage} className="text-xl" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Pengajuan Reset Password</h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">Isi data akunmu, lalu kirim pengajuan melalui WhatsApp admin.</p>
          </div>

          <div className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
            Isi data sesuai akunmu. Setelah pesan terkirim, admin akan membantu mereset password dan memberikan instruksi login baru.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs font-bold text-slate-700">
              Nama lengkap
              <div className="relative mt-1.5">
                <FontAwesomeIcon icon={faUser} className="absolute left-3.5 top-1/2 w-4 -translate-y-1/2 text-slate-400" />
                <input name="nama" required value={form.nama} onChange={handleChange} placeholder="Nama sesuai akun" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-indigo-500 focus:bg-white" />
              </div>
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Email akun
              <div className="relative mt-1.5">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 top-1/2 w-4 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="email yang dipakai saat daftar" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-indigo-500 focus:bg-white" />
              </div>
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Keterangan
              <textarea name="alasan" required value={form.alasan} onChange={handleChange} placeholder="Contoh: lupa password setelah ganti HP" rows="3" className="mt-1.5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white" />
            </label>

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.98]">
              <FontAwesomeIcon icon={faWhatsapp} className="text-lg" /> Kirim Pengajuan via WhatsApp
            </button>
          </form>

          <p className="mt-5 text-center text-[10px] text-slate-400">Nomor bantuan: 0858 7852 8337</p>
        </div>
      </div>
    </div>
  );
}
