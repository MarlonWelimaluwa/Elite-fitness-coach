'use client';

import { useState } from 'react';
import { LogOut, Dumbbell, Calendar, TrendingUp, Settings, Home } from 'lucide-react';
import DashboardHome from './dashboard/DashboardHome';
import WorkoutTracker from './dashboard/WorkoutTracker';
import BookingSessions from './dashboard/BookingSessions';
import ProgressTracker from './dashboard/ProgressTracker';
import AdminPanel from './dashboard/AdminPanel';

export default function Dashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('home');
    const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    const tabs = [
        { id: 'home', name: 'Dashboard', icon: Home },
        { id: 'workouts', name: 'Workouts', icon: Dumbbell },
        { id: 'booking', name: 'Book Session', icon: Calendar },
        { id: 'progress', name: 'Progress', icon: TrendingUp },
    ];

    if (isAdmin) {
        tabs.push({ id: 'admin', name: 'Admin', icon: Settings });
    }

    return (
        <div className="min-h-screen bg-[#0A0E27]">
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
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="card sticky top-8">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] text-white' : 'text-[#9CA3AF] hover:bg-[#1A1F3A]'}`}>
                                            <Icon size={20} />
                                            <span className="font-medium">{tab.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    <main className="flex-1">
                        {activeTab === 'home' && <DashboardHome user={user} isAdmin={isAdmin} />}
                        {activeTab === 'workouts' && <WorkoutTracker user={user} />}
                        {activeTab === 'booking' && <BookingSessions user={user} />}
                        {activeTab === 'progress' && <ProgressTracker user={user} />}
                        {activeTab === 'admin' && isAdmin && <AdminPanel />}
                    </main>
                </div>
            </div>
        </div>
    );
}