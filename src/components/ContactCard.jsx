import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, User, Mail, Phone, Plus, Trash2, Save, ExternalLink, StickyNote, Briefcase, MapPin, Tag, MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { useContact } from '../hooks/use-queries/useContact';
import { useToast } from './ui/use-toast';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export function ContactCard({ isOpen, onClose, contactPhone, contactName, contactAvatar, organizationId, onGoToChat }) {
    const { t, i18n } = useTranslation();

    console.log('ContactCard Debug:', {
        lang: i18n.language,
        translation: t('contact_card.basic_details'),
        exists: i18n.exists('contact_card.basic_details')
    });

    // Hooks
    const { contact, isLoading, saveContact, isSaving } = useContact(contactPhone, organizationId);

    // Local State for Editing
    const [formData, setFormData] = useState({});
    const [newFieldKey, setNewFieldKey] = useState('');
    const [newFieldValue, setNewFieldValue] = useState('');
    const [isAddingField, setIsAddingField] = useState(false);

    // Sync state with fetching data
    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name || contactName || '',
                email: contact.email || '',
                notes: contact.notes || '',
                custom_fields: contact.custom_fields || {},
                crm_links: contact.crm_links || {}
            });
        }
    }, [contact, contactName]);

    const handleSavePrimary = async () => {
        try {
            await saveContact({
                organization_id: organizationId,
                phone_number: contactPhone,
                name: formData.name,
                email: formData.email,
                notes: formData.notes,
                custom_fields: formData.custom_fields,
                crm_links: formData.crm_links
            });
            toast({ title: t('common.success'), description: t('contact_card.contact_saved') });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: t('contact_card.save_error') });
        }
    };

    const handleAddCustomField = () => {
        if (!newFieldKey.trim()) return;

        const updatedFields = {
            ...formData.custom_fields,
            [newFieldKey.trim()]: newFieldValue.trim()
        };

        setFormData(prev => ({ ...prev, custom_fields: updatedFields }));
        setNewFieldKey('');
        setNewFieldValue('');
        setIsAddingField(false);
    };

    const handleRemoveCustomField = (key) => {
        const updatedFields = { ...formData.custom_fields };
        delete updatedFields[key];
        setFormData(prev => ({ ...prev, custom_fields: updatedFields }));
    };

    const handleUpdateCustomField = (key, value) => {
        setFormData(prev => ({
            ...prev,
            custom_fields: {
                ...prev.custom_fields,
                [key]: value
            }
        }));
    };

    if (!isOpen) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        {contactAvatar ? (
                            <img src={contactAvatar} alt={contactName} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                        )}
                        <div>
                            <SheetTitle className="text-xl">{contactName || contactPhone}</SheetTitle>
                            <SheetDescription className="font-mono text-xs text-muted-foreground mt-1">
                                {contactPhone}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-6 py-4">
                    {/* Primary Info */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="w-4 h-4" /> {t('contact_card.basic_details')}
                        </h4>
                        <div className="grid gap-2">
                            <Input
                                placeholder={t('contact_card.full_name')}
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                prefix={<User className="w-4 h-4 text-muted-foreground" />}
                            />
                            <Input
                                placeholder={t('contact_card.email_address')}
                                value={formData.email || ''}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                type="email"
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Dynamic Custom Fields */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <Tag className="w-4 h-4" /> {t('contact_card.dynamic_info')}
                            </h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => setIsAddingField(true)}
                            >
                                <Plus className="w-3 h-3 mr-1" /> {t('contact_card.add_field')}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {/* Existing Fields */}
                            {Object.entries(formData.custom_fields || {}).map(([key, value]) => (
                                <div key={key} className="flex gap-2 group items-center">
                                    <div className="w-1/3 text-xs font-semibold text-muted-foreground truncate bg-muted/50 p-2 rounded-md">
                                        {key}
                                    </div>
                                    <Input
                                        className="flex-1 h-9 text-sm"
                                        value={value}
                                        onChange={(e) => handleUpdateCustomField(key, e.target.value)}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRemoveCustomField(key)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}

                            {/* New Field Input */}
                            {isAddingField && (
                                <div className="flex gap-2 items-center bg-muted/20 p-2 rounded-md border border-dashed border-primary/50 animate-in fade-in-50">
                                    <Input
                                        placeholder={t('contact_card.label_placeholder')}
                                        className="w-1/3 h-8 text-xs"
                                        value={newFieldKey}
                                        onChange={e => setNewFieldKey(e.target.value)}
                                        autoFocus
                                    />
                                    <Input
                                        placeholder={t('contact_card.value_placeholder')}
                                        className="flex-1 h-8 text-xs"
                                        value={newFieldValue}
                                        onChange={e => setNewFieldValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddCustomField();
                                        }}
                                    />
                                    <Button size="icon" className="h-8 w-8" onClick={handleAddCustomField}>
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsAddingField(false)}>
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}

                            {!isAddingField && Object.keys(formData.custom_fields || {}).length === 0 && (
                                <div className="text-center py-4 text-xs text-muted-foreground border border-dashed rounded-md">
                                    {t('contact_card.no_dynamic_fields')}
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Notes */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <StickyNote className="w-4 h-4" /> {t('contact_card.notes')}
                        </h4>
                        <Textarea
                            placeholder={t('contact_card.notes_placeholder')}
                            value={formData.notes || ''}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between pt-4 mt-auto gap-2">
                    {onGoToChat && (
                        <Button variant="outline" onClick={onGoToChat} className="flex-1 sm:flex-none">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {t('contacts.go_to_chat', 'Go to Chat')}
                        </Button>
                    )}
                    <Button onClick={handleSavePrimary} disabled={isSaving} className="flex-1 sm:flex-none">
                        {isSaving ? (
                            <>{t('contact_card.saving')}</>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {t('contact_card.save_changes')}
                            </>
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
