import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MessageSquare, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ActiveChatsWidget({ chats = [], loading = false }) {
    const { t } = useTranslation();

    // Sort by last_message_at desc and take top 5
    const activeChats = chats
        .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at))
        .slice(0, 5);

    if (loading) {
        return <Card className="h-full"><CardContent className="p-6">Loading...</CardContent></Card>;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    {t('dashboard.active_chats')}
                </CardTitle>
                <CardDescription>
                    {t('recent_activity')}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {activeChats.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
                        <MessageSquare className="h-10 w-10 mb-2 opacity-20" />
                        <p>{t('dashboard.no_active_chats')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeChats.map((chat) => (
                            <div key={chat.id} className="flex items-center gap-4 group">
                                <Avatar className="h-9 w-9 border border-border">
                                    <AvatarImage src={chat.profile_pic_url} />
                                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-none truncate mb-1">
                                        {chat.name || chat.remote_jid?.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {new Date(chat.last_message_at).toLocaleString()}
                                    </p>
                                </div>
                                <Link to={`/app/chats?remoteJid=${chat.remote_jid}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ActiveChatsWidget;
