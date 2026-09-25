import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { getExclusiveUserPreset } from '../components/ExclusiveUserBorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faSpinner, faComments, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

// =========================================================
// KOMPONEN CERDAS: AUTO-EMBED LINK JADI GAMBAR
// =========================================================
const AutoEmbedLink = ({ url, isMine, onImageLoaded }) => {
  // Semua URL akan diuji sebagai gambar terlebih dahulu secara diam-diam
  const [status, setStatus] = useState('checking'); // 'checking', 'is-image', 'is-link'
  
  const linkStyle = isMine ? "text-indigo-100 underline font-medium break-all" : "text-blue-600 underline font-medium break-all";

  return (
    <span className="inline-block max-w-full align-top">
      {/* Tampilkan teks URL JIKA ternyata dia bukan gambar atau masih dicek */}
      {status !== 'is-image' && (
        <a href={url} target="_blank" rel="noopener noreferrer" className={linkStyle}>
          {url}
        </a>
      )}
      
      {/* Coba muat gambar. Kalau sukses, teks link di atas otomatis disembunyikan. */}
      <span className={status === 'is-image' ? 'block mt-1' : 'hidden'}>
        <a href={url} target="_blank" rel="noopener noreferrer" className="block relative">
          <img 
            src={url} 
            alt="Attachment" 
            className="max-w-[200px] sm:max-w-[240px] h-auto max-h-[250px] rounded-[16px] object-cover bg-slate-100 shadow-sm transition-transform hover:scale-[1.02]"
            loading="lazy"
            onLoad={() => {
              setStatus('is-image'); // Sukses dimuat sebagai gambar
              if (onImageLoaded) onImageLoaded(); // Beritahu Bubble Utama untuk transparan
            }} 
            onError={() => {
              setStatus('is-link'); // Error dimuat (Bukan gambar/web HTML biasa), balik ke link teks
            }} 
          />
        </a>
      </span>
    </span>
  );
};

const renderMessageWithImages = (text, isMine, onImageLoaded) => {
  if (!text) return null;
  const parts = text.split(/(\s+)/);

  return parts.map((part, index) => {
    if (/^https?:\/\/[^\s]+/i.test(part)) {
      return <AutoEmbedLink key={index} url={part} isMine={isMine} onImageLoaded={onImageLoaded} />;
    }
    return <span key={index}>{part}</span>;
  });
};

