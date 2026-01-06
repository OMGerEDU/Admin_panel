import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Support() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">{t('support_page.title')}</h1>
                <p className="text-xl text-muted-foreground">
                    {t('support_page.subtitle')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-10">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            {t('support_page.email_support_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('support_page.email_support_desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            {t('support_page.email_support_text')}
                        </p>
                        <Button asChild className="w-full">
                            <a href="mailto:support@ferns.builders-tech.com">
                                {t('support_page.contact_support')}
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            {t('support_page.community_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('support_page.community_desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            {t('support_page.community_text')}
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://github.com/GreenBuilders" target="_blank" rel="noopener noreferrer">
                                {t('support_page.visit_github')} <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-lg border-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {t('support_page.common_topics')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-2">{t('support_page.getting_started_title')}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                {t('support_page.getting_started_text')}
                            </p>
                            <Link to="/app/dashboard" className="text-sm text-primary hover:underline">
                                {t('support_page.go_dashboard')} &rarr;
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-2">{t('support_page.account_mgmt_title')}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                {t('support_page.account_mgmt_text')}
                            </p>
                            <Link to="/app/settings" className="text-sm text-primary hover:underline">
                                {t('support_page.go_settings')} &rarr;
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-2">{t('support_page.privacy_policy_title')}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                {t('support_page.privacy_policy_text')}
                            </p>
                            <Link to="/privacy-policy" className="text-sm text-primary hover:underline">
                                {t('support_page.read_policy')} &rarr;
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-2">{t('support_page.status_title')}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                {t('support_page.status_text')}
                            </p>
                            <a href="https://green-api.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                {t('support_page.visit_status')} &rarr;
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
