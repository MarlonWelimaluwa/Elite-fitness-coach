'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/lib/supabase';

export default function ProgressTracker({ user }) {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        record_date: new Date().toISOString().split('T')[0],
        weight_kg: '',
        body_fat_percentage: '',
        muscle_mass_kg: '',
        notes: '',
    });

    useEffect(() => {
        fetchProgress();
    }, [user]);

    const fetchProgress = async () => {
        try {
            const { data, error } = await supabase
                .from('progress')
                .select('*')
                .eq('user_id', user.id)
                .order('record_date', { ascending: true });

            if (error) throw error;
            setProgressData(data || []);
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('progress').insert([
                {
                    user_id: user.id,
                    record_date: formData.record_date,
                    weight_kg: parseFloat(formData.weight_kg) || null,
                    body_fat_percentage: parseFloat(formData.body_fat_percentage) || null,
                    muscle_mass_kg: parseFloat(formData.muscle_mass_kg) || null,
                    notes: formData.notes,
                },
            ]);

            if (error) throw error;

            setShowAddForm(false);
            setFormData({
                record_date: new Date().toISOString().split('T')[0],
                weight_kg: '',
                body_fat_percentage: '',
                muscle_mass_kg: '',
                notes: '',
            });
            fetchProgress();
        } catch (error) {
            console.error('Error saving progress:', error);
            alert('Failed to save progress. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (progressId) => {
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
            const { error } = await supabase.from('progress').delete().eq('id', progressId);
            if (error) throw error;
            fetchProgress();
        } catch (error) {
            console.error('Error deleting progress:', error);
            alert('Failed to delete progress. Please try again.');
        }
    };

    const getChange = (data, key) => {
        if (data.length < 2) return null;
        const latest = data[data.length - 1][key];
        const previous = data[data.length - 2][key];
        if (!latest || !previous) return null;
        return latest - previous;
    };

    const chartData = progressData.map((item) => ({
        date: new Date(item.record_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: item.weight_kg,
        bodyFat: item.body_fat_percentage,
        muscle: item.muscle_mass_kg,
    }));

    const latestRecord = progressData[progressData.length - 1];
    const weightChange = getChange(progressData, 'weight_kg');
    const bodyFatChange = getChange(progressData, 'body_fat_percentage');
    const muscleChange = getChange(progressData, 'muscle_mass_kg');

    if (loading && progressData.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#E8E9ED]">Progress Tracker</h1>
                <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center whitespace-nowrap">
                    <Plus size={20} className="mr-2" />
                    <span>Log Progress</span>
                </button>
            </div>

            {showAddForm && (
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#E8E9ED]">Log New Progress</h2>
                        <button onClick={() => setShowAddForm(false)} className="text-[#9CA3AF] hover:text-[#E8E9ED]">
                            <Plus size={24} className="rotate-45" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Date</label>
                            <input type="date" value={formData.record_date} onChange={(e) => setFormData({ ...formData, record_date: e.target.value })} required className="input" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Weight (kg)</label>
                                <input type="number" step="0.1" value={formData.weight_kg} onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })} className="input" placeholder="70.5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Body Fat (%)</label>
                                <input type="number" step="0.1" value={formData.body_fat_percentage} onChange={(e) => setFormData({ ...formData, body_fat_percentage: e.target.value })} className="input" placeholder="15.5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Muscle Mass (kg)</label>
                                <input type="number" step="0.1" value={formData.muscle_mass_kg} onChange={(e) => setFormData({ ...formData, muscle_mass_kg: e.target.value })} className="input" placeholder="60.0" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Notes (Optional)</label>
                            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input resize-none" rows="3" placeholder="How are you feeling?"></textarea>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={loading} className="flex-1 btn-primary">
                                {loading ? <div className="spinner"></div> : 'Save Progress'}
                            </button>
                            <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {progressData.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-[#9CA3AF] mb-4">No progress data yet. Start tracking your transformation!</p>
                    <button onClick={() => setShowAddForm(true)} className="btn-primary">
                        Log Your First Entry
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[#9CA3AF] text-sm font-medium">Current Weight</h3>
                                {weightChange !== null && (
                                    <span className={`flex items-center text-sm ${weightChange > 0 ? 'text-red-500' : weightChange < 0 ? 'text-green-500' : 'text-[#9CA3AF]'}`}>
                    {weightChange > 0 ? <TrendingUp size={16} /> : weightChange < 0 ? <TrendingDown size={16} /> : <Minus size={16} />}
                                        <span className="ml-1">{Math.abs(weightChange).toFixed(1)} kg</span>
                  </span>
                                )}
                            </div>
                            <div className="text-3xl font-bold text-[#E8E9ED]">{latestRecord?.weight_kg?.toFixed(1) || '--'} kg</div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[#9CA3AF] text-sm font-medium">Body Fat</h3>
                                {bodyFatChange !== null && (
                                    <span className={`flex items-center text-sm ${bodyFatChange > 0 ? 'text-red-500' : bodyFatChange < 0 ? 'text-green-500' : 'text-[#9CA3AF]'}`}>
                    {bodyFatChange > 0 ? <TrendingUp size={16} /> : bodyFatChange < 0 ? <TrendingDown size={16} /> : <Minus size={16} />}
                                        <span className="ml-1">{Math.abs(bodyFatChange).toFixed(1)}%</span>
                  </span>
                                )}
                            </div>
                            <div className="text-3xl font-bold text-[#E8E9ED]">{latestRecord?.body_fat_percentage?.toFixed(1) || '--'}%</div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[#9CA3AF] text-sm font-medium">Muscle Mass</h3>
                                {muscleChange !== null && (
                                    <span className={`flex items-center text-sm ${muscleChange > 0 ? 'text-green-500' : muscleChange < 0 ? 'text-red-500' : 'text-[#9CA3AF]'}`}>
                    {muscleChange > 0 ? <TrendingUp size={16} /> : muscleChange < 0 ? <TrendingDown size={16} /> : <Minus size={16} />}
                                        <span className="ml-1">{Math.abs(muscleChange).toFixed(1)} kg</span>
                  </span>
                                )}
                            </div>
                            <div className="text-3xl font-bold text-[#E8E9ED]">{latestRecord?.muscle_mass_kg?.toFixed(1) || '--'} kg</div>
                        </div>
                    </div>

                    {chartData.length > 1 && (
                        <div className="card">
                            <h2 className="text-2xl font-bold text-[#E8E9ED] mb-6">Progress Charts</h2>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#E8E9ED] mb-4">Weight Trend</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1A1F3A" />
                                            <XAxis dataKey="date" stroke="#9CA3AF" />
                                            <YAxis stroke="#9CA3AF" />
                                            <Tooltip contentStyle={{ backgroundColor: '#1A1F3A', border: '1px solid #FF6B35', borderRadius: '8px' }} />
                                            <Line type="monotone" dataKey="weight" stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35', r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-[#E8E9ED] mb-4">Body Composition</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1A1F3A" />
                                            <XAxis dataKey="date" stroke="#9CA3AF" />
                                            <YAxis stroke="#9CA3AF" />
                                            <Tooltip contentStyle={{ backgroundColor: '#1A1F3A', border: '1px solid #FF6B35', borderRadius: '8px' }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="bodyFat" stroke="#E85A2A" strokeWidth={2} dot={{ fill: '#E85A2A', r: 4 }} name="Body Fat %" />
                                            <Line type="monotone" dataKey="muscle" stroke="#00D9FF" strokeWidth={2} dot={{ fill: '#00D9FF', r: 4 }} name="Muscle Mass (kg)" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <h2 className="text-2xl font-bold text-[#E8E9ED] mb-4">Progress History</h2>
                        <div className="space-y-3">
                            {progressData.slice().reverse().map((record) => (
                                <div key={record.id} className="bg-[#1A1F3A] rounded-lg p-4 border border-white/5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <span className="text-[#E8E9ED] font-semibold">{new Date(record.record_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                {record.weight_kg && (
                                                    <div>
                                                        <span className="text-[#9CA3AF]">Weight: </span>
                                                        <span className="text-[#E8E9ED] font-medium">{record.weight_kg} kg</span>
                                                    </div>
                                                )}
                                                {record.body_fat_percentage && (
                                                    <div>
                                                        <span className="text-[#9CA3AF]">Body Fat: </span>
                                                        <span className="text-[#E8E9ED] font-medium">{record.body_fat_percentage}%</span>
                                                    </div>
                                                )}
                                                {record.muscle_mass_kg && (
                                                    <div>
                                                        <span className="text-[#9CA3AF]">Muscle: </span>
                                                        <span className="text-[#E8E9ED] font-medium">{record.muscle_mass_kg} kg</span>
                                                    </div>
                                                )}
                                            </div>
                                            {record.notes && <p className="text-[#9CA3AF] text-sm mt-2 italic">{record.notes}</p>}
                                        </div>
                                        <button onClick={() => handleDelete(record.id)} className="text-[#9CA3AF] hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}