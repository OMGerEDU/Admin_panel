import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { FeedbackButton } from '../components/FeedbackButton';
import { FeedbackModal } from '../components/FeedbackModal';

export default function DashboardLayout() {
    const { user } = useAuth();
    const [showAutoFeedback, setShowAutoFeedback] = useState(false);

    // If we are strictly checking for auth here, we ensure we don't render protected content
    // validation is simplified for now
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check for 7-day feedback prompt
    useEffect(() => {
        if (!user?.created_at) return;

        const checkFeedbackPrompt = () => {
            const dismissed = localStorage.getItem('feedback_dismissed');
            if (dismissed === 'true') return;

            const createdAt = new Date(user.created_at);
            const now = new Date();
            const diffTime = Math.abs(now - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 7) {
                setShowAutoFeedback(true);
            }
        };

        checkFeedbackPrompt();
    }, [user]);

    return (
        <div className="flex min-h-screen bg-background text-foreground relative">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:block" />

            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 overflow-auto bg-muted/20 relative">
                    <Outlet />

                    {/* Floating Feedback Button */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <FeedbackButton className="shadow-lg" />
                    </div>
                </main>
            </div>

            {/* Auto-shown Feedback Modal */}
            <FeedbackModal
                open={showAutoFeedback}
                onOpenChange={setShowAutoFeedback}
                source="prompt_7_days"
            />
        </div>
    );
}
