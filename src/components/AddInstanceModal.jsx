import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, CheckCircle2, QrCode, Smartphone, ArrowLeft, Lock } from 'lucide-react';
import { EvolutionApiService } from '../services/EvolutionApiService';
import { supabase } from '../lib/supabaseClient';
import { cn } from '../lib/utils';

export function AddInstanceModal({ isOpen, onClose, isBetaTester, onSuccess, user, editingNumber, userPlan }) {
    const { t } = useTranslation();

    // Steps: 'select-provider' | 'configure' | 'success'
    const [currentStep, setCurrentStep] = useState('select-provider');
    const [provider, setProvider] = useState('green-api'); // 'green-api' | 'evolution-api'

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [createdInstanceId, setCreatedInstanceId] = useState(null); // DB ID of created/updated instance

    const isEvolutionLocked = userPlan === 'Free' || !userPlan; // Default to locked if plan unknown, or strictly check 'Free'

    // GreenAPI Form Data
    const [greenFormData, setGreenFormData] = useState({
        phone_number: '',
        instance_id: '',
        api_token: '',
        status: 'active',
        configureSettings: true,
        usePlatformWebhook: false
    });

    // EvolutionAPI Form Data
    const [evoFormData, setEvoFormData] = useState({
        instanceName: '',
    });
    const [evoQrCode, setEvoQrCode] = useState(null);
    const [evoStep, setEvoStep] = useState('create'); // 'create' | 'qr'

    // Success Step Data
    const [friendlyName, setFriendlyName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(false);
            setError(null);
            setEvoQrCode(null);
            setCreatedInstanceId(null);
            setFriendlyName('');

            if (editingNumber) {
                // Edit Mode: Skip selection, go straight to configure
                setCurrentStep('configure');
                setProvider(editingNumber.provider || 'green-api');
                setFriendlyName(editingNumber.name || '');

                if (editingNumber.provider === 'evolution-api') {
                    setEvoFormData({ instanceName: editingNumber.instance_id || '' });
                    setEvoStep('create'); // Start at create to allow re-fetching QR or see name
                } else {
                    setGreenFormData({
                        phone_number: editingNumber.phone_number || '',
                        instance_id: editingNumber.instance_id || '',
                        api_token: editingNumber.api_token || '',
                        status: editingNumber.status || 'active',
                        configureSettings: false,
                        usePlatformWebhook: false
                    });
                }
            } else {
                // New Mode: Start at selection
                setCurrentStep(isBetaTester ? 'select-provider' : 'configure');
                setProvider('green-api');
                setGreenFormData({
                    phone_number: '',
                    instance_id: '',
                    api_token: '',
                    status: 'active',
                    configureSettings: true,
                    usePlatformWebhook: false
                });
                setEvoFormData({ instanceName: '' });
                setEvoStep('create');
            }
        }
    }, [isOpen, editingNumber, isBetaTester]);

    const handleGreenSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (greenFormData.instance_id.length !== 10 || !/^\d+$/.test(greenFormData.instance_id)) {
            setError(t('validation.instance_id_format') || 'Instance ID must be exactly 10 digits.');
            setLoading(false);
            return;
        }
        if (greenFormData.api_token.length !== 50) {
            setError(t('validation.api_token_format') || 'API Token must be exactly 50 characters.');
            setLoading(false);
            return;
        }

        try {
            let instanceId;
            if (editingNumber) {
                // UPDATE
                const { error: dbError } = await supabase
                    .from('numbers')
                    .update({
                        phone_number: greenFormData.phone_number,
                        instance_id: greenFormData.instance_id,
                        api_token: greenFormData.api_token,
                        status: greenFormData.status,
                        // provider: 'green-api'
                    })
                    .eq('id', editingNumber.id);

                if (dbError) throw dbError;
                instanceId = editingNumber.id;
            } else {
                // INSERT
                const { data: existing } = await supabase
                    .from('numbers')
                    .select('id')
                    .eq('instance_id', greenFormData.instance_id)
                    .maybeSingle();

                if (existing) {
                    throw new Error('Instance ID already exists in the system.');
                }

                const { data: newNumber, error: dbError } = await supabase
                    .from('numbers')
                    .insert({
                        user_id: user.id,
                        phone_number: greenFormData.phone_number,
                        instance_id: greenFormData.instance_id,
                        api_token: greenFormData.api_token,
                        status: 'active',
                        provider: 'green-api',
                        // Temporary name until renamed
                        name: greenFormData.phone_number ? `GreenAPI ${greenFormData.phone_number}` : 'New GreenAPI Instance'
                    })
                    .select('id')
                    .single();

                if (dbError) throw dbError;
                instanceId = newNumber.id;
            }

            setCreatedInstanceId(instanceId);
            setFriendlyName(editingNumber?.name || greenFormData.phone_number || '');
            setCurrentStep('success'); // Move to success/rename step
        } catch (err) {
            console.error('GreenAPI Save Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEvoCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const name = evoFormData.instanceName.trim();
        if (!name) {
            setError('Instance Name is required.');
            setLoading(false);
            return;
        }

        try {
            if (!editingNumber) {
                const { data: existing } = await supabase
                    .from('numbers')
                    .select('id')
                    .eq('instance_id', name)
                    .maybeSingle();

                if (existing) {
                    throw new Error('Instance Name already exists in your account.');
                }
            }

            // Create/Fetch Instance
            let result;
            try {
                result = await EvolutionApiService.createInstance(name);
            } catch (err) {
                if (err.message.includes('already exists')) {
                    // If it exists, try connecting to it (fetch QR)
                    result = await EvolutionApiService.fetchQrCode(name);
                } else {
                    throw err;
                }
            }

            if (result.qrcode && result.qrcode.base64) {
                setEvoQrCode(result.qrcode.base64);
                setEvoStep('qr');
            } else if (result.instance) {
                // Already connected?
                setEvoStep('qr'); // Still go to QR step but maybe show info
                // Check status
                const status = await EvolutionApiService.getInstance(name);
                if (status?.instance?.state === 'open') {
                    // Already connected, auto-verify
                    await handleEvoConfirm(name);
                    return;
                } else {
                    // Try fetch QR specifically if no base64 in create response
                    const qrRes = await EvolutionApiService.fetchQrCode(name);
                    if (qrRes.qrcode && qrRes.qrcode.base64) {
                        setEvoQrCode(qrRes.qrcode.base64);
                        setEvoStep('qr');
                    } else {
                        throw new Error('Could not retrieve QR code.');
                    }
                }
            } else {
                // Fallback try fetch QR
                const qrRes = await EvolutionApiService.fetchQrCode(name);
                if (qrRes.qrcode && qrRes.qrcode.base64) {
                    setEvoQrCode(qrRes.qrcode.base64);
                    setEvoStep('qr');
                } else {
                    throw new Error('Instance created but QR code missing.');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEvoConfirm = async (overrideName) => {
        setLoading(true);
        try {
            const name = overrideName || evoFormData.instanceName.trim();
            // Just inserting into DB now

            let instanceId;
            if (editingNumber) {
                // Update
                const { error: dbError } = await supabase
                    .from('numbers')
                    .update({
                        // Evolution doesn't strictly have phone number until connected and we fetch it
                        // For now keeping what we have or updating if we could fetch profile
                    })
                    .eq('id', editingNumber.id);
                if (dbError) throw dbError;
                instanceId = editingNumber.id;
            } else {
                const { data: newNumber, error: dbError } = await supabase
                    .from('numbers')
                    .insert({
                        user_id: user.id,
                        phone_number: name, // Placeholder until synced
                        instance_id: name,
                        api_token: 'evolution-managed',
                        status: 'active',
                        provider: 'evolution-api',
                        name: name
                    })
                    .select('id')
                    .single();

                if (dbError) throw dbError;
                instanceId = newNumber.id;
            }

            setCreatedInstanceId(instanceId);
            setFriendlyName(editingNumber?.name || name);
            setCurrentStep('success'); // Move to rename
        } catch (err) {
            setError('Failed to confirm connection. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveName = async () => {
        if (!createdInstanceId) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('numbers')
                .update({ name: friendlyName })
                .eq('id', createdInstanceId);

            if (error) throw error;

            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to save name: ' + err.message);
        } finally {
            setLoading(false);
        }
    }


    const renderStepSelection = () => (
        <div className="grid grid-cols-2 gap-4 py-4">
            <div
                className={cn(
                    "cursor-pointer rounded-xl border-2 p-4 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3 text-center",
                    provider === 'green-api' ? "border-primary bg-primary/5" : "border-muted"
                )}
                onClick={() => setProvider('green-api')}
            >
                <Smartphone className="h-8 w-8 text-green-600" />
                <div className="space-y-1">
                    <h3 className="font-semibold">Green API</h3>
                    <p className="text-xs text-muted-foreground">Stable, managed hosting.</p>
                </div>
            </div>

            <div
                className={cn(
                    "relative rounded-xl border-2 p-4 transition-all flex flex-col items-center justify-center gap-3 text-center",
                    isEvolutionLocked
                        ? "border-muted bg-gray-50 opacity-70 cursor-not-allowed"
                        : "cursor-pointer hover:border-primary/50",
                    !isEvolutionLocked && provider === 'evolution-api' ? "border-primary bg-primary/5" : "border-muted"
                )}
                onClick={() => {
                    if (!isEvolutionLocked) setProvider('evolution-api');
                }}
            >
                {isEvolutionLocked && (
                    <div className="absolute top-2 right-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                )}
                <div className="relative">
                    <QrCode className="h-8 w-8 text-blue-600" />
                    {!isEvolutionLocked && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">BETA</span>}
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold">Evolution API</h3>
                    <p className="text-xs text-muted-foreground">Self-hosted, QR scan.</p>
                    {isEvolutionLocked && <p className="text-[10px] font-bold text-amber-600">Premium / Enterprise only</p>}
                </div>
            </div>
        </div>
    );

    const renderStepConfigure = () => {
        if (provider === 'green-api') {
            return (
                <form onSubmit={handleGreenSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>{t('numbers_page.phone_number')}</Label>
                        <Input
                            value={greenFormData.phone_number}
                            onChange={(e) => setGreenFormData({ ...greenFormData, phone_number: e.target.value })}
                            placeholder="+1234567890"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{t('common.instance_id')}</Label>
                        <Input
                            value={greenFormData.instance_id}
                            onChange={(e) => setGreenFormData({ ...greenFormData, instance_id: e.target.value })}
                            placeholder="10 digits"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>API Token</Label>
                        <Input
                            type="password"
                            value={greenFormData.api_token}
                            onChange={(e) => setGreenFormData({ ...greenFormData, api_token: e.target.value })}
                            placeholder="50 characters"
                            required
                        />
                    </div>
                    {error && <div className="text-sm text-red-500">{error}</div>}
                    <Button type="submit" className="w-full mt-4" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : (editingNumber ? t('common.save') : 'Connect')}
                    </Button>
                </form>
            );
        } else {
            // Evolution
            if (evoStep === 'create') {
                return (
                    <form onSubmit={handleEvoCreate} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Instance Name</Label>
                            <Input
                                value={evoFormData.instanceName}
                                onChange={(e) => setEvoFormData({ ...evoFormData, instanceName: e.target.value })}
                                placeholder="MyBusinessWA"
                                required
                            />
                            <p className="text-xs text-muted-foreground">Unique name for this connection.</p>
                        </div>
                        {error && <div className="text-sm text-red-500">{error}</div>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Create & Get QR'}
                        </Button>
                    </form>
                );
            } else {
                // QR Scan
                return (
                    <div className="flex flex-col items-center space-y-4 py-2">
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Scan QR Code</h3>
                            <p className="text-sm text-muted-foreground">Open WhatsApp on your phone > Linked Devices > Link a Device</p>
                        </div>

                        {evoQrCode ? (
                            <img src={evoQrCode} alt="QR Code" className="w-64 h-64 border rounded-lg shadow-sm" />
                        ) : (
                            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-lg">
                                <p className="text-muted-foreground">Loading QR...</p>
                            </div>
                        )}

                        <div className="w-full space-y-2">
                            <Button onClick={() => handleEvoConfirm()} className="w-full" variant="default" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'I have scanned it'}
                            </Button>
                            <Button onClick={() => setEvoStep('create')} variant="ghost" className="w-full">
                                Back
                            </Button>
                        </div>
                        {error && <div className="text-sm text-red-500 text-center">{error}</div>}
                    </div>
                );
            }
        }
    };

    const renderStepSuccess = () => (
        <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-bold">Connected!</h3>
                <p className="text-muted-foreground">Your instance has been successfully added.</p>
            </div>

            <div className="w-full max-w-xs space-y-2 text-left">
                <Label>Instance Name</Label>
                <Input
                    value={friendlyName}
                    onChange={(e) => setFriendlyName(e.target.value)}
                    placeholder="E.g. Support Line"
                    autoFocus
                />
                <p className="text-xs text-muted-foreground">Give this number a friendly name to identify it easily.</p>
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}

            <Button onClick={handleSaveName} className="w-full max-w-xs" size="lg" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Finish'}
            </Button>
        </div>
    );

    // Dialog Props
    const titles = {
        'select-provider': 'Select Provider',
        'configure': provider === 'green-api' ? 'Connect Green API' : 'Connect Evolution API',
        'success': 'Success'
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] transition-all duration-300">
                <DialogHeader>
                    {currentStep !== 'select-provider' && currentStep !== 'success' && !editingNumber && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute left-4 top-4 h-8 w-8 p-0"
                            onClick={() => {
                                if (currentStep === 'configure') setCurrentStep('select-provider');
                            }}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <DialogTitle className="text-center">{titles[currentStep]}</DialogTitle>
                    {currentStep === 'select-provider' && (
                        <DialogDescription className="text-center">
                            Choose how you want to connect your WhatsApp number.
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="min-h-[300px] flex flex-col justify-center">
                    {currentStep === 'select-provider' && renderStepSelection()}
                    {currentStep === 'configure' && renderStepConfigure()}
                    {currentStep === 'success' && renderStepSuccess()}
                </div>

                {currentStep === 'select-provider' && (
                    <DialogFooter>
                        <Button className="w-full" onClick={() => setCurrentStep('configure')}>
                            Continue
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
