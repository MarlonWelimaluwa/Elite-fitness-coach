'use client';

import { useState, useEffect } from 'react';
import { LogOut, Dumbbell, Users, Calendar, DollarSign, Bell, MessageSquare, Settings, TrendingUp, AlertTriangle, CheckCircle, Clock, Home, Send } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/lib/supabase';

import AdminPanel from './dashboard/AdminPanel';

export default function CoachDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('home');
    const [userName, setUserName] = useState('');
    const [stats, setStats] = useState({
        totalClients: 0,
        activeClients: 0,
        atRiskClients: [],
        weeklyBookings: [],
        monthlyRevenue: 0,
        pendingApprovals: 0,
        recentActivity: [],
    });
    const [loading, setLoading] = useState(true);
    const [showBroadcast, setShowBroadcast] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [broadcastMessage, setBroadcastMessage] = useState({ title: '', message: '' });
    const [allClients, setAllClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectAll, setSelectAll] = useState(true);

    useEffect(() => {
        fetchCoachStats();
        fetchUserName();
        fetchAllClients();
    }, [user]);

    const fetchUserName = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            setUserName(data?.full_name || '');
        } catch (error) {
            console.error('Error fetching user name:', error);
        }
    };

    const fetchAllClients = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .neq('role', 'coach')
                .order('full_name', { ascending: true });

            if (error) throw error;

            setAllClients(data || []);
            // Initially select all clients
            setSelectedClients(data?.map(c => c.id) || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchCoachStats = async () => {
        try {
            const [clientsRes, engagementRes, bookingsRes, weeklyBookingsRes] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact' }).neq('role', 'coach'),
                supabase.from('user_engagement').select('*'),
                supabase.from('bookings').select('*', { count: 'exact' }).eq('status', 'pending'),
                supabase
                    .from('bookings')
                    .select('session_date, status')
                    .gte('session_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                    .order('session_date', { ascending: true }),
            ]);

            // Calculate at-risk clients (no activity in 48+ hours)
            const now = new Date();
            const atRisk = engagementRes.data
                ?.filter((eng) => {
                    const lastLogin = new Date(eng.last_login);
                    const hoursSinceLogin = (now - lastLogin) / (1000 * 60 * 60);
                    return hoursSinceLogin >= 48;
                })
                .slice(0, 5) || [];

            // Get client details for at-risk users
            const atRiskWithDetails = await Promise.all(
                atRisk.map(async (eng) => {
                    const { data: profile } = await supabase.from('profiles').select('*').eq('id', eng.user_id).single();
                    return { ...eng, profile };
                })
            );

            // Calculate active clients (logged in within 7 days)
            const activeCount = engagementRes.data?.filter((eng) => {
                const lastLogin = new Date(eng.last_login);
                const daysSinceLogin = (now - lastLogin) / (1000 * 60 * 60 * 24);
                return daysSinceLogin <= 7;
            }).length || 0;

            // Weekly bookings chart data
            const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const weeklyData = weekDays.map((day, index) => {
                const dayBookings = weeklyBookingsRes.data?.filter((b) => new Date(b.session_date).getDay() === index) || [];
                return {
                    day,
                    confirmed: dayBookings.filter((b) => b.status === 'confirmed').length,
                    pending: dayBookings.filter((b) => b.status === 'pending').length,
                };
            });

            // Calculate monthly revenue (mock data - you can replace with real payment data)
            const confirmedBookings = weeklyBookingsRes.data?.filter((b) => b.status === 'confirmed').length || 0;
            const estimatedRevenue = confirmedBookings * 199; // Assuming $199 per session

            setStats({
                totalClients: clientsRes.count || 0,
                activeClients: activeCount,
                atRiskClients: atRiskWithDetails,
                weeklyBookings: weeklyData,
                monthlyRevenue: estimatedRevenue,
                pendingApprovals: bookingsRes.count || 0,
                recentActivity: [],
            });
        } catch (error) {
            console.error('Error fetching coach stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendBroadcast = async () => {
        if (!broadcastMessage.title || !broadcastMessage.message) {
            alert('Please fill in both title and message');
            return;
        }

        if (selectedClients.length === 0) {
            alert('Please select at least one client');
            return;
        }

        try {
            const { error } = await supabase.from('broadcasts').insert([
                {
                    coach_id: user.id,
                    title: broadcastMessage.title,
                    message: broadcastMessage.message,
                },
            ]);

            if (error) throw error;

            // Show success message
            setShowBroadcast(false);
            setShowSuccess(true);
            setBroadcastMessage({ title: '', message: '' });
            setSelectAll(true);
            setSelectedClients(allClients.map(c => c.id));

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error sending broadcast:', error);
            alert('Failed to send broadcast. Please try again.');
        }
    };

    const handleToggleClient = (clientId) => {
        if (selectedClients.includes(clientId)) {
            setSelectedClients(selectedClients.filter(id => id !== clientId));
            setSelectAll(false);
        } else {
            const newSelected = [...selectedClients, clientId];
            setSelectedClients(newSelected);
            if (newSelected.length === allClients.length) {
                setSelectAll(true);
            }
        }
    };

    const handleToggleAll = () => {
        if (selectAll) {
            setSelectedClients([]);
            setSelectAll(false);
        } else {
            setSelectedClients(allClients.map(c => c.id));
            setSelectAll(true);
        }
    };

    const clientStatusData = [
        { name: 'Active', value: stats.activeClients, color: '#00D9FF' },
        { name: 'At Risk', value: stats.atRiskClients.length, color: '#FF6B35' },
        { name: 'Inactive', value: stats.totalClients - stats.activeClients, color: '#9CA3AF' },
    ];

    const tabs = [
        { id: 'home', name: 'Overview', icon: Home },
        { id: 'clients', name: 'Clients', icon: Users },
        { id: 'bookings', name: 'Bookings', icon: Calendar },
        { id: 'schedule', name: 'Schedule', icon: Clock },
        { id: 'settings', name: 'Settings', icon: Settings },
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
                            <button className="relative text-[#9CA3AF] hover:text-[#FF6B35] transition-colors">
                                <Bell size={20} />
                                {stats.pendingApprovals > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B35] rounded-full text-white text-xs flex items-center justify-center">
                    {stats.pendingApprovals}
                  </span>
                                )}
                            </button>
                            <span className="text-[#9CA3AF] text-sm hidden sm:block">Coach</span>
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
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-[#E8E9ED] mb-2">Welcome{userName ? `, ${userName}` : ''}! 🎯</h1>
                                        <p className="text-[#9CA3AF]">Manage your clients and grow your business</p>
                                    </div>
                                    <button onClick={() => setShowBroadcast(true)} className="btn-primary flex items-center">
                                        <MessageSquare size={20} className="mr-2" />
                                        Broadcast
                                    </button>
                                </div>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="card">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center">
                                                <Users className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-[#E8E9ED] mb-1">{stats.totalClients}</div>
                                        <div className="text-sm text-[#9CA3AF]">Total Clients</div>
                                    </div>

                                    <div className="card">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#00D9FF] to-[#004E89] rounded-lg flex items-center justify-center">
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-[#E8E9ED] mb-1">{stats.activeClients}</div>
                                        <div className="text-sm text-[#9CA3AF]">Active Clients</div>
                                    </div>

                                    <div className="card">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center">
                                                <DollarSign className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-[#E8E9ED] mb-1">${stats.monthlyRevenue.toLocaleString()}</div>
                                        <div className="text-sm text-[#9CA3AF]">This Month</div>
                                    </div>

                                    <div className="card">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center">
                                                <Bell className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-[#E8E9ED] mb-1">{stats.pendingApprovals}</div>
                                        <div className="text-sm text-[#9CA3AF]">Pending Approvals</div>
                                    </div>
                                </div>

                                {/* At-Risk Clients Alert */}
                                {stats.atRiskClients.length > 0 && (
                                    <div className="card bg-red-500/10 border-red-500/30">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <AlertTriangle className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-[#E8E9ED] mb-2">⚠️ At-Risk Clients</h3>
                                                <p className="text-[#9CA3AF] mb-4">These clients haven't logged in for 48+ hours. Reach out to keep them engaged!</p>
                                                <div className="space-y-2">
                                                    {stats.atRiskClients.map((client) => (
                                                        <div key={client.user_id} className="flex items-center justify-between bg-[#1A1F3A] rounded-lg p-3">
                                                            <div>
                                                                <div className="text-[#E8E9ED] font-medium">{client.profile?.full_name || 'Unknown'}</div>
                                                                <div className="text-sm text-[#9CA3AF]">
                                                                    Last active: {Math.floor((new Date() - new Date(client.last_login)) / (1000 * 60 * 60))} hours ago
                                                                </div>
                                                            </div>
                                                            <button className="text-[#FF6B35] hover:text-[#E85A2A] text-sm font-medium">
                                                                Message
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Charts Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Weekly Bookings Chart */}
                                    <div className="card">
                                        <h2 className="text-xl font-bold text-[#E8E9ED] mb-6">Weekly Bookings</h2>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={stats.weeklyBookings}>
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
                                                <Bar dataKey="confirmed" stackId="a" fill="#00D9FF" radius={[8, 8, 0, 0]} />
                                                <Bar dataKey="pending" stackId="a" fill="#FF6B35" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                        <div className="flex items-center justify-center gap-6 mt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-[#00D9FF] rounded-full"></div>
                                                <span className="text-sm text-[#9CA3AF]">Confirmed</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-[#FF6B35] rounded-full"></div>
                                                <span className="text-sm text-[#9CA3AF]">Pending</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Client Status Pie Chart */}
                                    <div className="card">
                                        <h2 className="text-xl font-bold text-[#E8E9ED] mb-6">Client Status</h2>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={clientStatusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {clientStatusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1A1F3A',
                                                        border: '1px solid #FF6B35',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="card">
                                    <h2 className="text-xl font-bold text-[#E8E9ED] mb-6">Quick Actions</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setActiveTab('clients')}
                                            className="flex items-center p-4 bg-[#1A1F3A] rounded-lg hover:bg-[#FF6B35]/10 transition-colors border border-white/5"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center mr-4">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-[#E8E9ED] font-semibold">Manage Clients</h3>
                                                <p className="text-[#9CA3AF] text-sm">View all clients</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('bookings')}
                                            className="flex items-center p-4 bg-[#1A1F3A] rounded-lg hover:bg-[#FF6B35]/10 transition-colors border border-white/5"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#004E89] rounded-lg flex items-center justify-center mr-4">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-[#E8E9ED] font-semibold">Approve Bookings</h3>
                                                <p className="text-[#9CA3AF] text-sm">{stats.pendingApprovals} pending</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('schedule')}
                                            className="flex items-center p-4 bg-[#1A1F3A] rounded-lg hover:bg-[#FF6B35]/10 transition-colors border border-white/5"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center mr-4">
                                                <Clock className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-[#E8E9ED] font-semibold">Set Schedule</h3>
                                                <p className="text-[#9CA3AF] text-sm">Manage office hours</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'clients' && <AdminPanel defaultTab="clients" />}
                        {activeTab === 'bookings' && <AdminPanel defaultTab="bookings" />}
                        {activeTab === 'schedule' && <AdminPanel defaultTab="slots" />}
                        {activeTab === 'settings' && <div className="text-[#E8E9ED]">Settings (Office hours, preferences, etc.)</div>}
                    </main>
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 animate-fadeIn">
                    <div className="card bg-green-500/10 border-green-500/30 flex items-center gap-3 min-w-[300px]">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-green-500 font-bold">Broadcast Sent!</h3>
                            <p className="text-[#9CA3AF] text-sm">All clients have been notified</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Broadcast Modal */}
            {showBroadcast && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
                    <div className="relative w-full max-w-2xl">
                        <div className="card animate-fadeIn max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-[#E8E9ED] mb-6">Send Message</h2>

                            {/* Client Selection */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-[#E8E9ED]">Select Recipients</label>
                                    <button
                                        onClick={handleToggleAll}
                                        className="text-[#FF6B35] hover:text-[#E85A2A] text-sm font-medium"
                                    >
                                        {selectAll ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>

                                <div className="bg-[#0A0E27] rounded-lg p-4 max-h-48 overflow-y-auto">
                                    <div className="space-y-2">
                                        {allClients.map((client) => (
                                            <label
                                                key={client.id}
                                                className="flex items-center space-x-3 p-2 rounded hover:bg-[#1A1F3A] cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.includes(client.id)}
                                                    onChange={() => handleToggleClient(client.id)}
                                                    className="w-4 h-4 text-[#FF6B35] bg-[#1A1F3A] border-[#9CA3AF] rounded focus:ring-[#FF6B35] focus:ring-2"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-[#E8E9ED] text-sm font-medium">{client.full_name || 'No Name'}</div>
                                                    <div className="text-[#9CA3AF] text-xs">{client.email}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-[#9CA3AF] mt-2">
                                    {selectedClients.length} client{selectedClients.length !== 1 ? 's' : ''} selected
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={broadcastMessage.title}
                                        onChange={(e) => setBroadcastMessage({ ...broadcastMessage, title: e.target.value })}
                                        className="input"
                                        placeholder="Important Update"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Message</label>
                                    <textarea
                                        value={broadcastMessage.message}
                                        onChange={(e) => setBroadcastMessage({ ...broadcastMessage, message: e.target.value })}
                                        className="input resize-none"
                                        rows="5"
                                        placeholder="Your message to clients..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleSendBroadcast} className="flex-1 btn-primary">
                                        <Send size={18} className="mr-2 inline" />
                                        Send to {selectedClients.length} Client{selectedClients.length !== 1 ? 's' : ''}
                                    </button>
                                    <button onClick={() => setShowBroadcast(false)} className="btn-secondary">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}