import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Tag, Check, Settings } from 'lucide-react';

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
            <DialogContent className="sm:max-w-[350px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        {t('tags.assign_tags') || 'Assign Tags'}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {tags.length === 0 ? (
                        <div className="text-center py-6 space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {t('tags.no_tags_defined') || 'No tags defined yet.'}
                            </p>
                            <Button variant="outline" size="sm" onClick={onManageTags}>
                                {t('tags.create_first_tag') || 'Create Tag'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {tags.map((tag) => {
                                const isSelected = selectedTagIds.includes(tag.id);
                                return (
                                    <div
                                        key={tag.id}
                                        className={`
                                            flex items-center justify-between p-2 rounded-md cursor-pointer border
                                            ${isSelected ? 'bg-primary/10 border-primary/50' : 'hover:bg-accent border-transparent'}
                                        `}
                                        onClick={() => handleToggle(tag.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: tag.color }}
                                            />
                                            <span className="text-sm font-medium">{tag.name}</span>
                                        </div>
                                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {tags.length > 0 && (
                    <div className="pt-2 border-t mt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-muted-foreground"
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
