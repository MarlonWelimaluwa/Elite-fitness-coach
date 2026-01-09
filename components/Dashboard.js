'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ClientDashboard from './ClientDashboard';
import CoachDashboard from './CoachDashboard';

export default function Dashboard({ user, onLogout }) {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserRole();
    }, [user]);

    const fetchUserRole = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            setUserRole(data?.role || 'client');
        } catch (error) {
            console.error('Error fetching user role:', error);
            // Default to client if error
            setUserRole('client');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0A0E27]">
                <div className="spinner"></div>
            </div>
        );
    }

    // Route to appropriate dashboard based on role
    if (userRole === 'coach') {
        return <CoachDashboard user={user} onLogout={onLogout} />;
    }

    return <ClientDashboard user={user} onLogout={onLogout} />;
}