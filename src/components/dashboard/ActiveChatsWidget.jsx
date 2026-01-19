import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MessageSquare, ArrowRight, User, Check, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ActiveChatsWidget({ chats = [], loading = false }) {
    const { t } = useTranslation();

    // Sort by last_message_at desc and take top 10 (dashboard passed 10)
    const activeChats = chats
        .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at))
        .slice(0, 10);

    if (loading) {
        return <Card className="h-full"><CardContent className="p-6">Loading...</CardContent></Card>;
    }

    return (
        <Card className="h-full flex flex-col max-h-[500px]">
            <CardHeader className="pb-3 flex-none border-b border-border/40 bg-card z-10">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            {t('dashboard.active_chats')}
                        </CardTitle>
                        <CardDescription>
                            {t('recent_activity')}
                        </CardDescription>
                    </div>
                    <Link to="/app/chats">
                        <Button variant="outline" size="sm" className="h-7 text-xs">{t('view_all')}</Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {activeChats.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
                        <MessageSquare className="h-10 w-10 mb-2 opacity-20" />
                        <p>{t('dashboard.no_active_chats')}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/40">
                        {activeChats.map((chat) => (
                            <div key={chat.id} className="p-4 hover:bg-muted/30 transition-colors group">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-10 w-10 border border-border mt-1">
                                        <AvatarImage src={chat.profile_pic_url} />
                                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold leading-none truncate">
                                                {chat.name || chat.remote_jid?.split('@')[0]}
                                            </p>
                                            <Link to={`/app/chats?remoteJid=${chat.remote_jid}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <ArrowRight className="h-3 w-3" />
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Message History Preview (Last 2) */}
                                        <div className="space-y-1.5">
                                            {(chat.messages || []).length > 0 ? (
                                                chat.messages.slice(0, 2).map((msg, idx) => (
                                                    <p key={msg.id || idx} className={`text-xs flex items-center gap-1.5 ${idx === 0 ? 'text-foreground/90 font-medium' : 'text-muted-foreground'}`}>
                                                        {msg.key?.fromMe ? (
                                                            <span className="text-[10px] text-primary shrink-0 opacity-70">You:</span>
                                                        ) : (
                                                            <span className="text-[10px] text-muted-foreground shrink-0 opacity-70">User:</span>
                                                        )}
                                                        <span className="truncate">{msg.content || msg.message?.conversation || msg.message?.extendedTextMessage?.text || (msg.message ? 'Media' : '...')}</span>
                                                        <span className="ml-auto text-[10px] text-muted-foreground/60 whitespace-nowrap">
                                                            {new Date(msg.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </p>
                                                ))
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic">
                                                    {chat.last_message || 'No messages loaded'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ActiveChatsWidget;
