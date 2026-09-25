import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { getExclusiveUserPreset } from '../components/ExclusiveUserBorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faSpinner, faComments, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

// =========================================================
// KOMPONEN CERDAS: AUTO-EMBED LINK JADI GAMBAR ALA DISCORD
// =========================================================
const AutoEmbedLink = ({ url, isMine }) => {
  // Cek apakah url secara eksplisit punya ekstensi gambar
  const isKnownImage = /\.(jpeg|jpg|gif|png|svg|webp)(\?.*)?$/i.test(url);
  
  // Status: 'checking', 'is-image', 'is-link'
  const [status, setStatus] = useState(isKnownImage ? 'is-image' : 'checking');
  
  const linkStyle = isMine ? "text-indigo-100 underline font-bold break-all" : "text-blue-600 underline font-bold break-all";

  return (
    <span className="inline-block max-w-full align-bottom">
      {/* Tampilkan teks URL HANYA JIKA statusnya BUKAN gambar */}
      {status !== 'is-image' && (
        <a href={url} target="_blank" rel="noopener noreferrer" className={linkStyle}>
          {url}
        </a>
      )}
      
      {/* Coba muat gambar. Kalau sukses, teks link di atas akan disembunyikan. */}
      <span className={status === 'is-image' ? 'block mt-1' : 'hidden'}>
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <img 
            src={url} 
            alt="Attachment" 
            className="max-w-full h-auto max-h-60 rounded-xl object-contain border border-slate-200/30 bg-black/5 shadow-sm transition-transform hover:scale-[1.02]"
            loading="lazy"
            onLoad={() => setStatus('is-image')} // BEGITU GAMBAR MUNCUL, URL TEKS HILANG
            onError={() => setStatus('is-link')} // KALAU BUKAN GAMBAR MURNI (MISAL PIN.IT WEB), BALIK KE TEKS LINK
          />
        </a>
      </span>
    </span>
  );
};

const renderMessageWithImages = (text, isMine) => {
  if (!text) return null;
  // Pisahkan teks berdasarkan spasi/enter tanpa menghilangkan spasinya
  const parts = text.split(/(\s+)/);

  return parts.map((part, index) => {
    // Kalau potongan teks ini adalah URL, masukkan ke komponen cerdas kita
    if (/^https?:\/\/[^\s]+/i.test(part)) {
      return <AutoEmbedLink key={index} url={part} isMine={isMine} />;
    }
    // Selain URL, tampilkan sebagai teks biasa
    return <span key={index}>{part}</span>;
  });
};

export default function ChatRoom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  const listRef = useRef(null);
  const isAtBottomRef = useRef(true); 

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const markMessagesAsRead = async (currentUserId = user?.id, currentRoomId = room?.id) => {
    if (!currentUserId || !currentRoomId) return;

    try {
      await API.post('/chat-room/read', {
        user_id: currentUserId,
        room_id: currentRoomId,
      });
    } catch (error) {
      console.error('Gagal menandai chat sebagai terbaca:', error);
    }
  };

  const loadMessages = async (currentUserId = user?.id, silent = true) => {
    if (!currentUserId) return;
    if (!silent) setLoading(true);

    try {
      const response = await API.get(`/chat-room?user_id=${currentUserId}`);
      if (response.data.status === 'success') {
        const nextRoom = response.data.room;
        setRoom(nextRoom);
        setMessages(response.data.messages || []);

        if (!silent && nextRoom?.id) {
          await markMessagesAsRead(currentUserId, nextRoom.id);
        }
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
    
    // Tarik data pertama kali (loading muncul)
    loadMessages(savedUser.id, false);

    // Polling background setiap 3 detik (tanpa loading visual)
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

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (listRef.current && isAtBottomRef.current) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages]);

  // Handle Kirim REALTIME MURNI
  const handleSend = async (event) => {
    event.preventDefault();
    if (!user?.id || !draft.trim() || sending) return;

    const now = Date.now();
    if (now < cooldownUntil) return;

    const trimmedDraft = draft.trim();
    
    setSending(true);

    try {
      const response = await API.post('/chat-room/send', {
        user_id: user.id,
        message: trimmedDraft,
      });

      if (response.data.status === 'success') {
        setDraft(''); 
        
        const sentChat = response.data.chat;
        if (sentChat) {
          setMessages((prev) => {
            if (prev.find(m => m.id === sentChat.id)) return prev; 
            return [...prev, sentChat];
          });
          isAtBottomRef.current = true;
        }
        
        setCooldownUntil(Date.now() + 500);
      } else {
        alert(response.data.message || 'Pesan gagal terkirim.');
      }
    } catch (error) {
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

                      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        {!isMine && (
                          <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1">
                            {getDisplayName(sender)}
                          </span>
                        )}

                        <div 
                          onClick={() => {
                            if (isMine && !isDeleted) setMessageToDelete(item);
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
                          
                          <div className={`text-[13px] leading-relaxed break-words whitespace-pre-wrap ${isDeleted ? 'pr-0' : 'pr-11'} pt-0.5`}>
                            {isDeleted ? (
                              <span className="flex items-center gap-1.5">
                                <span className="italic">Pesan ini telah dihapus</span>
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-300 text-[9px] font-black text-slate-600">×</span>
                              </span>
                            ) : (
                              // TAMPILAN SMART AUTO-EMBED
                              renderMessageWithImages(item.message, isMine)
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
                placeholder="Ketik pesan atau paste URL gambar..."
                className="flex-1 h-12 rounded-full border border-slate-200 bg-white px-5 text-[13px] font-medium text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                maxLength={500}
                autoComplete="off"
                disabled={sending}
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