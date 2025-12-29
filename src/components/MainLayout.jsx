import { useState } from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function MainLayout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { lang, toggleLang, t } = useLanguage();
    const { signOut, user } = useAuth();

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Header */}
                <header className="h-[var(--header-height)] sticky top-0 z-20 bg-[var(--bg-glass)] backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-6">
                    <button
                        className="lg:hidden p-2 rounded hover:bg-[var(--bg-secondary)]"
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </button>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLang}
                            className="p-2 rounded hover:bg-[var(--bg-secondary)] font-bold text-sm"
                        >
                            {lang === 'en' ? '🇮🇱 HE' : '🇺🇸 EN'}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded hover:bg-[var(--bg-secondary)] text-xl"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        <div className="h-6 w-px bg-[var(--border-color)] mx-2"></div>

                        <div className="flex items-center gap-3">
                            <span className="hidden md:block text-sm font-medium opacity-80">{user?.email}</span>
                            <button
                                onClick={signOut}
                                className="text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-1.5 rounded hover:border-[var(--status-error)] hover:text-[var(--status-error)] transition-colors"
                            >
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-4 text-center text-sm text-[var(--text-secondary)] border-t border-[var(--border-color)]">
                    &copy; {new Date().getFullYear()} Ferns. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
