import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './userContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useUser();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#6C7D41]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/forum" replace />;
    }

    return children;
};

export default ProtectedRoute;