import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'; // Assuming tabs exist or we use simple toggle
import { FileUp, Download, FileJson, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'; // Icons
import { toast } from './ui/use-toast';
import { supabase } from '../lib/supabaseClient';

export function ImportContactsDialog({ isOpen, onClose, organizationId, onImportSuccess }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('csv');
    const [file, setFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importStats, setImportStats] = useState(null); // { total, success, failed }

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
                    name: "Jane Smith",
                    phone_number: "9876543210",
                    email: "jane@example.com",
                    notes: "VIP Client",
                    custom_fields: { "city": "New York", "interest": "Tech" }
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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setImportStats(null);
        }
    };

    const parseCSV = (text) => {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        const contacts = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(',');
            const contact = {};
            headers.forEach((header, index) => {
                let value = values[index]?.trim();
                if (value) contact[header] = value;
            });
            if (contact.phone_number) contacts.push(contact);
        }
        return contacts;
    };

    const handleImport = async () => {
        if (!file || !organizationId) return;

        setIsImporting(true);
        setImportStats(null);

        try {
            const text = await file.text();
            let contacts = [];

            if (file.name.endsWith('.csv')) {
                contacts = parseCSV(text);
            } else if (file.name.endsWith('.json')) {
                contacts = JSON.parse(text);
                if (!Array.isArray(contacts)) throw new Error("JSON must be an array of objects");
            } else {
                throw new Error("Unsupported file format");
            }

            if (contacts.length === 0) {
                throw new Error("No valid contacts found in file");
            }

            // Batch insert/upsert
            let successCount = 0;
            let failureCount = 0;

            for (const contact of contacts) {
                // normalize phone?
                if (!contact.phone_number) {
                    failureCount++;
                    continue;
                }

                const { error } = await supabase
                    .from('contacts')
                    .upsert({
                        organization_id: organizationId,
                        phone_number: contact.phone_number,
                        name: contact.name,
                        email: contact.email,
                        notes: contact.notes,
                        custom_fields: contact.custom_fields || {},
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'organization_id, phone_number' });

                if (error) {
                    console.error("Import error details:", error);
                    failureCount++;
                } else {
                    successCount++;
                }
            }

            setImportStats({ total: contacts.length, success: successCount, failed: failureCount });
            if (successCount > 0) {
                toast({ title: t('common.success'), description: `Imported ${successCount} contacts successfully` });
                onImportSuccess?.();
            } else {
                toast({ variant: 'destructive', title: t('common.error'), description: "Failed to import any contacts" });
            }

        } catch (error) {
            console.error('Import failed:', error);
            toast({ variant: 'destructive', title: t('common.error'), description: error.message || 'Import failed' });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('contacts.import_title', 'Import Contacts')}</DialogTitle>
                    <DialogDescription>
                        {t('contacts.import_desc', 'Upload a CSV or JSON file to bulk import contacts.')}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {/* Template Downloads */}
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" size="sm" onClick={() => downloadTemplate('csv')} className="flex-1">
                            <FileText className="mr-2 h-4 w-4" />
                            {t('contacts.download_csv', 'CSV Template')}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadTemplate('json')} className="flex-1">
                            <FileJson className="mr-2 h-4 w-4" />
                            {t('contacts.download_json', 'JSON Template')}
                        </Button>
                    </div>

                    {/* File Upload */}
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/5 hover:bg-muted/10 transition-colors">
                        <Input
                            type="file"
                            accept=".csv,.json"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <FileUp className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                                {file ? file.name : t('contacts.click_to_upload', 'Click to upload or drag file here')}
                            </span>
                            <span className="text-xs text-muted-foreground/70">
                                .csv, .json
                            </span>
                        </label>
                    </div>

                    {/* Stats or Loading */}
                    {isImporting && (
                        <div className="flex items-center justify-center gap-2 text-primary">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">{t('contacts.importing_data', 'Importing data...')}</span>
                        </div>
                    )}

                    {importStats && (
                        <div className={`p-3 rounded-lg text-sm border ${importStats.success > 0 ? 'bg-green-500/10 border-green-500/20 text-green-700' : 'bg-red-500/10 border-red-500/20 text-red-700'}`}>
                            <div className="font-medium flex items-center gap-2">
                                {importStats.success > 0 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                {t('contacts.import_results', 'Import Results')}
                            </div>
                            <div className="mt-1 opacity-90">
                                {t('contacts.stats_total', 'Total')}: {importStats.total} / {t('contacts.stats_success', 'Success')}: {importStats.success} / {t('contacts.stats_failed', 'Failed')}: {importStats.failed}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onClose()}>{t('common.cancel', 'Cancel')}</Button>
                    <Button onClick={handleImport} disabled={!file || isImporting}>
                        {t('contacts.start_import', 'Start Import')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
