import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { ExclusiveProfileShell, getUserBorderValue, normalizeBorderValue } from '../components/ExclusiveUserBorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faSpinner, faComments, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

// =========================================================
// CACHE RINGAN DI LOCALSTORAGE (ANTI LOADING LAMA)
// =========================================================
const CHAT_CACHE_PREFIX = 'chatroom_cache_v1_';
const CHAT_CACHE_MAX_MESSAGES = 50;
const PROFILE_TABLE_KEY = 'finclass-user-profiles';

const getChatCacheKey = (userId) => `${CHAT_CACHE_PREFIX}${userId}`;

const readProfileTable = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_TABLE_KEY) || '{}');
  } catch {
    return {};
  }
};

const getStoredProfile = (userId) => {
  if (!userId) return null;
  return readProfileTable()[userId] || null;
};

const getMessageUser = (item) => (
  item?.user || item?.sender || item?.author || {}
);

// Resolve border milik pengirim yang sedang tampil.
// Prioritas utama adalah data user dari API/database, lalu cache profil lokal.
const resolveBorderValue = (item, userId) => {
  const sender = getMessageUser(item);
  const storedProfile = getStoredProfile(userId);
  const candidates = [
    sender?.custom_border_color,
    sender?.border_type,
    sender?.exclusive_border,
    sender?.exclusive_border_type,
    sender?.profile?.custom_border_color,
    sender?.profile?.border_type,
    item?.custom_border_color,
    item?.border_type,
    storedProfile?.custom_border_color,
    storedProfile?.border_type,
  ];
  for (const candidate of candidates) {
    const normalized = normalizeBorderValue(candidate);
    if (normalized) return normalized;
  }
  return '';
};

const readChatCache = (userId) => {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(getChatCacheKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null; 
  }
};

const writeChatCache = (userId, room, messages) => {
  if (!userId) return;
  try {
    const trimmed = (messages || []).slice(-CHAT_CACHE_MAX_MESSAGES);
    localStorage.setItem(
      getChatCacheKey(userId),
      JSON.stringify({ room: room || null, messages: trimmed, savedAt: Date.now() })
    );
  } catch {
    // Abaikan jika storage penuh
  }
};

