import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Send, Phone } from 'lucide-react';
import { cn, removeJidSuffix } from '../lib/utils';
import { 
    sendMessage as sendGreenMessage,
    getLastIncomingMessages,
    getLastOutgoingMessages,
    getChatHistory,
    normalizePhoneForAPI,
} from '../services/greenApi';
import { pollNewMessages } from '../services/messageSync';
import { logger } from '../lib/logger';

export default function Chats() {
    const { t } = useTranslation();
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

    // Cache like extension
    const chatsCacheRef = useRef({ data: null, timestamp: 0, ttl: 30000 }); // 30 seconds
    const historyCacheRef = useRef(new Map()); // Map<chatId, { messages, timestamp }>

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
            fetchMessages();
        }
    }, [selectedChat]);

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
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', user.id)
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
            const chats = Array.from(chatsMap.values());
            chats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            console.log('[CHATS] Grouped into', chats.length, 'chats');

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
            // Green API endpoint: getChatHistory
            const result = await getChatHistory(acc.instance_id, acc.api_token, chatId, 100);

            if (!result.success) {
                console.error('[HISTORY] Failed to fetch history:', result.error);
                await logger.error('Failed to fetch chat history', {
                    error: result.error,
                    chatId
                }, selectedNumber.id);
                setMessages([]);
                return;
            }

            const data = result.data;

            // Parse response - Green API returns { data: [...] } or direct array
            let arr = [];
            if (Array.isArray(data)) {
                arr = data;
            } else if (data?.data && Array.isArray(data.data)) {
                arr = data.data;
            } else if (data?.messages && Array.isArray(data.messages)) {
                arr = data.messages;
            } else if (data?.results && Array.isArray(data.results)) {
                arr = data.results;
            }

            if (!Array.isArray(arr) || arr.length === 0) {
                console.log('[HISTORY] No messages found');
                setMessages([]);
                historyCacheRef.current.set(chatId, { messages: [], timestamp: Date.now() });
                return;
            }

            // Sort by timestamp (oldest first, like extension)
            arr.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

            // Cache the history
            historyCacheRef.current.set(chatId, { messages: arr, timestamp: Date.now() });

            setMessages(arr);
        } catch (error) {
            console.error('[HISTORY] Fetch error:', error);
            await logger.error('Error fetching chat history', { error: error.message }, selectedNumber?.id);
            setMessages([]);
        } finally {
            setMessagesLoading(false);
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
            setMessages([...messages, sentMessage]);
            setNewMessage('');

            // Clear cache to force refresh on next load
            historyCacheRef.current.delete(chatId);
            chatsCacheRef.current.data = null; // Force refresh chats list

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

    const filteredChats = chats.filter((chat) =>
        (chat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.chatId || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-[#00a884] dark:to-[#005c4b] flex items-center justify-center text-sm font-semibold text-primary-foreground dark:text-white">
                                            {getChatInitials(chat)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate text-foreground dark:text-[#e9edef]">{chat.name || chat.phone || chatId}</p>
                                            <p className="text-sm text-muted-foreground dark:text-[#8696a0] truncate">
                                                {chat.lastMessage || t('chats_page.no_chats')}
                                            </p>
                                        </div>
                                        {chat.lastMessageTime && (
                                            <span className="text-xs text-muted-foreground dark:text-[#8696a0] whitespace-nowrap">
                                                {new Date(chat.lastMessageTime * 1000).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </span>
                                        )}
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
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-background dark:bg-[#0a1014]"
                        >
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
                                    let text = item.textMessage || 
                                               (item.extendedTextMessage && item.extendedTextMessage.text) || 
                                               (item.extendedTextMessageData && item.extendedTextMessageData.text) || 
                                               (item.conversation) || 
                                               item.content ||
                                               '';
                                    
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
                                                        {item.jpegThumbnail ? (
                                                            <img
                                                                src={`data:image/jpeg;base64,${item.jpegThumbnail}`}
                                                                alt="image"
                                                                className="max-w-[220px] max-h-[220px] rounded-lg block mb-1"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : (item.urlFile || item.downloadUrl || item.mediaUrl) ? (
                                                            <img
                                                                src={item.urlFile || item.downloadUrl || item.mediaUrl}
                                                                alt="image"
                                                                className="max-w-[220px] max-h-[220px] rounded-lg block mb-1"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : null}
                                                        {(item.caption || text) && (
                                                            <div className="text-sm">{item.caption || text}</div>
                                                        )}
                                                        {(item.urlFile || item.downloadUrl) && !item.jpegThumbnail && (
                                                            <a
                                                                href={item.urlFile || item.downloadUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                            >
                                                                📷 {t('chats_page.open_image') || 'Open Image'}
                                                            </a>
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
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">🎵</span>
                                                            {(item.downloadUrl || item.url || item.mediaUrl || 
                                                              (item.audioMessage && (item.audioMessage.downloadUrl || item.audioMessage.url))) ? (
                                                                <audio
                                                                    controls
                                                                    preload="metadata"
                                                                    className="max-w-[250px] h-8 outline-none"
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    <source 
                                                                        src={item.downloadUrl || item.url || item.mediaUrl || 
                                                                              (item.audioMessage && (item.audioMessage.downloadUrl || item.audioMessage.url))} 
                                                                        type={item.mimeType || item.audioMessage?.mimeType || 'audio/ogg; codecs=opus'} 
                                                                    />
                                                                </audio>
                                                            ) : (
                                                                <div className="text-xs text-muted-foreground dark:text-[#8696a0]">
                                                                    {t('chats_page.audio_not_available') || 'Audio message (not available for download)'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {(item.seconds || item.duration || item.length || 
                                                          (item.audioMessage && (item.audioMessage.seconds || item.audioMessage.duration))) && (
                                                            <div className="text-xs text-muted-foreground dark:text-[#8696a0]">
                                                                {(() => {
                                                                    const duration = item.seconds || item.duration || item.length || 
                                                                                     (item.audioMessage && (item.audioMessage.seconds || item.audioMessage.duration)) || 0;
                                                                    const minutes = Math.floor(duration / 60);
                                                                    const secs = Math.floor(duration % 60);
                                                                    return `${minutes}:${secs.toString().padStart(2, '0')}`;
                                                                })()}
                                                            </div>
                                                        )}
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
                                                
                                                {/* Regular Text Message (or fallback) */}
                                                {!typeMessage && text && (
                                                    <p className="text-sm">{text}</p>
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
        </div>
    );
}

