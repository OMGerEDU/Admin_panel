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
        <div className="flex h-[calc(100vh-8rem)] bg-background">
            {/* Left Sidebar - Numbers & Chats */}
            <div className="w-96 border-r flex flex-col bg-muted/30">
                {/* Number Selector */}
                <div className="p-4 border-b bg-background">
                    <div className="flex items-center gap-2 mb-3">
                        <select
                            value={selectedNumber?.id || ''}
                            onChange={(e) => {
                                const num = numbers.find(n => n.id === e.target.value);
                                setSelectedNumber(num);
                                setSelectedChat(null);
                            }}
                            className="flex-1 px-3 py-2 rounded-md border bg-background text-sm"
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
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('chats_page.search_chats')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Chats List */}
                <div className="flex-1 overflow-y-auto">
                    {!selectedNumber ? (
                        <div className="p-8 text-center text-muted-foreground">
                            {t('chats_page.no_number_selected')}
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            {t('chats_page.no_chats')}
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={cn(
                                    "p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                                    selectedChat?.id === chat.id && "bg-muted"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{chat.name || chat.remote_jid}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {chat.last_message || 'No messages'}
                                        </p>
                                    </div>
                                    {chat.last_message_at && (
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
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
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-background">
                            <h3 className="font-semibold">
                                {selectedChat.name || selectedChat.remote_jid}
                            </h3>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5] dark:bg-slate-900">
                            {messages.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
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
                                                "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
                                                message.is_from_me
                                                    ? "bg-[#dcf8c6] dark:bg-primary/20 rounded-tr-none"
                                                    : "bg-white dark:bg-slate-800 rounded-tl-none"
                                            )}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <p className="text-xs text-muted-foreground mt-1 text-right">
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
                        <div className="p-4 border-t bg-background">
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
                                    className="flex-1"
                                />
                                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-[#e5ddd5] dark:bg-slate-900">
                        <div className="text-center text-muted-foreground">
                            <Phone className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">{t('chats_page.select_number')}</p>
                            <p className="text-sm mt-2">{t('chats_page.no_chats')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

