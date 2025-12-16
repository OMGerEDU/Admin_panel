import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Shield, Zap, RefreshCw, BarChart3, Lock } from 'lucide-react';

export default function LandingPage() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex gap-2 items-center font-bold text-xl tracking-tight">
                        <span className="text-[#00a884]">Green</span>Builders
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost">{t('login.submit')}</Button>
                        </Link>
                        <Link to="/signup">
                            <Button>{t('landing.get_started')}</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center">
                        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            {t('landing.hero_title')}
                        </h1>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            {t('landing.hero_subtitle')}
                        </p>
                        <div className="space-x-4 flex items-center justify-center gap-4 mt-2">
                            <Link to="/login">
                                <Button size="lg" className="h-12 px-8 text-lg">
                                    {t('landing.get_started')}
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                                {t('landing.view_demo')}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            {t('landing.features')}
                        </h2>
                    </div>
                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                        <FeatureCard
                            icon={<Zap className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.instant_connection')}
                            description={t('landing.features_list.instant_connection_desc')}
                        />
                        <FeatureCard
                            icon={<RefreshCw className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.auto_recovery')}
                            description={t('landing.features_list.auto_recovery_desc')}
                        />
                        <FeatureCard
                            icon={<Shield className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.secure_tokens')}
                            description={t('landing.features_list.secure_tokens_desc')}
                        />
                        <FeatureCard
                            icon={<BarChart3 className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.real_time_analytics')}
                            description={t('landing.features_list.real_time_analytics_desc')}
                        />
                        <FeatureCard
                            icon={<Lock className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.role_management')}
                            description={t('landing.features_list.role_management_desc')}
                        />
                        <FeatureCard
                            icon={<Check className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.uptime')}
                            description={t('landing.features_list.uptime_desc')}
                        />
                    </div>
                </section>

                {/* Pricing Section */}
            <section className="container space-y-6 py-8 md:py-12 lg:py-24">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                        {t('landing.pricing')}
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
                    {/* Free Plan */}
                    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                        <h3 className="font-bold text-xl">{t('landing.plans.free')}</h3>
                        <div className="mt-4 text-4xl font-bold">$0</div>
                        <div className="text-sm text-muted-foreground">{t('landing.plans.month')}</div>
                        <ul className="mt-6 flex-1 space-y-3 text-sm">
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> 2 {t('landing.plans.numbers')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.basic_webhooks')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> 1 {t('landing.plans.users')}</li>
                        </ul>
                        <Link to="/signup">
                            <Button className="mt-8 w-full" variant="outline">{t('landing.plans.select')}</Button>
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-md border-primary/20 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-blue-600 px-3 py-1 text-xs text-white shadow-md font-medium">
                            {t('landing.plans.popular')}
                        </div>
                        <h3 className="font-bold text-xl">{t('landing.plans.pro')}</h3>
                        <div className="mt-4 text-4xl font-bold">$29</div>
                        <div className="text-sm text-muted-foreground">{t('landing.plans.month')}</div>
                        <ul className="mt-6 flex-1 space-y-3 text-sm">
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> 10 {t('landing.plans.numbers')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.advanced_webhooks')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.priority_log_retention')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> 5 {t('landing.plans.team_members')}</li>
                        </ul>
                        <Link to="/signup">
                            <Button className="mt-8 w-full">{t('landing.plans.select')}</Button>
                        </Link>
                    </div>

                    {/* Agency Plan */}
                    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                        <h3 className="font-bold text-xl">{t('landing.plans.agency')}</h3>
                        <div className="mt-4 text-4xl font-bold">$99</div>
                        <div className="text-sm text-muted-foreground">{t('landing.plans.month')}</div>
                        <ul className="mt-6 flex-1 space-y-3 text-sm">
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.unlimited')} {t('landing.plans.numbers')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.dedicated_support')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.custom_integrations')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.unlimited')} {t('landing.plans.users')}</li>
                        </ul>
                        <Link to="/signup">
                            <Button className="mt-8 w-full" variant="outline">{t('landing.plans.select')}</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    {t('landing.footer')}
                </p>
            </div>
        </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                {icon}
                <div className="space-y-2">
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
        </div>
    )
}
