import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '../lib/supabaseClient';
import { toast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';

export function CreateContactDialog({ isOpen, onClose, organizationId, onContactCreated }) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!phone || !organizationId) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('contacts')
                .insert([{
                    organization_id: organizationId,
                    phone_number: phone,
                    name: name,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast({ variant: 'destructive', title: t('common.error'), description: t('contacts.already_exists', 'Contact already exists') });
                } else {
                    throw error;
                }
            } else {
                toast({ title: t('common.success'), description: t('contacts.created_success', 'Contact created') });
                onContactCreated?.(data);
                onClose();
                setName('');
                setPhone('');
            }
        } catch (error) {
            console.error('Create contact error:', error);
            toast({ variant: 'destructive', title: t('common.error'), description: t('common.error_occurred') });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('contacts.create_new', 'Create New Contact')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('common.name', 'Name')}
                        </label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="phone" className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('common.phone', 'Phone')}
                        </label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="col-span-3"
                            placeholder="1234567890"
                            type="tel"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate} disabled={!phone || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('common.create', 'Create')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
