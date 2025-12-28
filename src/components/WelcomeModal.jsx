import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { CheckCircle2, Smartphone, CalendarClock, X, Sparkles, Loader2, ArrowRight, HelpCircle } from 'lucide-react';
import { logger } from '../lib/logger';
import GreenApiHelpModal from './GreenApiHelpModal';

export default function WelcomeModal({
    isOpen,
    onClose,
    hasNumbers,
    hasScheduledMessages,
    onComplete
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [formData, setFormData] = useState({
        phone_number: '',
        instance_id: '',
        api_token: '',
        status: 'active'
    });

    if (!isOpen) return null;

    // Determine initial step based on existing data if user re-opens, 
    // but typically strictly 1 then 2 for new users.
    // If user already has numbers, we might just show step 2 or nothing.
    // For now, we enforce the flow.

    const handleAddNumber = async (e) => {
        e.preventDefault();
        if (!user) return;

        // Validation
        const instanceId = formData.instance_id.trim();
        const apiToken = formData.api_token.trim();

        if (instanceId.length !== 10 || !/^\d+$/.test(instanceId)) {
            alert(t('validation.instance_id_format') || 'Instance ID must be exactly 10 digits.');
            return;
        }

        if (apiToken.length !== 50) {
            alert(t('validation.api_token_format') || 'API Token must be exactly 50 characters.');
            return;
        }

        try {
            setLoading(true);

            // Check if instance already exists to avoid duplicates/errors
            // (Optional, but good for UX)

            const { error } = await supabase
                .from('numbers')
                .insert({
                    user_id: user.id,
                    phone_number: formData.phone_number,
                    instance_id: instanceId,
                    api_token: apiToken,
                    status: 'active'
                });

            if (error) throw error;

            await logger.info(
                `Onboarding number added: ${formData.phone_number}`,
                { instance_id: instanceId }
            );

            // Move to step 2
            setStep(2);
        } catch (error) {
            console.error('Error saving number:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleCreateScheduledMessage = () => {
        // Mark onboarding as done so it doesn't pop up again
        localStorage.setItem('onboarding_completed', 'true');
        onComplete?.();
        onClose();
        navigate('/app/scheduled');
    };

    const handleComplete = () => {
        localStorage.setItem('onboarding_completed', 'true');
        onComplete?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="bg-card border rounded-lg shadow-xl w-full max-w-lg m-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold">
                                {t('onboarding.welcome_title') || 'Welcome to GreenManager!'}
                            </h2>
                        </div>
                        <button
                            onClick={handleSkip}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-accent"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className={`flex-1 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`flex-1 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                        <span className="text-xs font-medium text-muted-foreground ml-2">{step}/2</span>
                    </div>

                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <GreenApiHelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Smartphone className="h-5 w-5 text-primary" />
                                    {t('onboarding.step1_title') || 'Connect WhatsApp'}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {t('onboarding.step1_desc') || 'Enter your Green API credentials to connect your first number.'}
                                </p>
                            </div>

                            <form onSubmit={handleAddNumber} className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                                <div>
                                    <label className="text-sm font-medium">{t('numbers_page.phone_number')}</label>
                                    <Input
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        placeholder="+1234567890"
                                        required
                                        className="bg-background"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">{t('common.instance_id')}</label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                                            onClick={() => setShowHelpModal(true)}
                                        >
                                            <HelpCircle className="mr-1 h-3 w-3" />
                                            {t('common.where_to_find') || 'Where to find?'}
                                        </Button>
                                    </div>
                                    <Input
                                        value={formData.instance_id}
                                        onChange={(e) => setFormData({ ...formData, instance_id: e.target.value })}
                                        placeholder="10 digits (e.g. 7107372601)"
                                        required
                                        className="bg-background"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        Must be exactly 10 digits
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">API Token</label>
                                    <Input
                                        type="password"
                                        value={formData.api_token}
                                        onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                                        placeholder="50 characters token"
                                        required
                                        className="bg-background"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        Must be exactly 50 characters
                                    </p>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t('common.connecting') || 'Connecting...'}
                                        </>
                                    ) : (
                                        <>
                                            {t('common.connect_continue') || 'Connect & Continue'}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center space-y-2 py-4">
                                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold">{t('onboarding.step2_title') || 'Number Connected!'}</h3>
                                <p className="text-muted-foreground">
                                    {t('onboarding.step2_desc') || 'Your number is ready. Now, let\'s set up your first automation.'}
                                </p>
                            </div>

                            <div className="bg-muted/30 p-6 rounded-lg border text-center space-y-4">
                                <CalendarClock className="h-10 w-10 text-primary mx-auto opacity-80" />
                                <div>
                                    <h4 className="font-semibold">Scheduled Messages</h4>
                                    <p className="text-sm text-muted-foreground px-4">
                                        Send messages automatically at specific times. Perfect for reminders, greetings, and follow-ups.
                                    </p>
                                </div>
                                <Button onClick={handleCreateScheduledMessage} className="w-full">
                                    {t('onboarding.create_first_message') || 'Create First Message'}
                                </Button>
                                <Button variant="ghost" onClick={handleSkip} className="w-full text-muted-foreground">
                                    {t('onboarding.skip') || 'Skip for now'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

