import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog'
import { ScrollArea } from '../components/ui/scroll-area'
import { Copy, Trash, Plus, Key, Check, AlertTriangle, Menu, ChevronRight } from 'lucide-react'
import { getApiKeys, createApiKey, deleteApiKey } from '../services/apiKeys'

// --- Helper Components ---

const CodeBlock = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(tabs[activeTab]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-md border bg-slate-950 text-slate-50 dark:bg-slate-900 dark:border-slate-800 overflow-hidden my-4">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
                <div className="flex gap-4">
                    {Object.keys(tabs).map(lang => (
                        <button
                            key={lang}
                            onClick={() => setActiveTab(lang)}
                            className={`text-xs font-medium transition-colors hover:text-white ${activeTab === lang ? 'text-white' : 'text-slate-400'}`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                    {tabs[activeTab]}
                </pre>
            </div>
        </div>
    );
};

const MethodBadge = ({ method }) => {
    const colors = {
        GET: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        POST: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        PUT: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors[method] || "bg-gray-100 text-gray-700"}`}>
            {method}
        </span>
    );
};

const EndpointDoc = ({ id, method, path, title, description, params, examples }) => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <MethodBadge method={method} />
                    <code className="text-lg font-mono font-semibold">{path}</code>
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground mt-2">{description}</p>
            </div>

            {params && params.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Name</TableHead>
                                <TableHead className="w-[100px]">Type</TableHead>
                                <TableHead className="w-[100px]">In</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {params.map((p, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-mono text-xs font-semibold">{p.name}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{p.type}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{p.in}</TableCell>
                                    <TableCell className="text-sm">
                                        {p.required && <span className="text-red-500 font-bold text-xs mr-1">*</span>}
                                        {p.description}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Example Request</h4>
                <CodeBlock tabs={examples} />
            </div>
        </div>
    );
};

// --- Main Page ---

export default function Api() {
    const { session } = useAuth()
    const { t } = useTranslation()
    const [loading, setLoading] = useState(true)
    const [plan, setPlan] = useState(null)
    const [keys, setKeys] = useState([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newKeyName, setNewKeyName] = useState('')
    const [generatedKey, setGeneratedKey] = useState(null)
    const [copySuccess, setCopySuccess] = useState(false)
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        if (session?.user?.id) {
            checkPlanAndFetchKeys()
        }
    }, [session?.user?.id])

    const checkPlanAndFetchKeys = async () => {
        setLoading(true)
        try {
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('*, plans(*)')
                .eq('user_id', session.user.id)
                .maybeSingle()

            const planName = subscription?.plans?.name || 'Free'
            const status = subscription?.status || 'inactive'
            const isEligible = planName !== 'Free' && status === 'active';

            setPlan({ name: planName, isEligible })

            if (isEligible) {
                const { data, error } = await getApiKeys()
                if (error) console.error(error)
                else setKeys(data || [])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return
        const { data, plainKey, error } = await createApiKey(newKeyName)
        if (error) {
            console.error(error)
            alert('Failed to create key')
        } else {
            setGeneratedKey(plainKey)
            const { data: newData } = await getApiKeys()
            setKeys(newData || [])
        }
    }

    const handleDeleteKey = async (id) => {
        if (!confirm('Are you sure you want to delete this API key?')) return
        await deleteApiKey(id)
        const { data } = await getApiKeys()
        setKeys(data || [])
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
    }

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading API details...</div>
    }

    if (!plan?.isEligible) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="bg-primary/10 p-6 rounded-full">
                    <Key className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">API Access Locked</h2>
                <p className="text-muted-foreground max-w-md">
                    API access is available only for pro and agency plans.
                    Upgrade your plan to generate API keys, access documentation, and build custom integrations.
                </p>
                <Button onClick={() => window.location.href = '/app/plans'} size="lg">
                    Upgrade to Pro
                </Button>
            </div>
        )
    }

    const menuItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'authentication', label: 'Authentication' },
        { id: 'management', label: 'API Keys' },
        { id: 'whoami', label: 'Whoami / Verification' },
        { id: 'numbers-list', label: 'List Numbers' },
        { id: 'chats-list', label: 'List Chats' },
        { id: 'chat-history', label: 'Chat History' },
        { id: 'send-message', label: 'Send Message' },
        { id: 'delete-message', label: 'Delete Message' },
        { id: 'scheduled', label: 'Scheduled Messages' },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">API Documentation</h1>
                        <p className="text-lg text-muted-foreground">
                            Welcome to the Ferns API. You can use our API to access WhatsApp endpoints, which allows you to send and receive messages, manage automated workflows, and integrate with your CRM.
                        </p>
                        <div className="bg-muted p-6 rounded-lg border flex items-start gap-4">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />
                            <div>
                                <h4 className="font-semibold mb-1">Getting Started</h4>
                                <p className="text-muted-foreground text-sm">
                                    Please select a section from the sidebar to view detailed documentation.
                                    Start by generating an API Key in the "API Keys" section.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'authentication':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold">Authentication</h2>
                        <p className="text-muted-foreground">
                            The API uses API keys to authenticate requests. You can view and manage your API keys below.
                            All API requests must be made over HTTPS. Calls made over plain HTTP will fail.
                            API keys must be included as a header in all requests:
                        </p>
                        <CodeBlock tabs={{
                            Header: `x-api-key: YOUR_API_KEY`
                        }} />
                    </div>
                );
            case 'management':
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Your API Keys</CardTitle>
                                    <CardDescription>
                                        Manage access keys for your applications.
                                    </CardDescription>
                                </div>
                                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                                    setIsCreateOpen(open)
                                    if (!open) {
                                        setGeneratedKey(null)
                                        setNewKeyName('')
                                    }
                                }}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Generate Key
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        {!generatedKey ? (
                                            <>
                                                <DialogHeader>
                                                    <DialogTitle>Create New API Key</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <Input
                                                        placeholder="Key Name (e.g. Production)"
                                                        value={newKeyName}
                                                        onChange={e => setNewKeyName(e.target.value)}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>Create</Button>
                                                </DialogFooter>
                                            </>
                                        ) : (
                                            <>
                                                <DialogHeader>
                                                    <DialogTitle className="text-green-600">Key Created!</DialogTitle>
                                                    <DialogDescription>Copy this key now. It won't be shown again.</DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4 relative">
                                                    <Input readOnly value={generatedKey} className="pr-12 font-mono" />
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="absolute right-1 top-1 h-8 w-8"
                                                        onClick={() => copyToClipboard(generatedKey)}
                                                    >
                                                        {copySuccess ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={() => setIsCreateOpen(false)}>Done</Button>
                                                </DialogFooter>
                                            </>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                {keys.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No active keys.</p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Prefix</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {keys.map(key => (
                                                <TableRow key={key.id}>
                                                    <TableCell className="font-medium">{key.name}</TableCell>
                                                    <TableCell className="font-mono text-xs text-muted-foreground">{key.prefix}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{new Date(key.created_at).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteKey(key.id)}>
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'whoami':
                return (
                    <EndpointDoc
                        id="whoami"
                        method="GET"
                        path="/api/whoami"
                        title="Whoami / Verification"
                        description="Retrieve information about the authenticated user. This endpoint is commonly used by Make.com and other integration platforms to verify the API connection."
                        examples={{
                            cURL: `curl -X GET https://ferns.builders-tech.com/api/whoami \\
  -H "x-api-key: YOUR_API_KEY"`,
                            Node: `const response = await fetch('https://ferns.builders-tech.com/api/whoami', {
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
});
const data = await response.json();`,
                        }}
                    />
                );
            case 'numbers-list':
                return (
                    <EndpointDoc
                        id="numbers-list"
                        method="GET"
                        path="/v1/numbers"
                        title="List Numbers"
                        description="Retrieve a list of all WhatsApp numbers connected to your account."
                        examples={{
                            cURL: `curl -X GET https://ferns.builders-tech.com/api/v1/numbers \\
  -H "x-api-key: YOUR_API_KEY"`,
                            Node: `const response = await fetch('https://ferns.builders-tech.com/api/v1/numbers', {
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
});
const data = await response.json();`,
                            Python: `import requests

url = "https://ferns.builders-tech.com/api/v1/numbers"
headers = {"x-api-key": "YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`
                        }}
                    />
                );
            case 'chats-list':
                return (
                    <EndpointDoc
                        id="chats-list"
                        method="GET"
                        path="/v1/chats"
                        title="List Chats"
                        description="Retrieve a list of active chats for your account. You can filter by number_id."
                        params={[
                            { name: "number_id", type: "string", in: "query", description: "Optional. Filter chats by specific number ID." },
                            { name: "limit", type: "integer", in: "query", description: "Optional. Limit number of results (default 20, max 100)." }
                        ]}
                        examples={{
                            cURL: `curl -X GET "https://ferns.builders-tech.com/api/v1/chats?limit=10" \\
  -H "x-api-key: YOUR_API_KEY"`,
                            Node: `const response = await fetch('https://ferns.builders-tech.com/api/v1/chats?limit=10', {
  headers: { 'x-api-key': 'YOUR_API_KEY' }
});`,
                        }}
                    />
                );
            case 'chat-history':
                return (
                    <EndpointDoc
                        id="chat-history"
                        method="GET"
                        path="/v1/chats/:id/messages"
                        title="Get Chat History"
                        description="Retrieve the message history for a specific chat."
                        params={[
                            { name: "id", type: "string", in: "path", required: true, description: "The UUID of the chat." },
                            { name: "limit", type: "integer", in: "query", description: "Number of messages to return (default 50)." },
                            { name: "before", type: "string", in: "query", description: "Timestamp to fetch messages before (for pagination)." }
                        ]}
                        examples={{
                            cURL: `curl -X GET "https://ferns.builders-tech.com/api/v1/chats/CHAT_UUID/messages" \\
  -H "x-api-key: YOUR_API_KEY"`,
                            Node: `const chatId = 'CHAT_UUID';
const response = await fetch(\`https://ferns.builders-tech.com/api/v1/chats/\${chatId}/messages\`, {
  headers: { 'x-api-key': 'YOUR_API_KEY' }
});`
                        }}
                    />
                );
            case 'send-message':
                return (
                    <EndpointDoc
                        id="send-message"
                        method="POST"
                        path="/v1/messages/send"
                        title="Send Message"
                        description="Send a text or media message to a phone number."
                        params={[
                            { name: "number_id", type: "string", in: "body", required: true, description: "The ID of the source number." },
                            { name: "to", type: "string", in: "body", required: true, description: "Destination phone number (international format)." },
                            { name: "message", type: "string", in: "body", description: "Text content of the message." },
                            { name: "media_url", type: "string", in: "body", description: "Optional URL for media attachment." },
                            { name: "media_type", type: "string", in: "body", description: "image, video, audio, or document." }
                        ]}
                        examples={{
                            cURL: `curl -X POST https://ferns.builders-tech.com/api/v1/messages/send \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "number_id": "NUMBER_UUID",
    "to": "1234567890",
    "message": "Hello from API!"
  }'`
                        }}
                    />
                );
            case 'delete-message':
                return (
                    <EndpointDoc
                        id="delete-message"
                        method="DELETE"
                        path="/v1/messages/:id"
                        title="Delete Message"
                        description="Delete a specific message from a chat."
                        params={[
                            { name: "id", type: "string", in: "path", required: true, description: "UUID of the message to delete." }
                        ]}
                        examples={{
                            cURL: `curl -X DELETE https://ferns.builders-tech.com/api/v1/messages/MESSAGE_UUID \\
  -H "x-api-key: YOUR_API_KEY"`
                        }}
                    />
                );
            case 'scheduled':
                return (
                    <EndpointDoc
                        id="scheduled"
                        method="POST"
                        path="/v1/scheduled"
                        title="Schedule Message"
                        description="Create a scheduled message to be sent at a future time."
                        params={[
                            { name: "number_id", type: "string", in: "body", required: true, description: "Source Number ID." },
                            { name: "to", type: "string", in: "body", required: true, description: "Recipient Phone Number." },
                            { name: "message", type: "string", in: "body", required: true, description: "Message content." },
                            { name: "scheduled_at", type: "string", in: "body", required: true, description: "ISO 8601 Date String (e.g. 2024-12-25T10:00:00Z)." }
                        ]}
                        examples={{
                            cURL: `curl -X POST https://ferns.builders-tech.com/api/v1/scheduled \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "number_id": "NUMBER_UUID",
    "to": "15551234567",
    "message": "Merry Christmas!",
    "scheduled_at": "2025-12-25T08:00:00Z"
  }'`
                        }}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Sidebar Navigation */}
                <div className="md:col-span-3 lg:col-span-2 hidden md:block">
                    <div className="sticky top-24 space-y-1">
                        <h4 className="font-bold mb-4 px-2">API Reference</h4>
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${activeSection === item.id
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-9 lg:col-span-10 min-h-[500px]">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}