// =========================================================
// KOMPONEN CERDAS: AUTO-EMBED LINK JADI GAMBAR
// =========================================================
const AutoEmbedLink = ({ url, isMine, onImageLoaded }) => {
  const [status, setStatus] = useState('checking');

  const linkStyle = isMine ? "text-indigo-100 underline font-medium break-all" : "text-indigo-600 underline font-medium break-all";

  return (
    <span className="inline-block max-w-full align-top overflow-hidden">
      {status !== 'is-image' && (
        <a href={url} target="_blank" rel="noopener noreferrer" className={linkStyle}>
          {url}
        </a>
      )}

      {status !== 'is-link' && (
        <a href={url} target="_blank" rel="noopener noreferrer" className={status === 'is-image' ? 'block mt-1 relative' : 'absolute opacity-0 w-0 h-0 overflow-hidden'}>
          <img
            src={url}
            alt="Attachment"
            className="max-w-[200px] sm:max-w-[240px] w-auto h-auto max-h-[250px] rounded-[14px] object-cover bg-slate-100 shadow-sm transition-transform hover:scale-[1.02]"
            loading="lazy"
            onLoad={() => {
              if (status !== 'is-image') {
                setStatus('is-image');
                if (onImageLoaded) onImageLoaded();
              }
            }}
            onError={() => {
              if (status !== 'is-link') setStatus('is-link');
            }}
          />
        </a>
      )}
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
// KOMPONEN ITEM PESAN (BUBBLE, AVATAR, & GROUPING)
// =========================================================
const MessageItem = ({ item, isMine, showAvatar, borderValue, getDisplayName, formatTime, setMessageToDelete }) => {
  const sender = getMessageUser(item);
  const storedProfile = getStoredProfile(sender?.id);
  const avatarUrl = storedProfile?.image || sender?.profile_image_url || sender?.profile_image || '';
  const isDeleted = Boolean(item.deleted_at || item.is_deleted);

  const isOnlyUrl = /^https?:\/\/[^\s]+$/i.test(item.message?.trim() || '');
  const [isImageMode, setIsImageMode] = useState(false);

  const handleImageLoaded = () => {
    if (isOnlyUrl) {
      setIsImageMode(true);
    }
  };

  let cornerClass = 'rounded-2xl';
  if (showAvatar) {
    cornerClass = isMine ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm';
  }

  let bubbleClass = isMine
    ? isDeleted
      ? 'bg-slate-200 text-slate-600 border border-slate-200'
      : 'bg-indigo-600 text-white shadow-sm'
    : isDeleted
      ? 'bg-slate-100 border border-slate-200 text-slate-500'
      : 'bg-white border border-slate-200 text-slate-800 shadow-sm';

  if (isImageMode && !isDeleted) {
    bubbleClass = 'bg-transparent shadow-none p-0 mt-1';
  } else {
    bubbleClass += ` px-3.5 pt-2 pb-5 min-w-[70px] ${cornerClass}`;
  }

  return (
    <div className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'} mt-1`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] items-start gap-2.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* WADAH FOTO PROFIL DENGAN EXCLUSIVE BORDER */}
        <div className="flex flex-col items-center shrink-0 w-9 mt-0.5">
          {showAvatar ? (
            <ExclusiveProfileShell 
              email={sender?.email}
              customBorderColor={borderValue}
              borderValue={borderValue}
              variant="avatar"
              className="h-9 w-9 shrink-0"
            >
              <div className="h-full w-full overflow-hidden rounded-full bg-slate-100 flex items-center justify-center border border-slate-200/60 shadow-inner">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={getDisplayName(sender)} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    {getDisplayName(sender).charAt(0)}
                  </div>
                )}
              </div>
            </ExclusiveProfileShell>
          ) : (
            <div className="h-9 w-9 shrink-0" />
          )}
        </div>

        {/* WADAH KONTEN CHAT */}
        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} min-w-0 flex-1 max-w-[calc(100%-2.5rem)]`}>

          {showAvatar && !isMine && (
            <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1 truncate max-w-full">
              {getDisplayName(sender)}
            </span>
          )}

          <div
            onClick={() => {
              if (isMine && !isDeleted) setMessageToDelete(item);
            }}
            className={`relative max-w-full cursor-pointer active:scale-[0.98] transition-transform ${bubbleClass}`}
          >
            <div className={`text-xs leading-relaxed break-words whitespace-pre-wrap ${isDeleted ? 'pr-0' : ''}`}>
              {isDeleted ? (
                <span className="flex items-center gap-1.5 opacity-90">
                  <span className="italic text-[11px] font-medium">Pesan ini telah dihapus</span>
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-300 text-[8px] font-bold text-slate-600">×</span>
                </span>
              ) : (
                renderMessageWithImages(item.message, isMine, handleImageLoaded)
              )}
            </div>

            <span className={`text-[9px] absolute font-bold z-10 ${
              isImageMode
                ? 'bottom-2 right-2 bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-sm shadow-sm'
                : `bottom-1.5 right-2.5 ${isMine ? 'text-indigo-200/90' : 'text-slate-400/90'}`
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
  const hasAutoScrolledRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Penahan pesan agar tidak kedip (Optimistic UI)
  const recentSentRef = useRef(new Map());   
  const recentDeletedRef = useRef(new Map()); 

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

  const reconcileMessages = (serverMessages) => {
    const serverIds = new Set(serverMessages.map((m) => m.id));

    const stillPendingSent = [];
    recentSentRef.current.forEach((msg, id) => {
      if (serverIds.has(id)) {
        recentSentRef.current.delete(id); 
      } else {
        stillPendingSent.push(msg);
      }
    });

    let merged = stillPendingSent.length
      ? [...serverMessages, ...stillPendingSent].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )
      : serverMessages;

    if (recentDeletedRef.current.size > 0) {
      merged = merged.map((item) => {
        if (item.deleted_at || item.is_deleted) {
          recentDeletedRef.current.delete(item.id); 
          return item;
        }
        if (recentDeletedRef.current.has(item.id)) {
          return {
            ...item,
            message: 'Pesan ini telah dihapus',
            deleted_at: recentDeletedRef.current.get(item.id),
            is_deleted: true,
          };
        }
        return item;
      });
    }

    return merged;
  };

  const loadMessages = async (currentUserId = user?.id, silent = true) => {
    if (!currentUserId) return;

    try {
      const response = await API.get(`/chat-room?user_id=${currentUserId}`);
      if (response.data.status === 'success') {
        const nextRoom = response.data.room;
        setRoom(nextRoom);

        const incomingMessages = response.data.messages || [];
        const reconciled = reconcileMessages(incomingMessages);

        setMessages((prev) => {
          if (prev.length !== reconciled.length) return reconciled;
          
          const isChanged = prev.some((p, i) => 
            p.id !== reconciled[i].id || 
            p.is_deleted !== reconciled[i].is_deleted || 
            p.deleted_at !== reconciled[i].deleted_at ||
            p.message !== reconciled[i].message
          );

          return isChanged ? reconciled : prev;
        });

        writeChatCache(currentUserId, nextRoom, reconciled);

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

    const cached = readChatCache(savedUser.id);
    if (cached) {
      setRoom(cached.room || null);
      setMessages(cached.messages || []);
      setLoading(false);
    }

    loadMessages(savedUser.id, false);

    const safetyTimer = window.setTimeout(() => setLoading(false), 5000);

    const timer = window.setInterval(() => {
      if (savedUser?.id) loadMessages(savedUser.id, true);
    }, 3000);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(safetyTimer);
    };
  }, [navigate]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  useEffect(() => {
    if (!listRef.current) return;

    const isFirstReveal = !hasAutoScrolledRef.current && messages.length > 0;

    if (isFirstReveal || isAtBottomRef.current) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }, 50);

      if (isFirstReveal) hasAutoScrolledRef.current = true;
    }
  }, [messages]);

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
          recentSentRef.current.set(sentChat.id, sentChat);

          setMessages((prev) => {
            if (prev.find((m) => m.id === sentChat.id)) return prev;
            const next = [...prev, sentChat];
            writeChatCache(user.id, room, next);
            return next;
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
        const deletedAt = response.data.chat?.deleted_at || new Date().toISOString();

        recentDeletedRef.current.set(messageId, deletedAt);

        setMessages((currentMessages) => {
          const next = currentMessages.map((item) =>
            item.id === messageId
              ? {
                  ...item,
                  message: 'Pesan ini telah dihapus',
                  deleted_at: deletedAt,
                  is_deleted: true,
                }
              : item
          );
          writeChatCache(user.id, room, next);
          return next;
        });
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
      <div className="relative left-1/2 flex h-[calc(100dvh-135px)] min-h-0 w-screen max-w-none -translate-x-1/2 flex-col overflow-x-hidden sm:left-0 sm:w-full sm:translate-x-0">

        {/* HEADER: TANPA GAP DAN MENEMPEL DI ATAS AREA CHAT */}
        <div className="sticky top-0 z-30 flex w-full shrink-0 items-center gap-3 border-b border-slate-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          </button>

          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-sm shrink-0 shadow-inner">
              <FontAwesomeIcon icon={faComments} />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-800 leading-tight truncate">
                {room ? room.name : 'Room Chat Kelas'}
              </h1>
              <p className="text-[10px] font-medium text-slate-400 truncate">Pesan terhapus otomatis 7 hari</p>
            </div>
          </div>
        </div>

        {loading && messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-2.5 text-slate-400">
              <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-indigo-500 drop-shadow-sm" />
              <span className="text-xs font-bold tracking-wide">Memuat percakapan...</span>
            </div>
          </div>
        ) : !user?.kelas_id ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm max-w-sm w-full">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                 <FontAwesomeIcon icon={faComments} className="text-xl" />
              </div>
              <p className="text-sm font-bold text-slate-800">Kamu belum bergabung di kelas.</p>
              <p className="mt-1.5 text-xs text-slate-500 font-medium">Silakan gabung kelas terlebih dahulu untuk memulai obrolan.</p>
            </div>
          </div>
        ) : (
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth space-y-1 pb-[70px] pr-1 scrollbar-hide"
          >
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="bg-indigo-50/80 text-indigo-600 px-4 py-2.5 rounded-xl text-xs font-bold border border-indigo-100 shadow-sm backdrop-blur-sm">
                  Mulai obrolan pertama di kelas ini!
                </div>
              </div>
            ) : (
              messages.map((item, index) => {
                const sender = getMessageUser(item);
                const senderId = item.user_id || sender?.id || item.sender_id || item.author_id;
                const isMine = String(senderId) === String(user.id);

                // Setiap pesan memakai border milik pengirimnya sendiri.
                // Border user login tidak pernah dipakai untuk user lain.
                const borderValue = resolveBorderValue(item, senderId) || (
                  isMine ? getUserBorderValue(user) : ''
                );

                const prevMessage = messages[index - 1];
                const prevSenderId = prevMessage?.user_id || getMessageUser(prevMessage)?.id || prevMessage?.sender_id || prevMessage?.author_id;
                const isSameUserAsPrev = prevMessage && String(prevSenderId) === String(senderId);
                const showAvatar = !isSameUserAsPrev;

                return (
                  <MessageItem
                    key={item.id}
                    item={item}
                    isMine={isMine}
                    showAvatar={showAvatar}
                    borderValue={borderValue}
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

      {/* INPUT BAR BAWAH */}
      {user?.kelas_id && (
        <div className="fixed inset-x-0 bottom-[65px] z-40 w-full border-t border-slate-200/80 bg-white/95 px-3 py-2.5 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)] backdrop-blur-md sm:px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSend} className="flex items-center gap-2.5">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ketik pesan atau paste URL gambar..."
                className="flex-1 h-[42px] rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-800 shadow-inner outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
                maxLength={500}
                autoComplete="off"
                disabled={sending}
              />

              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 disabled:cursor-not-allowed disabled:bg-indigo-300 transition-all hover:bg-indigo-700 active:scale-95 cursor-pointer"
              >
                {sending ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="text-xs" />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} className="text-xs mr-0.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS PESAN */}
      {messageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all" onClick={() => setMessageToDelete(null)}>
          <div
            className="w-full max-w-sm bg-white rounded-[28px] p-5 shadow-2xl animate-[slide-up_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden"></div>
            <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pilihan Pesan</h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDeleteMessage(messageToDelete.id)}
                className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer border border-rose-100"
              >
                <FontAwesomeIcon icon={faTrash} />
                Hapus Pesan Ini
              </button>

              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} />
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}