import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    UploadCloud,
    Plus,
    Search,
    Send,
    Phone,
    Tag,
    Settings,
    Filter,
    Calendar,
    X,
    RefreshCw,
    Mic,
    ArrowLeft,
    Trash2
} from 'lucide-react';
import { useTags } from '../hooks/useTags';
import { useUserOrganization } from '../hooks/use-queries/useOrganization';
import { TagsManager } from '../components/TagsManager';
import { ChatTagsSelector } from '../components/ChatTagsSelector';
import { ImageLightbox } from '../components/ImageLightbox';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { ContactCard } from '../components/ContactCard';
import { cn, removeJidSuffix } from '../lib/utils';
import {
    sendMessage as sendGreenMessage,
    getLastIncomingMessages,
    getLastOutgoingMessages,
    getChatHistory,
    getChats,
    normalizePhoneForAPI,
    getAvatar,
    downloadFile,
} from '../services/greenApi';
import { EvolutionApiService } from '../services/EvolutionApiService';
import { pollNewMessages, startBackgroundSync, getSyncStatus, syncChatsToSupabase, syncMessagesToSupabase, syncFullChatHistory, resetChatNames, warmUpSync, triggerStateSnapshot } from '../services/messageSync';
import { bootstrapFromSnapshot } from '../services/snapshotService';
import { logger } from '../lib/logger';
import { playNotificationSound } from '../utils/audio';
import {
    saveMessagesToCache,
    loadMessagesFromCache,
    mergeMessages,
    clearChatCache as clearLocalChatCache,
    saveChatsToCache,
    loadChatsFromCache,
    saveAvatarsToCache,
    loadAvatarsFromCache,
    saveSyncMeta,
    getSyncMeta,
} from '../lib/messageLocalCache';

