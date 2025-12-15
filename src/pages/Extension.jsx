import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Download, Chrome } from 'lucide-react';

export default function Extension() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Extension</h2>
                <p className="text-muted-foreground">Manage and preview the browser extension.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Installation</CardTitle>
                        <CardDescription>Get the extension for your browser.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center p-4 border rounded-lg bg-card">
                            <Chrome className="h-8 w-8 text-blue-500 mr-4" />
                            <div className="flex-1">
                                <h4 className="font-semibold">Chrome Extension</h4>
                                <p className="text-sm text-muted-foreground">Version 2.4.0</p>
                            </div>
                            <Button>
                                <Download className="mr-2 h-4 w-4" />
                                Install
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>How it looks in the browser.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg p-4 shadow-xl bg-background max-w-[300px] mx-auto">
                            {/* Mock Extension UI */}
                            <div className="flex items-center justify-between border-b pb-2 mb-2">
                                <span className="font-bold text-sm text-primary">GreenSender</span>
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-8 bg-muted rounded w-full"></div>
                                <div className="h-20 bg-muted rounded w-full"></div>
                                <div className="flex justify-end">
                                    <div className="h-8 bg-primary rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
