import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Check,
    MessageCircle,
    Shield,
    Zap,
    Activity,
    AlertTriangle,
    BarChart3,
    Lock,
    Globe,
    ArrowLeft,
    Menu,
    X,
    Loader2,
    CheckCircle2,
    Play
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

// --- Assets ---
const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69419a22f9aa11079dc26e01/59c0c29b5_icon32.png";

const CLIENTS = [
    { name: 'עומרי כהן', imageUrl: 'https://e-club.biz/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-27-at-15.48.25.jpeg' },
    { name: 'קבוצת ב.ס.ר', imageUrl: 'https://pic1.calcalist.co.il/picserver3/crop_images/2025/03/03/rJMSUlQsyg/rJMSUlQsyg_9_0_262_147_0_xx-large.jpg' },
    { name: 'דניאל מולדבסקי', imageUrl: 'https://yt3.googleusercontent.com/Ti137VSspBSwMddYf-Pcpr_LM1bALCF3R4oQJWCh-QSqHFXMDq8fAEwoEmx4zaRZjf9R4mLOLQ=s900-c-k-c0x00ffffff-no-rj' },
    { name: 'עו״ד אילן', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDS5dvIWsTVh2IbLc-dRf0LSQdA1e6JFwJoQ&s' },
    { name: 'גיא נתן', imageUrl: 'https://cdn.funder.co.il/fimgni/i/a/Guy-Nathan.jpg' },
    { name: 'בי מניב', imageUrl: 'https://bmeniv.co.il/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-16.44.26.jpeg' },
    { name: 'מתן ניסטור', imageUrl: 'https://i.scdn.co/image/ab67656300005f1fa64ab8cbdeaace2b6759d1ad' },
    { name: 'טל מועלם', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZQzCBys6dauWt-mw63jFZHArRt7S5BThz5A&s' }
];

// --- Components ---

const GlassCard = ({ children, className = "" }) => (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        {children}
    </div>
);

const Section = ({ children, className = "", id = "" }) => (
    <section id={id} className={`relative py-20 px-4 md:px-8 overflow-hidden ${className}`}>
        {children}
    </section>
);

const AnimatedBackground = () => (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0F172A]">
        {/* Dynamic Orbs */}
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 50, 0],
                y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#10B981]/10 blur-[100px]"
        />
        <motion.div
            animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, -40, 0],
                y: [0, 60, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#059669]/10 blur-[120px]"
        />
    </div>
);

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-[#0F172A]/90 backdrop-blur-lg border-b border-white/10' : 'py-6 bg-transparent'}`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={LOGO_URL} alt="Ferns Logo" className="w-8 h-8 md:w-10 md:h-10 animate-float" />
                    <span className="text-xl md:text-2xl font-bold text-white tracking-tight">Ferns</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                        className="bg-[#10B981] hover:bg-[#059669] text-white rounded-full px-6 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-1"
                    >
                        חבר מספר ראשון
                    </Button>
                </div>
            </div>
        </nav>
    );
};

// --- Landing Page ---

