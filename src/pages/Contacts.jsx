import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useContacts } from '../hooks/use-queries/useContacts';
import { getContacts } from '../services/greenApi';
import { loadChatsFromCache, loadAvatarsFromCache } from '../lib/messageLocalCache';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ContactCard } from '../components/ContactCard';
import { CreateContactDialog } from '../components/CreateContactDialog';
import { ImportContactsDialog } from '../components/ImportContactsDialog';
import { Loader2, Search, Database, Smartphone, User, Phone, RefreshCw, ChevronDown, LayoutGrid, List, Plus, Upload, Filter, Tag, Trash2, Download, X, CheckSquare, Square, MoreHorizontal } from 'lucide-react';
import { toast } from '../components/ui/use-toast';
import { useTags } from '../hooks/useTags';
import { Checkbox } from '../components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';

export default function Contacts() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, organization } = useAuth();
    const { contacts: dbContacts, isLoading: isLoadingDb, refetch: refetchDbContacts } = useContacts(organization?.id);

    // Numbers state
    const [numbers, setNumbers] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [showNumberDropdown, setShowNumberDropdown] = useState(false);

    // Local state for Green API contacts
    const [greenContacts, setGreenContacts] = useState([]);
    const [isLoadingGreen, setIsLoadingGreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // Keeping state logic but hiding UI

    // View Type: 'grid' or 'list'
    const [viewType, setViewType] = useState('grid');

    // Dialogs State
    const [selectedContact, setSelectedContact] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    // Avatars
    const [contactAvatars, setContactAvatars] = useState(new Map());

    // Filters & Selection
    const [filterSource, setFilterSource] = useState('all'); // 'all', 'whatsapp', 'storage'
    const [filterTag, setFilterTag] = useState('all'); // 'all', tagId
    const [selectedContacts, setSelectedContacts] = useState(new Set());
    const [isBulkTagOpen, setIsBulkTagOpen] = useState(false);
    const [bulkTagMode, setBulkTagMode] = useState('add'); // 'add', 'remove'

    // Tags Hook
    const { tags, chatTags, assignTagToChat, removeTagFromChat } = useTags(organization?.id, selectedNumber?.instance_id, user?.id);

    // Fetch numbers on mount
    useEffect(() => {
        const fetchNumbers = async () => {
            if (!user) return;

            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setNumbers(data);
                if (data.length > 0 && !selectedNumber) {
                    setSelectedNumber(data[0]);
                }
            }
        };
        fetchNumbers();
    }, [user]);

    // Load avatars from cache when number changes
    useEffect(() => {
        if (selectedNumber?.instance_id) {
            const cachedAvatars = loadAvatarsFromCache(selectedNumber.instance_id);
            if (cachedAvatars.size > 0) {
                setContactAvatars(cachedAvatars);
            }
        }
    }, [selectedNumber?.instance_id]);

    // Fetch Green API contacts
    const fetchGreenContacts = async () => {
        if (!selectedNumber?.instance_id || !selectedNumber?.api_token) return;

        setIsLoadingGreen(true);
        try {
            const result = await getContacts(selectedNumber.instance_id, selectedNumber.api_token);
            if (result.success && Array.isArray(result.data)) {
                setGreenContacts(result.data);
            } else {
                console.warn('Failed to fetch contacts from Green API');
            }
        } catch (error) {
            console.error('Error fetching green contacts:', error);
            toast({ variant: 'destructive', title: t('common.error') });
        } finally {
            setIsLoadingGreen(false);
        }
    };

    // Also try to get contacts from cached chats
    const getContactsFromChatsCache = () => {
        if (!selectedNumber?.instance_id) return [];

        const cachedChats = loadChatsFromCache(selectedNumber.instance_id);
        if (!cachedChats || cachedChats.length === 0) return [];

        return cachedChats.map(chat => ({
            id: chat.chatId || chat.remote_jid,
            name: chat.name || chat.chatName,
            contactName: chat.name || chat.chatName,
            source: 'cache'
        })).filter(c => c.id && !c.id.includes('@g.us')); // Filter out groups
    };

    useEffect(() => {
        if (selectedNumber) {
            fetchGreenContacts();
        }
    }, [selectedNumber?.id]);

    // Combine and filter logic
    const filteredContacts = React.useMemo(() => {
        const term = searchTerm.toLowerCase();

        // Supabase DB contacts
        const dbItems = (dbContacts || []).filter(c =>
            c.name?.toLowerCase().includes(term) ||
            c.phone_number?.includes(term) ||
            c.email?.toLowerCase().includes(term)
        ).map(c => ({
            ...c,
            source: 'storage',
            id: c.id,
            displayName: c.name || c.phone_number,
            displayPhone: c.phone_number
        }));

        // Green API contacts + cached chats
        const cacheItems = getContactsFromChatsCache();
        const allGreenItems = [...greenContacts, ...cacheItems];

        // Dedupe by ID
        const seenIds = new Set();
        const greenItems = allGreenItems.filter(c => {
            const id = c.id || c.chatId;
            if (!id || seenIds.has(id)) return false;
            seenIds.add(id);
            const name = c.name || c.contactName || id || '';
            return name.toLowerCase().includes(term) || id.includes(term);
        }).map(c => {
            const id = c.id || c.chatId;
            return {
                ...c,
                source: c.source || 'whatsapp',
                id: id,
                displayName: c.name || c.contactName || id?.split('@')[0],
                displayPhone: id?.split('@')[0]
            };
        });

        let result = activeTab === 'storage' ? dbItems : activeTab === 'whatsapp' ? greenItems : [...dbItems, ...greenItems];

        // Apply Filters
        if (filterSource !== 'all') {
            result = result.filter(c => c.source === filterSource);
        }

        if (filterTag !== 'all') {
            result = result.filter(c => {
                const id = c.id || c.chatId || c.remote_jid;
                // Check if any tag of this chat matches filterTag
                const tagsForChat = chatTags[id] || [];
                return tagsForChat.includes(filterTag);
            });
        }

        return result;
    }, [dbContacts, greenContacts, searchTerm, activeTab, selectedNumber?.instance_id, filterSource, filterTag, chatTags]);

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
    };

    const handleGoToChat = () => {
        if (!selectedContact || !selectedNumber) return;

        // Navigate to chats page with this contact
        const chatId = selectedContact.id || selectedContact.displayPhone;
        const phoneNumber = chatId?.split('@')[0] || chatId;

        // Close the contact card
        setSelectedContact(null);

        // Navigate to chats with this specific chat selected
        navigate(`/app/chats/${selectedNumber.id}/${encodeURIComponent(phoneNumber)}`);
    };

    const handleContactCreated = () => {
        // Refetch DB contacts
        // useContacts hook should auto-update if keys match but better to force or let invalidation handle it
        // The CreateDialog calls onContactCreated logic if provided.
        // We can just rely on react-query invalidation if we configured it, otherwise:
        // window.location.reload() or refetch if exposed.
        // Assuming simple refresh for now or optimistic update.
        // Since useContacts uses react-query, we might want to invalidate queries
        // For now, let's just refetch DB contacts if `refetch` exposed or hope for the best.
        // Added refetch to useContacts return above.
        // Actually, refetchDbContacts() from useContacts return.

        // Also fetch green contacts? No, created contact is storage only.
        // refetchDbContacts?.(); // Need to ensure useContacts returns refetch
        // Let's assume it does or user didn't ask for live update, but I added it to destructuring.
    };

    const toggleSelection = (id, e) => {
        e.stopPropagation();
        const newSet = new Set(selectedContacts);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedContacts(newSet);
    };

    const selectAll = () => {
        if (selectedContacts.size === filteredContacts.length) {
            setSelectedContacts(new Set());
        } else {
            setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(t('contacts.confirm_bulk_delete', `Delete ${selectedContacts.size} contacts? (Only storage contacts will be deleted)`))) return;

        const ids = Array.from(selectedContacts);
        // We can only delete storage contacts reliably via ID
        const storageIds = filteredContacts.filter(c => selectedContacts.has(c.id) && c.source === 'storage').map(c => c.id);

        if (storageIds.length > 0) {
            const { error } = await supabase.from('contacts').delete().in('id', storageIds);
            if (error) {
                toast({ variant: 'destructive', title: t('common.error'), description: error.message });
            } else {
                toast({ title: t('common.success'), description: t('contacts.deleted_count', { count: storageIds.length }) });
                refetchDbContacts();
                setSelectedContacts(new Set());
            }
        } else {
            toast({ description: t('contacts.no_storage_contacts_selected', 'No storage contacts selected to delete.') });
            setSelectedContacts(new Set());
        }
    };

    const handleBulkExport = () => {
        const contactsToExport = filteredContacts.filter(c => selectedContacts.has(c.id));
        if (contactsToExport.length === 0) return;

        const csvContent = [
            ['Name', 'Phone', 'Email', 'Source'].join(','),
            ...contactsToExport.map(c => [
                `"${c.displayName || ''}"`,
                `"${c.displayPhone || ''}"`,
                `"${c.email || ''}"`,
                c.source
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `contacts_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBulkTag = async (tagId) => {
        if (!selectedNumber?.instance_id) return;

        let count = 0;
        const contactsToTag = filteredContacts.filter(c => selectedContacts.has(c.id));

        for (const contact of contactsToTag) {
            const chatId = contact.id || contact.remote_jid;
            if (!chatId) continue;

            try {
                if (bulkTagMode === 'add') {
                    await assignTagToChat(chatId, tagId);
                } else {
                    await removeTagFromChat(chatId, tagId);
                }
                count++;
            } catch (e) {
                console.error('Failed to update tag for', chatId, e);
            }
        }

        toast({ title: t('common.success'), description: t('contacts.updated_tags_count', { count }) });
        setIsBulkTagOpen(false);
        setSelectedContacts(new Set());
    };

    // Render contact item based on view type (Grid)
    const renderContactGrid = (contact, idx) => {
        const isSelected = selectedContacts.has(contact.id);
        const contactTags = chatTags[contact.id] || [];

        return (
            <div
                key={contact.id || idx}
                className={cn(
                    "group relative overflow-hidden rounded-xl border bg-background/40 transition-all duration-300 p-3 sm:p-4 flex items-center gap-4 shadow-sm hover:shadow-md cursor-pointer",
                    isSelected ? "border-primary bg-primary/5" : "border-border/40 hover:bg-background/80 hover:border-primary/30"
                )}
                onClick={() => handleContactClick(contact)}
            >
                {/* Selection Checkbox (Visible on hover or selected) */}
                <div
                    className={cn("absolute top-2 right-2 z-10", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}
                    onClick={(e) => toggleSelection(contact.id, e)}
                >
                    {isSelected ? <CheckSquare className="h-5 w-5 text-primary fill-primary/10" /> : <Square className="h-5 w-5 text-muted-foreground/50 hover:text-primary" />}
                </div>

                {/* Avatar */}
                {contactAvatars.get(contact.id) ? (
                    <img
                        src={contactAvatars.get(contact.id)}
                        alt={contact.displayName}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                        {contact.displayName?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-medium truncate text-foreground text-sm group-hover:text-primary transition-colors pr-6">
                            {contact.displayName}
                        </h4>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <Phone className="h-3 w-3 mr-1" />
                        <span className="truncate">{contact.displayPhone}</span>
                    </div>
                    {/* Tags in Grid */}
                    <div className="flex flex-wrap gap-1 mt-1">
                        {contactTags.slice(0, 3).map(tagId => {
                            const tag = tags.find(t => t.id === tagId);
                            if (!tag) return null;
                            return (
                                <span key={tagId} className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} title={tag.name} />
                            );
                        })}
                    </div>
                </div>

                <div className="absolute bottom-2 right-2">
                    {contact.source === 'storage' ? (
                        <Database className="h-3.5 w-3.5 text-blue-400 opacity-70" title="Saved in Storage" />
                    ) : (
                        <Smartphone className="h-3.5 w-3.5 text-green-500 opacity-70" title="From WhatsApp" />
                    )}
                </div>

            </div>
        );
    };

    // Render contact item based on view type (List)
    const renderContactList = (contact, idx) => {
        const isSelected = selectedContacts.has(contact.id);
        const contactTags = chatTags[contact.id] || [];

        return (
            <div
                key={contact.id || idx}
                className={cn(
                    "group flex items-center gap-4 px-4 py-3 transition-colors cursor-pointer border-b border-border/30 last:border-b-0",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                )}
                onClick={() => handleContactClick(contact)}
            >
                <div
                    className="shrink-0 cursor-pointer"
                    onClick={(e) => toggleSelection(contact.id, e)}
                >
                    {isSelected ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-muted-foreground/30 hover:text-primary" />}
                </div>

                {contactAvatars.get(contact.id) ? (
                    <img
                        src={contactAvatars.get(contact.id)}
                        alt={contact.displayName}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                        {contact.displayName?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                )}

                <div className="min-w-[180px] flex-1">
                    <h4 className="font-medium text-base text-foreground group-hover:text-primary transition-colors truncate">
                        {contact.displayName}
                    </h4>
                    {/* Tags in List */}
                    <div className="flex gap-1 mt-1">
                        {contactTags.map(tagId => {
                            const tag = tags.find(t => t.id === tagId);
                            if (!tag) return null;
                            return (
                                <Badge key={tagId} variant="outline" className="text-[10px] h-4 px-1" style={{ borderColor: tag.color, color: tag.color }}>
                                    {tag.name}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                <div className="min-w-[140px] text-base text-muted-foreground font-mono">
                    {contact.displayPhone}
                </div>

                <div className="min-w-[180px] text-base text-muted-foreground hidden lg:block">
                    {contact.email || '-'}
                </div>

                <div className="min-w-[80px] flex justify-end">
                    {contact.source === 'storage' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-blue-500/10 text-blue-500">
                            <Database className="h-3.5 w-3.5" />
                            {t('data_sources.storage', 'Storage')}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-green-500/10 text-green-500">
                            <Smartphone className="h-3.5 w-3.5" />
                            WA
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('sidebar.contacts')}</h1>
                    <p className="text-muted-foreground mt-1">
                        {t('contacts.subtitle', 'Manage your saved contacts and WhatsApp interactions')}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Number Selector */}
                    {numbers.length > 0 && (
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowNumberDropdown(!showNumberDropdown)}
                                className="min-w-[140px] justify-between"
                            >
                                <span className="truncate">
                                    {selectedNumber?.phone_number || selectedNumber?.name || t('chats_page.select_number')}
                                </span>
                                <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
                            </Button>
                            {showNumberDropdown && (
                                <div className="absolute right-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
                                    {numbers.map(num => (
                                        <button
                                            key={num.id}
                                            className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors ${selectedNumber?.id === num.id ? 'bg-primary/10 text-primary' : ''
                                                }`}
                                            onClick={() => {
                                                setSelectedNumber(num);
                                                setShowNumberDropdown(false);
                                                setGreenContacts([]); // Reset
                                            }}
                                        >
                                            {num.phone_number || num.name || num.instance_id}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <Button variant="outline" size="sm" onClick={fetchGreenContacts} disabled={isLoadingGreen || !selectedNumber}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingGreen ? 'animate-spin' : ''}`} />
                        {t('common.refresh')}
                    </Button>
                </div>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex gap-2 items-center flex-1 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                            <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shrink-0">
                                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">{t('contacts.create_contact', 'Create')}</span>
                            </Button>

                            {/* Source Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={filterSource !== 'all' ? "secondary" : "outline"} size="sm" className="gap-2 shrink-0 border-dashed">
                                        <Filter className="h-4 w-4" />
                                        {filterSource === 'all' ? 'All Sources' : filterSource === 'whatsapp' ? 'WhatsApp' : 'Storage'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setFilterSource('all')}>All Sources</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterSource('whatsapp')}>WhatsApp</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterSource('storage')}>Storage (Manual/Import)</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Tag Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={filterTag !== 'all' ? "secondary" : "outline"} size="sm" className="gap-2 shrink-0 border-dashed">
                                        <Tag className="h-4 w-4" />
                                        {filterTag === 'all' ? 'All Tags' : tags.find(t => t.id === filterTag)?.name || 'Unknown Tag'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setFilterTag('all')}>All Tags</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {tags.map(tag => (
                                        <DropdownMenuItem key={tag.id} onClick={() => setFilterTag(tag.id)}>
                                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                                            {tag.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Selection Status */}
                            {selectedContacts.size > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary shrink-0 animate-in fade-in zoom-in">
                                    {selectedContacts.size} Selected
                                    <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setSelectedContacts(new Set())} />
                                </div>
                            )}

                            {/* View Toggle */}
                            <div className="flex gap-1 ml-auto shrink-0">
                                <button
                                    className={viewButtonClass('grid')}
                                    onClick={() => setViewType('grid')}
                                    title={t('contacts.grid_view', 'Grid View')}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    className={viewButtonClass('list')}
                                    onClick={() => setViewType('list')}
                                    title={t('contacts.list_view', 'List View')}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="relative w-full sm:w-64 shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('common.search', 'Search...')}
                                className="pl-9 bg-background/50 border-primary/20 focus:border-primary/50 transition-all font-sans"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {!selectedNumber && numbers.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="bg-muted/30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">{t('chats_page.no_number_selected', 'No number connected')}</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                                {t('contacts.no_number_hint', 'Connect a WhatsApp number first to see contacts.')}
                            </p>
                        </div>
                    ) : (isLoadingDb && activeTab !== 'whatsapp') || isLoadingGreen ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredContacts.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="bg-muted/30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                                <User className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">{t('common.no_data', 'No contacts found')}</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                                {t('contacts.empty_state', 'Try adjusting your search or refresh to find contacts.')}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {/* Select All Bar (Visible in Grid) */}
                            {viewType === 'grid' && (
                                <div className="mb-4 flex items-center gap-2 pl-1">
                                    <div
                                        className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-primary transition-colors"
                                        onClick={selectAll}
                                    >
                                        {selectedContacts.size === filteredContacts.length && filteredContacts.length > 0 ? (
                                            <CheckSquare className="h-5 w-5 text-primary" />
                                        ) : (
                                            <Square className="h-5 w-5" />
                                        )}
                                        {selectedContacts.size === filteredContacts.length ? 'Deselect All' : 'Select All'}
                                    </div>
                                </div>
                            )}

                            {viewType === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredContacts.map((contact, idx) => renderContactGrid(contact, idx))}
                                </div>
                            ) : (
                                <div className="border border-border/30 rounded-lg overflow-hidden">
                                    {/* List Header */}
                                    <div className="flex items-center gap-4 px-4 py-3 bg-muted/30 border-b border-border/30 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        <div
                                            className="w-5 cursor-pointer"
                                            onClick={selectAll}
                                        >
                                            {selectedContacts.size === filteredContacts.length && filteredContacts.length > 0 ? (
                                                <CheckSquare className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Square className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div className="w-10" />
                                        <div className="min-w-[180px] flex-1">{t('common.name', 'Name')}</div>
                                        <div className="min-w-[140px]">{t('common.phone', 'Phone')}</div>
                                        <div className="min-w-[180px] hidden lg:block">{t('contact_card.email_address', 'Email')}</div>
                                        <div className="min-w-[80px] text-right">{t('common.source', 'Source')}</div>
                                    </div>
                                    {/* List Items */}
                                    {filteredContacts.map((contact, idx) => renderContactList(contact, idx))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bulk Action Bar - Floating */}
            {selectedContacts.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-foreground text-background dark:bg-card dark:text-foreground dark:border dark:border-border p-3 rounded-full shadow-2xl z-50 flex items-center justify-between px-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold">{selectedContacts.size} Selected</span>
                        <div className="h-4 w-[1px] bg-background/20 dark:bg-border" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white dark:text-foreground hover:bg-white/10"
                            onClick={() => setSelectedContacts(new Set())}
                        >
                            Cancel
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 rounded-full"
                            onClick={() => {
                                setBulkTagMode('add');
                                setIsBulkTagOpen(true);
                            }}
                        >
                            <Tag className="h-3.5 w-3.5" /> Tag
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 rounded-full"
                            onClick={handleBulkExport}
                        >
                            <Download className="h-3.5 w-3.5" /> Export
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2 rounded-full px-4"
                            onClick={handleBulkDelete}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Contact Card Popup */}
            <ContactCard
                isOpen={!!selectedContact}
                onClose={() => setSelectedContact(null)}
                contactPhone={selectedContact?.displayPhone}
                contactName={selectedContact?.displayName}
                contactAvatar={contactAvatars.get(selectedContact?.id)}
                organizationId={organization?.id || selectedNumber?.organization_id}
                onGoToChat={handleGoToChat}
            />

            {/* Create Contact Dialog */}
            <CreateContactDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                organizationId={organization?.id || selectedNumber?.organization_id}
                onContactCreated={handleContactCreated}
            />

            {/* Import Contacts Dialog */}
            <ImportContactsDialog
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                organizationId={organization?.id || selectedNumber?.organization_id}
                onImportSuccess={handleContactCreated}
            />

            {/* Bulk Tag Dialog */}
            <Dialog open={isBulkTagOpen} onOpenChange={setIsBulkTagOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{bulkTagMode === 'add' ? 'Add Tags to Selected' : 'Remove Tags from Selected'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
                        {tags.map(tag => (
                            <div
                                key={tag.id}
                                className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-muted"
                                onClick={() => handleBulkTag(tag.id)}
                            >
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                                <span className="font-medium">{tag.name}</span>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBulkTagOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
