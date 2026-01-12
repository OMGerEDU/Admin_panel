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
    Webhook,
    ZoomIn,
    ChevronLeft,
    ChevronRight,
    Users,
    Briefcase,
    UserCheck,
    Building2,
    Sparkles,
    ArrowDown,
    CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

// Import Client Images
import omriImg from '../assets/clients/omri.jpg';
import bsrImg from '../assets/clients/bsr.jpg';
import danielImg from '../assets/clients/daniel.jpg';
import ilanImg from '../assets/clients/ilan.jpg';
import guyImg from '../assets/clients/guy.jpg';
import biMenivImg from '../assets/clients/bi_meniv.jpg';
import matanImg from '../assets/clients/matan.jpg';
import talImg from '../assets/clients/tal.jpg';

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
                        src="/fernslogo.png"
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
                    <Link to="/login">
                        <Button variant="ghost" className="text-slate-600 dark:text-white hover:text-[#10B981] hover:bg-slate-100 dark:hover:bg-white/5">
                            {t('landing.nav.login')}
                        </Button>
                    </Link>
                    <Link to="/register">
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
                            <Link to="/login" className="text-slate-900 dark:text-white py-2 block" onClick={() => setMobileMenuOpen(false)}>
                                {t('landing.nav.login')}
                            </Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
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
                            <Link to="/register">
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

