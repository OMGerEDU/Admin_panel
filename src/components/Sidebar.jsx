import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { LayoutDashboard, Smartphone, Settings, FileText, Bot, Webhook, Chrome, MessageSquare } from 'lucide-react';

export function Sidebar({ className }) {
    const { t } = useTranslation();

    const links = [
        { href: '/app/dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/app/chats', label: t('chats'), icon: MessageSquare },
        { href: '/app/numbers', label: t('numbers'), icon: Smartphone },
        { href: '/app/webhooks', label: t('webhooks'), icon: Webhook },
        { href: '/app/logs', label: t('logs'), icon: FileText },
        { href: '/app/automation', label: t('automation'), icon: Bot },
        { href: '/app/settings', label: t('settings'), icon: Settings },
        { href: '/app/extension', label: t('extension'), icon: Chrome },
    ];

    return (
        <div className={cn("pb-12 w-64 border-r bg-card h-screen sticky top-0", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
                        GreenManager
                    </h2>
                    <div className="space-y-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                                        isActive ? "bg-accent text-accent-foreground shadow-sm" : "transparent"
                                    )
                                }
                            >
                                <link.icon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