export default function LandingPage() {
    // Form State
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                url: window.location.href
            };

            await fetch('https://hook.eu2.make.com/g7oyto9px0pik1chpifjjkzje4yubear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            setSubmitStatus('success');
            setFormData({ name: '', phone: '', email: '' });
        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus(null), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-x-hidden selection:bg-[#10B981]/30" dir="rtl">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');
                body { font-family: 'Rubik', sans-serif; }
                .glass-card-hover:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(16, 185, 129, 0.3);
                    transform: translateY(-4px);
                }
            `}</style>

            <AnimatedBackground />
            <Navbar />

            {/* Hero Section */}
            <Section className="min-h-screen flex items-center pt-32 pb-20">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 text-center lg:text-right"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            דע שמערכות הוואטסאפ שלך עובדות – <span className="text-[#10B981] relative inline-block">
                                לפני
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#10B981]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span> שהלקוחות שלך ישימו לב.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                            מרכז שליטה ובקרה עבור סוכנויות ועסקים המנהלים מספר חיבורי WhatsApp API.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                                className="h-14 px-8 text-lg bg-[#10B981] hover:bg-[#059669] text-white rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all transform hover:-translate-y-1"
                            >
                                חבר את המספר הראשון שלך
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <GlassCard className="p-6 md:p-8 border-white/10 shadow-2xl">
                            {/* Mock Dashboard Visual */}
                            <div className="grid gap-4">
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="text-xs text-gray-400">System Status: Active</div>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-red-500 animate-pulse' : 'bg-[#10B981]'}`} />
                                                <span className="text-sm text-gray-300">Instance #8493-{i}</span>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded bg-white/5 ${i === 2 ? 'text-red-400' : 'text-[#10B981]'}`}>
                                                {i === 2 ? 'Error: Webhook Failed' : 'Operational'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {/* Alert Popup Mock */}
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                                    <AlertTriangle className="text-red-400 h-5 w-5" />
                                    <div className="text-sm">
                                        <span className="text-red-400 font-bold block">התראת ניתוק</span>
                                        <span className="text-gray-300 text-xs">נמצאה שגיאת חיבור במספר 050-XXX-XXXX</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </Section>

            {/* Pain Amplification Section */}
            <Section className="bg-black/20">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { text: "מנהל מספר מספרי WhatsApp?", icon: MessageCircle, color: "text-blue-400" },
                            { text: "לא בטוח אילו מהם מקוונים?", icon: Activity, color: "text-orange-400" },
                            { text: "חושש מניתוקים שקטים?", icon: Lock, color: "text-red-400" },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <GlassCard className="p-6 flex items-center gap-4 border-l-4 border-l-[#10B981]/50 glass-card-hover transition-all">
                                    <div className={`p-3 rounded-full bg-white/5 ${item.color}`}>
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-medium">{item.text}</h3>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Outcomes & Benefits */}
            <Section>
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">שליטה מלאה. <span className="text-[#10B981]">בלי הפתעות.</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">הפסיקו לנחש מה קורה עם האוטומציות שלכם. קבלו תמונת מצב מלאה בזמן אמת.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "אפס שטחים מתים", desc: "לוח מחוונים מאוחד המציג את כל המספרים במבט אחד.", icon: Globe },
                            { title: "סקייל ללא כאוס", desc: "נהל עשרות ומאות חשבונות ללא צורך במעבר בין מסכים.", icon: BarChart3 },
                            { title: "שמור על פעילות תקינה", desc: "ניטור בריאות אוטומטי 24/7 לכל החיבורים.", icon: Shield },
                            { title: "תקן לפני הנזק", desc: "יומן שגיאות חכם המתריע על בעיות בזמן אמת.", icon: Zap },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <GlassCard className="h-full p-8 flex flex-col items-start gap-4 hover:bg-white/10 transition-colors group">
                                    <div className="p-4 rounded-xl bg-[#10B981]/10 text-[#10B981] group-hover:scale-110 transition-transform duration-300">
                                        <item.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Social Proof (Clients) */}
            <Section className="bg-[#10B981]/5">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">סומכים עלינו בעיניים <span className="text-[#10B981]">ירוקות</span></h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-center mb-12">
                        {CLIENTS.map((client, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex flex-col items-center group relative"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#10B981] to-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)] mb-3 transition-transform duration-300 group-hover:scale-110">
                                    <img
                                        src={client.imageUrl}
                                        alt={client.name}
                                        className="w-full h-full rounded-full object-cover border-2 border-[#0F172A]"
                                    />
                                </div>
                                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-3 py-1 rounded-full text-xs whitespace-nowrap z-10">
                                    {client.name}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                        <CheckCircle2 className="text-[#10B981] w-5 h-5" />
                        <span className="text-gray-300 font-medium tracking-wide">
                            הפחתנו אירועי השבתה ב-<span className="text-white font-bold">30%</span> עבור יותר מ-1200 חשבונות פעילים.
                        </span>
                    </div>
                </div>
            </Section>

            {/* Audience Segmentation */}
            <Section>
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Agencies */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <GlassCard className="p-10 h-full border-2 border-transparent hover:border-[#10B981]/30 transition-all">
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-[#10B981]">//</span> לסוכנויות
                                </h3>
                                <p className="text-3xl font-bold mb-6 text-gray-200">נהל אינספור מספרי לקוחות בביטחון.</p>
                                <ul className="space-y-3 text-gray-400">
                                    <li className="flex items-center gap-2"><Check className="text-[#10B981] w-4 h-4" /> הפרדה מלאה בין לקוחות</li>
                                    <li className="flex items-center gap-2"><Check className="text-[#10B981] w-4 h-4" /> הרשאות גישה מתקדמות</li>
                                    <li className="flex items-center gap-2"><Check className="text-[#10B981] w-4 h-4" /> דוחות ביצועים מרוכזים</li>
                                </ul>
                            </GlassCard>
                        </motion.div>

                        {/* Businesses */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <GlassCard className="p-10 h-full border-2 border-transparent hover:border-[#10B981]/30 transition-all">
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-[#10B981]">//</span> לעסקים
                                </h3>
                                <p className="text-3xl font-bold mb-6 text-gray-200">הבטח זמינות והגן על ההכנסות.</p>
                                <ul className="space-y-3 text-gray-400">
                                    <li className="flex items-center gap-2"><Check className="text-[#10B981] w-4 h-4" /> התראות מיידיות על תקלות</li>
                                    <li className="flex items-center gap-2"><Check className="text-[#10B981] w-4 h-4" /> שקט נפשי תפעולי</li>
                                    <li className="flex items-center gap-2"><Check className="text-[#10B981] w-4 h-4" /> מניעת אובדן לידים</li>
                                </ul>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* Pricing & Risk */}
            <Section className="bg-gradient-to-b from-[#0F172A] to-[#10B981]/10">
                <div className="container mx-auto text-center max-w-3xl">
                    <h2 className="text-4xl font-bold mb-6">מחיר התחלתי ברור לכל ארגון.</h2>
                    <p className="text-xl text-gray-300 mb-10">
                        בלי אותיות קטנות. בלי הפתעות. הצטרף למהפכת השקיפות.
                    </p>
                    <div className="flex justify-center gap-4 mb-10 text-sm font-medium">
                        <span className="px-4 py-2 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                            ✨ ניסיון חינם
                        </span>
                        <span className="px-4 py-2 rounded-full bg-white/10 text-white border border-white/20">
                            🛡️ גמישות בביטול
                        </span>
                    </div>
                    <Button
                        onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                        className="h-16 px-12 text-xl bg-white text-[#0F172A] hover:bg-gray-100 font-bold rounded-xl shadow-2xl hover:scale-105 transition-transform"
                    >
                        קבל הצעה עכשיו
                    </Button>
                </div>
            </Section>

            {/* FAQ */}
            <Section>
                <div className="container mx-auto max-w-2xl">
                    <h2 className="text-3xl font-bold text-center mb-10">שאלות נפוצות</h2>
                    <div className="space-y-4">
                        {[
                            { q: "האם יש אינטגרציה ל-Green API?", a: "כן! המערכת תוכננה לעבוד בצורה חלקה ומושלמת עם Green API, כולל תמיכה במופעים מרובים." },
                            { q: "כמה מאובטח השירות?", a: "אנו משתמשים בתקני האבטחה המחמירים ביותר, כולל הצפנת מידע וטוקנים, וגישה מבוססת תפקידים." },
                            { q: "האם זה עובד עם התוסף שלכם?", a: "בהחלט. לוח הבקרה מסתנכר בזמן אמת עם תוסף הכרום שלנו לחוויה הוליסטית." }
                        ].map((item, idx) => (
                            <GlassCard key={idx} className="p-0">
                                <details className="group">
                                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                                        <span className="font-medium text-lg">{item.q}</span>
                                        <ChevronDown className="transition-transform group-open:rotate-180 text-[#10B981]" />
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                        {item.a}
                                    </div>
                                </details>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Contact Form */}
            <Section id="contact" className="pb-32">
                <div className="container mx-auto max-w-md">
                    <GlassCard className="p-8 md:p-10 border-t-4 border-t-[#10B981]">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-2">השאר פרטים ונדבר.</h2>
                            <p className="text-gray-400">הצוות שלנו יחזור אליך בהקדם.</p>
                        </div>

                        {submitStatus === 'success' ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-10 h-10 text-[#10B981]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#10B981] mb-2">תודה רבה!</h3>
                                <p className="text-gray-300">קיבלנו את הפרטים שלך, ניצור קשר בקרוב.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">שם מלא</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-white/5 border-white/10 h-12 text-white focus:border-[#10B981] transition-colors"
                                        placeholder="ישראל ישראלי"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">טלפון</label>
                                    <Input
                                        required
                                        dir="ltr"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-white/5 border-white/10 h-12 text-white text-right focus:border-[#10B981] transition-colors"
                                        placeholder="050-0000000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">אימייל</label>
                                    <Input
                                        required
                                        dir="ltr"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-white/5 border-white/10 h-12 text-white text-right focus:border-[#10B981] transition-colors"
                                        placeholder="name@company.com"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-lg mt-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            שולח...
                                        </>
                                    ) : 'שלח פרטים'}
                                </Button>
                                {submitStatus === 'error' && (
                                    <p className="text-red-400 text-sm text-center mt-2">אירעה שגיאה בשליחה, אנא נסה שוב.</p>
                                )}
                            </form>
                        )}
                    </GlassCard>
                </div>
            </Section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 bg-black/20">
                <div className="container mx-auto text-center text-gray-500 text-sm">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <img src={LOGO_URL} alt="Logo" className="w-6 h-6 grayscale opacity-50" />
                        <span className="font-semibold">Ferns</span>
                    </div>
                    <p className="mb-4">© 2025 Ferns. כל הזכויות שמורות.</p>
                    <div className="flex justify-center gap-6">
                        <a href="#" className="hover:text-[#10B981] transition-colors">מדיניות פרטיות</a>
                        <a href="#" className="hover:text-[#10B981] transition-colors">תנאי שימוש</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
