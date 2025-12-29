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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [window.location.pathname]);

    // If we are strictly checking for auth here, we ensure we don't render protected content
    // validation is simplified for now
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground relative">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:block" />

            {/* Mobile Sidebar */}
            <Sidebar
                className={mobileMenuOpen ? "block fixed inset-y-0 left-0 z-50 w-64 shadow-xl" : "hidden"}
                isMobile={true}
                onClose={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
                <main className="flex-1 p-4 md:p-6 overflow-auto bg-muted/20 relative">
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
