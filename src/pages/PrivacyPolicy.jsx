import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader className="text-center border-b bg-muted/20">
                    <CardTitle className="text-3xl font-bold text-primary">Privacy Policy</CardTitle>
                    <p className="text-muted-foreground mt-2">Ferns • Green API CRM Helper</p>
                    <p className="text-sm text-muted-foreground">Last Updated: December 30, 2025</p>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Introduction</h2>
                        <p className="text-muted-foreground">
                            Ferns • Green API CRM Helper ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how our Chrome Extension collects, uses, and safeguards your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Data Collection and Usage</h2>
                        <p className="text-muted-foreground mb-4">We process the following data to provide the extension's functionality:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Phone Numbers:</strong> The extension scans the current web page for phone numbers when you request it or interact with the extension. This is done locally within your browser to facilitate starting WhatsApp chats.</li>
                            <li><strong>Authentication Data:</strong> We store your Supabase session tokens and Green API credentials (Instance ID and API Token) locally in your browser (<code>chrome.storage.local</code>) to maintain your login session and connection to the Green API service.</li>
                            <li><strong>Chat History:</strong> We fetch and temporarily cache your WhatsApp chat history and contact avatars from Green API to display them in the extension popup. This data is stored locally on your device for performance and is not sent to any third-party servers other than the Green API service you authenticated with.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Permissions Usage</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>activeTab:</strong> Used to interact with the current tab to identify phone numbers for the "Click to Chat" feature.</li>
                            <li><strong>storage:</strong> Used to save your preferences, session tokens, and cached data locally.</li>
                            <li><strong>contextMenus:</strong> Used to add a "Open in Ferns" right-click menu item for selected text.</li>
                            <li><strong>scripting:</strong> (If applicable) Used to inject content scripts to modify the page for functionality.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Third-Party Services</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Green API:</strong> Your Green API credentials are used solely to communicate directly with the Green API service to send and receive messages. We do not have access to your Green API account details other than what you provide.</li>
                            <li><strong>Supabase:</strong> We use Supabase for user authentication and subscription management.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Data Sharing</h2>
                        <p className="text-muted-foreground">
                            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Your data stays on your device and is only communicated to the services you explicitly connect (Green API, Supabase).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Your Consent</h2>
                        <p className="text-muted-foreground">
                            By using our extension, you consent to our privacy policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any questions regarding this privacy policy, you may contact us at <a href="mailto:support@ferns.builders-tech.com" className="text-primary hover:underline">support@ferns.builders-tech.com</a>.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
