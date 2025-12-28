import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useTags } from '../hooks/useTags';

const PRESET_COLORS = [
    '#EF4444', // red-500
    '#F97316', // orange-500
    '#EAB308', // yellow-500
    '#22C55E', // green-500
    '#06B6D4', // cyan-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#D946EF', // fuchsia-500
    '#64748B', // slate-500
];

export function TagsManager({ organizationId, open, onOpenChange }) {
    const { t } = useTranslation();
    const { tags, createTag, deleteTag } = useTags(organizationId);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateTag = async (e) => {
        e.preventDefault();
        if (!newTagName.trim()) return;

        try {
            setIsCreating(true);
            await createTag(newTagName.trim(), newTagColor);
            setNewTagName('');
        } catch (error) {
            console.error('Failed to create tag:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteTag = async (tagId) => {
        if (!confirm(t('tags.confirm_delete') || 'Delete this tag?')) return;
        try {
            await deleteTag(tagId);
        } catch (error) {
            console.error('Failed to delete tag:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        {t('tags.manage_tags') || 'Manage Tags'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Create New Tag */}
                    <form onSubmit={handleCreateTag} className="space-y-4 rounded-lg border p-3 bg-muted/50">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                {t('tags.create_new') || 'Create New Tag'}
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder={t('tags.tag_name') || 'Tag Name'}
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={isCreating || !newTagName.trim()}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`h-6 w-6 rounded-full border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${newTagColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setNewTagColor(color)}
                                />
                            ))}
                        </div>
                    </form>

                    {/* Existing Tags List */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium leading-none">
                            {t('tags.existing_tags') || 'Existing Tags'}
                        </h4>
                        <div className="max-h-[200px] overflow-y-auto space-y-2 min-h-[100px] p-1">
                            {tags.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    {t('tags.no_tags_yet') || 'No tags created yet.'}
                                </p>
                            ) : (
                                tags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="flex items-center justify-between rounded-md border p-2 bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: tag.color }}
                                            />
                                            <span className="text-sm font-medium">{tag.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteTag(tag.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
