import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    Sparkles,
    BarChart3,
    Users,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';

export function Sidebar({ className, isMobile, onClose, isCollapsed, onToggle }) {
    const { t } = useTranslation();
    const { isBetaTester } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const primaryLinks = [
        { href: '/app/dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
        { href: '/app/chats', label: t('sidebar.chats'), icon: MessageSquare },
        { href: '/app/contacts', label: t('sidebar.contacts'), icon: Users },
        { href: '/app/scheduled', label: t('sidebar.scheduled'), icon: CalendarClock },
        { href: '/app/extension', label: t('sidebar.extension'), icon: Chrome },
        // { href: '/app/api', label: t('sidebar.api') || 'API', icon: Code },
    ];

    const settingsChildren = [
        { href: '/app/settings', label: t('sidebar.settings'), icon: Settings },
        { href: '/app/organization', label: t('sidebar.organization'), icon: Building2 },
        { href: '/app/numbers', label: t('sidebar.numbers'), icon: Smartphone },
        { href: '/app/plans', label: t('landing.pricing.plans.select'), icon: LayoutDashboard },
        { href: '/app/logs', label: t('sidebar.logs'), icon: FileText },
    ];

    if (isBetaTester) {
        settingsChildren.push({ href: '/app/api', label: 'API', icon: Code });
    }

    const isSettingsRoute = settingsChildren.some((link) =>
        location.pathname.startsWith(link.href),
    );

    const [settingsOpen, setSettingsOpen] = React.useState(isSettingsRoute);

    React.useEffect(() => {
        if (!isCollapsed) {
            setSettingsOpen(isSettingsRoute);
        } else {
            setSettingsOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, isCollapsed]);

    const handleSettingsClick = () => {
        if (isCollapsed) {
            onToggle();
            setTimeout(() => setSettingsOpen(true), 150); // slight delay for smooth expansion
            return;
        }
        setSettingsOpen((open) => !open);
    };

    return (
        <div
            className={cn(
                "pb-12 border-r bg-card h-screen sticky top-0 transition-all duration-300 ease-in-out flex flex-col",
                isCollapsed ? "w-[70px]" : "w-64",
                className
            )}
        >
            <div className="space-y-4 py-4 flex-1 flex flex-col">
                <div className="px-3 py-2 flex-1">
                    <div className={cn("flex items-center mb-6 px-2", isCollapsed ? "justify-center" : "justify-between")}>
                        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                            <img src="/fernslogo.png" alt="Ferns" className="h-8 w-8 min-w-8" onError={(e) => e.target.style.display = 'none'} />
                            <h2 className={cn(
                                "text-lg font-semibold tracking-tight text-primary transition-opacity duration-300",
                                isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                            )}>
                                Ferns
                            </h2>
                        </div>
                        {isMobile && (
                            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        )}
                        {!isMobile && !isCollapsed && (
                            <button
                                onClick={onToggle}
                                className="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-md transition-colors"
                                title={t('sidebar.collapse') || 'Collapse sidebar'}
                            >
                                <PanelLeftClose className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {!isMobile && isCollapsed && (
                        <div className="flex justify-center mb-4 border-b border-border/40 pb-4">
                            <button
                                onClick={onToggle}
                                className="text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-md transition-colors"
                                title={t('sidebar.expand') || 'Expand sidebar'}
                            >
                                <PanelLeftOpen className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    <div className="space-y-1">
                        {primaryLinks.map((link, index) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center px-3 py-2.5 text-[15px] font-medium transition-all rounded-md mx-1",
                                        "hover:bg-accent/70 hover:text-accent-foreground",
                                        isActive ? "bg-primary/10 text-primary shadow-sm" : "bg-transparent",
                                        isCollapsed ? "justify-center" : ""
                                    )
                                }
                                title={isCollapsed ? link.label : undefined}
                            >
                                <link.icon className={cn("h-5 w-5 shrink-0 transition-all", !isCollapsed && "mr-3 rtl:ml-3 rtl:mr-0")} />
                                {!isCollapsed && <span className="truncate">{link.label}</span>}
                            </NavLink>
                        ))}

                        {/* Settings group */}
                        <div className="pt-2 mt-2 border-t border-border/40">
                            <button
                                type="button"
                                onClick={handleSettingsClick}
                                className={cn(
                                    "w-full flex items-center px-3 py-2.5 text-[15px] font-medium text-left transition-all rounded-md mx-1",
                                    "hover:bg-accent/70 hover:text-accent-foreground",
                                    (isSettingsRoute && !settingsOpen) ? "bg-accent text-accent-foreground shadow-sm" : "bg-transparent",
                                    isCollapsed ? "justify-center" : "justify-between"
                                )}
                                title={isCollapsed ? t('sidebar.settings') : undefined}
                            >
                                <span className="flex items-center min-w-0">
                                    <Settings className={cn("h-5 w-5 shrink-0 transition-all", !isCollapsed && "mr-3 rtl:ml-3 rtl:mr-0")} />
                                    {!isCollapsed && <span className="truncate">{t('sidebar.settings')}</span>}
                                </span>
                                {!isCollapsed && (
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 shrink-0 transition-transform ml-auto",
                                            settingsOpen ? "rotate-180" : "rotate-0",
                                        )}
                                    />
                                )}
                            </button>

                            {!isCollapsed && settingsOpen && (
                                <div className="mt-1 ml-4 pl-2 border-l border-border/40 space-y-0.5 animate-in slide-in-from-top-2 fade-in duration-200">
                                    {settingsChildren.map((link) => (
                                        <NavLink
                                            key={link.href}
                                            to={link.href}
                                            className={({ isActive }) =>
                                                cn(
                                                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                                    isActive
                                                        ? "text-primary bg-primary/5"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                                )
                                            }
                                        >
                                            <link.icon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                            <span className="truncate">{link.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
