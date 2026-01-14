import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Star, Loader2, Send } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function FeedbackModal({ open, onOpenChange, source = 'manual' }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState('feedback')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    try {
      setLoading(true)

      // In a real app, you might save this to a 'feedback' table
      // For now, we'll just log it or simulate a save
      // If table exists:
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id,
          rating,
          category,
          comment,
          source, // 'manual' or 'prompt_7_days'
          user_agent: navigator.userAgent
        })

      if (error) {
        console.error('Error saving feedback:', error)
      } else {
        console.log('Feedback submitted:', { rating, category, comment, source })
      }

      // If this was an auto-prompt, save that we showed it/user responded
      if (source === 'prompt_7_days') {
        localStorage.setItem('feedback_dismissed', 'true')
      }

      setSubmitted(true)
      setTimeout(() => {
        onOpenChange(false)
        // Reset after closing
        setTimeout(() => {
          setSubmitted(false)
          setRating(0)
          setCategory('feedback')
          setComment('')
        }, 500)
      }, 2000)

    } catch (err) {
      console.error('Error submitting feedback:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    if (source === 'prompt_7_days') {
      // If they dismiss the prompt, maybe remind later or mark as dismissed
      localStorage.setItem('feedback_dismissed', 'true')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleDismiss}>
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>{t('feedback.title', 'We value your feedback')}</DialogTitle>
              <DialogDescription>
                {t('feedback.description', 'How is your experience with Ferns so far?')}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('feedback.category', 'Category')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['feedback', 'bug', 'improvement', 'feature_request'].map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant={category === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategory(cat)}
                      className="text-xs h-8"
                    >
                      {t(`feedback.cat_${cat}`, cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()))}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('feedback.details', 'Message')}
                </label>
                <Textarea
                  placeholder={
                    category === 'bug' ? t('feedback.bug_placeholder', 'What went wrong?') :
                      category === 'feature_request' ? t('feedback.feature_placeholder', 'What would you like to see?') :
                        t('feedback.placeholder', 'Tell us what you like or what we can improve...')
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button variant="ghost" onClick={handleDismiss}>
                {t('common.skip', 'Skip')}
              </Button>
              <Button onClick={handleSubmit} disabled={rating === 0 || loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.submit', 'Submit')}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium">{t('feedback.thank_you', 'Thank you!')}</h3>
            <p className="text-center text-muted-foreground">
              {t('feedback.received', 'Your feedback helps us build a better product.')}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
