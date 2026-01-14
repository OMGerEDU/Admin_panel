import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, Bug, Zap, Rocket, Calendar } from 'lucide-react';
import updates from '../data/updates.json';

export default function Updates() {
    const { t } = useTranslation();

    const getIcon = (type) => {
        switch (type) {
            case 'major': return <Sparkles className="h-5 w-5 text-purple-500" />;
            case 'bugfix': return <Bug className="h-5 w-5 text-red-500" />;
            case 'improvement': return <Zap className="h-5 w-5 text-yellow-500" />;
            case 'launch': return <Rocket className="h-5 w-5 text-blue-500" />;
            default: return <Zap className="h-5 w-5 text-primary" />;
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold tracking-tight text-primary">
                    {t('updates.title', 'System Updates')}
                </h2>
                <p className="text-muted-foreground text-lg">
                    {t('updates.subtitle', 'What\'s new in Ferns and the Chrome Extension')}
                </p>
            </div>

            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {updates.map((update, index) => (
                    <div key={update.version} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors group-hover:border-primary">
                            {getIcon(update.type)}
                        </div>

                        {/* Content */}
                        <Card className="w-[calc(100%-4rem)] md:w-[45%] p-4 group-hover:shadow-lg transition-all border-muted/60 hover:border-primary/40 bg-card/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-mono text-xs">
                                        v{update.version}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {update.date}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-foreground">{update.title}</h3>
                            <div className="space-y-3">
                                {update.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="space-y-1">
                                        <h4 className="text-sm font-semibold text-primary/90 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                            {feature.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed pl-3.5">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Feature Request CTA */}
            <Card className="bg-primary/5 border-dashed border-primary/20 p-8 text-center mt-12">
                <CardHeader>
                    <CardTitle className="text-xl">
                        {t('updates.suggestion_title', 'Have a suggestion?')}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {t('updates.suggestion_desc', 'We\'re building Ferns together. Share your ideas with us!')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        {t('updates.suggestion_note', 'Use the feedback button in the sidebar to submit a feature request.')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
