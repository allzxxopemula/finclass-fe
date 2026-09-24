import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faSpinner, faComments, faClock } from '@fortawesome/free-solid-svg-icons';

export default function ChatRoom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [nowTick, setNowTick] = useState(Date.now());
  const listRef = useRef(null);

  const readUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  };

  const getDisplayName = (member) => member?.name || member?.username || 'Anggota';
  const getDisplayUsername = (member) => member?.username || member?.name || 'user';
  const getDisplayAvatar = (member) => member?.profile_image_url || member?.profile_image || '';
  const formatTime = (value) => {
    if (!value) return '';
    try {
      return new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const loadMessages = async (currentUserId = user?.id, silent = false) => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    if (!silent) {
      setLoading(true);
    }

    try {
      const response = await API.get(`/chat-room?user_id=${currentUserId}`);
      if (response.data.status === 'success') {
        setRoom(response.data.room);
        setMessages(response.data.messages || []);
      } else {
        setRoom(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Gagal memuat room chat:', error);
      setRoom(null);
      setMessages([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const savedUser = readUser();
    if (!savedUser) {
      navigate('/login');
      return;
    }

    setUser(savedUser);
    loadMessages(savedUser.id, false);

    const timer = window.setInterval(() => {
      if (savedUser?.id) {
        loadMessages(savedUser.id, true);
      }
    }, 15000);

    return () => window.clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    const interval = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!user?.id || !draft.trim()) return;
    if (sending) return;

    const now = Date.now();
    if (now < cooldownUntil) {
      return;
    }

    setSending(true);

    try {
      const response = await API.post('/chat-room/send', {
        user_id: user.id,
        message: draft.trim(),
      });

      if (response.data.status === 'success') {
        setDraft('');
        setCooldownUntil(Date.now() + 5000);
        await loadMessages(user.id, true);
      } else {
        alert(response.data.message || 'Pesan gagal terkirim.');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal mengirim pesan.';
      alert(message);
    } finally {
      setSending(false);
    }
  };

  const sendDisabled = sending || nowTick < cooldownUntil;

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-180px)] min-h-[60vh] flex-col pb-3">
        <div className="flex items-center gap-3 pt-2 pb-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <FontAwesomeIcon icon={faComments} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900">
                {room ? room.name : 'Room Chat Kelas'}
              </h1>
              <p className="text-[10px] text-slate-400">Pesan akan otomatis dihapus setelah 7 hari</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <FontAwesomeIcon icon={faSpinner} spin />
              Memuat chat...
            </div>
          </div>
        ) : !user?.kelas_id ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <p className="text-sm font-black text-slate-800">Kamu belum masuk kelas.</p>
            <p className="mt-2 text-xs text-slate-500">Gabung kelas dulu agar bisa mengikuti room chat.</p>
          </div>
        ) : (
          <>
            <div ref={listRef} className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="space-y-2">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-[180px] items-center justify-center text-center text-xs text-slate-400">
                  Belum ada pesan di room kelas ini. Mulai percakapan pertama.
                </div>
              ) : (
                messages.map((item) => {
                  const sender = item.user || {};
                  const isMine = String(sender.id) === String(user.id);
                  const avatarUrl = getDisplayAvatar(sender);

                  return (
                    <div key={item.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[88%] items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={getDisplayName(sender)} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-[10px] font-black text-slate-600">
                              {getDisplayName(sender).charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                          {!isMine && (
                            <div className="mb-1 flex items-center gap-1 px-1">
                              <span className="text-[10px] font-black text-slate-700">{getDisplayName(sender)}</span>
                              <span className="text-[9px] text-slate-400">@{getDisplayUsername(sender)}</span>
                            </div>
                          )}

                          <div className={`max-w-[72%] ${isMine ? 'ml-auto' : 'mr-auto'}`}>
                            <div className={`inline-block rounded-2xl px-2.5 py-2 shadow-sm ${isMine ? 'bg-violet-600 text-white' : 'border border-slate-200 bg-slate-100 text-slate-800'}`}>
                              <div className="flex items-end gap-1.5">
                                <p className="m-0 max-w-[calc(100%-26px)] break-words text-[11px] leading-relaxed text-current">{item.message}</p>
                                <span className={`m-0 shrink-0 self-end pb-0.5 text-[7px] leading-none whitespace-nowrap ${isMine ? 'text-violet-100' : 'text-slate-400'}`}>
                                  {formatTime(item.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              </div>
            </div>

            <form onSubmit={handleSend} className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Tulis pesan ke kelas..."
                className="flex-1 border-0 bg-transparent px-2 py-2 text-xs text-slate-700 outline-none placeholder:text-slate-400"
                maxLength={500}
              />

              <button
                type="submit"
                disabled={sendDisabled || !draft.trim()}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-[10px] font-black text-white disabled:cursor-not-allowed disabled:bg-violet-300"
              >
                {sending ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
                {Date.now() < cooldownUntil ? 'Tunggu' : 'Kirim'}
              </button>
            </form>

            <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-slate-400">
              <FontAwesomeIcon icon={faClock} />
              <span>Cooldown kirim: 5 detik</span>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
