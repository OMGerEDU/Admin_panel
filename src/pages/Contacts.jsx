import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useContacts } from '../hooks/use-queries/useContacts';
import { getContacts } from '../services/greenApi';
import { loadChatsFromCache } from '../lib/messageLocalCache';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Loader2, Search, Database, Smartphone, User, Phone, RefreshCw, ChevronDown } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

export default function Contacts() {
    const { t } = useTranslation();
    const { user, organization } = useAuth();
    const { contacts: dbContacts, isLoading: isLoadingDb } = useContacts(organization?.id);

    // Numbers state (like Chats page)
    const [numbers, setNumbers] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [showNumberDropdown, setShowNumberDropdown] = useState(false);

    // Local state for Green API contacts
    const [greenContacts, setGreenContacts] = useState([]);
    const [isLoadingGreen, setIsLoadingGreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // Fetch numbers on mount (same pattern as Chats)
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

    // Fetch Green API contacts when number is selected
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

        if (activeTab === 'storage') return dbItems;
        if (activeTab === 'whatsapp') return greenItems;

        return [...dbItems, ...greenItems];
    }, [dbContacts, greenContacts, searchTerm, activeTab, selectedNumber?.instance_id]);

    const tabButtonClass = (tab) =>
        `px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
        }`;

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
                        <div className="flex gap-2">
                            <button className={tabButtonClass('all')} onClick={() => setActiveTab('all')}>
                                {t('common.all', 'All')}
                            </button>
                            <button className={tabButtonClass('storage')} onClick={() => setActiveTab('storage')}>
                                {t('data_sources.storage', 'Storage')}
                            </button>
                            <button className={tabButtonClass('whatsapp')} onClick={() => setActiveTab('whatsapp')}>
                                {t('data_sources.whatsapp', 'WhatsApp')}
                            </button>
                        </div>
                        <div className="relative w-full sm:w-72">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredContacts.map((contact, idx) => (
                                <div
                                    key={contact.id || idx}
                                    className="group relative overflow-hidden rounded-xl border border-border/40 bg-background/40 hover:bg-background/80 hover:border-primary/30 transition-all duration-300 p-4 flex items-center gap-4 shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                                        {contact.displayName?.substring(0, 2).toUpperCase() || '??'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className="font-medium truncate text-foreground text-sm group-hover:text-primary transition-colors">
                                                {contact.displayName}
                                            </h4>
                                            {contact.source === 'storage' ? (
                                                <Database className="h-3.5 w-3.5 text-blue-400 opacity-70" title="Saved in Storage" />
                                            ) : (
                                                <Smartphone className="h-3.5 w-3.5 text-green-500 opacity-70" title="From WhatsApp" />
                                            )}
                                        </div>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Phone className="h-3 w-3 mr-1" />
                                            <span className="truncate">{contact.displayPhone}</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/10 rounded-xl transition-all pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
