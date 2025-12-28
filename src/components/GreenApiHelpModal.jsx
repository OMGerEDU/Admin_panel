import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GreenApiHelpModal({ isOpen, onClose }) {
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('green_api.guide_title') || 'How to get Green API Credentials'}</DialogTitle>
                    <DialogDescription>
                        {t('green_api.guide_desc') || 'Follow these steps to get your Instance ID and API Token.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">1</span>
                            <h4 className="font-semibold">{t('green_api.step1') || 'Go to Green API Console'}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-8">
                            {t('green_api.step1_desc') || 'Login or create an account on the Green API console to manage your instances.'}
                        </p>
                        <Button asChild variant="outline" className="ml-8 mt-1">
                            <a href="https://console.green-api.com/instanceList" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                {t('green_api.open_console') || 'Open Console'}
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">2</span>
                            <h4 className="font-semibold">{t('green_api.step2') || 'Copy Credentials'}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-8">
                            {t('green_api.step2_desc') || 'Select your instance and copy the "InstanceId" and "ApiTokenInstance" as shown below:'}
                        </p>
                        <div className="ml-8 mt-2 border rounded-lg overflow-hidden shadow-sm">
                            <img
                                src="/greenApiGuide.png"
                                alt="Green API Instance Guide"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
