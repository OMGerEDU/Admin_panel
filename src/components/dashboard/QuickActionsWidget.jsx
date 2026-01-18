import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MessageSquarePlus, CalendarClock, Radio, Tag, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickActionsWidget() {
    const { t } = useTranslation();

    const actions = [
        {
            label: t('dashboard.action_new_chat'),
            icon: MessageSquarePlus,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10 hover:bg-blue-500/20',
            link: '/app/contacts' // Assuming workflow starts from Contacts to find/create
        },
        {
            label: t('contacts.create_contact'),
            icon: Users,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
            link: '/app/contacts' // Same page, maybe different query param? User can click create there.
        },
        {
            label: t('dashboard.action_schedule'),
            icon: CalendarClock,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10 hover:bg-violet-500/20',
            link: '/app/scheduled'
        },
        {
            label: t('dashboard.action_tags'),
            icon: Tag,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10 hover:bg-orange-500/20',
            link: '/app/chats' // Tags are managed in Chats usually
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, i) => (
                <Link key={i} to={action.link} className="block">
                    <Card className={`h-full border-none shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer ${action.bg}`}>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-24 sm:h-32">
                            <div className={`p-2 rounded-full bg-background/50 backdrop-blur-sm shadow-sm`}>
                                <action.icon className={`h-6 w-6 ${action.color}`} />
                            </div>
                            <span className="font-medium text-sm text-foreground/90">{action.label}</span>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

export default QuickActionsWidget;
