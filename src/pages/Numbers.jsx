import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from 'lucide-react'; // Placeholder for Badge
import { Search, Plus, MoreHorizontal, RefreshCw, Trash2, Power, PowerOff } from 'lucide-react';

// Simple Badge component since we don't have it in UI lib yet
function StatusBadge({ status }) {
    const styles = {
        connected: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        disconnected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
}

export default function Numbers() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data
    const numbers = [
        { id: 1, name: "Marketing WhatsApp", instanceId: "1101828342", status: "connected", lastSeen: "2 mins ago" },
        { id: 2, name: "Support Team", instanceId: "7721828341", status: "disconnected", lastSeen: "1 hour ago" },
        { id: 3, name: "Alerts Bot", instanceId: "9918283422", status: "connected", lastSeen: "Just now" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('numbers_page.title')}</h2>
                    <p className="text-muted-foreground">{t('numbers_page.subtitle')}</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('add_number')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('numbers_page.list_title')}</CardTitle>
                    <CardDescription>
                        {t('numbers_page.list_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder={t('numbers_page.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('common.name')}</TableHead>
                                    <TableHead>{t('common.instance_id')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead>{t('common.last_seen')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {numbers.map((number) => (
                                    <TableRow key={number.id}>
                                        <TableCell className="font-medium">{number.name}</TableCell>
                                        <TableCell>{number.instanceId}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={number.status} />
                                        </TableCell>
                                        <TableCell>{number.lastSeen}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
