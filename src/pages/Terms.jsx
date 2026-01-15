import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Shield, Clock, CreditCard, AlertTriangle, Users } from 'lucide-react';

export default function Terms() {
    const { t, i18n } = useTranslation();
    const isHebrew = i18n.language === 'he';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] py-12 px-4" dir={isHebrew ? 'rtl' : 'ltr'}>
            <div className="container mx-auto max-w-4xl">
                <Card className="shadow-lg">
                    <CardHeader className="text-center border-b bg-muted/20">
                        <CardTitle className="text-3xl font-bold text-primary">
                            {t('terms.title')}
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">
                            {t('terms.last_updated')}
                        </p>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none p-8 space-y-8">

                        {/* Business Details */}
                        <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 mt-0 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                {t('terms.business_details.title')}
                            </h2>
                            <div className="space-y-3 text-blue-700 dark:text-blue-200">
                                <p className="flex items-center gap-2">
                                    <strong>{t('terms.business_details.name_label')}</strong> Ferns
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <strong>{t('terms.business_details.phone_label')}</strong>
                                    <a href="tel:0545661641" className="underline hover:text-blue-900 dark:hover:text-blue-100">054-566-1641</a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <strong>{t('terms.business_details.address_label')}</strong>
                                    {t('terms.business_details.address_value')}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <strong>{t('terms.business_details.email_label')}</strong>
                                    <a href="mailto:support@di-biz.com" className="underline hover:text-blue-900 dark:hover:text-blue-100">support@di-biz.com</a>
                                </p>
                            </div>
                        </section>

                        {/* Age Restriction */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center gap-2">
                                <Users className="w-6 h-6 text-primary" />
                                {t('terms.age_restriction.title')}
                            </h2>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                                    {t('terms.age_restriction.text')}
                                </p>
                            </div>
                        </section>

                        {/* Service Description & Delivery */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center gap-2">
                                <Clock className="w-6 h-6 text-primary" />
                                {t('terms.service_delivery.title')}
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    {t('terms.service_delivery.intro')}
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        {t('terms.service_delivery.list1')}
                                    </li>
                                    <li>
                                        {t('terms.service_delivery.list2')}
                                    </li>
                                    <li>
                                        {t('terms.service_delivery.list3')}
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Cancellation Policy */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-primary" />
                                {t('terms.cancellation.title')}
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                    <p className="text-red-800 dark:text-red-200 font-medium">
                                        {t('terms.cancellation.alert')}
                                    </p>
                                </div>

                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>
                                        {t('terms.cancellation.list1')}
                                    </li>
                                    <li>
                                        {t('terms.cancellation.list2')}
                                    </li>
                                    <li>
                                        {t('terms.cancellation.list3')}
                                    </li>
                                </ul>

                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="font-medium mb-2">{t('terms.cancellation.how_to_title')}</p>
                                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                                        <li>
                                            {t('terms.cancellation.how_to_email')}
                                            <a href="mailto:support@di-biz.com" className="text-primary underline">support@di-biz.com</a>
                                        </li>
                                        <li>
                                            {t('terms.cancellation.how_to_settings')}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Liability */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-primary" />
                                {t('terms.liability.title')}
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    {t('terms.liability.intro')}
                                </p>

                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        {t('terms.liability.list1')}
                                    </li>
                                    <li>
                                        {t('terms.liability.list2')}
                                    </li>
                                    <li>
                                        {t('terms.liability.list3')}
                                    </li>
                                    <li>
                                        {t('terms.liability.list4')}
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Privacy Link */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground">
                                {t('terms.privacy.title')}
                            </h2>
                            <p className="text-muted-foreground">
                                {t('terms.privacy.text_pre')}
                                <Link to="/privacy-policy" className="text-primary underline hover:text-primary/80">
                                    {t('terms.privacy.link_text')}
                                </Link>.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                            <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-3 mt-0">
                                {t('terms.contact.title')}
                            </h2>
                            <p className="text-green-700 dark:text-green-200">
                                {t('terms.contact.intro')}
                            </p>
                            <div className="mt-3 space-y-2 text-green-700 dark:text-green-200">
                                <p><strong>{t('terms.contact.email_label')}</strong> <a href="mailto:support@di-biz.com" className="underline">support@di-biz.com</a></p>
                                <p><strong>{t('terms.contact.phone_label')}</strong> <a href="tel:0545661641" className="underline">054-566-1641</a></p>
                            </div>
                        </section>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
