import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, Smartphone, CalendarClock, X, Sparkles } from 'lucide-react';

export default function WelcomeModal({ 
    isOpen, 
    onClose, 
    hasNumbers, 
    hasScheduledMessages,
    onComplete 
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const step1Completed = hasNumbers;
    const step2Completed = hasScheduledMessages;
    const allCompleted = step1Completed && step2Completed;

    const handlePrimaryAction = () => {
        if (!hasNumbers) {
            // Navigate to numbers page
            navigate('/app/numbers');
            onClose();
        } else if (!hasScheduledMessages) {
            // Navigate to create scheduled message
            navigate('/app/scheduled/new');
            onClose();
        } else {
            // All done
            handleComplete();
        }
    };

    const handleComplete = () => {
        localStorage.setItem('onboarding_completed', 'true');
        onComplete?.();
        onClose();
    };

    const handleSkip = () => {
        localStorage.setItem('onboarding_completed', 'true');
        onComplete?.();
        onClose();
    };

    const getPrimaryButtonText = () => {
        if (!hasNumbers) {
            return t('onboarding.add_number_cta') || 'Add WhatsApp Number';
        } else if (!hasScheduledMessages) {
            return t('onboarding.schedule_message_cta') || 'Schedule Your First Message';
        } else {
            return t('onboarding.complete') || 'Got it!';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="bg-card border rounded-lg shadow-xl w-full max-w-lg m-4 animate-in zoom-in-95">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold">
                                {t('onboarding.welcome_title') || 'Welcome to GreenManager! 🎉'}
                            </h2>
                        </div>
                        <button
                            onClick={handleSkip}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-accent"
                            aria-label={t('common.close') || 'Close'}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground">
                        {t('onboarding.welcome_description') || "Let's get you started in 2 simple steps"}
                    </p>

                    {/* Steps */}
                    <div className="space-y-4">
                        {/* Step 1: Add Number */}
                        <div className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                            step1Completed 
                                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                                : 'bg-accent/50 border-border'
                        }`}>
                            <div className={`flex-shrink-0 mt-1 ${
                                step1Completed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                            }`}>
                                {step1Completed ? (
                                    <CheckCircle2 className="h-6 w-6" />
                                ) : (
                                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                                        <span className="text-xs font-bold">1</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">
                                        {t('onboarding.step1_title') || 'Add WhatsApp Number'}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t('onboarding.step1_description') || 'Connect your WhatsApp number to start sending messages'}
                                </p>
                            </div>
                        </div>

                        {/* Step 2: Schedule Message */}
                        <div className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                            step2Completed 
                                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                                : 'bg-accent/50 border-border'
                        }`}>
                            <div className={`flex-shrink-0 mt-1 ${
                                step2Completed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                            }`}>
                                {step2Completed ? (
                                    <CheckCircle2 className="h-6 w-6" />
                                ) : (
                                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                                        <span className="text-xs font-bold">2</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">
                                        {t('onboarding.step2_title') || 'Schedule Your First Message'}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t('onboarding.step2_description') || 'Create your first scheduled message and experience the power of automation'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                {t('onboarding.progress') || 'Progress'}
                            </span>
                            <span className="font-medium">
                                {step1Completed && step2Completed ? '2/2' : step1Completed ? '1/2' : '0/2'}
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary transition-all duration-500"
                                style={{ 
                                    width: `${((step1Completed ? 1 : 0) + (step2Completed ? 1 : 0)) * 50}%` 
                                }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSkip}
                            className="flex-1"
                        >
                            {t('onboarding.skip') || 'Skip for now'}
                        </Button>
                        <Button
                            type="button"
                            onClick={handlePrimaryAction}
                            className="flex-1 bg-primary hover:bg-primary/90"
                        >
                            {getPrimaryButtonText()}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

