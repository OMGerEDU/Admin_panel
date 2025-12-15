import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
    const { user } = useAuth();

    // Redirect to dashboard if already logged in
    if (user) {
        return <Navigate to="/app/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50">
            <div className="w-full max-w-[400px] p-4">
                <Outlet />
            </div>
        </div>
    );
}
