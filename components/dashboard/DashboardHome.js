'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Calendar, TrendingUp, Target } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardHome({ user, isAdmin }) {
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        upcomingBookings: 0,
        recentProgress: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const [workoutsRes, bookingsRes, progressRes] = await Promise.all([
                supabase.from('workouts').select('id', { count: 'exact' }).eq('user_id', user.id),
                supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user.id).gte('session_date', new Date().toISOString().split('T')[0]).eq('status', 'confirmed'),
                supabase.from('progress').select('*').eq('user_id', user.id).order('record_date', { ascending: false }).limit(1),
            ]);

            setStats({
                totalWorkouts: workoutsRes.count || 0,
                upcomingBookings: bookingsRes.count || 0,
                recentProgress: progressRes.data?.[0] || null,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold text-[#E8E9ED] mb-2">Welcome Back{isAdmin ? ', Coach' : ''}! 👋</h1>
                <p className="text-[#9CA3AF]">{isAdmin ? 'Manage your clients and schedule' : 'Track your fitness journey and stay on target'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-[#E8E9ED]">{stats.totalWorkouts}</span>
                    </div>
                    <h3 className="text-[#9CA3AF] font-medium">Total Workouts</h3>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-[#E8E9ED]">{stats.upcomingBookings}</span>
                    </div>
                    <h3 className="text-[#9CA3AF] font-medium">Upcoming Sessions</h3>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-[#E8E9ED]">{stats.recentProgress?.weight_kg || '--'}</span>
                    </div>
                    <h3 className="text-[#9CA3AF] font-medium">Current Weight (kg)</h3>
                </div>
            </div>

            <div className="card">
                <h2 className="text-2xl font-bold text-[#E8E9ED] mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center p-4 bg-[#1A1F3A] rounded-lg hover:bg-[#FF6B35]/10 transition-colors border border-white/5">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center mr-4">
                            <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-[#E8E9ED] font-semibold">Log Workout</h3>
                            <p className="text-[#9CA3AF] text-sm">Record your training session</p>
                        </div>
                    </button>

                    <button className="flex items-center p-4 bg-[#1A1F3A] rounded-lg hover:bg-[#FF6B35]/10 transition-colors border border-white/5">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center mr-4">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-[#E8E9ED] font-semibold">Book Session</h3>
                            <p className="text-[#9CA3AF] text-sm">Schedule coaching time</p>
                        </div>
                    </button>

                    <button className="flex items-center p-4 bg-[#1A1F3A] rounded-lg hover:bg-[#FF6B35]/10 transition-colors border border-white/5">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center mr-4">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-[#E8E9ED] font-semibold">Track Progress</h3>
                            <p className="text-[#9CA3AF] text-sm">Log body measurements</p>
                        </div>
                    </button>

                    <button className="flex items-center p-4 bg-[#1A1F3A] rounded-lg hover:bg-[#FF6B35]/10 transition-colors border border-white/5">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center mr-4">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-[#E8E9ED] font-semibold">View Goals</h3>
                            <p className="text-[#9CA3AF] text-sm">Track your objectives</p>
                        </div>
                    </button>
                </div>
            </div>

            <div className="card">
                <h2 className="text-2xl font-bold text-[#E8E9ED] mb-4">Motivational Quote</h2>
                <blockquote className="text-lg text-[#9CA3AF] italic border-l-4 border-[#FF6B35] pl-6">
                    "The only bad workout is the one that didn't happen."
                </blockquote>
                <p className="text-[#9CA3AF] mt-2">- Keep pushing forward!</p>
            </div>
        </div>
    );
}