import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    ChevronDown,
    Menu,
    X,
    Check,
    Smartphone,
    Network,
    ShieldAlert,
    Activity,
    Zap,
    Building2,
    Users,
    Sun,
    Moon,
    Languages,
    LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { lang, toggleLang } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Common Motion Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <img src="/fernslogo.png" alt="Ferns" className="h-8 w-8" />
                        <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">Ferns</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle Theme">
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleLang} title="Switch Language">
                            <Languages className="h-5 w-5" />
                        </Button>

                        <div className="h-6 w-px bg-border mx-2" />

                        {user ? (
                            <Button onClick={() => navigate('/app/dashboard')}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                {t('dashboard')}
                            </Button>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost">{t('login.submit')}</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button>{t('landing.hero.cta_primary')}</Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-b bg-background px-4 pb-4"
                        >
                            <nav className="flex flex-col gap-4 py-4">
                                <Button variant="ghost" className="justify-start" onClick={toggleTheme}>
                                    {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                                    Theme
                                </Button>
                                <Button variant="ghost" className="justify-start" onClick={toggleLang}>
                                    <Languages className="mr-2 h-4 w-4" />
                                    {lang === 'en' ? 'Hebrew' : 'English'}
                                </Button>
                                {user ? (
                                    <Button className="w-full" onClick={() => navigate('/app/dashboard')}>
                                        {t('dashboard')}
                                    </Button>
                                ) : (
                                    <>
                                        <Link to="/login" className="w-full">
                                            <Button variant="outline" className="w-full">{t('login.submit')}</Button>
                                        </Link>
                                        <Link to="/signup" className="w-full">
                                            <Button className="w-full">{t('landing.hero.cta_primary')}</Button>
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 lg:py-32">
                    <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50 dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.4))]" />
                    <div className="container relative z-10 px-4 text-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="mx-auto max-w-4xl space-y-8"
                        >
                            <motion.h1
                                variants={fadeInUp}
                                className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                            >
                                {t('landing.hero.headline')}
                            </motion.h1>
                            <motion.p
                                variants={fadeInUp}
                                className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl"
                            >
                                {t('landing.hero.subheadline')}
                            </motion.p>
                            <motion.div
                                variants={fadeInUp}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            >
                                <Link to="/signup">
                                    <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                                        {t('landing.hero.cta_primary')}
                                    </Button>
                                </Link>
                                <Link to="#demo-video"> {/* In future implementation, this could open a modal */}
                                    <Button variant="outline" size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                                        {t('landing.hero.cta_secondary')}
                                    </Button>
                                </Link>
                            </motion.div>
                            <motion.div
                                variants={fadeInUp}
                                className="pt-8 text-sm text-muted-foreground flex items-center justify-center gap-2"
                            >
                                <Check className="h-4 w-4 text-primary" />
                                {t('landing.hero.trust_badge')}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Pain Section - "Fear of messing up" */}
                <section className="bg-muted/30 py-16 lg:py-24 border-y border-border/50">
                    <div className="container px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-destructive/80">
                                    {t('landing.pain.headline')}
                                </h2>
                                <ul className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <li key={i} className="flex items-center gap-3 text-lg text-muted-foreground">
                                            <ShieldAlert className="h-6 w-6 text-destructive shrink-0" />
                                            {t(`landing.pain.point_${i}`)}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xl font-medium border-l-4 border-primary pl-4 py-2">
                                    {t('landing.pain.impact')}
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative rounded-xl border bg-card p-6 shadow-2xl skew-y-1"
                            >
                                {/* Mockup of Error Log */}
                                <div className="space-y-4 font-mono text-xs sm:text-sm">
                                    <div className="flex items-center gap-2 text-destructive">
                                        <Activity className="h-4 w-4" />
                                        <span>[CRITICAL] Instance #97250... disconnected</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <Activity className="h-4 w-4" />
                                        <span>[WARN] Webhook delivery failed (Limit reached)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Activity className="h-4 w-4" />
                                        <span>[INFO] Auto-reconnecting...</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t text-center text-muted-foreground">
                                        ... {t('dashboard.no_data') ? 'Is this your current reality?' : 'Is this your current reality?'}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 lg:py-28">
                    <div className="container px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">
                                {t('landing.benefits.headline')}
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Activity, key: 'b1' },
                                { icon: Network, key: 'b2' },
                                { icon: ShieldAlert, key: 'b3' },
                                { icon: Zap, key: 'b4' }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors shadow-sm"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{t(`landing.benefits.${item.key}_title`)}</h3>
                                    <p className="text-muted-foreground">{t(`landing.benefits.${item.key}_desc`)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Audience Segmentation */}
                <section className="py-16 bg-gradient-to-b from-background to-muted/20">
                    <div className="container px-4">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold">{t('landing.audience.headline')}</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Agencies */}
                            <div className="p-8 rounded-2xl border bg-card relative overflow-hidden group hover:shadow-lg transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users className="h-24 w-24" />
                                </div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Users className="h-6 w-6 text-primary" />
                                    {t('landing.audience.tab_agencies')}
                                </h3>
                                <ul className="space-y-3">
                                    {t('landing.audience.agencies_list', { returnObjects: true }).map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Businesses */}
                            <div className="p-8 rounded-2xl border bg-card relative overflow-hidden group hover:shadow-lg transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Building2 className="h-24 w-24" />
                                </div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Building2 className="h-6 w-6 text-blue-500" />
                                    {t('landing.audience.tab_businesses')}
                                </h3>
                                <ul className="space-y-3">
                                    {t('landing.audience.businesses_list', { returnObjects: true }).map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof */}
                <section className="py-20 border-y bg-accent/5">
                    <div className="container px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="grid grid-cols-2 gap-8 text-center">
                                <div>
                                    <div className="text-4xl sm:text-5xl font-extrabold text-primary mb-2">
                                        {t('landing.social_proof.stat_1_value')}
                                    </div>
                                    <div className="text-muted-foreground font-medium">
                                        {t('landing.social_proof.stat_1_label')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-4xl sm:text-5xl font-extrabold text-primary mb-2">
                                        {t('landing.social_proof.stat_2_value')}
                                    </div>
                                    <div className="text-muted-foreground font-medium">
                                        {t('landing.social_proof.stat_2_label')}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-card p-8 rounded-2xl shadow-sm border relative">
                                <div className="text-4xl text-primary/20 font-serif absolute top-4 left-4">"</div>
                                <blockquote className="text-xl font-medium relative z-10 italic">
                                    "{t('landing.social_proof.quote')}"
                                </blockquote>
                                <div className="mt-6 font-bold text-primary">
                                    — {t('landing.social_proof.quote_author')}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="py-20 lg:py-28" id="pricing">
                    <div className="container px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">
                                {t('landing.pricing.headline')}
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                {t('landing.pricing.subheadline')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {['free', 'pro', 'agency'].map((planKey) => {
                                const plan = t(`landing.pricing.plans.${planKey}`, { returnObjects: true });
                                const isPro = planKey === 'pro';

                                return (
                                    <div
                                        key={planKey}
                                        className={`relative flex flex-col p-8 rounded-2xl border ${isPro ? 'border-primary shadow-xl bg-card' : 'bg-muted/10'} transition-all hover:scale-105 duration-300`}
                                    >
                                        {plan.badge && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                {plan.badge}
                                            </div>
                                        )}
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold">{plan.name}</h3>
                                            <div className="mt-2 flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold">{plan.price}</span>
                                                <span className="text-muted-foreground">/mo</span>
                                            </div>
                                            <p className="mt-4 text-sm text-muted-foreground">{plan.desc}</p>
                                        </div>
                                        <ul className="flex-1 space-y-4 mb-8">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm">
                                                    <Check className={`h-4 w-4 ${isPro ? 'text-primary' : 'text-muted-foreground'}`} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to="/signup">
                                            <Button
                                                variant={isPro ? 'default' : 'outline'}
                                                className="w-full"
                                            >
                                                {t('landing.pricing.cta')}
                                            </Button>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <ShieldAlert className="h-4 w-4" />
                                {t('landing.pricing.risk_reversal')}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 bg-muted/30">
                    <div className="container px-4 max-w-3xl">
                        <h2 className="text-3xl font-bold text-center mb-10">{t('landing.faq.headline')}</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border rounded-lg bg-card overflow-hidden">
                                    <div className="p-4 font-semibold">
                                        {t(`landing.faq.q${i}`)}
                                    </div>
                                    <div className="px-4 pb-4 text-muted-foreground border-t pt-4 bg-muted/5">
                                        {t(`landing.faq.a${i}`)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-8 bg-background">
                <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                        {t('landing.footer.rights')}
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                            {t('landing.footer.links.privacy')}
                        </Link>
                        <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">
                            {t('landing.footer.links.support')}
                        </Link>
                        <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                            {t('landing.footer.links.login')}
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
