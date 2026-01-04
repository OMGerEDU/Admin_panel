import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader className="text-center border-b bg-muted/20">
                    <CardTitle className="text-3xl font-bold text-primary">Privacy Policy</CardTitle>
                    <p className="text-muted-foreground mt-2">Ferns • Green API CRM Helper</p>
                    <p className="text-sm text-muted-foreground">Last Updated: January 4, 2026</p>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none p-8 space-y-8">

                    {/* Limited Use Disclosure - REQUIRED */}
                    <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3 mt-0">Limited Use Disclosure</h2>
                        <p className="text-blue-700 dark:text-blue-200 font-medium">
                            The use of information received from Google APIs will adhere to the <a href="https://developer.chrome.com/docs/webstore/user-data-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Chrome Web Store User Data Policy</a>, including the Limited Use requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Data Collection and Usage</h2>
                        <p className="text-muted-foreground mb-4">
                            We are committed to protecting your privacy. This policy details how we handle your data in compliance with the Chrome Web Store User Data Policy.
                        </p>
                        <h3 className="text-xl font-medium mb-2 text-foreground">What we collect:</h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Phone Numbers:</strong> The extension scans the current web page for phone numbers to provide "Click to Chat" functionality. This processing happens locally on your device.</li>
                            <li><strong>Authentication Data:</strong> We store Supabase session tokens and Green API credentials (Instance ID and API Token) locally in your browser (<code>chrome.storage.local</code>) to maintain your session.</li>
                            <li><strong>Chat History & Media:</strong> We fetch and locally cache your WhatsApp chat history and contact avatars from Green API to display them in the extension popup.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Limited Use Policy</h2>
                        <p className="text-muted-foreground mb-4">
                            Our use of your data is strictly limited to providing the core functionality of the "Ferns" extension.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Do not allow humans to read user data:</strong> We do not allow humans to read your data valid unless we have obtained your affirmative agreement for specific messages (for example, accessing it to provide technical support), it is necessary for security purposes (such as investigating a bug or abuse), to comply with applicable law, or for the extension's internal operations and the data have been aggregated and anonymized.</li>
                            <li><strong>No Transfer to Third Parties:</strong> We do not transfer or sell your data to third parties, data brokers, or advertising platforms. Your data is only transferred to the specific services you have connected (Green API and Supabase) for the sole purpose of functionality.</li>
                            <li><strong>No Personalized Ads:</strong> We do not use your data for personalized advertisements or credit-worthiness purposes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Permissions Usage</h2>
                        <p className="text-muted-foreground mb-4">We request the absolute minimum permissions necessary:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>activeTab:</strong> To identify phone numbers on the page you are viewing.</li>
                            <li><strong>storage:</strong> To save your login session and cached data locally.</li>
                            <li><strong>contextMenus:</strong> To provide a right-click option to open chats.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Security</h2>
                        <p className="text-muted-foreground">
                            We handle your data securely. All data transmission to Green API and Supabase occurs over encrypted HTTPS connections. We do not expose your credentials or financial information publicly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have questions about this policy or our data practices, please contact us at <a href="mailto:support@ferns.builders-tech.com" className="text-primary hover:underline">support@ferns.builders-tech.com</a>.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
