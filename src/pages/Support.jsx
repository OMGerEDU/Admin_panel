import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Support() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">How can we help?</h1>
                <p className="text-xl text-muted-foreground">
                    Support and resources for Ferns • Green API CRM Helper
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-10">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            Email Support
                        </CardTitle>
                        <CardDescription>
                            Direct assistance from our team
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Have a question or run into an issue? Drop us an email and we'll get back to you within 24 hours.
                        </p>
                        <Button asChild className="w-full">
                            <a href="mailto:support@ferns.builders-tech.com">
                                Contact Support
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Community & Updates
                        </CardTitle>
                        <CardDescription>
                            Stay connected with us
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Follow our updates and join the conversation about new features and improvements.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://github.com/GreenBuilders" target="_blank" rel="noopener noreferrer">
                                Visit GitHub <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-lg border-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Common Topics
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-2">Getting Started</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Learn how to connect your first WhatsApp number and set up the extension.
                            </p>
                            <Link to="/app/dashboard" className="text-sm text-primary hover:underline">
                                Go to Dashboard &rarr;
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-2">Account Management</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Need to manage your subscription or team members?
                            </p>
                            <Link to="/app/settings" className="text-sm text-primary hover:underline">
                                Go to Settings &rarr;
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-2">Privacy Policy</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Understand how we handle your data and privacy.
                            </p>
                            <Link to="/privacy-policy" className="text-sm text-primary hover:underline">
                                Read Policy &rarr;
                            </Link>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-2">Green API Status</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Check the operational status of the Green API service.
                            </p>
                            <a href="https://green-api.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                Visit Green API &rarr;
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
