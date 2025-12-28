import { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import { Button } from './ui/button'
import { FeedbackModal } from './FeedbackModal'
import { useTranslation } from 'react-i18next'

export function FeedbackButton({ className }) {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className={`gap-2 ${className}`}
                onClick={() => setOpen(true)}
            >
                <MessageSquarePlus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('feedback.button', 'Feedback')}</span>
            </Button>

            <FeedbackModal
                open={open}
                onOpenChange={setOpen}
                source="manual_button"
            />
        </>
    )
}
