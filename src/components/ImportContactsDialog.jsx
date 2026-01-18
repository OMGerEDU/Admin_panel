import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FileUp, FileJson, FileText, AlertCircle, CheckCircle2, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from './ui/use-toast';
import { supabase } from '../lib/supabaseClient';

export function ImportContactsDialog({ isOpen, onClose, organizationId, onImportSuccess }) {
    const { t } = useTranslation();
    const [step, setStep] = useState('upload'); // 'upload', 'preview', 'result'
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [isImporting, setIsImporting] = useState(false);
    const [importStats, setImportStats] = useState(null); // { total, success, failed }

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (!isOpen) {
            // Short delay to allow animation to finish
            const timer = setTimeout(() => {
                setStep('upload');
                setFile(null);
                setPreviewData([]);
                setImportStats(null);
                setIsImporting(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const downloadTemplate = (type) => {
        let content = '';
        let filename = '';
        let mimeType = '';

        if (type === 'csv') {
            content = 'name,phone_number,email,notes\nJohn Doe,1234567890,john@example.com,Customer from website';
            filename = 'contacts_template.csv';
            mimeType = 'text/csv';
        } else {
            content = JSON.stringify([
                {
                    "name": "Jane Smith",
                    "phone_number": "9876543210",
                    "email": "jane@example.com",
                    "notes": "VIP Client",
                    "custom_fields": { "city": "New York", "interest": "Tech" }
                }
            ], null, 2);
            filename = 'contacts_template.json';
            mimeType = 'application/json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const parseCSV = (text) => {
        const lines = text.split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const contacts = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            // Simple comma split - works for the template
            const values = lines[i].split(',').map(v => v.trim());
            const contact = {};

            headers.forEach((header, index) => {
                if (values[index]) contact[header] = values[index];
            });

            if (contact.phone_number || contact.name) {
                contacts.push(contact);
            }
        }
        return contacts;
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setImportStats(null);

        try {
            const text = await selectedFile.text();
            let contacts = [];

            if (selectedFile.name.endsWith('.csv')) {
                contacts = parseCSV(text);
            } else if (selectedFile.name.endsWith('.json')) {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    contacts = parsed;
                } else {
                    throw new Error("JSON must be an array of objects");
                }
            } else {
                throw new Error("Unsupported file format");
            }

            if (contacts.length === 0) {
                toast({ variant: 'destructive', title: "Error", description: t('contacts.no_valid_contacts') });
                return;
            }

            setPreviewData(contacts);
            setStep('preview');
        } catch (error) {
            console.error('Parse error:', error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to parse file: " + error.message });
        }
    };

    const handleRemoveRow = (index) => {
        setPreviewData(prev => prev.filter((_, i) => i !== index));
    };

    const handleCellChange = (index, field, value) => {
        setPreviewData(prev => {
            const newData = [...prev];
            newData[index] = { ...newData[index], [field]: value };
            return newData;
        });
    };

    const handleConfirmImport = async () => {
        if (!organizationId) {
            toast({ variant: 'destructive', title: "Error", description: "Organization ID missing. Please refresh or select an organization." });
            return;
        }

        if (previewData.length === 0) return;

        setIsImporting(true);
        setImportStats(null);

        try {
            let successCount = 0;
            // Filter out empty rows if any became empty during edit
            const validData = previewData.filter(c => c.phone_number || c.phone);

            if (validData.length === 0) {
                throw new Error("No valid contacts with phone numbers");
            }

            const normalizedData = validData.map(c => ({
                organization_id: organizationId,
                phone_number: c.phone_number || c.phone,
                name: c.name || c.full_name,
                email: c.email,
                notes: c.notes,
                custom_fields: c.custom_fields || {},
                updated_at: new Date().toISOString()
            }));

            // Using Supabase bulk upsert
            const { error } = await supabase
                .from('contacts')
                .upsert(normalizedData, { onConflict: 'organization_id, phone_number' });

            if (error) throw error;

            successCount = normalizedData.length;

            setImportStats({
                total: validData.length,
                success: successCount,
                failed: 0
            });

            toast({ title: t('common.success'), description: t('contacts.stats_success') + `: ${successCount}` });

            setTimeout(() => {
                onImportSuccess?.();
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Import failed:', error);
            setImportStats({ total: previewData.length, success: 0, failed: previewData.length });
            toast({ variant: 'destructive', title: t('common.error'), description: error.message || 'Import failed' });
        } finally {
            setIsImporting(false);
        }
    };

    const renderUploadStep = () => (
        <div className="py-4 space-y-6">
            <div className="flex gap-4 justify-center">
                <Button variant="outline" size="sm" onClick={() => downloadTemplate('csv')} className="flex-1 h-20 flex-col gap-2">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    {t('contacts.download_csv', 'CSV Template')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadTemplate('json')} className="flex-1 h-20 flex-col gap-2">
                    <FileJson className="h-6 w-6 text-muted-foreground" />
                    {t('contacts.download_json', 'JSON Template')}
                </Button>
            </div>

            <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center bg-muted/5 hover:bg-muted/10 transition-colors group cursor-pointer">
                <Input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3 w-full h-full">
                    <div className="bg-primary/10 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <FileUp className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                            {t('contacts.click_to_upload', 'Click to upload or drag file here')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            CSV, JSON
                        </p>
                    </div>
                </label>
            </div>
        </div>
    );

    const renderPreviewStep = () => (
        <div className="py-2 space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {t('contacts.contacts_found', { count: previewData.length })}.
                </p>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setStep('upload'); setFile(null); }}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        {t('contacts.back_to_upload', 'Back')}
                    </Button>
                </div>
            </div>

            <div className="border rounded-md max-h-[300px] overflow-y-auto">
                <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-[180px]">{t('common.name')}</TableHead>
                            <TableHead className="w-[140px]">{t('common.phone')}</TableHead>
                            <TableHead className="hidden sm:table-cell">{t('contact_card.email_address')}</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {previewData.map((contact, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="p-2">
                                    <Input
                                        value={contact.name || contact.full_name || ''}
                                        onChange={(e) => handleCellChange(idx, 'name', e.target.value)}
                                        className="h-8 text-sm"
                                        placeholder="Name"
                                    />
                                </TableCell>
                                <TableCell className="p-2">
                                    <Input
                                        value={contact.phone_number || contact.phone || ''}
                                        onChange={(e) => handleCellChange(idx, 'phone_number', e.target.value)}
                                        className="h-8 text-sm font-mono"
                                        placeholder="Phone"
                                    />
                                </TableCell>
                                <TableCell className="hidden sm:table-cell p-2">
                                    <Input
                                        value={contact.email || ''}
                                        onChange={(e) => handleCellChange(idx, 'email', e.target.value)}
                                        className="h-8 text-sm"
                                        placeholder="Email"
                                    />
                                </TableCell>
                                <TableCell className="p-2 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveRow(idx)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{step === 'preview' ? t('contacts.preview_title', 'Preview Import') : t('contacts.import_title', 'Import Contacts')}</DialogTitle>
                    <DialogDescription>
                        {step === 'preview'
                            ? t('contacts.preview_desc', 'Review contacts before importing.')
                            : t('contacts.import_desc', 'Upload a CSV or JSON file to bulk import contacts.')}
                    </DialogDescription>
                </DialogHeader>

                {step === 'upload' && renderUploadStep()}
                {step === 'preview' && renderPreviewStep()}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onClose()} disabled={isImporting}>
                        {t('common.cancel', 'Cancel')}
                    </Button>

                    {step === 'preview' && (
                        <Button onClick={handleConfirmImport} disabled={isImporting || previewData.length === 0}>
                            {isImporting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('contacts.importing_data', 'Importing...')}
                                </>
                            ) : (
                                t('contacts.confirm_import', 'Confirm Import')
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
