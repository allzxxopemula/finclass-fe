import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { getExclusiveUserPreset } from '../components/ExclusiveUserBorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faSpinner, faComments, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function ChatRoom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  
  // State untuk popup hapus pesan
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  const listRef = useRef(null);
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

  // Fungsi load pesan yang dioptimasi agar tidak memicu spinner terus-menerus
  const loadMessages = async (currentUserId = user?.id, silent = true) => {
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
      }
    } catch (error) {
      console.error('Gagal memuat room chat:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = readUser();
    if (!savedUser) {
      navigate('/login');
      return;
    }

    setUser(savedUser);
    // Pertama kali masuk: load dengan indikator
    loadMessages(savedUser.id, false);

    // Polling realtime dipercepat jadi 3 detik agar obrolan teman cepat masuk
    const timer = window.setInterval(() => {
      if (savedUser?.id) loadMessages(savedUser.id, true);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [navigate]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  useEffect(() => {
    if (listRef.current && isAtBottomRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Handle Kirim dengan Optimistic UI Update (Visual Tampil Dulu)
  const handleSend = async (event) => {
    event.preventDefault();
    if (!user?.id || !draft.trim() || sending) return;

    const now = Date.now();
    if (now < cooldownUntil) return;

    const trimmedDraft = draft.trim();
    
    // 1. Buat ID dan objek pesan sementara (Optimistic Message)
    const optimisticId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: optimisticId,
      message: trimmedDraft,
      created_at: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        profile_image_url: user.profile_image_url || user.profile_image || '',
      },
      is_deleted: false,
      is_sending: true, // Marker sedang proses kirim
    };

    // 2. Tampilkan LANGSUNG di UI tanpa menunggu server
    setDraft('');
    setMessages((currentMessages) => [...currentMessages, optimisticMessage]);
    isAtBottomRef.current = true;
    setSending(true);

    try {
      const response = await API.post('/chat-room/send', {
        user_id: user.id,
        message: trimmedDraft,
      });

      if (response.data.status === 'success') {
        const sentChat = response.data.chat || {};
        // 3. Update pesan sementara dengan data resmi dari database
        setMessages((currentMessages) =>
          currentMessages.map((item) =>
            item.id === optimisticId
              ? {
                  ...item,
                  id: sentChat.id || item.id,
                  created_at: sentChat.created_at || item.created_at,
                  user: sentChat.user || item.user,
                  is_sending: false,
                }
              : item
          )
        );
        setCooldownUntil(Date.now() + 1000);
      } else {
        // Jika gagal, hapus pesan sementara
        setMessages((currentMessages) => currentMessages.filter((item) => item.id !== optimisticId));
        alert(response.data.message || 'Pesan gagal terkirim.');
      }
    } catch (error) {
      setMessages((currentMessages) => currentMessages.filter((item) => item.id !== optimisticId));
      alert(error?.response?.data?.message || 'Gagal mengirim pesan.');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!user?.id || !messageId) return;

    try {
      const response = await API.delete(`/chat-room/message/${messageId}`, {
        data: { user_id: user.id },
      });

      if (response.data.status === 'success') {
        setMessages((currentMessages) =>
          currentMessages.map((item) =>
            item.id === messageId
              ? {
                  ...item,
                  message: 'Pesan ini telah dihapus',
                  deleted_at: response.data.chat?.deleted_at || new Date().toISOString(),
                  is_deleted: true,
                }
              : item
          )
        );
        setMessageToDelete(null);
      } else {
        alert(response.data.message || 'Gagal menghapus pesan.');
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Gagal menghapus pesan.');
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100dvh-135px)] relative">
        
        {/* Header Kelas - STICKY */}
        <div className="sticky top-0 z-30 bg-slate-50 flex items-center gap-3 pt-3 pb-3 shrink-0 border-b border-slate-200/50 mb-2">
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

        {loading && messages.length === 0 ? (
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
                const isDeleted = Boolean(item.deleted_at || item.is_deleted);
                const preset = getExclusiveUserPreset(sender.email || user?.email);

                return (
                  <div key={item.id} className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[90%] md:max-w-[75%] items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      {/* Avatar Profile */}
                      <div className={`h-7 w-7 shrink-0 mb-0.5 rounded-full ${preset ? `p-[1.5px] bg-gradient-to-br ${preset.accent}` : ''}`}>
                        <div className={`h-full w-full overflow-hidden rounded-full bg-slate-100 shadow-sm flex items-center justify-center ${preset ? 'border-[1.5px] border-white' : 'border border-slate-200'}`}>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={getDisplayName(sender)} className="h-full w-full object-cover" />
                          ) : (
                            <div className="text-[10px] font-black text-slate-600 uppercase">
                              {getDisplayName(sender).charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Konten Chat */}
                      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        {!isMine && (
                          <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1">
                            {getDisplayName(sender)}
                          </span>
                        )}

                        <div 
                          onClick={() => {
                            if (isMine && !isDeleted && !item.is_sending) setMessageToDelete(item);
                          }}
                          className={`relative px-3 pt-2 pb-1.5 shadow-sm max-w-full ${
                          isMine
                            ? isDeleted
                              ? 'bg-slate-200 text-slate-600 rounded-2xl rounded-br-sm border border-slate-200'
                              : 'bg-indigo-600 text-white rounded-2xl rounded-br-sm cursor-pointer active:scale-[0.97] transition-transform'
                            : isDeleted
                              ? 'bg-slate-100 border border-slate-200 text-slate-500 rounded-2xl rounded-bl-sm'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm'
                        }`}>
                          
                          <div className={`text-[13px] leading-relaxed break-words whitespace-pre-wrap ${isDeleted ? 'pr-0' : 'pr-11'} pt-0.5 ${item.is_sending ? 'opacity-70' : ''}`}>
                            {isDeleted ? (
                              <span className="flex items-center gap-1.5">
                                <span className="italic">Pesan ini telah dihapus</span>
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-300 text-[9px] font-black text-slate-600">×</span>
                              </span>
                            ) : (
                              item.message
                            )}
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

      {/* MODAL ACTION SHEET: HAPUS PESAN */}
      {messageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl animate-[slide-up_0.2s_ease-out]" 
            style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-center text-sm font-black text-slate-800 mb-5">Pilihan Pesan</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleDeleteMessage(messageToDelete.id)}
                className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <FontAwesomeIcon icon={faTrash} />
                Hapus Pesan Ini
              </button>
              
              <button
                onClick={() => setMessageToDelete(null)}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <FontAwesomeIcon icon={faTimes} />
                Batal
              </button>
            </div>
          </div>
          
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

    </MainLayout>
  );
}