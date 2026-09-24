import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faSpinner, faComments } from '@fortawesome/free-solid-svg-icons';

export default function ChatRoom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  
  const listRef = useRef(null);
  // Ref untuk melacak apakah user sedang berada di area paling bawah chat
  const isAtBottomRef = useRef(true); 

  const readUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  };

  const getDisplayName = (member) => member?.name || member?.username || 'Anggota';
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
    if (!silent) setLoading(true);

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
      if (!silent) setLoading(false);
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
      if (savedUser?.id) loadMessages(savedUser.id, true);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [navigate]);

  // Event handler untuk mendeteksi apakah user sedang scroll ke atas
  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    // Jika jarak scroll dari bawah kurang dari 100px, anggap sedang di bawah
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  // Scroll otomatis ke bawah HANYA jika posisi sebelumnya di bawah
  useEffect(() => {
    if (listRef.current && isAtBottomRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!user?.id || !draft.trim() || sending) return;

    const now = Date.now();
    if (now < cooldownUntil) return;

    setSending(true);

    try {
      const response = await API.post('/chat-room/send', {
        user_id: user.id,
        message: draft.trim(),
      });

      if (response.data.status === 'success') {
        setDraft('');
        setCooldownUntil(Date.now() + 5000);
        
        // Paksa scroll ke bawah saat kita mengirim pesan sendiri
        isAtBottomRef.current = true; 
        
        await loadMessages(user.id, true);
      } else {
        alert(response.data.message || 'Pesan gagal terkirim.');
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Gagal mengirim pesan.');
    } finally {
      setSending(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100dvh-135px)] relative pt-2">
        
        {/* Header Kelas */}
        <div className="flex items-center gap-3 pb-3 shrink-0 border-b border-slate-200/50 mb-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-inner">
              <FontAwesomeIcon icon={faComments} className="text-sm" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">
                {room ? room.name : 'Room Chat Kelas'}
              </h1>
              <p className="text-[10px] font-bold text-slate-400">Pesan terhapus otomatis 7 hari</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-indigo-500" />
              <span className="text-xs font-bold">Memuat percakapan...</span>
            </div>
          </div>
        ) : !user?.kelas_id ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm max-w-sm">
              <p className="text-sm font-black text-slate-800">Kamu belum bergabung di kelas.</p>
              <p className="mt-1 text-xs text-slate-500">Silakan gabung kelas terlebih dahulu untuk memulai obrolan.</p>
            </div>
          </div>
        ) : (
          /* Tambahkan event onScroll di sini */
          <div 
            ref={listRef} 
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scroll-smooth space-y-4 pb-20 pr-1" 
          >
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-100">
                  Mulai obrolan pertama di kelas ini!
                </div>
              </div>
            ) : (
              messages.map((item) => {
                const sender = item.user || {};
                const isMine = String(sender.id) === String(user.id);
                const avatarUrl = getDisplayAvatar(sender);

                return (
                  <div key={item.id} className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[90%] md:max-w-[75%] items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      {/* Avatar Profile */}
                      <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm mb-0.5">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={getDisplayName(sender)} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-[10px] font-black text-slate-600 uppercase">
                            {getDisplayName(sender).charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Konten Chat */}
                      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        {!isMine && (
                          <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1">
                            {getDisplayName(sender)}
                          </span>
                        )}

                        <div className={`relative px-3 pt-2 pb-1.5 shadow-sm max-w-full ${
                          isMine 
                            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm'
                        }`}>
                          
                          <div className="text-[13px] leading-relaxed break-words whitespace-pre-wrap pr-11">
                            {item.message}
                          </div>
                          
                          <span className={`text-[9px] absolute bottom-1.5 right-2 leading-none font-medium ${isMine ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {formatTime(item.created_at)}
                          </span>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {user?.kelas_id && (
        <div className="fixed bottom-[65px] left-0 right-0 z-40 bg-slate-50/95 backdrop-blur-md border-t border-slate-200/60 px-4 py-2">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 h-12 rounded-full border border-slate-200 bg-white px-5 text-[13px] font-medium text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                maxLength={500}
                autoComplete="off"
              />

              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-600/20 disabled:cursor-not-allowed disabled:bg-indigo-300 transition-all hover:bg-indigo-700 active:scale-95"
              >
                {sending ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="text-lg" />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} className="text-lg mr-0.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}