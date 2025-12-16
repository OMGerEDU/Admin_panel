import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Send, Phone } from 'lucide-react';
import { cn } from '../lib/utils';
import { sendMessage as sendGreenMessage } from '../services/greenApi';
import {
    fullSync,
    syncMessagesToSupabase,
    pollNewMessages,
    syncChatsToSupabase,
} from '../services/messageSync';
import {
    shouldSyncChats,
    markChatsSynced,
    shouldSyncMessages,
    markMessagesSynced,
    clearChatCache,
} from '../lib/messageCache';
import { logger } from '../lib/logger';

export default function Chats() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
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
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [oldestMessageTs, setOldestMessageTs] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchNumbers();
    }, [user]);

    useEffect(() => {
        if (selectedNumber) {
            fetchChats();
        }
    }, [selectedNumber]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
        }
    }, [selectedChat]);

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

    const fetchChats = async (forceSync = false) => {
        if (!selectedNumber) return;

        try {
            // Always load from Supabase first (fast)
            const { data, error } = await supabase
                .from('chats')
                .select('*')
                .eq('number_id', selectedNumber.id)
                .order('last_message_at', { ascending: false });

            if (error) throw error;
            setChats(data || []);

            // Only sync from Green API if needed (smart caching)
            if (
                forceSync ||
                (selectedNumber.instance_id &&
                    selectedNumber.api_token &&
                    shouldSyncChats())
            ) {
                // Background sync - don't block UI
                syncChatsToSupabase(
                    selectedNumber.id,
                    selectedNumber.instance_id,
                    selectedNumber.api_token,
                    false, // Don't enrich all names
                )
                    .then(() => {
                        markChatsSynced();
                        // Refresh from Supabase after sync
                        return supabase
                            .from('chats')
                            .select('*')
                            .eq('number_id', selectedNumber.id)
                            .order('last_message_at', { ascending: false });
                    })
                    .then(({ data: refreshedData }) => {
                        if (refreshedData) {
                            setChats(refreshedData);
                        }
                    })
                    .catch((err) => {
                        console.error('Background chat sync error:', err);
                    });
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const PAGE_SIZE = 50;

    const fetchMessages = async (initial = true, forceSync = false) => {
        if (!selectedChat) return;

        try {
            setMessagesLoading(true);
            if (initial) {
                setHasMoreMessages(true);
                setOldestMessageTs(null);
                setMessages([]);
            }

            // SMART: Only sync from Green API if:
            // 1. Force sync requested (user clicked sync)
            // 2. No messages in DB yet
            // 3. Haven't synced recently (cache check)
            const shouldSync =
                forceSync ||
                (selectedNumber?.instance_id &&
                    selectedNumber?.api_token &&
                    selectedChat.remote_jid &&
                    shouldSyncMessages(selectedChat.id));

            if (shouldSync) {
                // Check if we have any messages first
                const { count } = await supabase
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('chat_id', selectedChat.id);

                // Only sync if we have < 20 messages or force sync
                if (forceSync || (count || 0) < 20) {
                    // Background sync - don't block UI
                    syncMessagesToSupabase(
                        selectedChat.id,
                        selectedNumber.instance_id,
                        selectedNumber.api_token,
                        selectedChat.remote_jid,
                        initial ? PAGE_SIZE * 2 : PAGE_SIZE, // Load more on initial
                    )
                        .then(() => {
                            markMessagesSynced(selectedChat.id);
                        })
                        .catch((err) => {
                            console.error('Background message sync error:', err);
                        });
                }
            }

            // Load from Supabase (always fast, even if sync is running)
            let query = supabase
                .from('messages')
                .select('*')
                .eq('chat_id', selectedChat.id)
                .order('timestamp', { ascending: false })
                .limit(PAGE_SIZE);

            if (!initial && oldestMessageTs) {
                query = query.lt('timestamp', oldestMessageTs);
            }

            const { data, error } = await query;

            if (error) throw error;

            const batch = data || [];
            if (batch.length === 0) {
                if (initial) {
                    setMessages([]);
                    setHasMoreMessages(false);
                } else {
                    setHasMoreMessages(false);
                }
                return;
            }

            // We queried descending; UI expects ascending
            const reversed = [...batch].reverse();

            if (initial) {
                setMessages(reversed);
            } else {
                setMessages((prev) => [...reversed, ...prev]);
            }

            const newOldest = reversed[0]?.timestamp;
            if (newOldest) {
                setOldestMessageTs(newOldest);
            }

            if (batch.length < PAGE_SIZE) {
                setHasMoreMessages(false);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleLoadMoreMessages = async () => {
        if (!hasMoreMessages || messagesLoading || !selectedChat) return;
        await fetchMessages(false);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
            // Send via Green API if possible
            if (selectedNumber?.instance_id && selectedNumber?.api_token && selectedChat.remote_jid) {
                const result = await sendGreenMessage(
                    selectedNumber.instance_id,
                    selectedNumber.api_token,
                    selectedChat.remote_jid,
                    newMessage,
                );

                if (!result.success) {
                    console.error('Failed sending via Green API:', result.error);
                    await logger.error('Failed to send message via Green API', {
                        error: result.error,
                        chat_id: selectedChat.remote_jid
                    }, selectedNumber.id);
                } else {
                    await logger.info('Message sent', {
                        chat_id: selectedChat.remote_jid,
                        message_length: newMessage.length
                    }, selectedNumber.id);
                }
            }

            // Always insert into Supabase so UI is consistent
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    chat_id: selectedChat.id,
                    content: newMessage,
                    is_from_me: true,
                    timestamp: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            setMessages([...messages, data]);
            setNewMessage('');

            // Update chat last message
            await supabase
                .from('chats')
                .update({
                    last_message: newMessage,
                    last_message_at: new Date().toISOString(),
                })
                .eq('id', selectedChat.id);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFullSync = async () => {
        if (!selectedNumber?.id || !selectedNumber.instance_id || !selectedNumber.api_token) {
            console.warn('Missing number Green API configuration for sync');
            await logger.warn('Sync attempted without Green API credentials', null, selectedNumber?.id);
            return;
        }

        setSyncing(true);
        try {
            // Clear cache to force fresh sync
            clearChatCache(selectedChat?.id);
            
            await logger.info('Starting full sync', { instance_id: selectedNumber.instance_id }, selectedNumber.id);
            
            const result = await fullSync(
                selectedNumber.id,
                selectedNumber.instance_id,
                selectedNumber.api_token,
                50,
            );

            if (!result.success) {
                console.error('Full sync failed:', result.error);
                await logger.error('Full sync failed', { error: result.error }, selectedNumber.id);
            } else {
                await logger.info('Full sync completed', { 
                    chats: result.data?.chats?.length || 0,
                    messages: result.data?.messages?.length || 0
                }, selectedNumber.id);
            }

            // Force refresh after sync
            await fetchChats(true);
            if (selectedChat) {
                await fetchMessages(true, true); // initial + force sync
            }
        } catch (error) {
            console.error('Error during full sync:', error);
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
                            clearChatCache(selectedChat.id);
                            await fetchMessages(true, true);
                        }
                        // Light refresh of chat list (just last_message)
                        await fetchChats();
                    }
                },
            );
        }, 15000); // Slower: 15 seconds instead of 5

        return () => {
            clearInterval(interval);
            setIsPolling(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNumber?.instance_id, selectedNumber?.api_token, selectedChat?.id]);

    const getChatInitials = (chat) => {
        const base = (chat.name || chat.remote_jid || 'WA').toString();
        const letters = base.replace(/[^A-Za-zא-ת0-9]/g, '').slice(0, 2);
        return letters.toUpperCase() || 'WA';
    };

    const filteredChats = chats.filter((chat) =>
        (chat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.remote_jid || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={cn(
                                    "px-4 py-3 border-b border-border dark:border-[#202c33] cursor-pointer hover:bg-secondary dark:hover:bg-[#202c33] transition-colors",
                                    selectedChat?.id === chat.id && "bg-secondary dark:bg-[#202c33]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-[#00a884] dark:to-[#005c4b] flex items-center justify-center text-sm font-semibold text-primary-foreground dark:text-white">
                                        {getChatInitials(chat)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate text-foreground dark:text-[#e9edef]">{chat.name || chat.remote_jid}</p>
                                        <p className="text-sm text-muted-foreground dark:text-[#8696a0] truncate">
                                            {chat.last_message || t('chats_page.no_chats')}
                                        </p>
                                    </div>
                                    {chat.last_message_at && (
                                        <span className="text-xs text-muted-foreground dark:text-[#8696a0] whitespace-nowrap">
                                            {new Date(chat.last_message_at).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
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
                                    {selectedChat.name || selectedChat.remote_jid}
                                </span>
                                <span className="text-xs text-muted-foreground dark:text-[#8696a0]">{t('chats_page.online_status') || ''}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-background dark:bg-[#0a1014]"
                            onScroll={(e) => {
                                if (e.currentTarget.scrollTop < 40) {
                                    handleLoadMoreMessages();
                                }
                            }}
                        >
                            {hasMoreMessages && messages.length > 0 && (
                                <div className="flex justify-center pb-2">
                                    <button
                                        type="button"
                                        onClick={handleLoadMoreMessages}
                                        disabled={messagesLoading}
                                        className="text-xs text-muted-foreground dark:text-[#8696a0] hover:text-foreground dark:hover:text-[#e9edef] disabled:opacity-60"
                                    >
                                        {messagesLoading ? t('common.loading') : t('common.refresh')}
                                    </button>
                                </div>
                            )}
                            {messages.length === 0 && !messagesLoading ? (
                                <div className="text-center text-muted-foreground dark:text-[#8696a0] py-8">
                                    {t('common.no_data')}
                                </div>
                            ) : (
                                messages.map((message) => {
                                    const mediaMeta = message.media_meta || {};
                                    const typeMessage = mediaMeta.typeMessage || mediaMeta.type || '';
                                    
                                    return (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex",
                                                message.is_from_me ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[70%] rounded-lg px-3 py-2 shadow-sm text-[13px] leading-snug",
                                                    message.is_from_me
                                                        ? "bg-primary/90 dark:bg-[#005c4b] text-primary-foreground dark:text-[#e9edef] rounded-br-none"
                                                        : "bg-secondary dark:bg-[#202c33] text-foreground dark:text-[#e9edef] rounded-bl-none"
                                                )}
                                            >
                                                {/* Image Message */}
                                                {typeMessage === 'imageMessage' && (
                                                    <div className="space-y-2">
                                                        {mediaMeta.jpegThumbnail ? (
                                                            <img
                                                                src={`data:image/jpeg;base64,${mediaMeta.jpegThumbnail}`}
                                                                alt="image"
                                                                className="max-w-[220px] max-h-[220px] rounded-lg block mb-1"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : mediaMeta.urlFile || mediaMeta.downloadUrl ? (
                                                            <img
                                                                src={mediaMeta.urlFile || mediaMeta.downloadUrl}
                                                                alt="image"
                                                                className="max-w-[220px] max-h-[220px] rounded-lg block mb-1"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : null}
                                                        {(mediaMeta.caption || message.content) && (
                                                            <div className="text-sm">{mediaMeta.caption || message.content}</div>
                                                        )}
                                                        {(mediaMeta.urlFile || mediaMeta.downloadUrl) && (
                                                            <a
                                                                href={mediaMeta.urlFile || mediaMeta.downloadUrl}
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
                                                        {mediaMeta.jpegThumbnail && (
                                                            <img
                                                                src={`data:image/jpeg;base64,${mediaMeta.jpegThumbnail}`}
                                                                alt="video"
                                                                className="max-w-[220px] max-h-[220px] rounded-lg block mb-1"
                                                            />
                                                        )}
                                                        <div>🎥 {t('chats_page.video_message') || 'Video Message'}</div>
                                                        {(mediaMeta.downloadUrl || mediaMeta.urlFile) && (
                                                            <a
                                                                href={mediaMeta.downloadUrl || mediaMeta.urlFile}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                            >
                                                                🎥 {t('chats_page.open_video') || 'Open Video'}
                                                            </a>
                                                        )}
                                                        {(mediaMeta.caption || message.content) && (
                                                            <div className="text-sm mt-2">{mediaMeta.caption || message.content}</div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Audio/Voice Message */}
                                                {(typeMessage === 'audioMessage' || typeMessage === 'ptt') && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">🎵</span>
                                                            {mediaMeta.downloadUrl || mediaMeta.url ? (
                                                                <audio
                                                                    controls
                                                                    preload="metadata"
                                                                    className="max-w-[250px] h-8 outline-none"
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    <source src={mediaMeta.downloadUrl || mediaMeta.url} type={mediaMeta.mimeType || 'audio/ogg; codecs=opus'} />
                                                                </audio>
                                                            ) : (
                                                                <div className="text-xs text-muted-foreground dark:text-[#8696a0]">
                                                                    {t('chats_page.audio_not_available') || 'Audio message (not available for download)'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {mediaMeta.seconds && mediaMeta.seconds > 0 && (
                                                            <div className="text-xs text-muted-foreground dark:text-[#8696a0]">
                                                                {Math.floor(mediaMeta.seconds / 60)}:{(mediaMeta.seconds % 60).toString().padStart(2, '0')}
                                                            </div>
                                                        )}
                                                        {message.content && (
                                                            <div className="text-sm mt-2">{message.content}</div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Document Message */}
                                                {typeMessage === 'documentMessage' && (
                                                    <div className="space-y-2">
                                                        <div>📄 {t('chats_page.document_message') || 'Document Message'}</div>
                                                        {mediaMeta.fileName && (
                                                            <div className="font-semibold text-sm">{mediaMeta.fileName}</div>
                                                        )}
                                                        {(mediaMeta.downloadUrl || mediaMeta.urlFile) && (
                                                            <a
                                                                href={mediaMeta.downloadUrl || mediaMeta.urlFile}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                            >
                                                                📄 {t('chats_page.download_document') || 'Download Document'}
                                                            </a>
                                                        )}
                                                        {(mediaMeta.caption || message.content) && (
                                                            <div className="text-sm mt-2">{mediaMeta.caption || message.content}</div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Sticker Message */}
                                                {typeMessage === 'stickerMessage' && (
                                                    <div className="space-y-2">
                                                        <div>🩹 {t('chats_page.sticker_message') || 'Sticker'}</div>
                                                        {mediaMeta.downloadUrl && (
                                                            <a
                                                                href={mediaMeta.downloadUrl}
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
                                                        {mediaMeta.latitude && mediaMeta.longitude && (
                                                            <a
                                                                href={`https://www.google.com/maps?q=${mediaMeta.latitude},${mediaMeta.longitude}`}
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
                                                {!typeMessage && (
                                                    <p className="text-sm">{message.content}</p>
                                                )}
                                                
                                                <p className="text-[11px] text-muted-foreground dark:text-[#8696a0] mt-1 text-right">
                                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
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

