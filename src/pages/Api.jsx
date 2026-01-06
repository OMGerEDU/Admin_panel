
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
import { Copy, Trash, Plus, Key, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { getApiKeys, createApiKey, deleteApiKey } from '../services/apiKeys'

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

    useEffect(() => {
        if (session?.user?.id) {
            checkPlanAndFetchKeys()
        }
    }, [session?.user?.id])

    const checkPlanAndFetchKeys = async () => {
        setLoading(true)
        try {
            // 1. Check Plan
            // We use the same logic as Plans.jsx roughly, or a simpler query
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('*, plans(*)')
                .eq('user_id', session.user.id)
                .maybeSingle()

            const planName = subscription?.plans?.name || 'Free'
            const status = subscription?.status || 'inactive'

            // Allow if plan is not Free and status is active (or trialing etc)
            // Adjust logic based on strict requirements ("above free plan")
            const isEligible = planName !== 'Free' && status === 'active';

            setPlan({ name: planName, isEligible })

            if (isEligible) {
                // 2. Fetch Keys
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
            // Refresh list
            const { data: newData } = await getApiKeys()
            setKeys(newData || [])
        }
    }

    const handleDeleteKey = async (id) => {
        if (!confirm('Are you sure you want to delete this API key? Any applications using it will stop working.')) return
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

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">API Management</h2>
                <p className="text-muted-foreground">
                    Manage your API keys and view documentation to integrate with your custom applications.
                </p>
            </div>

            {/* Keys Management */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>My API Keys</CardTitle>
                        <CardDescription>
                            These keys allow full access to your account via the API. Keep them secure.
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
                                Create New Key
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            {!generatedKey ? (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>Create New API Key</DialogTitle>
                                        <DialogDescription>
                                            Give your key a name to identify it later.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Input
                                            placeholder="e.g. Website Integration"
                                            value={newKeyName}
                                            onChange={e => setNewKeyName(e.target.value)}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                        <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>Generate Key</Button>
                                    </DialogFooter>
                                </>
                            ) : (
                                <>
                                    <DialogHeader>
                                        <DialogTitle className="text-green-600 flex items-center gap-2">
                                            <Check className="h-5 w-5" /> Key Created Successfully
                                        </DialogTitle>
                                        <DialogDescription>
                                            Copy this key now. You won't be able to see it again!
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 space-y-2">
                                        <div className="relative">
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
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            Store this key securely. It cannot be recovered.
                                        </p>
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
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            No API keys generated yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Token</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Last Used</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {keys.map(key => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-medium">{key.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{key.prefix}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(key.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteKey(key.id)}>
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Documentation */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Documentation</h3>
                    <p className="text-muted-foreground">
                        Reference for the REST API endpoints. All requests must include your API Key in the headers.
                    </p>
                </div>

                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-base">Authentication</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                            Include the <code>x-api-key</code> header in all your requests. Base URL: <code>/api</code> (same origin) or <code>https://your-domain.com/api</code>
                        </p>
                        <pre className="bg-black/90 text-white p-4 rounded-md overflow-x-auto text-sm font-mono">
                            {`curl -X GET https://your-domain.com/api/v1/numbers \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: sk_live_..."`}
                        </pre>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">GET</span>
                                /v1/numbers
                            </CardTitle>
                            <CardDescription>List all connected WhatsApp numbers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm">
                                <p className="font-semibold mb-1">Response</p>
                                <ScrollArea className="h-32 rounded border bg-muted p-2">
                                    <pre className="text-xs font-mono">
                                        {`{
  "data": [
    {
      "id": "uuid...",
      "phone_number": "1234567890",
      "status": "connected",
      "instance_id": "..."
    }
  ]
}`}
                                    </pre>
                                </ScrollArea>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">POST</span>
                                /v1/messages/send
                            </CardTitle>
                            <CardDescription>Send a text or media message</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm">
                                <p className="font-semibold mb-1">Body</p>
                                <pre className="bg-muted p-2 rounded text-xs font-mono">
                                    {`{
  "number_id": "uuid...",
  "to": "1234567890",
  "message": "Hello world!"
}`}
                                </pre>
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold mb-1">Response</p>
                                <pre className="bg-muted p-2 rounded text-xs font-mono">
                                    {`{
  "success": true,
  "message_id": "..."
}`}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">GET</span>
                                /v1/chats
                            </CardTitle>
                            <CardDescription>List active chats</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm">
                                <p className="font-semibold mb-1">Response</p>
                                <ScrollArea className="h-32 rounded border bg-muted p-2">
                                    <pre className="text-xs font-mono">
                                        {`{
  "data": [
    {
      "id": "uuid...",
      "name": "John Doe",
      "last_message": "Hello"
    }
  ]
}`}
                                    </pre>
                                </ScrollArea>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">DELETE</span>
                                /v1/messages/:id
                            </CardTitle>
                            <CardDescription>Delete a message</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm">
                                <p className="font-semibold mb-1">Response</p>
                                <pre className="bg-muted p-2 rounded text-xs font-mono">
                                    {`{
  "success": true
}`}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">POST</span>
                                /v1/scheduled
                            </CardTitle>
                            <CardDescription>Schedule a message for later</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">Body</p>
                                    <pre className="bg-muted p-2 rounded text-xs font-mono h-full">
                                        {`{
  "number_id": "uuid...",
  "to": "1234567890",
  "message": "Happy Birthday!",
  "scheduled_at": "2024-12-25T09:00:00Z",
  "is_recurring": false
}`}
                                    </pre>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">Response</p>
                                    <pre className="bg-muted p-2 rounded text-xs font-mono h-full">
                                        {`{
  "success": true,
  "data": {
    "id": "uuid...",
    "status": "pending",
    "scheduled_at": "..."
  }
}`}
                                    </pre>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div >
            </div >
        </div >
    )
}
