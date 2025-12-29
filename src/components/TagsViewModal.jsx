import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { MessageSquare, ArrowRight, Search, Hash } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export function TagsViewModal({ tag, chats, open, onClose, onNavigate }) {
    const { t } = useTranslation();

    const taggedChats = React.useMemo(() => {
        if (!tag || !chats) return [];
        return chats.filter(chat =>
            chat.tags && chat.tags.includes(tag.id)
        );
    }, [tag, chats]);

    if (!tag) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-white/20 shadow-2xl">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div
                            className="h-8 w-8 rounded-full shadow-lg ring-2 ring-white/20 flex items-center justify-center"
                            style={{ backgroundColor: tag.color }}
                        >
                            <Hash className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold">{tag.name}</span>
                        <span className="text-sm font-normal text-muted-foreground ml-auto bg-muted/50 px-3 py-1 rounded-full">
                            {taggedChats.length} {t('chats') || 'Chats'}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {taggedChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-60">
                            <div className="bg-muted/50 p-4 rounded-full">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-medium">
                                {t('tags.no_chats_with_tag') || 'No chats have this tag yet'}
                            </p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-2">
                                {taggedChats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-white/10 bg-muted/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                                        onClick={() => onNavigate(chat.id)}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
                                                <MessageSquare className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-medium truncate text-foreground/90">
                                                    {chat.name || chat.remote_jid.replace('@c.us', '')}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {chat.phone_number}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
