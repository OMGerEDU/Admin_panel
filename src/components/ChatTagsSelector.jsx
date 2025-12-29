import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Tag, Check, Settings, Sparkles } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';

export function ChatTagsSelector({
    open,
    onOpenChange,
    tags,
    selectedTagIds = [],
    onAssign,
    onRemove,
    onManageTags
}) {
    const { t } = useTranslation();

    const handleToggle = (tagId) => {
        if (selectedTagIds.includes(tagId)) {
            onRemove(tagId);
        } else {
            onAssign(tagId);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-background/95 backdrop-blur-xl border-white/20 shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b border-white/10">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Tag className="h-5 w-5 text-primary" />
                        {t('tags.assign_tags') || 'Assign Tags'}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    {tags.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                            <div className="bg-muted/30 p-4 rounded-full">
                                <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">{t('tags.no_tags_defined') || 'No tags defined yet'}</p>
                                <p className="text-sm text-muted-foreground">{t('tags.create_first_tag_desc') || 'Create tags to organize your chats'}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={onManageTags} className="mt-2 border-primary/20 text-primary hover:bg-primary/5">
                                {t('tags.create_first_tag') || 'Create Tag'}
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-[300px] pr-2">
                            <div className="space-y-2">
                                {tags.map((tag) => {
                                    const isSelected = selectedTagIds.includes(tag.id);
                                    return (
                                        <div
                                            key={tag.id}
                                            className={`
                                                group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200
                                                ${isSelected
                                                    ? 'bg-primary/5 border-primary/30 shadow-[0_0_15px_-5px_var(--primary)]'
                                                    : 'bg-card/50 border-white/5 hover:bg-card hover:border-white/10'
                                                }
                                            `}
                                            onClick={() => handleToggle(tag.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => handleToggle(tag.id)}
                                                    className={`border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground`}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-2.5 w-2.5 rounded-full ring-2 ring-white/10 shadow-sm"
                                                        style={{ backgroundColor: tag.color }}
                                                    />
                                                    <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                                        {tag.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {tags.length > 0 && (
                    <div className="px-6 py-4 bg-muted/20 border-t border-white/5">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-white/5"
                            onClick={onManageTags}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            {t('tags.manage_tags') || 'Manage Tags'}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
