import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, Tag, Loader2, Pencil, Eye, Check, X, Palette, Hash } from 'lucide-react';
import { useTags } from '../hooks/useTags';
import { TagsViewModal } from './TagsViewModal';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

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

export function TagsManager({ organizationId, userId, open, onOpenChange, chats = [], onNavigateChat }) {
    const { t } = useTranslation();
    const { tags, createTag, deleteTag, updateTag } = useTags(organizationId, null, userId);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
    const [isCreating, setIsCreating] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);

    // Edit Mode State
    const [editingTagId, setEditingTagId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('');

    // View Mode State
    const [viewingTag, setViewingTag] = useState(null);

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

    const handleSeedTags = async () => {
        try {
            setIsSeeding(true);
            const sampleTags = [
                { name: t('tags.urgent') || 'Urgent', color: '#EF4444' },
                { name: t('tags.follow_up') || 'Follow Up', color: '#EAB308' },
                { name: t('tags.completed') || 'Completed', color: '#22C55E' },
                { name: t('tags.lead') || 'Lead', color: '#3B82F6' },
                { name: t('tags.late') || 'Late', color: '#8B5CF6' },
            ];

            for (const tag of sampleTags) {
                if (!tags.some(t => t.name === tag.name)) {
                    await createTag(tag.name, tag.color);
                    await new Promise(r => setTimeout(r, 200));
                }
            }
        } catch (error) {
            console.error('Failed to seed tags:', error);
        } finally {
            setIsSeeding(false);
        }
    };

    const startEditing = (tag) => {
        setEditingTagId(tag.id);
        setEditName(tag.name);
        setEditColor(tag.color);
    };

    const cancelEditing = () => {
        setEditingTagId(null);
        setEditName('');
        setEditColor('');
    };

    const saveEditing = async () => {
        if (!editName.trim()) return;

        // Optimistic update handled by hook ideally, but lets assumes hook updateTag logic
        try {
            // Check if updateTag exists, if not we might fail. 
            // I'll add updateTags strictly after this file edit.
            if (updateTag) {
                await updateTag(editingTagId, editName, editColor);
            }
            setEditingTagId(null);
        } catch (error) {
            console.error('Failed to update tag:', error);
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
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col bg-background/80 backdrop-blur-xl border-white/20 shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="px-6 py-4 border-b border-white/10 shrink-0">
                        <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            <Tag className="h-6 w-6 text-primary" />
                            {t('tags.manage_tags') || 'Tag Management'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">
                        {/* Create New Tag Input */}
                        <div className="shrink-0 bg-muted/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                            <form onSubmit={handleCreateTag} className="flex gap-3">
                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder={t('tags.tag_name_placeholder') || 'Enter tag name...'}
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        className="bg-background/50 border-white/10 focus:border-primary/50 transition-all h-10"
                                    />
                                </div>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-10 h-10 rounded-full p-0 shrink-0 border-2"
                                            style={{ backgroundColor: newTagColor, borderColor: newTagColor }}
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-3 grid grid-cols-5 gap-2 bg-background/95 backdrop-blur shadow-xl border-white/10">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary ${newTagColor === color ? 'ring-2 ring-primary scale-110 border-white' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setNewTagColor(color)}
                                            />
                                        ))}
                                    </PopoverContent>
                                </Popover>

                                <Button
                                    type="submit"
                                    disabled={isCreating || !newTagName.trim()}
                                    className="h-10 px-6 shadow-lg shadow-primary/20"
                                >
                                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5" />}
                                </Button>
                            </form>
                        </div>

                        {/* Tags Grid */}
                        <ScrollArea className="flex-1 -mx-2 px-2">
                            {tags.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                                    <div className="bg-muted/30 p-4 rounded-full">
                                        <Tag className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground/80">{t('tags.no_tags_title') || 'No tags yet'}</p>
                                        <p className="text-sm text-muted-foreground">{t('tags.no_tags_desc') || 'Create your first tag to get started'}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSeedTags}
                                        disabled={isSeeding}
                                        className="mt-2 border-primary/20 hover:bg-primary/5 hover:text-primary text-primary/80"
                                    >
                                        {isSeeding ? (
                                            <>
                                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                {t('common.generating') || 'Generating...'}
                                            </>
                                        ) : (
                                            t('tags.generate_sample') || 'Generate Sample Tags'
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                                    {tags.map((tag) => (
                                        <div
                                            key={tag.id}
                                            className="group relative flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-card/50 hover:bg-card hover:border-white/10 hover:shadow-lg transition-all duration-300"
                                        >
                                            {editingTagId === tag.id ? (
                                                // Edit Mode
                                                <>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                className="h-8 w-8 rounded-full border shrink-0 transition-transform hover:scale-105"
                                                                style={{ backgroundColor: editColor }}
                                                            />
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-64 p-3 grid grid-cols-5 gap-2 bg-background/95 backdrop-blur shadow-xl border-white/10">
                                                            {PRESET_COLORS.map((color) => (
                                                                <button
                                                                    key={color}
                                                                    className={`h-6 w-6 rounded-full border ${editColor === color ? 'ring-2 ring-primary' : ''}`}
                                                                    style={{ backgroundColor: color }}
                                                                    onClick={() => setEditColor(color)}
                                                                />
                                                            ))}
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="h-8 text-sm"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-1">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={saveEditing}>
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={cancelEditing}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                // View Mode
                                                <>
                                                    <div
                                                        className="h-10 w-1 bg-primary rounded-full shrink-0"
                                                        style={{ backgroundColor: tag.color }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm truncate">{tag.name}</h4>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {/* Placeholder for usage count if available later */}
                                                            {t('tags.tag_id', { id: tag.id.slice(0, 4) }) || `#${tag.id.slice(0, 4)}`}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                            onClick={() => setViewingTag(tag)}
                                                            title={t('tags.view_chats') || 'View Chats'}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                                                            onClick={() => startEditing(tag)}
                                                            title={t('common.edit') || 'Edit'}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteTag(tag.id)}
                                                            title={t('common.delete') || 'Delete'}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>

            <TagsViewModal
                tag={viewingTag}
                chats={chats}
                open={!!viewingTag}
                onClose={() => setViewingTag(null)}
                onNavigate={(chatId) => {
                    onNavigateChat && onNavigateChat(chatId);
                    setViewingTag(null);
                    onOpenChange(false); // Close main modal too
                }}
            />
        </>
    );
}