const PlatformPreviewSection = () => {
    const { t, i18n } = useTranslation();
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const imagesEn = [
        '/platformPics/english_chats.png',
        '/platformPics/english_numbers.png',
        '/platformPics/english_organization.png',
        '/platformPics/english_schedlued.png',
        '/platformPics/english_scheduled2.png'
    ];

    const imagesHe = [
        '/platformPics/hebrew_chats.png',
        '/platformPics/hebrew_numbers.png',
        '/platformPics/hebrew_scheduled.png',
        '/platformPics/hebrew_scheduled2.png'
    ];

    const images = i18n.language === 'he' ? imagesHe : imagesEn;

    const openLightbox = (index) => setSelectedImageIndex(index);
    const closeLightbox = () => setSelectedImageIndex(null);

    const nextImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section className="py-20 bg-slate-50 dark:bg-[#0F172A] overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            {t('landing.platform_preview.title')}
                        </h2>
                        <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                            {t('landing.platform_preview.subtitle')}
                        </p>
                    </motion.div>
                </div>

                {/* Carousel / Scroll View */}
                <div className="relative group">
                    <div className="flex gap-6 overflow-x-auto pb-8 pt-4 px-4 snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0">
                        {images.map((img, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="snap-center shrink-0 w-[85vw] md:w-[600px] lg:w-[800px] relative cursor-pointer"
                                onClick={() => openLightbox(idx)}
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            >
                                <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1E293B]">
                                    <div className="aspect-[16/10] bg-slate-100 dark:bg-black/20 relative group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-black/10 group-hover:after:transition-colors">
                                        <img
                                            src={img}
                                            alt={`Platform Preview ${idx + 1}`}
                                            className="w-full h-full object-cover object-top"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-black/50 text-white p-3 rounded-full backdrop-blur-sm">
                                                <ZoomIn size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-20"
                        >
                            <X size={24} />
                        </button>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-20 hidden md:block"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-20 hidden md:block"
                        >
                            <ChevronRight size={32} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-[90vw] max-h-[90vh] w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={images[selectedImageIndex]}
                                alt="Full Preview"
                                className="w-full h-full object-contain max-h-[90vh] rounded-lg shadow-2xl"
                            />
                        </motion.div>

                        {/* Mobile Navigation Hints */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden pointer-events-none">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full ${idx === selectedImageIndex ? 'bg-white' : 'bg-white/30'}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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

// Section 4: איך זה עובד (How It Works)
const HowItWorksSection = () => {
    const { t } = useTranslation();

    const steps = [
        {
            number: '1',
            title: t('landing.how_it_works.step1_title'),
            desc: t('landing.how_it_works.step1_desc'),
            icon: CheckCircle
        },
        {
            number: '2',
            title: t('landing.how_it_works.step2_title'),
            desc: t('landing.how_it_works.step2_desc'),
            icon: Activity
        },
        {
            number: '3',
            title: t('landing.how_it_works.step3_title'),
            desc: t('landing.how_it_works.step3_desc'),
            icon: Zap
        }
    ];

    return (
        <section className="py-20 relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        {t('landing.integrations.title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        {t('landing.integrations.subtitle')}
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className="relative"
                        >
                            {/* Connecting Line (except last) */}
                            {idx < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#10B981]/50 to-transparent transform translate-x-4 z-0" />
                            )}

                            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-[#10B981]/50 transition-all duration-300 group h-full">
                                {/* Step Number */}
                                <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#10B981]/30 group-hover:scale-110 transition-transform duration-300">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-14 h-14 bg-[#10B981]/20 rounded-xl flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform duration-300">
                                        <step.icon size={28} />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#10B981] transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-400 italic text-lg max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        {t('landing.how_it_works.note')}
                    </p>
                </motion.div>
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
    const { t } = useTranslation();

    const solutions = [
        {
            icon: Tag,
            title: t('landing.solutions.tag.title'),
            pain: t('landing.solutions.tag.pain'),
            solution: t('landing.solutions.tag.solution'),
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-200 dark:border-blue-500/20"
        },
        {
            icon: Clock,
            title: t('landing.solutions.scheduled.title'),
            pain: t('landing.solutions.scheduled.pain'),
            solution: t('landing.solutions.scheduled.solution'),
            color: "text-purple-500",
            bg: "bg-purple-500/10", // Using explicit color classes for safety
            border: "border-purple-200 dark:border-purple-500/20"
        },
        {
            icon: Megaphone,
            title: t('landing.solutions.automation.title'),
            pain: t('landing.solutions.automation.pain'),
            solution: t('landing.solutions.automation.solution'),
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-200 dark:border-orange-500/20"
        },
        {
            icon: Webhook,
            title: t('landing.solutions.api.title'),
            pain: t('landing.solutions.api.pain'),
            solution: t('landing.solutions.api.solution'),
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
                        {t('landing.solutions.heading')}
                    </h2>
                    <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        {t('landing.solutions.subheading')}
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
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-[#10B981]/50 p-1 bg-[#10B981]/10 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center justify-center overflow-hidden">
            {url ? (
                <img src={url} alt={name} className="w-full h-full rounded-full object-cover transition-all duration-300" />
            ) : (
                <span className="text-xl font-bold text-[#10B981]">{name.charAt(0)}</span>
            )}
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-white bg-[#0F172A]/90 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
            {name}
        </div>
    </motion.div>
);

// Section 2: למי זה מתאים (Target Audience)
const TargetAudienceSection = () => {
    const { t } = useTranslation();

    const audiences = [
        { icon: Building2, text: t('landing.target_audience.businesses') },
        { icon: Briefcase, text: t('landing.target_audience.agencies') },
        { icon: UserCheck, text: t('landing.target_audience.freelancers') },
        { icon: Users, text: t('landing.target_audience.teams') },
        { icon: Sparkles, text: t('landing.target_audience.owners') }
    ];

    return (
        <section className="py-20 bg-white dark:bg-[#0F172A] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6"
                    >
                        {t('landing.target_audience.heading')}
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {audiences.map((audience, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-[#10B981]/30 hover:shadow-lg dark:hover:shadow-none transition-all duration-300"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#10B981]/10 rounded-xl text-[#10B981] group-hover:scale-110 transition-transform duration-300">
                                    <audience.icon size={24} />
                                </div>
                                <p className="text-slate-700 dark:text-gray-300 font-medium leading-relaxed pt-1">
                                    {audience.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const SocialProofSection = () => {
    const { t } = useTranslation();

    const scrollToPricing = () => {
        const pricingSection = document.getElementById('offer');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0F172A] dark:to-[#0B1120]">
            <div className="absolute inset-0 bg-[#10B981]/5 mask-image-gradient" />
            <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-12">
                    {t('landing.social.heading')}
                </h2>

                <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    ))}
                </div>

                <p className="text-[#10B981] font-medium text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                    {t('landing.social.stats')}
                </p>

                <Button
                    onClick={scrollToPricing}
                    className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-1"
                >
                    {t('landing.social.cta_see_how')}
                </Button>
            </div>
        </section>
    );
};

const PricingCard = ({ tier, price, period, features, recommended, badge, ctaKey }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className={`relative rounded-3xl p-8 border backdrop-blur-sm transition-all duration-300 flex flex-col h-full ${recommended
            ? 'bg-[#10B981]/10 border-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.15)] z-10 scale-105'
            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-[#10B981]/30 hover:shadow-xl dark:hover:shadow-none'}`}
    >
        {badge && (
            <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg ${recommended ? 'bg-[#10B981] text-white' : 'bg-slate-800 text-white'}`}>
                {badge}
            </div>
        )}

        <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-slate-600 dark:text-gray-300 mb-2">{tier}</h3>
            <div className="flex items-center justify-center gap-1">
                <span className="text-5xl font-bold text-slate-900 dark:text-white">{price}</span>
                <span className="text-slate-500 dark:text-gray-400 self-end mb-2">{period}</span>
            </div>
        </div>

        <div className="flex-1">
            <ul className="space-y-4 mb-8">
                {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                        <span className="text-start">{feat}</span>
                    </li>
                ))}
            </ul>
        </div>

        <Link to="/register" className="mt-auto">
            <Button className={`w-full py-6 rounded-xl text-lg ${recommended
                ? 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg shadow-green-500/20'
                : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white'}`}>
                {ctaKey}
            </Button>
        </Link>
    </motion.div>
);

const PricingSection = () => {
    const { t } = useTranslation();

    const commonFeatures = [
        t('landing.pricing.features.click_to_chat'),
        t('landing.pricing.features.crm_compat'),
        t('landing.pricing.features.browser_install'),
        t('landing.pricing.features.specialized'),
        t('landing.pricing.features.money_back'),
        t('landing.pricing.features.trial')
    ];

    const plans = [
        {
            tier: t('landing.pricing.starter.title'),
            price: t('landing.pricing.starter.price'),
            period: t('landing.pricing.starter.period'),
            badge: t('landing.pricing.starter.badge'),
            features: commonFeatures,
            ctaKey: t('landing.pricing.cta_trial')
        },
        {
            tier: t('landing.pricing.pro.title'),
            price: t('landing.pricing.pro.price'),
            period: t('landing.pricing.pro.period'),
            badge: t('landing.pricing.pro.badge'),
            recommended: true,
            features: commonFeatures,
            ctaKey: t('landing.pricing.cta_trial')
        },
        {
            tier: t('landing.pricing.business.title'),
            price: t('landing.pricing.business.price'),
            period: t('landing.pricing.business.period'),
            badge: t('landing.pricing.business.badge'),
            features: commonFeatures,
            ctaKey: t('landing.pricing.cta_trial')
        }
    ];

    return (
        <section id="offer" className="py-20 relative bg-slate-50 dark:bg-[#0F172A]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('landing.pricing.heading')}
                    </h2>
                    <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('landing.pricing.subheading')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {plans.map((p, i) => (
                        <PricingCard key={i} {...p} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FAQSection = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { q: t('landing.faq.q1'), a: t('landing.faq.a1') },
        { q: t('landing.faq.q2'), a: t('landing.faq.a2') },
        { q: t('landing.faq.q3'), a: t('landing.faq.a3') },
        { q: t('landing.faq.q4'), a: t('landing.faq.a4') },
        { q: t('landing.faq.q5'), a: t('landing.faq.a5') },
        { q: t('landing.faq.q6'), a: t('landing.faq.a6') },
    ];

    return (
        <section className="py-20 bg-white dark:bg-[#0B1120]">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
                    {t('landing.faq.heading')}
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-b border-slate-200 dark:border-white/10">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between py-6 text-start focus:outline-none"
                            >
                                <span className="text-lg font-medium text-slate-900 dark:text-white pr-8">{faq.q}</span>
                                {openIndex === i ? (
                                    <X className="w-5 h-5 text-[#10B981]" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Section 7: Final CTA
const FinalCTASection = () => {
    const { t } = useTranslation();

    return (
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {t('landing.pricing.heading')}
                        </h2>
                        <p className="text-xl md:text-2xl mb-10 text-green-50 leading-relaxed">
                            {t('landing.pricing.subheading')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link to="/register">
                            <Button
                                size="lg"
                                className="bg-white text-[#059669] hover:bg-green-50 text-xl px-10 py-7 rounded-full shadow-2xl hover:shadow-green-900/50 transition-all hover:-translate-y-1 font-bold"
                            >
                                {t('landing.pricing.cta_trial')}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    const { t, i18n } = useTranslation();
    const isHebrew = i18n.language === 'he';

    return (
        <footer className="border-t border-slate-200 dark:border-white/10 py-12 bg-slate-100 dark:bg-[#0F172A]">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Logo & Tagline */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <img
                                src="/fernslogo.png"
                                alt="Ferns Logo"
                                className="w-8 h-8"
                            />
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Ferns</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                            {isHebrew ? 'ניהול תקשורת עסקית בוואטסאפ' : 'Business WhatsApp Communication'}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                            {isHebrew ? 'יצירת קשר' : 'Contact'}
                        </h4>
                        <div className="space-y-2 text-sm text-slate-500 dark:text-gray-400">
                            <p className="flex items-center gap-2">
                                <span>📞</span>
                                <a href="tel:0545661641" className="hover:text-[#10B981] transition-colors">054-566-1641</a>
                            </p>
                            <p className="flex items-center gap-2">
                                <span>📍</span>
                                <span>{isHebrew ? 'הנשיא 10, אשקלון' : '10 HaNasi St., Ashkelon'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <span>✉️</span>
                                <a href="mailto:support@di-biz.com" className="hover:text-[#10B981] transition-colors">support@di-biz.com</a>
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                            {isHebrew ? 'קישורים' : 'Links'}
                        </h4>
                        <div className="space-y-2 text-sm">
                            <Link to="/privacy-policy" className="block text-slate-500 dark:text-gray-400 hover:text-[#10B981] dark:hover:text-white transition-colors">
                                {t('landing.footer.privacy')}
                            </Link>
                            <Link to="/terms" className="block text-slate-500 dark:text-gray-400 hover:text-[#10B981] dark:hover:text-white transition-colors">
                                {t('landing.footer.terms')}
                            </Link>
                            <Link to="/support" className="block text-slate-500 dark:text-gray-400 hover:text-[#10B981] dark:hover:text-white transition-colors">
                                {isHebrew ? 'תמיכה' : 'Support'}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-slate-200 dark:border-white/10 pt-6 text-center">
                    <span className="text-slate-500 dark:text-gray-500 text-sm">© 2025 Ferns. {t('landing.footer.rights')}</span>
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
            <TargetAudienceSection />
            <FeatureSolutionsSection />
            <PlatformPreviewSection />
            <SocialProofSection />
            <HowItWorksSection />
            <FeaturesSection />
            <PricingSection />
            <FAQSection />
            <FinalCTASection />
            <Footer />
        </div>
    );
}
