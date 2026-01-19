import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';

export default function Documentation() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Beta Documentation</h2>
                <p className="text-muted-foreground">
                    Exclusive guides and resources for our beta testers.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Getting Started with Beta Features
                    </CardTitle>
                    <CardDescription>
                        Welcome to the bleeding edge!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        As a beta tester, you have access to features that are still in development.
                        Your feedback is crucial in helping us shape the future of this platform.
                    </p>
                    <div className="bg-muted p-4 rounded-md flex items-start gap-4">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 shrink-0" />
                        <div>
                            <h4 className="font-semibold">Important Note</h4>
                            <p className="text-sm text-muted-foreground">
                                Beta features may be unstable or change without notice. Please report any bugs you encounter.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Upcoming Features
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Advanced Automation Workflows</li>
                        <li>Enhanced Analytics Dashboard</li>
                        <li>Custom Webhooks Integration</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
