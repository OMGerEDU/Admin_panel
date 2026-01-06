import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader className="text-center border-b bg-muted/20">
                    <CardTitle className="text-3xl font-bold text-primary">{t('privacy_policy.title')}</CardTitle>
                    <p className="text-muted-foreground mt-2">{t('privacy_policy.subtitle')}</p>
                    <p className="text-sm text-muted-foreground">{t('privacy_policy.last_updated')}</p>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none p-8 space-y-8">

                    {/* Limited Use Disclosure - REQUIRED */}
                    <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3 mt-0">{t('privacy_policy.limited_use_title')}</h2>
                        <p className="text-blue-700 dark:text-blue-200 font-medium">
                            {t('privacy_policy.limited_use_text')} <a href="https://developer.chrome.com/docs/webstore/user-data-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">{t('privacy_policy.chrome_policy')}</a>{t('privacy_policy.including_limited')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">{t('privacy_policy.data_collection_title')}</h2>
                        <p className="text-muted-foreground mb-4">
                            {t('privacy_policy.data_collection_intro')}
                        </p>
                        <h3 className="text-xl font-medium mb-2 text-foreground">{t('privacy_policy.what_we_collect')}</h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>{t('privacy_policy.collect_phone')}:</strong> {t('privacy_policy.collect_phone_desc')}</li>
                            <li><strong>{t('privacy_policy.collect_auth')}:</strong> {t('privacy_policy.collect_auth_desc')}</li>
                            <li><strong>{t('privacy_policy.collect_chat')}:</strong> {t('privacy_policy.collect_chat_desc')}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">{t('privacy_policy.limited_use_policy_title')}</h2>
                        <p className="text-muted-foreground mb-4">
                            {t('privacy_policy.limited_use_policy_intro')}
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>{t('privacy_policy.policy_human')}:</strong> {t('privacy_policy.policy_human_desc')}</li>
                            <li><strong>{t('privacy_policy.policy_transfer')}:</strong> {t('privacy_policy.policy_transfer_desc')}</li>
                            <li><strong>{t('privacy_policy.policy_ads')}:</strong> {t('privacy_policy.policy_ads_desc')}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">{t('privacy_policy.permissions_title')}</h2>
                        <p className="text-muted-foreground mb-4">{t('privacy_policy.permissions_intro')}</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>{t('privacy_policy.perm_active_tab')}:</strong> {t('privacy_policy.perm_active_tab_desc')}</li>
                            <li><strong>{t('privacy_policy.perm_storage')}:</strong> {t('privacy_policy.perm_storage_desc')}</li>
                            <li><strong>{t('privacy_policy.perm_context_menus')}:</strong> {t('privacy_policy.perm_context_menus_desc')}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">{t('privacy_policy.security_title')}</h2>
                        <p className="text-muted-foreground">
                            {t('privacy_policy.security_text')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">{t('privacy_policy.contact_title')}</h2>
                        <p className="text-muted-foreground">
                            {t('privacy_policy.contact_text')} <a href="mailto:support@ferns.builders-tech.com" className="text-primary hover:underline">support@ferns.builders-tech.com</a>.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
