import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Send, Phone } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Chats() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [numbers, setNumbers] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
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

    const fetchChats = async () => {
        if (!selectedNumber) return;

        try {
            const { data, error } = await supabase
                .from('chats')
                .select('*')
                .eq('number_id', selectedNumber.id)
                .order('last_message_at', { ascending: false });

            if (error) throw error;
            setChats(data || []);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', selectedChat.id)
                .order('timestamp', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    chat_id: selectedChat.id,
                    content: newMessage,
                    is_from_me: true,
                    timestamp: new Date().toISOString()
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
                    last_message_at: new Date().toISOString()
                })
                .eq('id', selectedChat.id);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.remote_jid?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-[#0a1014] text-sm">
            {/* Left Sidebar - Numbers & Chats (WhatsApp-style) */}
            <div className="w-96 border-r border-[#202c33] flex flex-col bg-[#111b21] text-white">
                {/* Number Selector / Top bar */}
                <div className="p-3 border-b border-[#202c33] bg-[#202c33]">
                    <div className="flex items-center gap-2 mb-3">
                        <select
                            value={selectedNumber?.id || ''}
                            onChange={(e) => {
                                const num = numbers.find(n => n.id === e.target.value);
                                setSelectedNumber(num);
                                setSelectedChat(null);
                            }}
                            className="flex-1 px-3 py-2 rounded-md border-0 bg-[#202c33] text-sm text-white placeholder:text-[#8696a0] outline-none focus:ring-2 focus:ring-[#00a884]"
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
                            className="bg-[#00a884] hover:bg-[#00a884]/90 text-white border-0"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
                        <Input
                            placeholder={t('chats_page.search_chats')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 border-0 bg-[#202c33] text-white placeholder:text-[#8696a0] focus-visible:ring-2 focus-visible:ring-[#00a884]"
                        />
                    </div>
                </div>

                {/* Chats List */}
                <div className="flex-1 overflow-y-auto bg-[#111b21]">
                    {!selectedNumber ? (
                        <div className="p-8 text-center text-[#8696a0]">
                            {t('chats_page.no_number_selected')}
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-8 text-center text-[#8696a0]">
                            {t('chats_page.no_chats')}
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={cn(
                                    "px-4 py-3 border-b border-[#202c33] cursor-pointer hover:bg-[#202c33] transition-colors",
                                    selectedChat?.id === chat.id && "bg-[#202c33]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#202c33] flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-[#00a884]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate text-[#e9edef]">{chat.name || chat.remote_jid}</p>
                                        <p className="text-sm text-[#8696a0] truncate">
                                            {chat.last_message || t('chats_page.no_chats')}
                                        </p>
                                    </div>
                                    {chat.last_message_at && (
                                        <span className="text-xs text-[#8696a0] whitespace-nowrap">
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
            <div className="flex-1 flex flex-col bg-[#0a1014]">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-3 border-b border-[#202c33] bg-[#202c33] flex items-center gap-3 text-[#e9edef]">
                            <div className="w-10 h-10 rounded-full bg-[#00a884]/20 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-[#00a884]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">
                                    {selectedChat.name || selectedChat.remote_jid}
                                </span>
                                <span className="text-xs text-[#8696a0]">{t('chats_page.online_status') || ''}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-[#0a1014]">
                            {messages.length === 0 ? (
                                <div className="text-center text-[#8696a0] py-8">
                                    {t('common.no_data')}
                                </div>
                            ) : (
                                messages.map((message) => (
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
                                                    ? "bg-[#005c4b] text-[#e9edef] rounded-br-none"
                                                    : "bg-[#202c33] text-[#e9edef] rounded-bl-none"
                                            )}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <p className="text-[11px] text-[#8696a0] mt-1 text-right">
                                                {new Date(message.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="px-4 py-3 border-t border-[#202c33] bg-[#202c33]">
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
                                    className="flex-1 border-0 bg-[#202c33] text-white placeholder:text-[#8696a0] focus-visible:ring-2 focus-visible:ring-[#00a884]"
                                />
                                <Button
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim()}
                                    className="bg-[#00a884] hover:bg-[#00a884]/90 text-white border-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-[#0a1014]">
                        <div className="text-center text-[#8696a0]">
                            <Phone className="h-16 w-16 mx-auto mb-4 opacity-40" />
                            <p className="text-lg text-[#e9edef]">{t('chats_page.select_number')}</p>
                            <p className="text-sm mt-2">{t('chats_page.no_chats')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

