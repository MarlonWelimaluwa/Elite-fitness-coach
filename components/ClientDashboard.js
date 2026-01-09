'use client';

import { useState, useEffect } from 'react';
import { LogOut, Dumbbell, Calendar, TrendingUp, Camera, Trophy, MessageCircle, Flame, Target, Clock, Home } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '@/lib/supabase';

import WorkoutTracker from './dashboard/WorkoutTracker';
import BookingSessions from './dashboard/BookingSessions';
import ProgressTracker from './dashboard/ProgressTracker';

export default function ClientDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('home');
    const [stats, setStats] = useState({
        currentStreak: 0,
        longestStreak: 0,
        totalWorkouts: 0,
        nextSession: null,
        recentProgress: null,
        weeklyActivity: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClientStats();
        updateEngagement();
    }, [user]);

    const updateEngagement = async () => {
        try {
            await supabase
                .from('user_engagement')
                .upsert({
                    user_id: user.id,
                    last_login: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
        } catch (error) {
            console.error('Error updating engagement:', error);
        }
    };

    const fetchClientStats = async () => {
        try {
            const [engagementRes, workoutsRes, nextSessionRes, progressRes, weeklyWorkoutsRes] = await Promise.all([
                supabase.from('user_engagement').select('*').eq('user_id', user.id).single(),
                supabase.from('workouts').select('id', { count: 'exact' }).eq('user_id', user.id),
                supabase
                    .from('bookings')
                    .select('*')
                    .eq('user_id', user.id)
                    .gte('session_date', new Date().toISOString().split('T')[0])
                    .eq('status', 'confirmed')
                    .order('session_date', { ascending: true })
                    .order('session_time', { ascending: true })
                    .limit(1)
                    .single(),
                supabase.from('progress').select('*').eq('user_id', user.id).order('record_date', { ascending: false }).limit(5),
                supabase
                    .from('workouts')
                    .select('workout_date')
                    .eq('user_id', user.id)
                    .gte('workout_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
            ]);

            const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date().getDay();
            const weeklyActivity = weekDays.map((day, index) => {
                const dayWorkouts = weeklyWorkoutsRes.data?.filter(w => new Date(w.workout_date).getDay() === index).length || 0;
                return { day, workouts: dayWorkouts, isToday: index === today };
            });

            setStats({
                currentStreak: engagementRes.data?.current_streak || 0,
                longestStreak: engagementRes.data?.longest_streak || 0,
                totalWorkouts: workoutsRes.count || 0,
                nextSession: nextSessionRes.data || null,
                recentProgress: progressRes.data || [],
                weeklyActivity,
            });
        } catch (error) {
            console.error('Error fetching client stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTimeUntilSession = () => {
        if (!stats.nextSession) return null;
        const sessionDateTime = new Date(`${stats.nextSession.session_date}T${stats.nextSession.session_time}`);
        const now = new Date();
        const diff = sessionDateTime - now;

        if (diff < 0) return 'Session has passed';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const progressChartData = stats.recentProgress.slice().reverse().map(p => ({
        date: new Date(p.record_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: p.weight_kg,
        bodyFat: p.body_fat_percentage,
    }));

    const tabs = [
        { id: 'home', name: 'Home', icon: Home },
        { id: 'workouts', name: 'Workouts', icon: Dumbbell },
        { id: 'booking', name: 'Book Session', icon: Calendar },
        { id: 'progress', name: 'Progress', icon: TrendingUp },
        { id: 'photos', name: 'Photos', icon: Camera },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0A0E27]">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0E27]">
            {/* Navbar */}
            <nav className="glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center">
                                <Dumbbell className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">Elite Fitness Coach</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-[#9CA3AF] text-sm hidden sm:block">{user?.email}</span>
                            <button onClick={onLogout} className="flex items-center space-x-2 text-[#9CA3AF] hover:text-[#FF6B35] transition-colors">
                                <LogOut size={20} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="card sticky top-8">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                                                activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] text-white'
                                                    : 'text-[#9CA3AF] hover:bg-[#1A1F3A]'
                                            }`}
                                        >
                                            <Icon size={20} />
                                            <span className="font-medium">{tab.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {activeTab === 'home' && (
                            <div className="space-y-6 animate-fadeIn">
                                {/* Welcome Header */}
                                <div>
                                    <h1 className="text-3xl font-bold text-[#E8E9ED] mb-2">Welcome Back! 💪</h1>
                                    <p className="text-[#9CA3AF]">Keep crushing your goals!</p>
                                </div>

                                {/* Streak & Next Session Cards */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Streak Card */}
                                    <div className="card relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF6B35]/20 to-transparent rounded-full blur-3xl"></div>
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-full flex items-center justify-center">
                                                        <Flame className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-[#9CA3AF]">Current Streak</div>
                                                        <div className="text-3xl font-bold text-[#E8E9ED]">{stats.currentStreak} Days</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <span className="text-sm text-[#9CA3AF]">Longest Streak</span>
                                                <span className="text-sm font-semibold text-[#FF6B35]">{stats.longestStreak} Days 🏆</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next Session Countdown */}
                                    <div className="card relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00D9FF]/20 to-transparent rounded-full blur-3xl"></div>
                                        <div className="relative">
                                            {stats.nextSession ? (
                                                <>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-[#00D9FF] to-[#004E89] rounded-full flex items-center justify-center">
                                                            <Clock className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-[#9CA3AF]">Next Session In</div>
                                                            <div className="text-3xl font-bold text-[#E8E9ED]">{getTimeUntilSession()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 border-t border-white/10">
                                                        <div className="text-sm text-[#9CA3AF] mb-1">{stats.nextSession.session_type}</div>
                                                        <div className="text-sm font-semibold text-[#00D9FF]">
                                                            {new Date(stats.nextSession.session_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {stats.nextSession.session_time}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-[#9CA3AF] to-[#6B7280] rounded-full flex items-center justify-center">
                                                            <Calendar className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-[#9CA3AF]">No Upcoming Session</div>
                                                            <div className="text-lg font-bold text-[#E8E9ED]">Book Your Next Session</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setActiveTab('booking')}
                                                        className="w-full btn-primary text-sm py-2"
                                                    >
                                                        Book Now
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Weekly Activity Bar Chart */}
                                <div className="card">
                                    <h2 className="text-xl font-bold text-[#E8E9ED] mb-6">This Week's Activity</h2>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={stats.weeklyActivity}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1A1F3A" />
                                            <XAxis dataKey="day" stroke="#9CA3AF" />
                                            <YAxis stroke="#9CA3AF" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1A1F3A',
                                                    border: '1px solid #FF6B35',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                            <Bar
                                                dataKey="workouts"
                                                fill="#FF6B35"
                                                radius={[8, 8, 0, 0]}
                                                shape={(props) => {
                                                    const { fill, x, y, width, height, payload } = props;
                                                    return (
                                                        <rect
                                                            x={x}
                                                            y={y}
                                                            width={width}
                                                            height={height}
                                                            fill={payload.isToday ? '#00D9FF' : fill}
                                                            rx={8}
                                                            ry={8}
                                                        />
                                                    );
                                                }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Progress Overview */}
                                {progressChartData.length > 0 && (
                                    <div className="card">
                                        <h2 className="text-xl font-bold text-[#E8E9ED] mb-6">Progress Overview</h2>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={progressChartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1A1F3A" />
                                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                                <YAxis stroke="#9CA3AF" />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1A1F3A',
                                                        border: '1px solid #FF6B35',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                                <Line type="monotone" dataKey="weight" stroke="#FF6B35" strokeWidth={3} dot={{ fill: '#FF6B35', r: 5 }} name="Weight (kg)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="card text-center">
                                        <Trophy className="w-10 h-10 text-[#FF6B35] mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-[#E8E9ED] mb-1">{stats.totalWorkouts}</div>
                                        <div className="text-[#9CA3AF]">Total Workouts</div>
                                    </div>
                                    <div className="card text-center">
                                        <Target className="w-10 h-10 text-[#00D9FF] mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-[#E8E9ED] mb-1">{stats.recentProgress[0]?.weight_kg?.toFixed(1) || '--'}</div>
                                        <div className="text-[#9CA3AF]">Current Weight (kg)</div>
                                    </div>
                                    <div className="card text-center">
                                        <Flame className="w-10 h-10 text-[#E85A2A] mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-[#E8E9ED] mb-1">{stats.currentStreak}</div>
                                        <div className="text-[#9CA3AF]">Day Streak</div>
                                    </div>
                                </div>

                                {/* Motivational Section */}
                                <div className="card bg-gradient-to-br from-[#FF6B35]/10 to-[#E85A2A]/5 border-[#FF6B35]/30">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-full flex items-center justify-center flex-shrink-0">
                                            <MessageCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#E8E9ED] mb-2">Today's Motivation</h3>
                                            <p className="text-[#9CA3AF] leading-relaxed italic">
                                                "Success is the sum of small efforts repeated day in and day out. Keep showing up!"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'workouts' && <WorkoutTracker user={user} />}
                        {activeTab === 'booking' && <BookingSessions user={user} />}
                        {activeTab === 'progress' && <ProgressTracker user={user} />}
                        {activeTab === 'photos' && <div className="text-[#E8E9ED]">Progress Photos (We'll build this next)</div>}
                    </main>
                </div>
            </div>
        </div>
    );
}