export default function Chats() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const { user } = useAuth();
    const { theme } = useTheme();
    const { data: organization } = useUserOrganization(user?.id);
    const navigate = useNavigate();
    const { numberId, remoteJid } = useParams();
    const [numbers, setNumbers] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isChatsLoaded, setIsChatsLoaded] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [isWarmUpSyncing, setIsWarmUpSyncing] = useState(false);
    const [isBootstrapping, setIsBootstrapping] = useState(false);
    const [isSnapshotting, setIsSnapshotting] = useState(false);
    const [isActiveChatSyncing, setIsActiveChatSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState(null);
    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
    const [chatAvatars, setChatAvatars] = useState(new Map()); // Map<chatId, avatarUrl>
    const [chatFilter, setChatFilter] = useState('all'); // 'all' | 'unread' | 'groups'

    // Advanced Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState(new Date().toLocaleDateString('en-CA'));
    const [filterTags, setFilterTags] = useState([]); // array of tag IDs


    // Tags Integration
    const { tags, chatTags, assignTagToChat, removeTagFromChat } = useTags(selectedNumber?.organization_id, selectedNumber?.instance_id, user?.id);
    const [showTagsManager, setShowTagsManager] = useState(false);
    const [currentChatTagsId, setCurrentChatTagsId] = useState(null); // chatId for selector dialog

    // Helper to clear chat history
    const clearHistory = async () => {
        if (!selectedChat || !selectedNumber) return;

        if (!window.confirm(t('chats_page.confirm_clear_history') || 'Are you sure you want to clear all messages in this chat? This cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            const chatId = selectedChat.id;
            const remoteJid = selectedChat.chatId || selectedChat.remote_jid;
            console.log('[HISTORY] Clearing history for:', remoteJid);

            // 1. Delete from Supabase
            // We use chat_id (UUID) to delete messages linked to this chat
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('chat_id', chatId);

            if (error) {
                console.warn('[HISTORY] Supabase delete error (non-fatal if empty):', error);
                throw error;
            }

            // 2. Clear local cache
            clearLocalChatCache(selectedNumber.instance_id, remoteJid);

            // 3. Clear local state
            setMessages([]);

            // 4. Force a UI refresh of the chat list to update "last message" snippet if needed
            fetchChats(false);

            console.log('[HISTORY] Cleared history successfully');
        } catch (error) {
            console.error('[HISTORY] Error clearing history:', error);
            // alert('Failed to clear history: ' + error.message); // Optional
        } finally {
            setLoading(false);
        }
    };

    // Image Lightbox state
    const [lightboxImage, setLightboxImage] = useState(null);

    // Media URLs cache - stores fetched downloadUrls by message ID
    const [mediaUrls, setMediaUrls] = useState({});
    const [loadingMedia, setLoadingMedia] = useState({});
    const [syncStatus, setSyncStatus] = useState({}); // numberId -> status object
    const [showPanelMaster, setShowPanelMaster] = useState(false);
    const [showContactCard, setShowContactCard] = useState(false); // Controls the dynamic customer card
    const pendingChatIdFromUrlRef = useRef(null);
    const isGatheringAvatarsRef = useRef(false);
    const activeChatIdRef = useRef(null);

    // Cache like extension
    const chatsCacheRef = useRef({ data: null, timestamp: 0, ttl: 30000 }); // 30 seconds
    const historyCacheRef = useRef(new Map()); // Map<chatId, { messages, timestamp }>

    // Merge chatTags into chats for TagsManager/TagsViewModal
    const chatsWithTags = useMemo(() => {
        return chats.map(chat => {
            const chatId = chat.chatId || chat.remote_jid || '';
            return {
                ...chat,
                // id: chatId, // REMOVE: This overwrites UUID with JID, causing DB errors
                remote_jid: chatId,
                tags: chatTags[chatId] || []
            };
        });
    }, [chats, chatTags]);

    useEffect(() => {
        fetchNumbers();
    }, [user]);

    // Load number and chat from URL params
    useEffect(() => {
        if (numberId && numbers.length > 0) {
            const num = numbers.find(n => n.id === numberId);
            if (num && num.id !== selectedNumber?.id) {
                setSelectedNumber(num);
                // Reset state for new number
                setChats([]);
                setIsChatsLoaded(false);
                setSelectedChat(null);
                setMessages([]);
                chatsCacheRef.current = { data: null, timestamp: 0, ttl: 30000, instanceId: num.instance_id };
                historyCacheRef.current.clear();

                // Load cached avatars for this instance immediately
            }
        }
    }, [numberId, numbers]);

    useEffect(() => {
        if (selectedNumber) {
            // 0. Priority Alpha: Bootstrap from Storage Snapshot (Ultra Fast)
            setIsBootstrapping(true);
            bootstrapFromSnapshot(selectedNumber.instance_id)
                .then((res) => {
                    if (res.success) {
                        console.log('[SNAPSHOT] Quick bootstrap successful, reloading UI');
                        // Reload state from newly populated cache
                        const cachedAvatars = loadAvatarsFromCache(selectedNumber.instance_id);
                        if (cachedAvatars.size > 0) setChatAvatars(cachedAvatars);
                        fetchChats();
                    }
                })
                .finally(() => setIsBootstrapping(false));

            // 1. Priority: Load avatars from cache immediately (Local only)
            const cachedAvatars = loadAvatarsFromCache(selectedNumber.instance_id);
            if (cachedAvatars.size > 0) {
                console.log(`[AVATAR] Loaded ${cachedAvatars.size} cached avatars for ${selectedNumber.instance_id}`);
                setChatAvatars(cachedAvatars);
            }

            // 2. Load basic chat list (Local Cache / DB)
            fetchChats();

            // 3. Perform a "Warm-up" sync to populate latest history immediately (Global History)
            setIsWarmUpSyncing(true);
            warmUpSync(selectedNumber.id, selectedNumber.instance_id, selectedNumber.api_token, selectedNumber.provider || 'green-api')
                .then((result) => {
                    console.log('[SYNC] Warm-up complete, refreshing list');

                    // Populate local cache based on discovered history
                    if (result.success && result.messages) {
                        const grouped = {};
                        result.messages.forEach(msg => {
                            const cid = msg.chatId || (msg.key?.remoteJid);
                            if (cid) {
                                if (!grouped[cid]) grouped[cid] = [];
                                grouped[cid].push(msg);
                            }
                        });

                        Object.keys(grouped).forEach(cid => {
                            const current = loadMessagesFromCache(selectedNumber.instance_id, cid) || [];
                            const merged = mergeMessages(current, grouped[cid]);
                            saveMessagesToCache(selectedNumber.instance_id, cid, merged);
                        });
                    }

                    fetchChats(true); // Soft refresh with cache update
                    // If we have a selected chat that was empty, refresh it now
                    if (selectedChat) fetchMessages(true);

                    // TRIGGER SNAPSHOT NOW: We have the warm history, let's freeze it for others
                    console.log('[SNAPSHOT] Triggering immediate snapshot after warm-up...');
                    triggerStateSnapshot(selectedNumber.instance_id);
                })
                .catch(err => console.error('[SYNC] Warm-up failed:', err))
                .finally(() => setIsWarmUpSyncing(false));
        }
    }, [selectedNumber?.id]);

    // Load chat from URL params
    useEffect(() => {
        if (remoteJid && selectedNumber) {
            const decodedRemoteJid = decodeURIComponent(remoteJid);
            pendingChatIdFromUrlRef.current = decodedRemoteJid;

            // Wait for chats to load if they are loading
            if (!isChatsLoaded) return;

            // Try to find in existing chats
            const chat = chats.find(c => {
                const chatNumberOnly = removeJidSuffix(c.chatId || c.remote_jid || '');
                return chatNumberOnly === decodedRemoteJid || c.chatId === decodedRemoteJid || c.phone === decodedRemoteJid;
            });

            if (chat) {
                if (chat.chatId !== selectedChat?.chatId) {
                    console.log('[CHATS] Setting selected chat from URL:', chat.chatId);
                    setSelectedChat(chat);
                }
                pendingChatIdFromUrlRef.current = null;
            } else {
                // Chat not found in list (New chat or not synced yet)
                console.log('[CHATS] Chat from URL not found in list, creating temporary:', decodedRemoteJid);

                const cleanId = removeJidSuffix(decodedRemoteJid);
                const fullId = decodedRemoteJid.includes('@') ? decodedRemoteJid : `${cleanId}@c.us`;

                const newChat = {
                    id: null,
                    chatId: fullId,
                    remote_jid: fullId,
                    phone: cleanId,
                    name: cleanId,
                    avatar: '',
                    lastMessage: '',
                    lastMessageId: '',
                    lastMessageTime: Date.now(),
                    timestamp: Date.now(),
                    unreadCount: 0,
                    isNew: true // Flag to indicate it's a temporary chat
                };
                setSelectedChat(newChat);
                // Optionally add to list so it's visible in sidebar
                setChats(prev => [newChat, ...prev]);
            }
        } else {
            if (!remoteJid) {
                // Only clear if URL param is gone, don't clear if just waiting for chats
                setSelectedChat(null);
            }
            pendingChatIdFromUrlRef.current = null;
        }
    }, [remoteJid, chats, isChatsLoaded, selectedNumber]);

    useEffect(() => {
        if (selectedChat && selectedNumber) {
            // Reset pagination state
            setHasMoreMessages(true);
            setOldestMessageTimestamp(null);
            const chatId = selectedChat.chatId || selectedChat.remote_jid;
            activeChatIdRef.current = chatId;
            // Clear messages immediately so we don't see previous chat's data
            setMessages([]);

            fetchMessages();

            if (chatId) {
                // Focused high-priority sync for ACTIVE CHAT
                const dbChat = chats.find(c => c.chatId === chatId) || selectedChat;
                if (dbChat && dbChat.id) {
                    setIsActiveChatSyncing(true);
                    console.log(`[ACTIVE SYNC] Starting for ${chatId}`);
                    syncMessagesToSupabase(
                        dbChat.id,
                        selectedNumber.instance_id,
                        selectedNumber.api_token,
                        chatId,
                        50,
                        selectedNumber.provider || 'green-api'
                    ).then(() => {
                        console.log(`[ACTIVE SYNC] Completed for ${chatId}`);
                        fetchMessages(true); // Soft refresh UI
                    }).finally(() => {
                        setIsActiveChatSyncing(false);
                    });

                    // Still trigger full history sync in background
                    syncFullChatHistory(dbChat, selectedNumber.instance_id, selectedNumber.api_token).catch(() => { });
                }
            }
        }
    }, [selectedChat, selectedNumber?.id]);

    // Background Sync Initiation
    useEffect(() => {
        if (numbers.length > 0) {
            const intervals = [];
            numbers.forEach(num => {
                if (num.instance_id && num.api_token) {
                    startBackgroundSync(num.id, num.instance_id, num.api_token);
                    // Periodic snapshot (e.g. 5 minutes)
                    const snapshotInterval = setInterval(() => {
                        triggerStateSnapshot(num.instance_id);
                    }, 300000);
                    intervals.push(snapshotInterval);
                }
            });
            return () => intervals.forEach(clearInterval);
        }
    }, [numbers, selectedNumber?.id]);

    // Global Auto-Refresh (Every 2 minutes)
    useEffect(() => {
        if (!selectedNumber) return;

        const autoRefreshInterval = setInterval(() => {
            console.log('[AUTO-REFRESH] Triggering periodic refresh...');
            fetchChats(true);
            if (selectedChat) {
                fetchMessages(true);
            }
        }, 120000); // 2 minutes

        return () => clearInterval(autoRefreshInterval);
    }, [selectedNumber?.id, selectedChat?.chatId]);


    useEffect(() => {
        if (chats.length > 0 && selectedNumber) {
            const prefetchChats = async () => {
                const topChats = chats.slice(0, 20); // Only top 20 for prefetch
                console.log(`[PREFETCH] Background sync for ${topChats.length} recent chats...`);

                for (const chat of topChats) {
                    const chatId = chat.chatId || chat.remote_jid;
                    if (!chatId) continue;

                    const meta = getSyncMeta(selectedNumber.instance_id, chatId);
                    // 30-minute cooldown for prefetch to be very conservative
                    if (meta && (Date.now() - meta.updatedAt < 1800000)) continue;

                    try {
                        await syncMessagesToSupabase(
                            chat.id,
                            selectedNumber.instance_id,
                            selectedNumber.api_token,
                            chatId,
                            50,
                            selectedNumber.provider || 'green-api'
                        );
                        saveSyncMeta(selectedNumber.instance_id, chatId, { updatedAt: Date.now() });
                    } catch (err) { }

                    // Even slower progress
                    await new Promise(r => setTimeout(r, 6000 + Math.random() * 2000));
                }
            };
            const timer = setTimeout(prefetchChats, 10000); // Wait 10s after mount to start noisy work
            return () => clearTimeout(timer);
        }
    }, [chats.length, selectedNumber?.id]);

    // Enhanced Polling & Real-time Sync (2-minute window + Sounds)
    useEffect(() => {
        if (!selectedNumber || isPolling) return;

        const interval = setInterval(async () => {
            if (isPolling) return;
            setIsPolling(true);

            try {
                // 1. Notification queue polling
                await pollNewMessages(
                    selectedNumber.instance_id,
                    selectedNumber.api_token,
                    async (msg, notification) => {
                        console.log('[POLLING] Message received:', msg);
                        const isIncoming = msg.type === 'incoming' || notification?.body?.typeWebhook === 'incomingMessageReceived';

                        if (isIncoming) {
                            playNotificationSound();
                        }

                        const msgChatId = msg.chatId || notification?.body?.senderData?.chatId;
                        if (selectedChat && (selectedChat.chatId === msgChatId || selectedChat.remote_jid === msgChatId)) {
                            fetchMessages(true);
                        }
                        // Lightweight refresh only
                        fetchChats(false);
                    }
                );

                // 2. Real-time 2-minute scan (as requested)
                const recentResult = await getLastIncomingMessages(selectedNumber.instance_id, selectedNumber.api_token, 2);
                if (recentResult.success && recentResult.data && recentResult.data.length > 0) {
                    const existingTimestamps = new Set(messages.slice(-20).map(m => m.timestamp));
                    const hasNew = recentResult.data.some(m => !existingTimestamps.has(m.timestamp));

                    if (hasNew) {
                        console.log('[POLLING] Found new recent messages, refreshing');
                        playNotificationSound();
                        fetchChats(false);
                        if (selectedChat) fetchMessages(true);
                    }
                }

                // 3. Periodic full list refresh (lightweight)
                const now = Date.now();
                const lastFullRefresh = chatsCacheRef.current.timestamp || 0;
                if (now - lastFullRefresh > 60000) {
                    console.log('[POLLING] Periodic full list refresh');
                    fetchChats(false);
                }

                // 4. Update background sync status
                const status = getSyncStatus(selectedNumber.id);
                if (status) {
                    setSyncStatus(prev => ({ ...prev, [selectedNumber.id]: status }));
                }

            } catch (err) {
                console.warn('[POLLING] Error in loop:', err);
            } finally {
                setIsPolling(false);
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [selectedNumber, selectedChat, messages.length]);

    // Load avatar for a chat
    const loadChatAvatar = async (chatId) => {
        if (!selectedNumber || !chatId || chatAvatars.has(chatId)) return;

        try {
            const result = await getAvatar(selectedNumber.instance_id, selectedNumber.api_token, chatId);
            if (result.success && result.data?.urlAvatar) {
                setChatAvatars(prev => new Map(prev).set(chatId, result.data.urlAvatar));
                console.log(`[AVATAR] Loaded avatar for ${chatId}`);
            }
        } catch (error) {
            console.error('[AVATAR] Error loading avatar:', error);
        }
    };


    // Load avatars sequentially with a delay to avoid 429
    useEffect(() => {
        if (chats.length > 0 && selectedNumber?.instance_id && !isGatheringAvatarsRef.current) {
            let mounted = true;

            const loadAvatarsSequentially = async () => {
                // Double check cache before filtering
                const currentCache = loadAvatarsFromCache(selectedNumber.instance_id);

                const chatsToLoad = chats.filter(chat => {
                    const id = chat.chatId || chat.remote_jid;
                    return id && !chatAvatars.has(id) && !currentCache.has(id);
                }).slice(0, 100); // Larger batch allowed now

                if (chatsToLoad.length === 0) return;

                isGatheringAvatarsRef.current = true;
                const freshAvatars = new Map([...chatAvatars, ...currentCache]);
                let newAvatarsLoaded = false;

                for (let i = 0; i < chatsToLoad.length; i++) {
                    if (!mounted) break;
                    const chat = chatsToLoad[i];
                    const chatId = chat.chatId || chat.remote_jid;

                    try {
                        const result = await getAvatar(selectedNumber.instance_id, selectedNumber.api_token, chatId);
                        if (result.success && result.data?.urlAvatar) {
                            freshAvatars.set(chatId, result.data.urlAvatar);
                            newAvatarsLoaded = true;

                            // Update state and cache periodically (every 5 found or at end)
                            if (freshAvatars.size % 5 === 0) {
                                setChatAvatars(new Map(freshAvatars));
                                saveAvatarsToCache(selectedNumber.instance_id, freshAvatars);
                            }
                        }
                        // Small delay between requests to avoid 429
                        await new Promise(r => setTimeout(r, 600));
                    } catch (error) { }
                }

                if (mounted && newAvatarsLoaded) {
                    setChatAvatars(new Map(freshAvatars));
                    saveAvatarsToCache(selectedNumber.instance_id, freshAvatars);
                }
                isGatheringAvatarsRef.current = false;
            };

            loadAvatarsSequentially();
            return () => { mounted = false; isGatheringAvatarsRef.current = false; };
        }
    }, [chats.length, selectedNumber?.id]);

    // Load avatar for selected chat
    useEffect(() => {
        if (selectedChat && selectedNumber) {
            const chatId = selectedChat.chatId || selectedChat.remote_jid;
            if (chatId && !chatAvatars.has(chatId)) {
                loadChatAvatar(chatId);
            }
        }
    }, [selectedChat, selectedNumber?.id]);

    // Auto-scroll to bottom only when new messages arrive (length changes or last message changes)
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            // Only scroll if the last message is new or list grew
            // This prevents scrolling when just loading media or updating other state
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length, messages.length > 0 ? messages[messages.length - 1].id : null, messages.length > 0 ? messages[messages.length - 1].idMessage : null]);

    const fetchNumbers = async () => {
        if (!user) return;

        try {
            setLoading(true);
            // Fetch numbers that the user owns OR numbers from organizations they're a member of
            // RLS policy will handle the filtering, so we just select all accessible numbers
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNumbers(data || []);
            if (data && data.length > 0 && !selectedNumber) {
                setSelectedNumber(data[0]);
            }
        } catch (error) {
            console.error('Error fetching numbers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChats = async (forceRefresh = false, refreshNames = false) => {
        if (!selectedNumber) return [];

        const acc = selectedNumber;
        if (!acc.instance_id || !acc.api_token) {
            console.warn('[CHATS] Missing instance_id or api_token');
            return [];
        }

        // Check memory cache first (during same session)
        const isSameInstance = chatsCacheRef.current.instanceId === acc.instance_id;
        if (!forceRefresh && isSameInstance && chatsCacheRef.current.data && (Date.now() - chatsCacheRef.current.timestamp < chatsCacheRef.current.ttl)) {
            console.log('[CHATS] Using memory cached chats list');
            setChats(chatsCacheRef.current.data);
            setIsChatsLoaded(true);
            return chatsCacheRef.current.data;
        }

        // Check localStorage cache (across navigation)
        if (!forceRefresh && chats.length === 0) {
            const localCachedChats = loadChatsFromCache(acc.instance_id);
            if (localCachedChats && localCachedChats.length > 0) {
                console.log('[CHATS] Using localStorage cached chats list');
                setChats(localCachedChats);
                setIsChatsLoaded(true);
            }
        }

        try {
            // Priority 1: Fetch Names & Discovery (only if specifically requested or long overdue)
            const lastSync = getSyncMeta(acc.instance_id, 'global_chats_sync')?.updatedAt || 0;
            const isOverdue = Date.now() - lastSync > 3600000; // Once per hour

            if (refreshNames || isOverdue) {
                console.log('[CHATS] Synchronizing names/discovery in background...');
                syncChatsToSupabase(acc.id, acc.instance_id, acc.api_token, refreshNames, acc.provider || 'green-api')
                    .then(() => {
                        saveSyncMeta(acc.instance_id, 'global_chats_sync', { updatedAt: Date.now() });
                        fetchChats(false);
                    })
                    .catch(() => { });
            }

            // 1. Fetch live summary from Provider
            let chatsResult = { success: false, data: [] };
            if (acc.provider === 'evolution-api') {
                chatsResult = await EvolutionApiService.fetchChats(acc.instance_id);
            } else {
                chatsResult = await getChats(acc.instance_id, acc.api_token);
            }

            const liveChatMap = new Map();

            if (chatsResult.success && Array.isArray(chatsResult.data)) {
                chatsResult.data.forEach(c => {
                    const id = c.id || c.chatId || c.chatIdString || c.remoteJid;
                    if (id) liveChatMap.set(id, c);
                });
            }

            // 2. Fetch all chats from Supabase
            const { data: dbChats } = await supabase
                .from('chats')
                .select('*')
                .eq('number_id', acc.id);

            // 3. Merge: Database serves as the list, API provides unread/live status
            let freshChats = (dbChats || []).map(dbChat => {
                const liveChat = liveChatMap.get(dbChat.remote_jid);
                const chatId = dbChat.remote_jid;
                const phone = removeJidSuffix(chatId);

                // Start with DB data
                let lastMessageText = dbChat.last_message || '';
                let lastMessageId = dbChat.last_message_id || '';
                let timestamp = dbChat.last_message_at ? Math.floor(new Date(dbChat.last_message_at).getTime() / 1000) : 0;
                let unreadCount = 0;

                // Priority 2: Use live data if available
                if (liveChat) {
                    unreadCount = liveChat.unreadCount ?? liveChat.unread ?? 0;
                    if (liveChat.lastMessage) {
                        const lm = liveChat.lastMessage;
                        lastMessageText = lm.textMessage || lm.extendedTextMessage?.text || lm.message || '[Media]';
                        lastMessageId = lm.idMessage || lm.id || lastMessageId;
                        timestamp = liveChat.timestamp || lm.timestamp || timestamp;
                    }
                }

                // Priority 3: If STILL empty, check local message cache (PanelMaster special optimization)
                if (!lastMessageText) {
                    const cachedMsgs = loadMessagesFromCache(acc.instance_id, chatId);
                    if (cachedMsgs && cachedMsgs.length > 0) {
                        const lastMsg = cachedMsgs[cachedMsgs.length - 1];
                        lastMessageText = lastMsg.textMessage || lastMsg.content || '[Media]';
                        timestamp = lastMsg.timestamp || timestamp;
                    }
                }

                const isJidHelper = (n) => n && (n.includes('@s.whatsapp.net') || n.includes('@g.us') || n.includes('@c.us'));
                const rawName = dbChat.name || liveChat?.name || liveChat?.chatName || null;
                const cleanName = isJidHelper(rawName) ? null : rawName;

                return {
                    id: dbChat.id,
                    chatId: chatId,
                    phone: phone,
                    name: cleanName || phone,
                    avatar: liveChat?.avatar || liveChat?.urlAvatar || '',
                    lastMessage: lastMessageText,
                    lastMessageId: lastMessageId,
                    lastMessageTime: timestamp,
                    timestamp: timestamp,
                    unreadCount: unreadCount,
                };
            });

            // Add chats that are ONLY in the live list (Discovery)
            liveChatMap.forEach((liveChat, cid) => {
                if (!freshChats.some(c => c.chatId === cid)) {
                    const lm = liveChat.lastMessage;
                    freshChats.push({
                        chatId: cid,
                        phone: removeJidSuffix(cid),
                        name: liveChat.name || liveChat.chatName || removeJidSuffix(cid),
                        avatar: liveChat.avatar || liveChat.urlAvatar || '',
                        lastMessage: lm ? (lm.textMessage || lm.extendedTextMessage?.text || '[Media]') : '',
                        lastMessageId: lm?.idMessage || lm?.id || '',
                        lastMessageTime: liveChat.timestamp || lm?.timestamp || 0,
                        timestamp: liveChat.timestamp || lm?.timestamp || 0,
                        unreadCount: liveChat.unreadCount ?? liveChat.unread ?? 0,
                    });
                }
            });

            freshChats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            // Update memory and disk cache
            chatsCacheRef.current.data = freshChats;
            chatsCacheRef.current.timestamp = Date.now();
            chatsCacheRef.current.instanceId = acc.instance_id;
            saveChatsToCache(acc.instance_id, freshChats);

            setChats(freshChats);
            setIsChatsLoaded(true);
            return freshChats;
        } catch (error) {
            console.error('[CHATS] Fetch chats error:', error);
            setIsChatsLoaded(true); // Even on error, we attempted
            return [];
        }
    };

    const fetchMessages = async (forceRefresh = false) => {
        if (!selectedChat || !selectedNumber) {
            setLoading(false);
            setMessagesLoading(false);
            return;
        }

        const chatId = selectedChat.chatId || selectedChat.remote_jid;
        if (!chatId) return;
        activeChatIdRef.current = chatId;

        // 1. INSTANT LOAD: Check localStorage cache first
        const localCachedMessages = loadMessagesFromCache(selectedNumber.instance_id, chatId);
        let skipSync = false;

        if (localCachedMessages && localCachedMessages.length > 0) {
            console.log(`[CHATS] Instant load from cache: ${localCachedMessages.length} messages`);
            setMessages(localCachedMessages);
            setLoading(false); // Hide global loader immediately
            setMessagesLoading(false);

            // Check if we even need to sync
            const liveLastMessageId = selectedChat.lastMessageId;
            const alreadyHasLatest = localCachedMessages.some(m => (m.idMessage === liveLastMessageId || m.id === liveLastMessageId));

            if (!forceRefresh && liveLastMessageId && alreadyHasLatest) {
                console.log(`[CHATS] Cache is already up-to-date with latest message: ${liveLastMessageId}`);
                skipSync = true;
            }

            // Also skip if very recently synced
            const meta = getSyncMeta(selectedNumber.instance_id, chatId);
            if (!forceRefresh && meta && (Date.now() - meta.updatedAt < 10000)) {
                skipSync = true;
            }
        } else {
            setMessagesLoading(true);
        }

        if (skipSync) {
            setMessagesLoading(false);
            return;
        }

        try {
            // Ensure DB chat exists (for new chats from URL)
            let dbChatId = selectedChat.id;
            if (!dbChatId) {
                console.log('[CHATS] Ensuring chat exists in DB:', chatId);
                const { data: upserted } = await supabase
                    .from('chats')
                    .upsert({
                        number_id: selectedNumber.id,
                        remote_jid: chatId,
                        name: selectedChat.name || chatId
                    }, { onConflict: 'number_id,remote_jid' })
                    .select('id')
                    .single();

                if (upserted?.id) {
                    dbChatId = upserted.id;
                    // Update the local chat object reference so subsequent calls work
                    selectedChat.id = upserted.id;
                }
            }

            if (!dbChatId) {
                console.warn('[CHATS] Failed to resolve DB ID for chat, skipping sync');
                setMessagesLoading(false);
                return;
            }

            // 2. BACKGROUND/DELTA SYNC: Fetch latest from API/Supabase
            // PRIORITY: This is the user's focus, fetch more messages than prefetch
            const result = await syncMessagesToSupabase(
                dbChatId,
                selectedNumber.instance_id,
                selectedNumber.api_token,
                chatId,
                50, // Request 50 fresh messages for the active chat
                selectedNumber.provider || 'green-api'
            );

            // Double check we are still on the same chat!
            if (activeChatIdRef.current !== chatId) {
                console.log('[CHATS] Ignoring stale results for', chatId);
                return;
            }

            if (result.success && result.data) {
                const apiMessages = result.data;

                // Merge with local cache to handle gaps or newly sent/received messages
                const merged = mergeMessages(localCachedMessages || [], apiMessages);

                setMessages(merged);
                setHasMoreMessages(apiMessages.length >= 100);
                if (merged.length > 0) {
                    setOldestMessageTimestamp(merged[0].timestamp);
                }

                // Update caches
                saveMessagesToCache(selectedNumber.instance_id, chatId, merged);
                saveSyncMeta(selectedNumber.instance_id, chatId, {
                    lastMessageId: merged[merged.length - 1]?.idMessage || merged[merged.length - 1]?.id
                });
            }
        } catch (error) {
            console.error('[HISTORY] Fetch error:', error);
        } finally {
            setMessagesLoading(false);
            setLoading(false);
        }
    };

    // Load more messages (pagination)
    const loadMoreMessages = async () => {
        if (!selectedChat || !selectedNumber || !hasMoreMessages || loadingMoreMessages) return;

        const acc = selectedNumber;
        const chatId = selectedChat.chatId || selectedChat.remote_jid;
        if (!chatId || !oldestMessageTimestamp) return;

        setLoadingMoreMessages(true);

        try {
            const GREEN_API_BASE = 'https://api.green-api.com';
            const apiUrl = `${GREEN_API_BASE}/waInstance${acc.instance_id}/getChatHistory/${acc.api_token}`;

            // Get the ID of the oldest message we have
            const oldestMsg = messages[0];
            const idMessage = oldestMsg?.idMessage || oldestMsg?.id;

            // Request older messages (before the oldest we have)
            const requestBody = {
                chatId: chatId,
                count: 100
            };
            if (idMessage) requestBody.idMessage = idMessage;

            console.log('[HISTORY] Loading more messages, before ID:', idMessage);

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!res || !res.ok) {
                console.error('[HISTORY] Failed to load more messages');
                setHasMoreMessages(false);
                return;
            }

            const data = await res.json();

            // Parse response
            let arr = [];
            if (Array.isArray(data)) {
                arr = data;
            } else if (data.data && Array.isArray(data.data)) {
                arr = data.data;
            } else if (data.messages && Array.isArray(data.messages)) {
                arr = data.messages;
            } else if (data.results && Array.isArray(data.results)) {
                arr = data.results;
            }

            if (!Array.isArray(arr) || arr.length === 0) {
                console.log('[HISTORY] No more messages found');
                setHasMoreMessages(false);
                return;
            }

            // Filter out messages we already have (by timestamp)
            const existingTimestamps = new Set(messages.map(m => m.timestamp));
            const newMessages = arr.filter(msg =>
                msg.timestamp < oldestMessageTimestamp && !existingTimestamps.has(msg.timestamp)
            );

            if (newMessages.length === 0) {
                console.log('[HISTORY] No new messages after filtering');
                setHasMoreMessages(false);
                return;
            }

            // Sort by timestamp (oldest first)
            newMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

            // Check if there are more messages
            setHasMoreMessages(newMessages.length >= 100);
            if (newMessages.length > 0) {
                setOldestMessageTimestamp(newMessages[0].timestamp);
            }

            // Prepend new messages to existing ones
            setMessages([...newMessages, ...messages]);

            // Update cache
            const allMessages = [...newMessages, ...messages];
            historyCacheRef.current.set(chatId, { messages: allMessages, timestamp: Date.now() });
            saveMessagesToCache(acc.instance_id, chatId, allMessages);

            console.log(`[HISTORY] Loaded ${newMessages.length} more messages`);
        } catch (error) {
            console.error('[HISTORY] Error loading more messages:', error);
            setHasMoreMessages(false);
        } finally {
            setLoadingMoreMessages(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat || !selectedNumber) return;

        try {
            const chatId = selectedChat.chatId || selectedChat.remote_jid;
            if (!chatId) {
                console.error('[SEND] No chatId');
                return;
            }

            // Send Message
            let result;
            if (selectedNumber.provider === 'evolution-api') {
                result = await EvolutionApiService.sendText(
                    selectedNumber.instance_id, // Name for Evolution
                    chatId,
                    newMessage
                );
            } else {
                result = await sendGreenMessage(
                    selectedNumber.instance_id,
                    selectedNumber.api_token,
                    chatId,
                    newMessage,
                );
            }

            if (!result.success) {
                console.error('[SEND] Failed sending via Green API:', result.error);
                await logger.error('Failed to send message via Green API', {
                    error: result.error,
                    chatId
                }, selectedNumber.id);
                return;
            }

            await logger.info('Message sent', {
                chatId,
                message_length: newMessage.length
            }, selectedNumber.id);

            // Create a message object for the sent message (like extension)
            const sentMessage = {
                type: 'outgoing',
                fromMe: true,
                typeMessage: 'textMessage',
                textMessage: newMessage,
                timestamp: Math.floor(Date.now() / 1000),
                chatId: chatId,
                idMessage: result.data?.idMessage || `temp_${Date.now()}`,
                is_from_me: true,
                content: newMessage,
            };

            // Add to messages and clear input
            const updatedMessages = [...messages, sentMessage];
            setMessages(updatedMessages);
            setNewMessage('');

            // Update memory cache
            historyCacheRef.current.set(chatId, { messages: updatedMessages, timestamp: Date.now() });

            // Save to localStorage cache
            saveMessagesToCache(selectedNumber.instance_id, chatId, updatedMessages);

            // Clear chats cache to force refresh on next load
            chatsCacheRef.current.data = null;

            // Refresh chats list to update last message
            await fetchChats(true);
        } catch (error) {
            console.error('[SEND] Send error:', error);
            await logger.error('Error sending message', { error: error.message }, selectedNumber?.id);
        }
    };

    const handleRefreshNames = async () => {
        if (!selectedNumber || !window.confirm(t('chats_page.confirm_reset_names'))) return;

        try {
            setSyncing(true);
            // 1. Reset names in DB
            const res = await resetChatNames(selectedNumber.id);
            if (res.success) {
                // 2. Trigger optimized parallel sync with enrichNames = true
                console.log('[SYNC] Starting optimized name enrichment...');
                await syncChatsToSupabase(selectedNumber.id, selectedNumber.instance_id, selectedNumber.api_token, true, selectedNumber.provider || 'green-api');

                // 3. Clear local caches to reflect changes
                chatsCacheRef.current.data = null;
                chatsCacheRef.current.timestamp = 0;

                // 4. Reload UI with Name Refresh forced
                await fetchChats(true, true);
                alert(t('common.success') || 'Success!');
            }
        } catch (error) {
            console.error('[SYNC] Reset names error:', error);
            alert(t('common.error') || 'Error occurred');
        } finally {
            setSyncing(false);
        }
    };

    const handleFullSync = async () => {
        if (!selectedNumber?.instance_id || !selectedNumber.api_token) {
            console.warn('[SYNC] Missing number Green API configuration');
            await logger.warn('Sync attempted without Green API credentials', null, selectedNumber?.id);
            return;
        }

        setSyncing(true);
        try {
            // Clear cache to force fresh sync
            chatsCacheRef.current.data = null;
            chatsCacheRef.current.timestamp = 0;
            historyCacheRef.current.clear();

            // Clear localStorage cache for current chat if selected
            if (selectedChat && selectedNumber?.instance_id) {
                const chatId = selectedChat.chatId || selectedChat.remote_jid;
                if (chatId) {
                    clearLocalChatCache(selectedNumber.instance_id, chatId);
                }
            }

            await logger.info('Starting full sync', { instance_id: selectedNumber.instance_id }, selectedNumber.id);

            // Force refresh chats
            await fetchChats(true, true);

            // Force refresh messages if chat is selected
            if (selectedChat) {
                await fetchMessages(true);
            }

            await logger.info('Full sync completed', {}, selectedNumber.id);
        } catch (error) {
            console.error('[SYNC] Error during full sync:', error);
            await logger.error('Full sync error', { error: error.message }, selectedNumber?.id);
        } finally {
            setSyncing(false);
        }
    };

    // Helper function to load media URL from Green API or Evolution API
    const loadMediaUrl = async (messageId, chatId, messageObject = null) => {
        if (!selectedNumber?.instance_id || !messageId) {
            return null;
        }

        // Check if already loading or loaded
        if (loadingMedia[messageId] || mediaUrls[messageId]) {
            return mediaUrls[messageId] || null;
        }

        setLoadingMedia(prev => ({ ...prev, [messageId]: true }));

        try {
            // Evolution API Handling
            if (selectedNumber.provider === 'evolution-api') {
                if (!messageObject) {
                    console.warn('[MEDIA] Message object required for Evolution API media download');
                    return null;
                }

                // Use preserved raw message if available (from Supabase media_meta), otherwise use the object itself
                // We prioritize: saved raw > current raw > object
                let payload = messageObject.media_meta?.raw || messageObject._raw || messageObject;

                let result = await EvolutionApiService.downloadMedia(selectedNumber.instance_id, payload);

                // Auto-fixer: If failed (likely due to missing raw data), try to fetch fresh message
                if (!result.success && result.error?.includes('400')) {
                    console.warn('[MEDIA] Download failed, attempting lazy load recovery...', messageId);

                    // fetchMessages returns normalized list but includes _raw
                    const recovery = await EvolutionApiService.fetchMessages(
                        selectedNumber.instance_id,
                        chatId,
                        50 // Get recent context
                    );

                    if (recovery.success && recovery.data) {
                        // Find matching message - checking both green_id and id
                        const freshMsg = recovery.data.find(m =>
                            m.idMessage === messageId ||
                            m.id === messageId ||
                            m._raw?.key?.id === messageId
                        );

                        if (freshMsg && freshMsg._raw) {
                            console.log('[MEDIA] Found fresh message data, retrying download...');
                            // Retry with fresh raw data
                            result = await EvolutionApiService.downloadMedia(selectedNumber.instance_id, freshMsg._raw);

                            // Optional: Update local message state to prevent future refetches (would require setMessages update)
                        } else {
                            console.warn('[MEDIA] Recovery failed: Message not found in recent history');
                        }
                    }
                }
                if (result.success && result.base64) {
                    // Create a data URL from base64
                    // Detect mimetype if possible, otherwise default to image/jpeg or similar
                    let mimeType = 'image/jpeg';
                    if (messageObject.messageType === 'imageMessage') mimeType = 'image/jpeg';
                    else if (messageObject.messageType === 'videoMessage') mimeType = 'video/mp4';
                    else if (messageObject.messageType === 'audioMessage') mimeType = 'audio/mp4'; // opus/mp3
                    else if (messageObject.mimetype) mimeType = messageObject.mimetype;

                    const url = `data:${mimeType};base64,${result.base64}`;
                    setMediaUrls(prev => ({ ...prev, [messageId]: url }));
                    return url;
                }
            }
            // Green API Handling
            else if (selectedNumber.api_token) {
                const result = await downloadFile(
                    selectedNumber.instance_id,
                    selectedNumber.api_token,
                    chatId,
                    messageId
                );

                if (result.success && result.data?.downloadUrl) {
                    const url = result.data.downloadUrl;
                    setMediaUrls(prev => ({ ...prev, [messageId]: url }));
                    return url;
                }
            }
        } catch (error) {
            console.error('[MEDIA] Error loading media URL:', error);
        } finally {
            setLoadingMedia(prev => ({ ...prev, [messageId]: false }));
        }

        return null;
    };

    const getChatInitials = (chat) => {
        const base = (chat.name || chat.phone || chat.chatId || 'WA').toString();
        const letters = base.replace(/[^A-Za-zא-ת0-9]/g, '').slice(0, 2);
        return letters.toUpperCase() || 'WA';
    };

    // Helper to check if chat is a group
    const isGroupChat = (chat) => {
        const chatId = chat.chatId || chat.remote_jid || '';
        return chatId.endsWith('@g.us');
    };

    // Apply both search and filter
    // Debug log to check available data
    if (chats.length > 0) {
        const groupCount = chats.filter(c => isGroupChat(c)).length;
        const unreadCount = chats.filter(c => (c.unreadCount || 0) > 0).length;
        console.log('[CHATS FILTER] Total:', chats.length, 'Groups:', groupCount, 'Unread:', unreadCount, 'Filter:', chatFilter);
    }

    // Check if any advanced filters are active
    // We don't count the default "To Today" as an active filter unless they have a From date or Tags or they changed it
    const hasActiveFilters = filterDateFrom || filterTags.length > 0 || (filterDateTo !== new Date().toLocaleDateString('en-CA'));

    const filteredChats = chatsWithTags.filter((chat) => {
        // First apply text search
        const matchesSearch =
            (chat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (chat.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (chat.chatId || '').toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Apply category filter
        switch (chatFilter) {
            case 'unread':
                if ((chat.unreadCount || 0) <= 0) return false;
                break;
            case 'groups':
                if (!isGroupChat(chat)) return false;
                break;
        }

        // Apply date filters
        if (filterDateFrom || filterDateTo) {
            const chatTimestamp = chat.lastMessageTime || chat.timestamp || 0;
            // Robust date handling: support seconds, milliseconds, or ISO strings
            let chatDate = null;
            if (chatTimestamp) {
                if (typeof chatTimestamp === 'number') {
                    // Seconds vs Milliseconds detection
                    chatDate = chatTimestamp < 10000000000 ? new Date(chatTimestamp * 1000) : new Date(chatTimestamp);
                } else {
                    chatDate = new Date(chatTimestamp);
                }
            }

            if (chatDate && !isNaN(chatDate.getTime())) {
                if (filterDateFrom) {
                    const fromDate = new Date(filterDateFrom);
                    fromDate.setHours(0, 0, 0, 0);
                    if (chatDate < fromDate) return false;
                }
                if (filterDateTo) {
                    const toDate = new Date(filterDateTo);
                    toDate.setHours(23, 59, 59, 999);
                    if (chatDate > toDate) return false;
                }
            } else {
                // If we have an active Date filter and chat has no valid date, hide it
                // Except if the filter is just the default "To Today"
                if (filterDateFrom || (filterDateTo && filterDateTo !== new Date().toLocaleDateString('en-CA'))) {
                    return false;
                }
            }
        }

        // Apply tag filters
        if (filterTags.length > 0) {
            const chatTagIds = chat.tags || [];
            const hasMatchingTag = filterTags.some(tagId => chatTagIds.includes(tagId));
            if (!hasMatchingTag) return false;
        }

        return true;
    });

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-background dark:bg-[#0a1014] text-sm">
            {/* Left Sidebar - Numbers & Chats (WhatsApp-style) */}
            <div className={cn(
                "w-full md:w-96 border-r border-border dark:border-[#202c33] flex-col bg-card dark:bg-[#111b21] text-foreground dark:text-white",
                selectedChat ? "hidden md:flex" : "flex"
            )}>
                {/* Number Selector / Top bar */}
                <div className="p-3 border-b border-border dark:border-[#202c33] bg-secondary dark:bg-[#202c33]">
                    <div className="flex items-center gap-2 mb-3">
                        <select
                            value={selectedNumber?.id || ''}
                            onChange={(e) => {
                                const num = numbers.find((n) => n.id === e.target.value);
                                setSelectedNumber(num || null);
                                setSelectedChat(null);
                                // Update URL when number changes
                                if (num) {
                                    navigate(`/app/chats/${num.id}`, { replace: true });
                                } else {
                                    navigate('/app/chats', { replace: true });
                                }
                            }}
                            className="flex-1 px-3 py-2 rounded-md border-0 bg-secondary dark:bg-[#202c33] text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#8696a0] outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">{t('chats_page.select_number')}</option>
                            {numbers.map((num) => (
                                <option key={num.id} value={num.id}>
                                    {num.phone_number || num.instance_id || num.id.slice(0, 8)}
                                </option>
                            ))}
                        </select>
                        <Button
                            size="icon"
                            onClick={() => navigate('/app/numbers')}
                            title={t('add_number')}
                            className="bg-primary hover:bg-primary/90 dark:bg-[#00a884] dark:hover:bg-[#00a884]/90 text-primary-foreground dark:text-white border-0"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            onClick={handleFullSync}
                            disabled={syncing || !selectedNumber}
                            title={t('common.sync') || 'Sync'}
                            className="ml-1 bg-primary hover:bg-primary/90 dark:bg-[#00a884] dark:hover:bg-[#00a884]/90 text-primary-foreground dark:text-white border-0"
                        >
                            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setShowTagsManager(true)}
                            title={t('tags.manage_tags') || 'Manage Tags'}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            disabled={!selectedNumber}
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-[#8696a0]" />
                        <Input
                            placeholder={t('chats_page.search_chats')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 border-0 bg-secondary dark:bg-[#202c33] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#8696a0] focus-visible:ring-2 focus-visible:ring-primary"
                        />
                    </div>
                    {/* Filter Tabs */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                        <button
                            onClick={() => setChatFilter('all')}
                            className={cn(
                                "px-2 py-1 text-[10px] sm:px-3 sm:text-xs rounded-full transition-colors",
                                chatFilter === 'all'
                                    ? "bg-primary dark:bg-[#00a884] text-white"
                                    : "bg-muted dark:bg-[#202c33] text-foreground dark:text-[#8696a0] hover:bg-muted/80"
                            )}
                        >
                            {t('chats_page.filter_all') || 'הכל'}
                        </button>
                        <button
                            onClick={() => setChatFilter('unread')}
                            className={cn(
                                "px-2 py-1 text-[10px] sm:px-3 sm:text-xs rounded-full transition-colors",
                                chatFilter === 'unread'
                                    ? "bg-primary dark:bg-[#00a884] text-white"
                                    : "bg-muted dark:bg-[#202c33] text-foreground dark:text-[#8696a0] hover:bg-muted/80"
                            )}
                        >
                            {t('chats_page.filter_unread') || 'לא נקראו'}
                        </button>
                        <button
                            onClick={() => setChatFilter('groups')}
                            className={cn(
                                "px-2 py-1 text-[10px] sm:px-3 sm:text-xs rounded-full transition-colors",
                                chatFilter === 'groups'
                                    ? "bg-primary dark:bg-[#00a884] text-white"
                                    : "bg-muted dark:bg-[#202c33] text-foreground dark:text-[#8696a0] hover:bg-muted/80"
                            )}
                        >
                            {t('chats_page.filter_groups') || 'קבוצות'}
                        </button>

                        {/* Advanced Filters Button */}
                        <Popover open={showFilters} onOpenChange={setShowFilters}>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "px-2 py-1 text-[10px] sm:px-3 sm:text-xs rounded-full transition-colors flex items-center gap-1",
                                        hasActiveFilters
                                            ? "bg-primary dark:bg-[#00a884] text-white"
                                            : "bg-muted dark:bg-[#202c33] text-foreground dark:text-[#8696a0] hover:bg-muted/80"
                                    )}
                                >
                                    <Filter className="h-3 w-3" />
                                    {t('chats_page.filters') || 'פילטרים'}
                                    {hasActiveFilters && (
                                        <span className="ml-1 bg-white/20 rounded-full px-1.5 text-[10px]">
                                            {(filterDateFrom ? 1 : 0) + (filterDateTo && filterDateTo !== new Date().toLocaleDateString('en-CA') ? 1 : 0) + filterTags.length}
                                        </span>
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4 bg-card dark:bg-[#202c33] border-border dark:border-[#3b4a54]" align="start">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm">{t('chats_page.advanced_filters') || 'פילטרים מתקדמים'}</h4>
                                        {hasActiveFilters && (
                                            <button
                                                onClick={() => {
                                                    setFilterDateFrom('');
                                                    setFilterDateTo(new Date().toLocaleDateString('en-CA'));
                                                    setFilterTags([]);
                                                }}
                                                className="text-xs text-primary dark:text-[#00a884] hover:underline"
                                            >
                                                {t('chats_page.clear_filters') || 'נקה הכל'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Date Filters */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {t('chats_page.last_message_date') || 'תאריך הודעה אחרונה'}
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-[10px] text-muted-foreground">{t('chats_page.from_date') || 'מתאריך'}</label>
                                                <Input
                                                    type="date"
                                                    value={filterDateFrom}
                                                    onChange={(e) => setFilterDateFrom(e.target.value)}
                                                    className="h-8 text-xs bg-background dark:bg-[#111b21] border-border"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] text-muted-foreground">{t('chats_page.to_date') || 'עד תאריך'}</label>
                                                <Input
                                                    type="date"
                                                    value={filterDateTo}
                                                    onChange={(e) => setFilterDateTo(e.target.value)}
                                                    className="h-8 text-xs bg-background dark:bg-[#111b21] border-border"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tag Filters */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            {t('chats_page.filter_by_tag') || 'סינון לפי תג'}
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {tags.length === 0 ? (
                                                <span className="text-xs text-muted-foreground italic">
                                                    {t('tags.no_tags_yet') || 'אין תגים עדיין'}
                                                </span>
                                            ) : (
                                                tags.map(tag => (
                                                    <button
                                                        key={tag.id}
                                                        onClick={() => {
                                                            setFilterTags(prev =>
                                                                prev.includes(tag.id)
                                                                    ? prev.filter(id => id !== tag.id)
                                                                    : [...prev, tag.id]
                                                            );
                                                        }}
                                                        className={cn(
                                                            "px-2 py-0.5 text-xs rounded-full transition-all",
                                                            filterTags.includes(tag.id)
                                                                ? "ring-2 ring-white/50 shadow-md"
                                                                : "opacity-70 hover:opacity-100"
                                                        )}
                                                        style={{
                                                            backgroundColor: tag.color,
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {tag.name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Chats List */}
                <div className="flex-1 overflow-y-auto bg-card dark:bg-[#111b21]">
                    {!selectedNumber ? (
                        <div className="p-8 text-center text-muted-foreground dark:text-[#8696a0]">
                            {t('chats_page.no_number_selected')}
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground dark:text-[#8696a0]">
                            {t('chats_page.no_chats')}
                        </div>
                    ) : (
                        filteredChats.map((chat) => {
                            const chatId = chat.chatId || chat.remote_jid || '';
                            const isSelected = selectedChat?.chatId === chatId || selectedChat?.phone === chat.phone;

                            return (
                                <div
                                    key={chatId}
                                    onClick={() => {
                                        if (chat.chatId === selectedChat?.chatId) return;

                                        // Instant UI feedback: Clear current messages while loading new one
                                        setMessages([]);
                                        setSelectedChat(chat);
                                        // Update URL when chat is clicked - use only the number part (without any @ suffix)
                                        if (selectedNumber) {
                                            const numberOnly = removeJidSuffix(chatId);
                                            // Navigation will trigger the remoteJid effect, but we set it here for instant feedback
                                            navigate(`/app/chats/${selectedNumber.id}/${encodeURIComponent(numberOnly)}`, { replace: true });
                                        }
                                    }}
                                    className={cn(
                                        "px-3 py-2 sm:px-4 sm:py-3 border-b border-border dark:border-[#202c33] cursor-pointer hover:bg-secondary dark:hover:bg-[#202c33] transition-colors",
                                        isSelected && "bg-secondary dark:bg-[#202c33]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {chatAvatars.has(chatId) ? (
                                            <img
                                                src={chatAvatars.get(chatId)}
                                                alt={chat.name || chat.phone}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                                                onError={(e) => {
                                                    // Fallback to initials if image fails
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-[#00a884] dark:to-[#005c4b] flex items-center justify-center text-sm font-semibold text-primary-foreground dark:text-white ${chatAvatars.has(chatId) ? 'hidden' : ''}`}
                                        >
                                            {getChatInitials(chat)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate text-foreground dark:text-[#e9edef]">{chat.name || chat.phone || chatId}</p>
                                            <p className="text-sm text-muted-foreground dark:text-[#8696a0] truncate">
                                                {chat.lastMessage || t('chats_page.no_messages') || ''}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {chat.lastMessageTime && (
                                                <span className={cn(
                                                    "text-xs whitespace-nowrap",
                                                    (chat.unreadCount || 0) > 0
                                                        ? "text-primary dark:text-[#00a884]"
                                                        : "text-muted-foreground dark:text-[#8696a0]"
                                                )}>
                                                    {new Date(chat.lastMessageTime * 1000).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            )}
                                            {/* Unread badge */}
                                            {(chat.unreadCount || 0) > 0 && (
                                                <span className="min-w-[20px] h-5 flex items-center justify-center bg-primary dark:bg-[#00a884] text-white text-xs font-medium rounded-full px-1.5">
                                                    {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1 pl-[3.75rem]">
                                        {chatTags[chatId]?.map(tagId => {
                                            const tag = tags.find(t => t.id === tagId);
                                            if (!tag) return null;
                                            return (
                                                <span
                                                    key={tag.id}
                                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                                                    style={{ backgroundColor: tag.color }}
                                                >
                                                    {tag.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Side - Chat Messages */}
            <div className={cn(
                "flex-1 flex-col bg-background dark:bg-[#0a1014]",
                selectedChat ? "flex" : "hidden md:flex"
            )}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-3 border-b border-border dark:border-[#202c33] bg-secondary dark:bg-[#202c33] flex items-center gap-3 text-foreground dark:text-[#e9edef]">
                            {/* Back Button for mobile */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden -ml-2 text-muted-foreground"
                                onClick={() => setSelectedChat(null)}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>


                            {/* Combined Clickable Area for Contact Card */}
                            <div
                                className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setShowContactCard(true)}
                            >
                                {/* Avatar or Phone Icon */}
                                {chatAvatars.has(selectedChat.chatId || selectedChat.remote_jid) ? (
                                    <img
                                        src={chatAvatars.get(selectedChat.chatId || selectedChat.remote_jid)}
                                        alt={selectedChat.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-[#00a884]/20 flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-primary dark:text-[#00a884]" />
                                    </div>
                                )}

                                <div className="flex flex-col">
                                    <span className="font-semibold">
                                        {selectedChat.name || selectedChat.phone || selectedChat.chatId}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground dark:text-[#8696a0]">{t('chats_page.online_status') || ''}</span>
                                        {isActiveChatSyncing && (
                                            <span className="text-[10px] text-green-500 animate-pulse flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 font-bold">
                                                <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                                                {t('sync.updating_chat') || 'מעדכן שיחה...'}
                                            </span>
                                        )}
                                        {(syncStatus[selectedNumber?.id]?.inProgress || isWarmUpSyncing) && !isActiveChatSyncing && (
                                            <span className="text-[9px] text-primary animate-pulse flex items-center gap-1 bg-primary/5 px-1.5 rounded">
                                                <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                {isWarmUpSyncing ? "Synchronizing Global History..." : t('sync.syncing')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="ml-auto">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-blue-500"
                                    disabled={isSnapshotting}
                                    onClick={async () => {
                                        if (selectedNumber) {
                                            setIsSnapshotting(true);
                                            try {
                                                await triggerStateSnapshot(selectedNumber.instance_id);
                                            } finally {
                                                setIsSnapshotting(false);
                                            }
                                        }
                                    }}
                                >
                                    {isSnapshotting ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <UploadCloud className="h-4 w-4" />
                                    )}
                                    <span className="hidden sm:inline">
                                        {isSnapshotting ? 'Saving...' : 'Backup to Cloud'}
                                    </span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setCurrentChatTagsId(selectedChat.chatId || selectedChat.remote_jid)}
                                >
                                    <Tag className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t('tags.labels') || 'Labels'}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={clearHistory}
                                    title={t('chats_page.clear_history') || 'Clear History'}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t('chats_page.clear_history') || 'Reset'}</span>
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 relative overflow-hidden flex flex-col">
                            {/* Background Image Layer */}
                            <div
                                className="absolute inset-x-0 inset-y-0 z-0 opacity-40 pointer-events-none transition-transform duration-300"
                                style={{
                                    backgroundImage: 'url(/bgImage.jpg)',
                                    backgroundSize: '30%', // Adjusted for a nice centered look avoiding full cover
                                    backgroundPosition: 'center center',
                                    backgroundRepeat: 'no-repeat',
                                    transform: isRTL ? 'rotate(180deg)' : 'none'
                                }}
                            />

                            <div
                                className="flex-1 overflow-y-auto px-4 py-3 space-y-2 relative z-10"
                            >
                                <div className="relative z-10 space-y-2">
                                    {/* Load More Messages Button */}
                                    {messages.length > 0 && (
                                        <div className="flex justify-center py-2">
                                            <Button
                                                onClick={loadMoreMessages}
                                                disabled={!hasMoreMessages || loadingMoreMessages}
                                                variant="outline"
                                                className={cn(
                                                    "text-sm",
                                                    !hasMoreMessages && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                {loadingMoreMessages
                                                    ? (t('common.loading') || 'טוען...')
                                                    : hasMoreMessages
                                                        ? (t('chats_page.load_more_messages') || 'טען עוד הודעות')
                                                        : (t('chats_page.no_more_messages') || 'אין עוד הודעות')
                                                }
                                            </Button>
                                        </div>
                                    )}

                                    {messages.length === 0 && !messagesLoading ? (
                                        <div className="text-center text-muted-foreground dark:text-[#8696a0] py-8">
                                            {t('common.no_data')}
                                        </div>
                                    ) : (
                                        messages.map((message, idx) => {
                                            // Parse message like extension does
                                            const item = message;
                                            const typeMessage = item.typeMessage || item.media_meta?.typeMessage || '';
                                            const isFromMe = item.type === 'outgoing' || item.fromMe === true || item.is_from_me === true;

                                            // Extract text from multiple possible locations (like extension)
                                            // IMPORTANT: Check textMessage FIRST, then extendedTextMessage.text
                                            let text = item.textMessage ||
                                                (item.extendedTextMessage && item.extendedTextMessage.text) ||
                                                (item.extendedTextMessageData && item.extendedTextMessageData.text) ||
                                                (item.conversation) ||
                                                item.content ||
                                                '';

                                            // Debug log for first few messages
                                            if (idx < 3) {
                                                console.log(`[MESSAGE ${idx}]`, {
                                                    idMessage: item.idMessage,
                                                    typeMessage: typeMessage,
                                                    type: item.type,
                                                    textMessage: item.textMessage,
                                                    extendedTextMessage: item.extendedTextMessage,
                                                    conversation: item.conversation,
                                                    extractedText: text,
                                                    textLength: text ? text.length : 0,
                                                    hasText: !!text
                                                });
                                            }

                                            return (
                                                <div
                                                    key={item.idMessage || item.id || `msg-${idx}`}
                                                    className={cn(
                                                        "flex",
                                                        isFromMe ? "justify-end" : "justify-start"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[70%] rounded-lg px-3 py-2 shadow-sm text-[13px] leading-snug",
                                                            isFromMe
                                                                ? "bg-primary/90 dark:bg-[#005c4b] text-primary-foreground dark:text-[#e9edef] rounded-br-none"
                                                                : "bg-secondary dark:bg-[#202c33] text-foreground dark:text-[#e9edef] rounded-bl-none"
                                                        )}
                                                    >
                                                        {/* Image Message */}
                                                        {typeMessage === 'imageMessage' && (
                                                            <div className="space-y-2">
                                                                {(() => {
                                                                    const messageId = item.green_id || item.idMessage || item.id;
                                                                    const chatId = selectedChat?.chatId || selectedChat?.remote_jid;
                                                                    // Check for cached URL first, then inline URLs
                                                                    const cachedUrl = mediaUrls[messageId];
                                                                    const inlineUrl = item.urlFile || item.downloadUrl || item.mediaUrl ||
                                                                        item.imageMessage?.urlFile || item.imageMessage?.downloadUrl || item.imageMessage?.url;
                                                                    const fullImageUrl = cachedUrl || inlineUrl;

                                                                    // Get thumbnail or fallback to full image
                                                                    const thumbnailSrc = item.jpegThumbnail
                                                                        ? `data:image/jpeg;base64,${item.jpegThumbnail}`
                                                                        : fullImageUrl;

                                                                    const isLoading = loadingMedia[messageId];

                                                                    return (
                                                                        <div className="relative">
                                                                            {thumbnailSrc ? (
                                                                                <img
                                                                                    src={thumbnailSrc}
                                                                                    alt="image"
                                                                                    className="max-w-[280px] max-h-[280px] rounded-lg block mb-1 cursor-pointer hover:opacity-90 transition-opacity"
                                                                                    onClick={async () => {
                                                                                        let imageUrl = fullImageUrl;
                                                                                        if (!imageUrl && messageId && chatId) {
                                                                                            imageUrl = await loadMediaUrl(messageId, chatId, item);
                                                                                        }
                                                                                        if (imageUrl) {
                                                                                            setLightboxImage({
                                                                                                src: imageUrl,
                                                                                                caption: item.caption || text
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                                                />
                                                                            ) : (
                                                                                <div
                                                                                    className="w-[200px] h-[150px] bg-muted dark:bg-[#182229] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer border border-dashed border-muted-foreground/30"
                                                                                    onClick={async () => {
                                                                                        if (messageId && chatId) {
                                                                                            const url = await loadMediaUrl(messageId, chatId, item);
                                                                                            if (url) {
                                                                                                setLightboxImage({ src: url, caption: item.caption || text });
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <span className="text-4xl">📷</span>
                                                                                    <span className="text-[10px] bg-primary/20 p-1 rounded">
                                                                                        {isLoading ? t('common.loading') || 'טוען...' : t('chats_page.click_to_load') || 'לחץ לטעינת תמונה'}
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {!fullImageUrl && thumbnailSrc && (
                                                                                <div
                                                                                    className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg cursor-pointer"
                                                                                    onClick={async () => {
                                                                                        if (messageId && chatId) {
                                                                                            const url = await loadMediaUrl(messageId, chatId, item);
                                                                                            if (url) {
                                                                                                setLightboxImage({ src: url, caption: item.caption || text });
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    {isLoading ? (
                                                                                        <div className="text-white text-sm">טוען...</div>
                                                                                    ) : (
                                                                                        <div className="text-white text-sm bg-primary/80 dark:bg-[#00a884]/80 px-3 py-1 rounded-full">
                                                                                            לחץ להגדלה
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })()}
                                                                {(item.caption || text) && (
                                                                    <div className="text-sm">{item.caption || text}</div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Video Message */}
                                                        {typeMessage === 'videoMessage' && (
                                                            <div className="space-y-2">
                                                                {item.jpegThumbnail && (
                                                                    <img
                                                                        src={`data:image/jpeg;base64,${item.jpegThumbnail}`}
                                                                        alt="video"
                                                                        className="max-w-[220px] max-h-[220px] rounded-lg block mb-1"
                                                                    />
                                                                )}
                                                                <div>🎥 {t('chats_page.video_message') || 'Video Message'}</div>
                                                                {(item.downloadUrl || item.url) && (
                                                                    <a
                                                                        href={item.downloadUrl || item.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                                    >
                                                                        🎥 {t('chats_page.open_video') || 'Open Video'}
                                                                    </a>
                                                                )}
                                                                {text && (
                                                                    <div className="text-sm mt-2">{text}</div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Audio/Voice Message */}
                                                        {(typeMessage === 'audioMessage' || typeMessage === 'ptt') && (
                                                            <div className="space-y-2">
                                                                {(() => {
                                                                    const messageId = item.green_id || item.idMessage || item.id;
                                                                    const chatId = selectedChat?.chatId || selectedChat?.remote_jid;
                                                                    // Check for cached URL first, then inline URLs
                                                                    const cachedUrl = mediaUrls[messageId];
                                                                    const inlineUrl = item.downloadUrl || item.url || item.urlFile || item.mediaUrl ||
                                                                        (item.audioMessage && (item.audioMessage.downloadUrl || item.audioMessage.url || item.audioMessage.urlFile));
                                                                    const audioUrl = cachedUrl || inlineUrl || null;
                                                                    const mimeType = item.mimeType || item.audioMessage?.mimeType || 'audio/ogg; codecs=opus';
                                                                    const duration = item.seconds || item.duration || item.length ||
                                                                        (item.audioMessage && (item.audioMessage.seconds || item.audioMessage.duration)) || 0;
                                                                    const isLoading = loadingMedia[messageId];

                                                                    return (
                                                                        <div className="flex items-center gap-3 min-w-[200px]">
                                                                            <span className="text-lg flex-shrink-0">{typeMessage === 'ptt' ? '🎤' : '🎵'}</span>
                                                                            {audioUrl ? (
                                                                                <div className="flex-1 flex flex-col gap-1">
                                                                                    <audio
                                                                                        controls
                                                                                        preload="metadata"
                                                                                        className="w-full h-10 rounded-lg"
                                                                                        style={{
                                                                                            minWidth: '180px',
                                                                                            maxWidth: '280px'
                                                                                        }}
                                                                                    >
                                                                                        <source src={audioUrl} type={mimeType} />
                                                                                        <source src={audioUrl} type="audio/mpeg" />
                                                                                        <source src={audioUrl} type="audio/ogg" />
                                                                                        Your browser does not support audio playback.
                                                                                    </audio>
                                                                                    {duration > 0 && (
                                                                                        <span className="text-xs text-muted-foreground dark:text-[#8696a0]">
                                                                                            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={async () => {
                                                                                        if (messageId && chatId) {
                                                                                            await loadMediaUrl(messageId, chatId, item);
                                                                                        }
                                                                                    }}
                                                                                    disabled={isLoading}
                                                                                    className="px-3 py-2 text-xs bg-primary/80 dark:bg-[#00a884]/80 text-white rounded-full hover:bg-primary dark:hover:bg-[#00a884] transition-colors disabled:opacity-50"
                                                                                >
                                                                                    {isLoading ? 'טוען...' : 'לחץ להשמעה'}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })()}
                                                                {text && (
                                                                    <div className="text-sm mt-2">{text}</div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Document Message */}
                                                        {typeMessage === 'documentMessage' && (
                                                            <div className="space-y-2">
                                                                <div>📄 {t('chats_page.document_message') || 'Document Message'}</div>
                                                                {item.fileName && (
                                                                    <div className="font-semibold text-sm">{item.fileName}</div>
                                                                )}
                                                                {(() => {
                                                                    const messageId = item.green_id || item.idMessage || item.id;
                                                                    const chatId = selectedChat?.chatId || selectedChat?.remote_jid;
                                                                    const cachedUrl = mediaUrls[messageId];
                                                                    const docUrl = cachedUrl || item.downloadUrl || item.url || item.urlFile ||
                                                                        item.documentMessage?.downloadUrl || item.documentMessage?.url || item.documentMessage?.urlFile;
                                                                    const isLoading = loadingMedia[messageId];

                                                                    if (docUrl) {
                                                                        return (
                                                                            <a
                                                                                href={docUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded bg-primary/10 dark:bg-[#53bdeb]/10 text-xs font-medium text-primary dark:text-[#53bdeb] hover:bg-primary/20 transition-colors"
                                                                            >
                                                                                📄 {t('chats_page.download_document') || 'Download Document'}
                                                                            </a>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <button
                                                                            onClick={() => messageId && chatId && loadMediaUrl(messageId, chatId, item)}
                                                                            disabled={isLoading}
                                                                            className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded bg-primary/10 dark:bg-[#00a884]/10 text-xs font-medium text-primary dark:text-[#00a884] hover:bg-primary/20 transition-colors disabled:opacity-50"
                                                                        >
                                                                            {isLoading ? (
                                                                                <>⌛ {t('common.loading') || 'טוען...'}</>
                                                                            ) : (
                                                                                <>📄 {t('chats_page.click_to_view_doc') || 'לחץ להצגת מסמך'}</>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })()}
                                                                {text && (
                                                                    <div className="text-sm mt-2">{text}</div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Contact Message */}
                                                        {(typeMessage === 'contactMessage' || typeMessage === 'contactsArrayMessage' || item.media_meta?.type === 'contact') && (
                                                            <div className="space-y-2 py-1 min-w-[200px]">
                                                                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-md border border-white/10">
                                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                                                                        👤
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="font-semibold truncate">
                                                                            {item.media_meta?.displayName || item.contactMessage?.displayName || item.displayName || 'Contact'}
                                                                        </div>
                                                                        <div className="text-[10px] text-muted-foreground uppercase">
                                                                            {t('chats_page.contact_card') || 'Contact Card'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {item.media_meta?.vcard && (
                                                                    <div className="text-[11px] opacity-70 italic truncate px-1">
                                                                        VCF Data available
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Sticker Message */}
                                                        {typeMessage === 'stickerMessage' && (
                                                            <div className="space-y-2">
                                                                <div>🩹 {t('chats_page.sticker_message') || 'Sticker'}</div>
                                                                {item.downloadUrl && (
                                                                    <a
                                                                        href={item.downloadUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                                    >
                                                                        {t('chats_page.view_sticker') || 'View Sticker'}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Location Message */}
                                                        {typeMessage === 'locationMessage' && (
                                                            <div className="space-y-2">
                                                                <div>📍 {t('chats_page.location_message') || 'Location'}</div>
                                                                {item.latitude && item.longitude && (
                                                                    <a
                                                                        href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                                    >
                                                                        {t('chats_page.view_location') || 'View Location'}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Quoted Message */}
                                                        {typeMessage === 'quotedMessage' && (
                                                            <div className="space-y-2">
                                                                {item.quotedMessage && (
                                                                    <div className="text-xs opacity-75 border-l-2 pl-2 mb-2">
                                                                        {item.quotedMessage.textMessage || item.quotedMessage.text || '💬 הודעה מצוטטת'}
                                                                    </div>
                                                                )}
                                                                {text && (
                                                                    <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Deleted Message */}
                                                        {typeMessage === 'deletedMessage' && (
                                                            <p className="text-sm italic text-muted-foreground dark:text-[#8696a0]">
                                                                🗑️ {t('chats_page.message_deleted') || 'Message deleted'}
                                                            </p>
                                                        )}

                                                        {/* Extended Text Message OR Regular Text Message - MUST be last to catch all text messages */}
                                                        {!['imageMessage', 'videoMessage', 'audioMessage', 'ptt', 'documentMessage', 'stickerMessage', 'locationMessage', 'quotedMessage', 'deletedMessage'].includes(typeMessage) && text && (
                                                            <div>
                                                                <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
                                                            </div>
                                                        )}

                                                        {/* Fallback - if no text found but message exists - show what we can */}
                                                        {!text && !['imageMessage', 'videoMessage', 'audioMessage', 'ptt', 'documentMessage', 'stickerMessage', 'locationMessage', 'quotedMessage', 'deletedMessage'].includes(typeMessage) && typeMessage && (
                                                            <p className="text-sm text-muted-foreground dark:text-[#8696a0]">
                                                                📎 {typeMessage} {t('chats_page.message_not_supported') || '(not fully supported)'}
                                                            </p>
                                                        )}

                                                        {/* Fallback - if no typeMessage and no text, show empty message indicator */}
                                                        {!typeMessage && !text && (
                                                            <p className="text-sm text-muted-foreground dark:text-[#8696a0]">
                                                                {t('chats_page.empty_message') || 'Empty message'}
                                                            </p>
                                                        )}

                                                        {/* Timestamp */}
                                                        <p className="text-[11px] text-muted-foreground dark:text-[#8696a0] mt-1 text-right">
                                                            {item.timestamp ? new Date(typeof item.timestamp === 'number' ? (item.timestamp < 2e12 ? item.timestamp * 1000 : item.timestamp) : item.timestamp).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    {messagesLoading && messages.length === 0 && (
                                        <div className="text-center text-muted-foreground dark:text-[#8696a0] py-4">
                                            {t('common.loading')}
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="px-4 py-3 border-t border-border dark:border-[#202c33] bg-secondary dark:bg-[#202c33]">
                            <div className="flex gap-2">
                                <Input
                                    placeholder={t('chats_page.type_message')}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    className="flex-1 border-0 bg-secondary dark:bg-[#202c33] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#8696a0] focus-visible:ring-2 focus-visible:ring-primary"
                                />
                                <Button
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim()}
                                    className="bg-primary hover:bg-primary/90 dark:bg-[#00a884] dark:hover:bg-[#00a884]/90 text-primary-foreground dark:text-white border-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-background dark:bg-[#0a1014]">
                        <div className="text-center text-muted-foreground dark:text-[#8696a0]">
                            <Phone className="h-16 w-16 mx-auto mb-4 opacity-40" />
                            <p className="text-lg text-foreground dark:text-[#e9edef]">{t('chats_page.select_number')}</p>
                            <p className="text-sm mt-2">{t('chats_page.no_chats')}</p>
                        </div>
                    </div>
                )}
            </div>

            <TagsManager
                organizationId={selectedNumber?.organization_id}
                userId={user?.id}
                open={showTagsManager}
                onOpenChange={setShowTagsManager}
                chats={chatsWithTags}
                onNavigateChat={(chatId) => {
                    // Find the chat and select it
                    const chat = chats.find(c => (c.chatId || c.remote_jid) === chatId);
                    if (chat) {
                        setSelectedChat(chat);
                    }
                }}
            />

            <ChatTagsSelector
                open={!!currentChatTagsId}
                onOpenChange={(open) => !open && setCurrentChatTagsId(null)}
                tags={tags}
                selectedTagIds={currentChatTagsId ? (chatTags[currentChatTagsId] || []) : []}
                onAssign={(tagId) => currentChatTagsId && assignTagToChat(currentChatTagsId, tagId)}
                onRemove={(tagId) => currentChatTagsId && removeTagFromChat(currentChatTagsId, tagId)}
                onManageTags={() => {
                    setCurrentChatTagsId(null);
                    setShowTagsManager(true);
                }}
            />

            {/* Image Lightbox */}
            <ImageLightbox
                src={lightboxImage?.src}
                caption={lightboxImage?.caption}
                isOpen={!!lightboxImage}
                onClose={() => setLightboxImage(null)}
            />
            {/* Dynamic Contact Card */}
            {
                selectedChat && selectedNumber && (
                    <ContactCard
                        isOpen={showContactCard}
                        onClose={() => setShowContactCard(false)}
                        contactPhone={removeJidSuffix(selectedChat.chatId || selectedChat.remote_jid)}
                        contactName={selectedChat.name}
                        contactAvatar={chatAvatars.get(selectedChat.chatId || selectedChat.remote_jid)}
                        organizationId={selectedNumber.organization_id || organization?.id}
                    />
                )
            }
        </div >
    );
}

