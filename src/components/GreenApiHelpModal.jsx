import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { ExternalLink, X, ZoomIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GreenApiHelpModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [showZoomedImage, setShowZoomedImage] = useState(false);

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

                        <div
                            className="ml-8 mt-2 border rounded-lg overflow-hidden shadow-sm relative group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                            onClick={() => setShowZoomedImage(true)}
                        >
                            <img
                                src="/greenApiGuide.png"
                                alt="Green API Instance Guide"
                                className="w-full h-auto object-contain"
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm">
                                    <ZoomIn className="h-3 w-3" />
                                    {t('common.click_to_zoom') || 'Click to zoom'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>

            {/* Image Zoom Lightbox */}
            {showZoomedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setShowZoomedImage(false)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/20 hover:text-white"
                        onClick={() => setShowZoomedImage(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                    <img
                        src="/greenApiGuide.png"
                        alt="Green API Instance Guide Zoomed"
                        className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </Dialog>
    );
}
