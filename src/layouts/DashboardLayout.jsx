import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export default function DashboardLayout() {
    const { user } = useAuth();

    // If we are strictly checking for auth here, we ensure we don't render protected content
    // validation is simplified for now
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:block" />

            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto bg-muted/20">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
