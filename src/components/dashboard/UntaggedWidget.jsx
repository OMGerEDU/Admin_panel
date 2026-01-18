import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Tag, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UntaggedWidget({ chats = [], loading = false }) {
    const { t } = useTranslation();

    // Find active chats (e.g. last 7 days) that have NO tags
    // Assuming chat object has `tags` array or similar.
    // If not, we might need to rely on joined data. 
    // For now assuming existing Dashboard fetches simple chats.
    // Let's assume chats have `tags` property if fetched correctly.
    // Dashboard fetch needs to include tags?

    // Logic: Active recently (> 30 days) AND no tags
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const untagged = chats
        .filter(c => new Date(c.last_message_at) > thirtyDaysAgo)
        .filter(c => !c.tags || c.tags.length === 0)
        .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at))
        .slice(0, 5);

    if (loading) return null;

    if (untagged.length === 0) return null; // Don't show if empty

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4 text-orange-500" />
                    {t('dashboard.untagged_contacts')}
                </CardTitle>
                <CardDescription>
                    Organize {untagged.length} recent conversations
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {untagged.map(chat => (
                        <div key={chat.id} className="flex items-center justify-between">
                            <span className="text-sm truncate max-w-[150px]">{chat.name || chat.remote_jid?.split('@')[0]}</span>
                            <Link to={`/app/chats?remoteJid=${chat.remote_jid}&action=tag`}>
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    Tag
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default UntaggedWidget;
