import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Send, Phone, Tag, Settings, Filter, Calendar, X } from 'lucide-react';
import { useTags } from '../hooks/useTags';
import { TagsManager } from '../components/TagsManager';
import { ChatTagsSelector } from '../components/ChatTagsSelector';
import { ImageLightbox } from '../components/ImageLightbox';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
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
import { pollNewMessages } from '../services/messageSync';
import { logger } from '../lib/logger';
import {
    saveMessagesToCache,
    loadMessagesFromCache,
    mergeMessages,
    clearChatCache as clearLocalChatCache,
} from '../lib/messageLocalCache';

export default function Chats() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { numberId, remoteJid } = useParams();
    const [numbers, setNumbers] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState(null);
    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
    const [chatAvatars, setChatAvatars] = useState(new Map()); // Map<chatId, avatarUrl>
    const [chatFilter, setChatFilter] = useState('all'); // 'all' | 'unread' | 'groups'

    // Advanced Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [filterTags, setFilterTags] = useState([]); // array of tag IDs


    // Tags Integration
    const { tags, chatTags, assignTagToChat, removeTagFromChat } = useTags(selectedNumber?.organization_id, selectedNumber?.instance_id, user?.id);
    const [showTagsManager, setShowTagsManager] = useState(false);
    const [currentChatTagsId, setCurrentChatTagsId] = useState(null); // chatId for selector dialog

    // Image Lightbox state
    const [lightboxImage, setLightboxImage] = useState(null);

    // Media URLs cache - stores fetched downloadUrls by message ID
    const [mediaUrls, setMediaUrls] = useState({});
    const [loadingMedia, setLoadingMedia] = useState({});

    // Cache like extension
    const chatsCacheRef = useRef({ data: null, timestamp: 0, ttl: 30000 }); // 30 seconds
    const historyCacheRef = useRef(new Map()); // Map<chatId, { messages, timestamp }>

    // Merge chatTags into chats for TagsManager/TagsViewModal
    const chatsWithTags = useMemo(() => {
        return chats.map(chat => {
            const chatId = chat.chatId || chat.remote_jid || '';
            return {
                ...chat,
                id: chatId,
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
            }
        }
    }, [numberId, numbers]);

    useEffect(() => {
        if (selectedNumber) {
            fetchChats();
        }
    }, [selectedNumber]);

    // Load chat from URL params
    useEffect(() => {
        if (remoteJid && chats.length > 0) {
            // Decode the remoteJid if it was encoded
            const decodedRemoteJid = decodeURIComponent(remoteJid);
            // Find chat by comparing the number part (without @ suffix) or chatId
            const chat = chats.find(c => {
                const chatNumberOnly = removeJidSuffix(c.chatId || c.remote_jid || '');
                return chatNumberOnly === decodedRemoteJid || c.chatId === decodedRemoteJid || c.phone === decodedRemoteJid;
            });
            if (chat && chat.chatId !== selectedChat?.chatId) {
                setSelectedChat(chat);
            }
        }
    }, [remoteJid, chats]);

    useEffect(() => {
        if (selectedChat) {
            // Reset pagination state
            setHasMoreMessages(true);
            setOldestMessageTimestamp(null);
            fetchMessages();
        }
    }, [selectedChat]);

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

    // Load avatars for all chats when chats are loaded
    useEffect(() => {
        if (chats.length > 0 && selectedNumber?.instance_id && selectedNumber?.api_token) {
            chats.forEach(chat => {
                const chatId = chat.chatId || chat.remote_jid;
                if (chatId && !chatAvatars.has(chatId)) {
                    // Load avatar asynchronously
                    getAvatar(selectedNumber.instance_id, selectedNumber.api_token, chatId)
                        .then(result => {
                            if (result.success && result.data?.urlAvatar) {
                                setChatAvatars(prev => new Map(prev).set(chatId, result.data.urlAvatar));
                            }
                        })
                        .catch(error => {
                            console.error('[AVATAR] Error loading avatar for', chatId, error);
                        });
                }
            });
        }
    }, [chats, selectedNumber]);

    // Load avatar for selected chat after messages are loaded
    useEffect(() => {
        if (selectedChat && selectedNumber && messages.length > 0) {
            const chatId = selectedChat.chatId || selectedChat.remote_jid;
            if (chatId) {
                loadChatAvatar(chatId);
            }
        }
    }, [messages.length, selectedChat, selectedNumber]);

    // Auto-scroll to bottom when messages change
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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

    const fetchChats = async (forceRefresh = false) => {
        if (!selectedNumber) return [];

        const acc = selectedNumber;
        if (!acc.instance_id || !acc.api_token) {
            console.warn('[CHATS] Missing instance_id or api_token');
            return [];
        }

        // Check cache first (like extension)
        if (!forceRefresh && chatsCacheRef.current.data && (Date.now() - chatsCacheRef.current.timestamp < chatsCacheRef.current.ttl)) {
            console.log('[CHATS] Using cached chats list');
            setChats(chatsCacheRef.current.data);
            return chatsCacheRef.current.data;
        }

        try {
            // Fetch last incoming messages (last 24 hours = 1440 minutes)
            const incomingResult = await getLastIncomingMessages(acc.instance_id, acc.api_token, 1440);
            if (!incomingResult.success) {
                console.error('[CHATS] Failed to fetch incoming messages:', incomingResult.error);
                return [];
            }

            // Fetch last outgoing messages
            const outgoingResult = await getLastOutgoingMessages(acc.instance_id, acc.api_token);
            if (!outgoingResult.success) {
                console.error('[CHATS] Failed to fetch outgoing messages:', outgoingResult.error);
                return [];
            }

            const incomingData = incomingResult.data;
            const outgoingData = outgoingResult.data;

            // Parse responses - Green API returns { data: [...] } or direct array
            let incomingMessages = [];
            let outgoingMessages = [];

            if (Array.isArray(incomingData)) {
                incomingMessages = incomingData;
            } else if (incomingData?.data && Array.isArray(incomingData.data)) {
                incomingMessages = incomingData.data;
            } else if (incomingData?.messages && Array.isArray(incomingData.messages)) {
                incomingMessages = incomingData.messages;
            }

            if (Array.isArray(outgoingData)) {
                outgoingMessages = outgoingData;
            } else if (outgoingData?.data && Array.isArray(outgoingData.data)) {
                outgoingMessages = outgoingData.data;
            } else if (outgoingData?.messages && Array.isArray(outgoingData.messages)) {
                outgoingMessages = outgoingData.messages;
            }

            // Combine both arrays
            const allMessages = [...incomingMessages, ...outgoingMessages];
            console.log('[CHATS] Total messages:', allMessages.length);

            if (allMessages.length === 0) {
                setChats([]);
                chatsCacheRef.current.data = [];
                chatsCacheRef.current.timestamp = Date.now();
                return [];
            }

            // Group messages by chatId and get last message for each chat
            const chatsMap = new Map();
            let messagesWithoutChatId = 0;

            allMessages.forEach((msg, idx) => {
                const chatId = msg.chatId;
                if (!chatId) {
                    messagesWithoutChatId++;
                    if (idx < 3) console.log('[CHATS] Message without chatId:', { type: msg.type, typeMessage: msg.typeMessage, id: msg.idMessage });
                    return;
                }

                // Extract phone number from chatId (remove @c.us, @g.us, etc.)
                const phone = removeJidSuffix(chatId);

                // Get message text
                let text = '';
                if (msg.textMessage) {
                    text = msg.textMessage;
                } else if (msg.extendedTextMessage?.text) {
                    text = msg.extendedTextMessage.text;
                } else if (msg.typeMessage === 'audioMessage') {
                    text = '🎵 הודעת קול';
                } else if (msg.typeMessage === 'imageMessage') {
                    text = '📷 תמונה';
                } else if (msg.typeMessage === 'videoMessage') {
                    text = '🎥 וידאו';
                } else if (msg.typeMessage === 'documentMessage') {
                    text = '📄 מסמך';
                } else if (msg.typeMessage === 'quotedMessage') {
                    text = msg.extendedTextMessage?.text || '💬 הודעה מצוטטת';
                } else if (msg.typeMessage === 'deletedMessage') {
                    text = '🗑️ הודעה נמחקה';
                } else {
                    text = '📎 הודעה';
                }

                // Get sender name if available (for incoming messages)
                const senderName = msg.senderName || msg.senderContactName || '';

                // Get avatar URL if available
                const avatarUrl = msg.avatar || msg.senderAvatar || msg.avatarUrl || '';

                // Check if this chat already exists or if this message is newer
                const existingChat = chatsMap.get(chatId);
                if (!existingChat || (msg.timestamp > (existingChat.timestamp || 0))) {
                    chatsMap.set(chatId, {
                        chatId: chatId,
                        phone: phone,
                        name: senderName || existingChat?.name || phone,
                        avatar: avatarUrl || existingChat?.avatar || '',
                        lastMessage: text,
                        lastMessageTime: msg.timestamp,
                        timestamp: msg.timestamp
                    });
                } else if (existingChat) {
                    // Update name/avatar if we got better info
                    if (senderName && (existingChat.name === existingChat.phone || !existingChat.name)) {
                        existingChat.name = senderName;
                    }
                    if (avatarUrl && !existingChat.avatar) {
                        existingChat.avatar = avatarUrl;
                    }
                }
            });

            if (messagesWithoutChatId > 0) {
                console.log(`[CHATS] Warning: ${messagesWithoutChatId} messages without chatId`);
            }

            // Convert map to array and sort by timestamp (newest first)
            let chats = Array.from(chatsMap.values());
            chats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            console.log('[CHATS] Grouped into', chats.length, 'chats');

            // Fetch unread counts from getChats API
            try {
                const chatsResult = await getChats(acc.instance_id, acc.api_token);
                console.log('[CHATS] getChats API response:', chatsResult);

                if (chatsResult.success && Array.isArray(chatsResult.data)) {
                    // Log first chat to see available fields
                    if (chatsResult.data.length > 0) {
                        console.log('[CHATS] Sample chat from getChats:', chatsResult.data[0]);
                    }

                    // Create a map of chatId -> unreadCount
                    const unreadMap = new Map();
                    chatsResult.data.forEach(chat => {
                        const id = chat.id || chat.chatId || chat.chatIdString;
                        // Try multiple possible field names for unread count
                        const unread = chat.unreadCount ?? chat.unread ?? chat.unreadMessages ?? 0;
                        if (id && unread > 0) {
                            unreadMap.set(id, unread);
                            console.log('[CHATS] Found unread chat:', id, 'count:', unread);
                        }
                    });

                    console.log('[CHATS] Unread map size:', unreadMap.size);

                    // Merge unreadCount into our chats
                    chats = chats.map(chat => ({
                        ...chat,
                        unreadCount: unreadMap.get(chat.chatId) || 0
                    }));

                    console.log('[CHATS] Merged unread counts from getChats API');
                }
            } catch (err) {
                console.warn('[CHATS] Failed to fetch unread counts:', err.message);
            }

            // Save contact names to database for use by scheduled message dispatcher
            // Only save chats that have a real name (not just phone number)
            const chatsWithNames = chats.filter(chat =>
                chat.name && chat.name !== chat.phone && chat.name !== chat.chatId
            );

            if (chatsWithNames.length > 0) {
                const chatsToUpsert = chatsWithNames.map(chat => ({
                    number_id: selectedNumber.id,
                    remote_jid: chat.chatId,
                    name: chat.name,
                    last_message: chat.lastMessage?.substring(0, 500), // Truncate to 500 chars
                    last_message_at: chat.timestamp ? new Date(chat.timestamp * 1000).toISOString() : new Date().toISOString(),
                }));

                try {
                    await supabase
                        .from('chats')
                        .upsert(chatsToUpsert, {
                            onConflict: 'number_id,remote_jid',
                            ignoreDuplicates: false
                        });
                    console.log(`[CHATS] Saved ${chatsWithNames.length} contact names to database`);
                } catch (err) {
                    console.error('[CHATS] Failed to save contact names:', err.message);
                }
            }

            // Update cache
            chatsCacheRef.current.data = chats;
            chatsCacheRef.current.timestamp = Date.now();

            setChats(chats);
            return chats;
        } catch (error) {
            console.error('[CHATS] Fetch chats error:', error);
            await logger.error('Failed to fetch chats', { error: error.message }, selectedNumber?.id);
            return [];
        }
    };

    const fetchMessages = async (forceRefresh = false) => {
        if (!selectedChat || !selectedNumber) return;

        const acc = selectedNumber;
        if (!acc.instance_id || !acc.api_token) {
            console.warn('[HISTORY] Missing instance_id or api_token');
            return;
        }

        // Get chatId from selectedChat
        const chatId = selectedChat.chatId || selectedChat.remote_jid;
        if (!chatId) {
            console.warn('[HISTORY] No chatId in selectedChat');
            return;
        }

        // Check cache first (like extension - 10 seconds)
        if (!forceRefresh && historyCacheRef.current.has(chatId)) {
            const cached = historyCacheRef.current.get(chatId);
            if (Date.now() - cached.timestamp < 10000) {
                console.log('[HISTORY] Using cached history');
                setMessages(cached.messages);
                return;
            }
        }

        setMessagesLoading(true);

        try {
            // Green API endpoint: getChatHistory - DIRECT CALL like extension
            const GREEN_API_BASE = 'https://api.green-api.com';
            const apiUrl = `${GREEN_API_BASE}/waInstance${acc.instance_id}/getChatHistory/${acc.api_token}`;

            console.log('[HISTORY] Fetching from:', apiUrl);
            console.log('[HISTORY] ChatId:', chatId);

            // Request body according to Green API documentation
            const requestBody = {
                chatId: chatId,
                count: 100
            };

            console.log('[HISTORY] Request body:', requestBody);

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }).catch(e => {
                console.error('[HISTORY] Fetch error:', e);
                const errorMsg = e.message || 'שגיאה לא ידועה';
                setMessages([]);
                return null;
            });

            if (!res || !res.ok) {
                if (res) {
                    const errorText = await res.text().catch(() => '');
                    console.error('[HISTORY] HTTP error:', res.status, res.statusText);
                    console.error('[HISTORY] Error response:', errorText);
                    await logger.error('Failed to fetch chat history', {
                        status: res.status,
                        error: errorText.substring(0, 200),
                        chatId
                    }, selectedNumber.id);
                } else {
                    await logger.error('Failed to fetch chat history - no response', { chatId }, selectedNumber.id);
                }
                setMessages([]);
                return;
            }

            const data = await res.json();
            console.log('[HISTORY] Response:', data);
            console.log('[HISTORY] Response type:', typeof data);
            console.log('[HISTORY] Is array?', Array.isArray(data));

            // Parse response - Green API returns { data: [...] } or direct array
            let arr = [];
            if (Array.isArray(data)) {
                arr = data;
                console.log('[HISTORY] Using direct array, length:', arr.length);
            } else if (data.data && Array.isArray(data.data)) {
                arr = data.data;
                console.log('[HISTORY] Using data.data, length:', arr.length);
            } else if (data.messages && Array.isArray(data.messages)) {
                arr = data.messages;
                console.log('[HISTORY] Using data.messages, length:', arr.length);
            } else if (data.results && Array.isArray(data.results)) {
                arr = data.results;
                console.log('[HISTORY] Using data.results, length:', arr.length);
            } else {
                console.warn('[HISTORY] Unknown response format:', Object.keys(data));
            }

            if (!Array.isArray(arr) || arr.length === 0) {
                console.log('[HISTORY] No messages found');
                setMessages([]);
                setHasMoreMessages(false);
                setOldestMessageTimestamp(null);
                historyCacheRef.current.set(chatId, { messages: [], timestamp: Date.now() });
                return;
            }

            // Log first message for debugging
            if (arr.length > 0) {
                console.log('[HISTORY] First message sample:', {
                    idMessage: arr[0].idMessage,
                    typeMessage: arr[0].typeMessage,
                    textMessage: arr[0].textMessage,
                    conversation: arr[0].conversation,
                    extendedTextMessage: arr[0].extendedTextMessage,
                    timestamp: arr[0].timestamp,
                    type: arr[0].type,
                    fromMe: arr[0].fromMe
                });
            }

            // Sort by timestamp (oldest first, like extension)
            arr.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

            console.log('[HISTORY] Sorted messages, count:', arr.length);

            // Check if there are more messages (if we got 100, there might be more)
            setHasMoreMessages(arr.length >= 100);
            if (arr.length > 0) {
                setOldestMessageTimestamp(arr[0].timestamp); // Oldest message timestamp
            }

            // Cache the history (simple, like extension)
            historyCacheRef.current.set(chatId, { messages: arr, timestamp: Date.now() });

            // Save to localStorage cache
            saveMessagesToCache(acc.instance_id, chatId, arr);

            setMessages(arr);
            console.log('[HISTORY] Messages set in state, count:', arr.length);
        } catch (error) {
            console.error('[HISTORY] Fetch error:', error);
            await logger.error('Error fetching chat history', { error: error.message }, selectedNumber?.id);
            setMessages([]);
        } finally {
            setMessagesLoading(false);
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

            // Request older messages (before the oldest we have)
            const requestBody = {
                chatId: chatId,
                count: 100
            };

            console.log('[HISTORY] Loading more messages, before timestamp:', oldestMessageTimestamp);

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

            // Send via Green API
            const result = await sendGreenMessage(
                selectedNumber.instance_id,
                selectedNumber.api_token,
                chatId,
                newMessage,
            );

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
            await fetchChats(true);

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

    // Helper function to load media URL from Green API
    const loadMediaUrl = async (messageId, chatId) => {
        if (!selectedNumber?.instance_id || !selectedNumber?.api_token || !messageId) {
            return null;
        }

        // Check if already loading or loaded
        if (loadingMedia[messageId] || mediaUrls[messageId]) {
            return mediaUrls[messageId] || null;
        }

        setLoadingMedia(prev => ({ ...prev, [messageId]: true }));

        try {
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
        } catch (error) {
            console.error('[MEDIA] Error loading media URL:', error);
        } finally {
            setLoadingMedia(prev => ({ ...prev, [messageId]: false }));
        }

        return null;
    };

    // SMART Polling: Slower interval + only refresh if we got a notification
    useEffect(() => {
        if (!selectedNumber?.instance_id || !selectedNumber?.api_token) {
            return;
        }

        setIsPolling(true);
        let lastNotificationTime = Date.now();

        const interval = setInterval(() => {
            pollNewMessages(
                selectedNumber.instance_id,
                selectedNumber.api_token,
                async (message) => {
                    // Only refresh if we actually got a new message
                    const now = Date.now();
                    if (now - lastNotificationTime > 1000) {
                        // Throttle: max once per second
                        lastNotificationTime = now;
                        // Only refresh the current chat, not all chats
                        if (selectedChat) {
                            // Clear cache and force refresh
                            const chatId = selectedChat.chatId || selectedChat.remote_jid;
                            if (chatId) {
                                historyCacheRef.current.delete(chatId);
                            }
                            await fetchMessages(true);
                        }
                        // Light refresh of chat list
                        await fetchChats(true);
                    }
                },
            );
        }, 15000); // Slower: 15 seconds instead of 5

        return () => {
            clearInterval(interval);
            setIsPolling(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNumber?.instance_id, selectedNumber?.api_token, selectedChat?.chatId]);

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
    const hasActiveFilters = filterDateFrom || filterDateTo || filterTags.length > 0;

    const filteredChats = chats.filter((chat) => {
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
            const chatDate = chatTimestamp ? new Date(chatTimestamp * 1000) : null;

            if (chatDate) {
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
                // No date available, filter out if date filter is active
                return false;
            }
        }

        // Apply tag filters
        if (filterTags.length > 0) {
            const chatId = chat.chatId || chat.remote_jid || '';
            const chatTagIds = chatTags[chatId] || [];
            const hasMatchingTag = filterTags.some(tagId => chatTagIds.includes(tagId));
            if (!hasMatchingTag) return false;
        }

        return true;
    });

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-background dark:bg-[#0a1014] text-sm">
            {/* Left Sidebar - Numbers & Chats (WhatsApp-style) */}
            <div className="w-96 border-r border-border dark:border-[#202c33] flex flex-col bg-card dark:bg-[#111b21] text-foreground dark:text-white">
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
                            size="sm"
                            onClick={handleFullSync}
                            disabled={syncing || !selectedNumber}
                            className="ml-1 bg-primary hover:bg-primary/90 dark:bg-[#00a884] dark:hover:bg-[#00a884]/90 text-primary-foreground dark:text-white border-0 text-xs px-3"
                        >
                            {syncing ? t('common.syncing') || 'Syncing...' : t('common.sync') || 'Sync'}
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
                                "px-3 py-1 text-xs rounded-full transition-colors",
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
                                "px-3 py-1 text-xs rounded-full transition-colors",
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
                                "px-3 py-1 text-xs rounded-full transition-colors",
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
                                        "px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1",
                                        hasActiveFilters
                                            ? "bg-primary dark:bg-[#00a884] text-white"
                                            : "bg-muted dark:bg-[#202c33] text-foreground dark:text-[#8696a0] hover:bg-muted/80"
                                    )}
                                >
                                    <Filter className="h-3 w-3" />
                                    {t('chats_page.filters') || 'פילטרים'}
                                    {hasActiveFilters && (
                                        <span className="ml-1 bg-white/20 rounded-full px-1.5 text-[10px]">
                                            {(filterDateFrom ? 1 : 0) + (filterDateTo ? 1 : 0) + filterTags.length}
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
                                                    setFilterDateTo('');
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
                                        setSelectedChat(chat);
                                        // Update URL when chat is clicked - use only the number part (without any @ suffix)
                                        if (selectedNumber) {
                                            const numberOnly = removeJidSuffix(chatId);
                                            navigate(`/app/chats/${selectedNumber.id}/${encodeURIComponent(numberOnly)}`, { replace: true });
                                        }
                                    }}
                                    className={cn(
                                        "px-4 py-3 border-b border-border dark:border-[#202c33] cursor-pointer hover:bg-secondary dark:hover:bg-[#202c33] transition-colors",
                                        isSelected && "bg-secondary dark:bg-[#202c33]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {chatAvatars.has(chatId) ? (
                                            <img
                                                src={chatAvatars.get(chatId)}
                                                alt={chat.name || chat.phone}
                                                className="w-12 h-12 rounded-full object-cover"
                                                onError={(e) => {
                                                    // Fallback to initials if image fails
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-[#00a884] dark:to-[#005c4b] flex items-center justify-center text-sm font-semibold text-primary-foreground dark:text-white ${chatAvatars.has(chatId) ? 'hidden' : ''}`}
                                        >
                                            {getChatInitials(chat)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate text-foreground dark:text-[#e9edef]">{chat.name || chat.phone || chatId}</p>
                                            <p className="text-sm text-muted-foreground dark:text-[#8696a0] truncate">
                                                {chat.lastMessage || t('chats_page.no_chats')}
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
            <div className="flex-1 flex flex-col bg-background dark:bg-[#0a1014]">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-3 border-b border-border dark:border-[#202c33] bg-secondary dark:bg-[#202c33] flex items-center gap-3 text-foreground dark:text-[#e9edef]">
                            <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-[#00a884]/20 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-primary dark:text-[#00a884]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">
                                    {selectedChat.name || selectedChat.phone || selectedChat.chatId}
                                </span>
                                <span className="text-xs text-muted-foreground dark:text-[#8696a0]">{t('chats_page.online_status') || ''}</span>
                            </div>
                            <div className="ml-auto">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setCurrentChatTagsId(selectedChat.chatId || selectedChat.remote_jid)}
                                >
                                    <Tag className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t('tags.labels') || 'Labels'}</span>
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
                                            const typeMessage = item.typeMessage || '';
                                            const isFromMe = item.type === 'outgoing' || item.fromMe === true;

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
                                                                    const messageId = item.idMessage || item.id;
                                                                    const chatId = selectedChat?.chatId || selectedChat?.remote_jid;
                                                                    // Check for cached URL first, then inline URLs
                                                                    const cachedUrl = mediaUrls[messageId];
                                                                    const inlineUrl = item.urlFile || item.downloadUrl || item.mediaUrl ||
                                                                        (item.imageMessage && (item.imageMessage.urlFile || item.imageMessage.downloadUrl || item.imageMessage.url));
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
                                                                                        // If we have full URL, open lightbox. Otherwise, try to load it first.
                                                                                        let imageUrl = fullImageUrl;
                                                                                        if (!imageUrl && messageId && chatId) {
                                                                                            imageUrl = await loadMediaUrl(messageId, chatId);
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
                                                                                <div className="w-[200px] h-[150px] bg-muted dark:bg-[#182229] rounded-lg flex items-center justify-center">
                                                                                    <span className="text-4xl">📷</span>
                                                                                </div>
                                                                            )}
                                                                            {/* Show loading overlay or load button */}
                                                                            {!fullImageUrl && thumbnailSrc && (
                                                                                <div
                                                                                    className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg cursor-pointer"
                                                                                    onClick={async () => {
                                                                                        if (messageId && chatId) {
                                                                                            const url = await loadMediaUrl(messageId, chatId);
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
                                                                    const messageId = item.idMessage || item.id;
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
                                                                                            await loadMediaUrl(messageId, chatId);
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
                                                                {(item.downloadUrl || item.url) && (
                                                                    <a
                                                                        href={item.downloadUrl || item.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                                    >
                                                                        📄 {t('chats_page.download_document') || 'Download Document'}
                                                                    </a>
                                                                )}
                                                                {text && (
                                                                    <div className="text-sm mt-2">{text}</div>
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
        </div>
    );
}

