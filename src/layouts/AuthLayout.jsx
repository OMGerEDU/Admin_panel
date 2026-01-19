import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
    const { user } = useAuth();
    const location = useLocation();

    // Redirect to dashboard if already logged in, but allow access to update-password page
    if (user && location.pathname !== '/update-password') {
        return <Navigate to="/app/dashboard" replace />;
    }

    return (
        <div className="min-h-screen">
            <Outlet />
        </div>
    );
}