// =========================================================
// KOMPONEN RENDER ITEM PESAN (MENANGANI BUBBLE & AVATAR)
// =========================================================
const MessageItem = ({ item, isMine, showAvatar, preset, getDisplayName, formatTime, setMessageToDelete }) => {
  const sender = item.user || {};
  const avatarUrl = sender?.profile_image_url || sender?.profile_image || '';
  const isDeleted = Boolean(item.deleted_at || item.is_deleted);
  
  // Cek apakah pesan INI isinya HANYA 1 buah URL (Tanpa teks lain)
  const isOnlyUrl = /^https?:\/\/[^\s]+$/i.test(item.message?.trim() || '');
  const [isImageMode, setIsImageMode] = useState(false);

  const handleImageLoaded = () => {
    // Jika isinya hanya URL dan sukses dimuat sebagai gambar, aktifkan Image Mode (Tanpa Bubble)
    if (isOnlyUrl) {
      setIsImageMode(true);
    }
  };

  // Logika Sudut Melengkung (Jika digabung, lengkungan nyambung)
  let cornerClass = 'rounded-2xl';
  if (showAvatar) {
    cornerClass = isMine ? 'rounded-2xl rounded-tr-[4px]' : 'rounded-2xl rounded-tl-[4px]';
  }

  // Logika Styling Bubble
  let bubbleClass = isMine
    ? isDeleted
      ? 'bg-slate-200 text-slate-600 border border-slate-200'
      : 'bg-indigo-600 text-white shadow-sm'
    : isDeleted
      ? 'bg-slate-100 border border-slate-200 text-slate-500'
      : 'bg-white border border-slate-200 text-slate-800 shadow-sm';

  // Transparankan Bubble jika ini HANYA GAMBAR
  if (isImageMode && !isDeleted) {
    bubbleClass = 'bg-transparent shadow-none p-0';
  } else {
    bubbleClass += ` px-3 pt-2 pb-1.5 ${cornerClass}`;
  }

  return (
    <div className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
      {/* DIUBAH: items-start agar Profile ada di ATAS chat, bukan di bawah */}
      <div className={`flex max-w-[90%] md:max-w-[75%] items-start gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* WADAH AVATAR: Tetap memakan ruang (w-7) agar chat lurus, walau avatarnya disembunyikan */}
        <div className="flex flex-col items-center shrink-0 w-7 mt-0.5">
          {showAvatar && (
            <div className={`h-7 w-7 rounded-full ${preset ? `p-[1.5px] bg-gradient-to-br ${preset.accent}` : ''}`}>
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
          )}
        </div>

        {/* WADAH CHAT */}
        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[calc(100%-2.5rem)]`}>
          
          {/* NAMA PENGIRIM: Hanya muncul jika Avatarnya muncul */}
          {showAvatar && !isMine && (
            <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1">
              {getDisplayName(sender)}
            </span>
          )}

          <div 
            onClick={() => {
              if (isMine && !isDeleted) setMessageToDelete(item);
            }}
            className={`relative max-w-full cursor-pointer active:scale-[0.98] transition-all ${bubbleClass}`}
          >
            
            <div className={`text-[13px] leading-relaxed break-words whitespace-pre-wrap ${isDeleted ? 'pr-0' : (isImageMode ? '' : 'pr-11')} pt-0.5`}>
              {isDeleted ? (
                <span className="flex items-center gap-1.5">
                  <span className="italic">Pesan ini telah dihapus</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-300 text-[9px] font-black text-slate-600">×</span>
                </span>
              ) : (
                // Panggil render teks & embed gambar
                renderMessageWithImages(item.message, isMine, handleImageLoaded)
              )}
            </div>
            
            {/* LOGIKA JAM (TIMESTAMP) */}
            <span className={`text-[9px] absolute font-medium ${
              isImageMode 
                ? 'bottom-2 right-2 bg-black/50 text-white px-1.5 py-0.5 rounded-md backdrop-blur-sm' // Di atas foto langsung
                : `bottom-1.5 right-2 ${isMine ? 'text-indigo-200' : 'text-slate-400'}` // Di dalam bubble chat
            }`}>
              {formatTime(item.created_at)}
            </span>

          </div>
        </div>
      </div>
    </div>
  );
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
      API.post('/chat-room/read', {
        user_id: currentUserId,
        room_id: currentRoomId,
      }).catch(() => {}); 
    } catch (e) {}
  };

  const loadMessages = async (currentUserId = user?.id, silent = true) => {
    if (!currentUserId) return;
    
    // Tampilkan loading HANYA jika list pesan masih 0 (kosong)
    if (!silent && messages.length === 0) setLoading(true);

    try {
      const response = await API.get(`/chat-room?user_id=${currentUserId}`);
      if (response.data.status === 'success') {
        const nextRoom = response.data.room;
        setRoom(nextRoom);
        setMessages(response.data.messages || []);

        if (!silent && nextRoom?.id) {
          markMessagesAsRead(currentUserId, nextRoom.id);
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
    loadMessages(savedUser.id, false);

    const timer = window.setInterval(() => {
      if (savedUser?.id) loadMessages(savedUser.id, true);
    }, 3000);

    return () => window.clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  useEffect(() => {
    if (listRef.current && isAtBottomRef.current) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages]);

  // =========================================================
  // LOGIKA KIRIM CHAT: TAHAN INPUT SAMPAI SERVER SUKSES
  // =========================================================
  const handleSend = async (event) => {
    event.preventDefault();
    if (!user?.id || !draft.trim() || sending) return;

    const now = Date.now();
    if (now < cooldownUntil) return;

    const trimmedDraft = draft.trim();
    
    // 1. TAHAN INPUT. Teks tidak dihapus, hanya memutar spinner.
    setSending(true);

    try {
      // 2. Lempar ke Database
      const response = await API.post('/chat-room/send', {
        user_id: user.id,
        message: trimmedDraft,
      });

      if (response.data.status === 'success') {
        // 3. JIKA SUKSES BARU KOSONGKAN INPUT
        setDraft(''); 
        
        const sentChat = response.data.chat;
        if (sentChat) {
          setMessages((prev) => {
            if (prev.find(m => m.id === sentChat.id)) return prev; 
            return [...prev, sentChat];
          });
          isAtBottomRef.current = true; // Paksa scroll bawah
        }
        
        setCooldownUntil(Date.now() + 500);
      } else {
        alert(response.data.message || 'Pesan gagal terkirim.');
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Gagal mengirim pesan.');
    } finally {
      // 4. Selesai request (Matikan Spinner)
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
        
        {/* HEADER */}
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

        {/* LOADING SPINNER */}
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
            className="flex-1 overflow-y-auto scroll-smooth space-y-[2px] pb-20 pr-1" 
          >
            {/* space-y-[2px] dibikin rapat banget biar antar pesan grup keliatan nyatu */}
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-100">
                  Mulai obrolan pertama di kelas ini!
                </div>
              </div>
            ) : (
              messages.map((item, index) => {
                const isMine = String(item.user_id) === String(user.id);
                const preset = getExclusiveUserPreset(item.user?.email || user?.email);
                
                // LOGIKA GROUPING CHAT: Cek pesan sebelumnya untuk Avatar
                const prevMessage = messages[index - 1];
                const isSameUserAsPrev = prevMessage && String(prevMessage.user_id) === String(item.user_id);
                const showAvatar = !isSameUserAsPrev;

                return (
                  <MessageItem 
                    key={item.id}
                    item={item}
                    isMine={isMine}
                    showAvatar={showAvatar}
                    preset={preset}
                    getDisplayName={getDisplayName}
                    formatTime={formatTime}
                    setMessageToDelete={setMessageToDelete}
                  />
                );
              })
            )}
          </div>
        )}
      </div>

      {/* INPUT BAR */}
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

      {/* MODAL HAPUS */}
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