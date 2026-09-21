import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function ConfirmModal({ open, title, message, confirmLabel = 'Lanjutkan', onConfirm, onCancel, danger = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${danger ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </div>
        <h2 className="mt-4 text-center text-base font-black text-slate-900">{title}</h2>
        <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">{message}</p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onCancel} className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-600">Batal</button>
          <button type="button" onClick={onConfirm} className={`w-full rounded-xl py-2.5 text-xs font-bold text-white ${danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
