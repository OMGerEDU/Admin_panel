import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import updates from '../data/updates.json';

export function UpdatesDropdown() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const latestUpdate = updates[0]; // Assuming updates are sorted by date descending

    if (!latestUpdate) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" title={t('sidebar.updates', 'Updates')}>
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b bg-amber-500/5">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-1.5 py-0.5 rounded">
                            v{latestUpdate.version}
                        </span>
                        <span className="text-xs text-muted-foreground">{latestUpdate.date}</span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground leading-tight">
                        {latestUpdate.title}
                    </h4>
                </div>

                <div className="p-4 space-y-3 max-h-[300px] overflow-auto">
                    {latestUpdate.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex gap-2">
                            <div className="mt-0.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold">{feature.title}</p>
                                <p className="text-[11px] text-muted-foreground line-clamp-2">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                    {latestUpdate.features.length > 3 && (
                        <p className="text-[10px] text-muted-foreground italic pl-5">
                            + {latestUpdate.features.length - 3} {t('common.more', 'more updates...')}
                        </p>
                    )}
                </div>

                <div className="p-2 border-t bg-muted/20">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => navigate('/app/updates')}
                    >
                        {t('common.see_all', 'See All')}
                        <ChevronRight className="ml-2 h-3 w-3" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
