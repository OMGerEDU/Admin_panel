import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import {
    LayoutDashboard,
    Smartphone,
    Settings,
    FileText,
    Bot,
    Webhook,
    Chrome,
    MessageSquare,
    ChevronDown,
    Building2,
    CalendarClock,
    X,
    Code,
} from 'lucide-react';

export function Sidebar({ className, isMobile, onClose }) {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const primaryLinks = [
        { href: '/app/dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/app/chats', label: t('chats'), icon: MessageSquare },
        { href: '/app/numbers', label: t('numbers'), icon: Smartphone },
        { href: '/app/scheduled', label: t('scheduled.title') || 'Scheduled', icon: CalendarClock },
        { href: '/app/extension', label: t('extension'), icon: Chrome },
        // { href: '/app/api', label: t('sidebar.api') || 'API', icon: Code },
    ];

    const settingsChildren = [
        { href: '/app/settings', label: t('settings'), icon: Settings },
        { href: '/app/organization', label: t('organization_settings') || 'Organization', icon: Building2 },
        { href: '/app/plans', label: t('landing.pricing.plans.select'), icon: LayoutDashboard },

        { href: '/app/logs', label: t('logs'), icon: FileText },

    ];

    const isSettingsRoute = settingsChildren.some((link) =>
        location.pathname.startsWith(link.href),
    );

    const [settingsOpen, setSettingsOpen] = React.useState(isSettingsRoute);

    React.useEffect(() => {
        setSettingsOpen(isSettingsRoute);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const handleSettingsClick = () => {
        setSettingsOpen((open) => !open);
        navigate('/app/settings');
    };

    return (
        <div className={cn("pb-12 w-64 border-r bg-card h-screen sticky top-0", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center justify-between mb-2 px-4">
                        <h2 className="text-lg font-semibold tracking-tight text-primary flex items-center gap-2">
                            <img src="/fernslogo.png" alt="Ferns" className="h-6 w-6" onError={(e) => e.target.style.display = 'none'} />
                            Ferns
                        </h2>
                        {isMobile && (
                            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    <div className="space-y-0 border-t border-border/40 rounded-xl overflow-hidden bg-card/80 backdrop-blur">
                        {primaryLinks.map((link, index) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center border-b border-border/40 last:border-b-0 px-4 py-2.5 text-[15px] font-medium hover:bg-accent/70 hover:text-accent-foreground transition-all",
                                        isActive ? "bg-primary/10 text-primary border-l-4 border-primary shadow-sm" : "bg-transparent"
                                    )
                                }
                            >
                                <link.icon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                <span>{link.label}</span>
                            </NavLink>
                        ))}

                        {/* Settings group */}
                        <button
                            type="button"
                            onClick={handleSettingsClick}
                            className={cn(
                                "w-full flex items-center justify-between border-b border-border/40 px-4 py-2.5 text-[15px] font-medium text-left hover:bg-accent/70 hover:text-accent-foreground transition-all",
                                isSettingsRoute ? "bg-accent text-accent-foreground shadow-sm" : "bg-transparent",
                            )}
                        >
                            <span className="flex items-center">
                                <Settings className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                {t('settings')}
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform",
                                    settingsOpen ? "rotate-180" : "rotate-0",
                                )}
                            />
                        </button>

                        {settingsOpen && (
                            <div className="bg-muted/40 border-t border-border/40">
                                {settingsChildren.map((link) => (
                                    <NavLink
                                        key={link.href}
                                        to={link.href}
                                        className={({ isActive }) =>
                                            cn(
                                                "flex items-center px-6 py-2.5 text-sm font-medium border-b border-border/30 last:border-b-0",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            )
                                        }
                                    >
                                        <link.icon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                        <span>{link.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
