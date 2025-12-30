import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    ChevronDown,
    Menu,
    X,
    Globe,
    Moon,
    Sun,
    AlertTriangle,
    Activity,
    Layers,
    Shield,
    Zap,
    ArrowRight,
    ArrowLeft,
    Smartphone,
    CheckCircle2,
    XCircle,

    Star,
    Tag,
    Clock,
    Megaphone,
    Webhook
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

// --- Animations ---
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

// --- Components ---

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'he' : 'en';
        i18n.changeLanguage(newLang);
        document.dir = newLang === 'he' ? 'rtl' : 'ltr';
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 py-3 shadow-sm dark:shadow-none' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69419a22f9aa11079dc26e01/59c0c29b5_icon32.png"
                        alt="Ferns Logo"
                        className="w-8 h-8"
                    />
                    <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Ferns</span>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <button onClick={toggleLanguage} className="text-slate-600 dark:text-gray-300 hover:text-[#10B981] dark:hover:text-white transition-colors">
                        <Globe className="w-5 h-5" />
                    </button>
                    <button onClick={toggleTheme} className="text-slate-600 dark:text-gray-300 hover:text-[#10B981] dark:hover:text-white transition-colors">
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <Link to="/app/login">
                        <Button variant="ghost" className="text-slate-600 dark:text-white hover:text-[#10B981] hover:bg-slate-100 dark:hover:bg-white/5">
                            {t('landing.nav.login')}
                        </Button>
                    </Link>
                    <Link to="/app/register">
                        <Button className="bg-[#10B981] hover:bg-[#059669] text-white border-none shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5">
                            {t('landing.nav.cta')}
                        </Button>
                    </Link>
                </div>

                <button className="md:hidden text-slate-900 dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
                        className="md:hidden bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-white/10 overflow-hidden shadow-lg"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            <Link to="/app/login" className="text-slate-900 dark:text-white py-2 block" onClick={() => setMobileMenuOpen(false)}>
                                {t('landing.nav.login')}
                            </Link>
                            <Link to="/app/register" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-[#10B981] hover:bg-[#059669] text-white">
                                    {t('landing.nav.cta')}
                                </Button>
                            </Link>
                            <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                                <button onClick={toggleLanguage} className="text-slate-600 dark:text-gray-300 flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> {i18n.language === 'en' ? 'Hebrew' : 'English'}
                                </button>
                                <button onClick={toggleTheme} className="text-slate-600 dark:text-gray-300 flex items-center gap-2">
                                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Theme
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const HeroSection = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';

    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#10B981]/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#059669]/10 rounded-full blur-[120px] animate-pulse delay-1000" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Text Content */}
                    <motion.div
                        className="lg:w-1/2 text-center lg:text-start"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                            </span>
                            {t('landing.hero.badge')}
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                            {t('landing.hero.title')}
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg text-slate-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                            {t('landing.hero.subtitle')}
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/app/register">
                                <Button size="lg" className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white text-lg px-8 h-12 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-1">
                                    {t('landing.hero.cta_primary')}
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Visual Content - Dashboard Mock */}
                    <motion.div
                        className="lg:w-1/2 w-full"
                        initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } }}
                    >
                        <div className="relative">
                            {/* Glass Card "Dashboard" */}
                            <div className="bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl dark:shadow-none transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-gray-500 font-mono">system_status.log</div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-800 dark:text-gray-200 font-medium">{t('landing.hero.dashboard_mock.instance_1_id')}</span>
                                                <span className="text-xs text-slate-500 dark:text-gray-500">{t('landing.hero.dashboard_mock.instance_1_status')}</span>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-black/20 text-slate-600 dark:text-gray-400 font-mono">
                                            {t('landing.hero.dashboard_mock.instance_1_code')}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-800 dark:text-gray-200 font-medium">{t('landing.hero.dashboard_mock.instance_2_id')}</span>
                                                <span className="text-xs text-slate-500 dark:text-gray-500">{t('landing.hero.dashboard_mock.instance_2_status')}</span>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-black/20 text-slate-600 dark:text-gray-400 font-mono">
                                            {t('landing.hero.dashboard_mock.instance_2_code')}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-800 dark:text-gray-200 font-medium">{t('landing.hero.dashboard_mock.instance_3_id')}</span>
                                                <span className="text-xs text-slate-500 dark:text-gray-500">{t('landing.hero.dashboard_mock.instance_3_status')}</span>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-black/20 text-slate-600 dark:text-gray-400 font-mono">
                                            {t('landing.hero.dashboard_mock.instance_3_code')}
                                        </div>
                                    </div>

                                    <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden mt-6">
                                        <div className="h-full w-[85%] bg-[#10B981]" />
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400">
                                        <span>{t('landing.hero.dashboard_mock.load_label')}</span>
                                        <span>{t('landing.hero.dashboard_mock.load_value')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Alert Card */}
                            <motion.div
                                className="absolute -bottom-6 -left-6 bg-white dark:bg-[#0F172A] border border-red-500/30 p-4 rounded-xl shadow-xl flex items-center gap-3 max-w-[250px]"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t('landing.hero.alert_title')}</div>
                                    <div className="text-xs text-slate-500 dark:text-gray-400">{t('landing.hero.alert_desc')}</div>
                                </div>
                            </motion.div>

                            {/* Floating Success Card */}
                            <motion.div
                                className="absolute -top-6 -right-6 bg-white dark:bg-[#0F172A] border border-[#10B981]/30 p-4 rounded-xl shadow-xl flex items-center gap-3 max-w-[250px]"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="p-2 bg-[#10B981]/20 rounded-lg text-[#10B981]">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t('landing.hero.success_title')}</div>
                                    <div className="text-xs text-slate-500 dark:text-gray-400">{t('landing.hero.success_desc')}</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } }
        }}
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:border-[#10B981]/30 transition-all group shadow-lg dark:shadow-none"
    >
        <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center text-[#10B981] mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
);

const DailyChaosSection = () => {
    const { t } = useTranslation();

    const chaosItems = [
        { icon: XCircle, text: "פספוס לידים בגלל עומס או חוסר מענה" },
        { icon: AlertTriangle, text: "בלגן בוואטסאפ – הודעות נעלמות בין עשרות צ'אטים" },
        { icon: Layers, text: "מעבר מסורבל בין אקסלים, יומנים ומערכות CRM" },
        { icon: Activity, text: "חוסר שליטה על מה שקורה בעסק בזמן אמת" },
        { icon: Smartphone, text: "תלות מוחלטת בטלפון האישי שלך לניהול העסק" },
    ];

    return (
        <section className="py-20 relative bg-red-50/50 dark:bg-red-900/10">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12">
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                            הכאוס היומיומי שמעכב את העסק שלך
                        </span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {chaosItems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-red-950/30 border border-red-100 dark:border-red-500/20 p-6 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm hover:shadow-md"
                        >
                            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 mb-4">
                                <item.icon size={24} />
                            </div>
                            <p className="text-lg font-medium text-slate-800 dark:text-gray-200">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeaturesSection = () => {
    const { t } = useTranslation();

    const features = [
        { icon: Layers, title: t('landing.features.unified.title'), desc: t('landing.features.unified.desc') },
        { icon: Zap, title: t('landing.features.scale.title'), desc: t('landing.features.scale.desc') },
        { icon: Activity, title: t('landing.features.uptime.title'), desc: t('landing.features.uptime.desc') },
        { icon: Shield, title: t('landing.features.logs.title'), desc: t('landing.features.logs.desc') }
    ];

    return (
        <section className="py-20 bg-slate-50 dark:bg-[#0F172A]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('landing.features.heading')}
                    </h2>
                    <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('landing.features.subheading')}
                    </p>
                </div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {features.map((f, i) => (
                        <FeatureCard key={i} {...f} delay={i * 0.1} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const FeatureSolutionsSection = () => {
    const solutions = [
        {
            icon: Tag,
            title: "תיוג חכם וסדר",
            pain: "בלאגן בצ׳אטים - הכל נראה אותו דבר, אי אפשר למצוא כלום",
            solution: "תגים צבעוניים שעושים סדר בעיניים - ליד, לקוח, דחוף",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-200 dark:border-blue-500/20"
        },
        {
            icon: Clock,
            title: "הודעות מתוזמנות",
            pain: "לשכוח לחזור ללקוח, לפספס ימי הולדת או מועדים חשובים",
            solution: "תזמון הודעות מראש לזמן המושלם - שגר ושכח",
            color: "text-purple-500",
            bg: "bg-purple-500/10", // Using explicit color classes for safety
            border: "border-purple-200 dark:border-purple-500/20"
        },
        {
            icon: Megaphone,
            title: "אוטומציות ודיוור",
            pain: "לשלוח הודעה אחת אחת ידנית ל-100 לקוחות - סיוט מתמשך",
            solution: "שליחה מרוכזת לכולם בקליק אחד פשוט ומהיר",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-200 dark:border-orange-500/20"
        },
        {
            icon: Webhook,
            title: "חיבור למערכות (API)",
            pain: "להעתיק ידנית נתונים מהאתר או מה-CRM לוואטסאפ",
            solution: "הכל מסתנכרן אוטומטית למערכות שלך בזמן אמת",
            color: "text-green-500",
            bg: "bg-green-500/10",
            border: "border-green-200 dark:border-green-500/20"
        }
    ];

    return (
        <section className="py-20 relative bg-white dark:bg-[#0F172A]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        פתרונות חכמים לכאבים אמיתיים
                    </h2>
                    <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        אל תתן לטכנולוגיה לעכב אותך - תן לה לעבוד בשבילך
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {solutions.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-8 rounded-2xl border ${item.border} bg-white dark:bg-white/5 hover:shadow-xl transition-all duration-300 group`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon size={28} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                        {item.title}
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="mt-1 min-w-[20px]">
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            </div>
                                            <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
                                                {item.pain}
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="mt-1 min-w-[20px]">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            </div>
                                            <p className="text-slate-800 dark:text-gray-200 font-medium text-sm leading-relaxed">
                                                {item.solution}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ClientAvatar = ({ name, url, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
        className="group relative"
    >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#10B981]/50 p-1 bg-[#10B981]/10 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center justify-center overflow-hidden">
            {url ? (
                <img src={url} alt={name} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
            ) : (
                <span className="text-xl font-bold text-[#10B981]">{name.charAt(0)}</span>
            )}
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-white bg-[#0F172A]/90 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
            {name}
        </div>
    </motion.div>
);

const SocialProofSection = () => {
    const { t } = useTranslation();

    const clients = [
        { name: 'עומרי כהן', imageUrl: 'https://e-club.biz/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-27-at-15.48.25.jpeg' },
        { name: 'קבוצת ב.ס.ר', imageUrl: 'https://pic1.calcalist.co.il/picserver3/crop_images/2025/03/03/rJMSUlQsyg/rJMSUlQsyg_9_0_262_147_0_xx-large.jpg' },
        { name: 'דניאל מולדבסקי', imageUrl: 'https://yt3.googleusercontent.com/Ti137VSspBSwMddYf-Pcpr_LM1bALCF3R4oQJWCh-QSqHFXMDq8fAEwoEmx4zaRZjf9R4mLOLQ=s900-c-k-c0x00ffffff-no-rj' },
        { name: 'עו״ד אילן', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDS5dvIWsTVh2IbLc-dRf0LSQdA1e6JFwJoQ&s' },
        { name: 'גיא נתן', imageUrl: 'https://cdn.funder.co.il/fimgni/i/a/Guy-Nathan.jpg' },
        { name: 'בי מניב', imageUrl: 'https://bmeniv.co.il/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-16.44.26.jpeg' },
        { name: 'מתן ניסטור', imageUrl: 'https://i.scdn.co/image/ab67656300005f1fa64ab8cbdeaace2b6759d1ad' },
        { name: 'טל מועלם', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZQzCBys6dauWt-mw63jFZHArRt7S5BThz5A&s' }
    ];

    const scrollToPricing = () => {
        const pricingSection = document.getElementById('offer');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#10B981]/5 mask-image-gradient" />
            <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-12">
                    {t('landing.social.heading')}
                </h2>

                <div className="grid grid-cols-4 gap-6 md:gap-10 mb-10 max-w-4xl mx-auto justify-items-center">
                    {clients.map((client, idx) => (
                        <ClientAvatar key={idx} {...client} delay={idx * 0.1} />
                    ))}
                </div>

                <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    ))}
                </div>

                <p className="text-[#10B981] font-medium text-lg mb-8">
                    {t('landing.social.stats')}
                </p>

                <Button
                    onClick={scrollToPricing}
                    className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-1"
                >
                    רוצה לראות איך זה יכול לעבוד אצלך?
                </Button>
            </div>
        </section>
    );
};

const PricingCard = ({ tier, price, period, features, recommended, ctaKey }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className={`relative rounded-2xl p-8 border backdrop-blur-sm transition-all duration-300 ${recommended
            ? 'bg-[#10B981]/10 border-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.15)] z-10 scale-105'
            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-[#10B981]/30 hover:shadow-xl dark:hover:shadow-none'}`}
    >
        {recommended && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#10B981] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
            </div>
        )}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tier}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{price}</span>
            <span className="text-slate-500 dark:text-gray-400">{period}</span>
        </div>

        <ul className="space-y-4 mb-8">
            {features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-gray-300">
                    <Check className="w-5 h-5 text-[#10B981] shrink-0" />
                    <span>{feat}</span>
                </li>
            ))}
        </ul>

        <Link to="/app/register">
            <Button className={`w-full ${recommended
                ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-lg'
                : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white'}`}>
                {ctaKey}
            </Button>
        </Link>
    </motion.div>
);

const PricingSection = () => {
    const { t } = useTranslation();

    const plans = [
        {
            tier: t('landing.pricing.starter.title'),
            price: t('landing.pricing.starter.price'),
            period: t('landing.pricing.starter.period'),
            features: [
                t('landing.pricing.starter.feat1'),
                t('landing.pricing.starter.feat2'),
                t('landing.pricing.starter.feat3')
            ],
            ctaKey: t('landing.pricing.cta_free')
        },
        {
            tier: t('landing.pricing.pro.title'),
            price: t('landing.pricing.pro.price'),
            period: t('landing.pricing.pro.period'),
            recommended: true,
            features: [
                t('landing.pricing.pro.feat1'),
                t('landing.pricing.pro.feat2'),
                t('landing.pricing.pro.feat3'),
                t('landing.pricing.pro.feat4')
            ],
            ctaKey: t('landing.pricing.cta_pro')
        },
        {
            tier: t('landing.pricing.scale.title'),
            price: t('landing.pricing.scale.price'),
            period: t('landing.pricing.scale.period'),
            features: [
                t('landing.pricing.scale.feat1'),
                t('landing.pricing.scale.feat2'),
                t('landing.pricing.scale.feat3'),
                t('landing.pricing.scale.feat4')
            ],
            ctaKey: t('landing.pricing.cta_scale')
        }
    ];

    return (
        <section id="offer" className="py-20 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('landing.pricing.heading')}
                    </h2>
                    <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('landing.pricing.subheading')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                    {plans.map((p, i) => (
                        <PricingCard key={i} {...p} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="border-t border-slate-200 dark:border-white/10 py-12 bg-slate-100 dark:bg-[#0F172A]">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <img
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69419a22f9aa11079dc26e01/59c0c29b5_icon32.png"
                        alt="Ferns Logo"
                        className="w-6 h-6 grayscale opacity-70"
                    />
                    <span className="text-slate-500 dark:text-gray-500 text-sm">© 2025 Ferns. {t('landing.footer.rights')}</span>
                </div>

                <div className="flex gap-6 text-sm text-slate-500 dark:text-gray-500">
                    <a href="#" className="hover:text-[#10B981] dark:hover:text-white transition-colors">{t('landing.footer.privacy')}</a>
                    <a href="#" className="hover:text-[#10B981] dark:hover:text-white transition-colors">{t('landing.footer.terms')}</a>
                </div>
            </div>
        </footer>
    );
};

// --- Main Page Component ---

export default function LandingPage() {
    const { i18n } = useTranslation();

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white selection:bg-[#10B981] selection:text-white font-rubik ${i18n.language === 'he' ? 'rtl' : 'ltr'}`} dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
            <Navbar />
            <HeroSection />
            <SocialProofSection />
            <DailyChaosSection />
            <FeatureSolutionsSection />
            <FeaturesSection />
            <PricingSection />
            <Footer />
        </div>
    );
}
