import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Download, Chrome, CheckCircle2, ExternalLink } from 'lucide-react';

export default function Extension() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('extension')}</h2>
                <p className="text-muted-foreground">{t('extension_page.subtitle')}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('extension_page.installation')}</CardTitle>
                        <CardDescription>{t('extension_page.get_extension')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center p-4 border rounded-lg bg-card">
                            <Chrome className="h-8 w-8 text-blue-500 mr-4" />
                            <div className="flex-1">
                                <h4 className="font-semibold">{t('extension_page.chrome_extension')}</h4>
                                <p className="text-sm text-muted-foreground">{t('extension_page.version')} 2.4.0</p>
                            </div>
                            <Button>
                                <Download className="mr-2 h-4 w-4" />
                                {t('extension_page.download')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('extension_page.preview')}</CardTitle>
                        <CardDescription>{t('extension_page.how_it_looks')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg p-4 shadow-xl bg-background max-w-[300px] mx-auto">
                            {/* Mock Extension UI */}
                            <div className="flex items-center justify-between border-b pb-2 mb-2">
                                <span className="font-bold text-sm text-primary">Ferns</span>
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-8 bg-muted rounded w-full"></div>
                                <div className="h-20 bg-muted rounded w-full"></div>
                                <div className="flex justify-end">
                                    <div className="h-8 bg-primary rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Installation Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('extension_page.instructions')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-3 list-decimal list-inside">
                        <li className="text-sm">{t('extension_page.step1')}</li>
                        <li className="text-sm">{t('extension_page.step2')}</li>
                        <li className="text-sm">{t('extension_page.step3')}</li>
                        <li className="text-sm">{t('extension_page.step4')}</li>
                    </ol>
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm">Extension Features</p>
                                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                    <li>• Quick send messages from any webpage</li>
                                    <li>• View chat history</li>
                                    <li>• Manage numbers on the go</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
