'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Broadcasts() {
    const [broadcasts, setBroadcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBroadcast, setSelectedBroadcast] = useState(null);

    useEffect(() => {
        fetchBroadcasts();
    }, []);

    const fetchBroadcasts = async () => {
        try {
            const { data, error } = await supabase
                .from('broadcasts')
                .select('*, profiles!broadcasts_coach_id_fkey(full_name)')
                .order('sent_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            setBroadcasts(data || []);
        } catch (error) {
            console.error('Error fetching broadcasts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="spinner"></div>
            </div>
        );
    }

    if (broadcasts.length === 0) {
        return (
            <div className="card text-center py-12 animate-fadeIn">
                <MessageSquare className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-[#E8E9ED] mb-2">No Announcements Yet</h3>
                <p className="text-[#9CA3AF]">Your coach hasn't sent any announcements yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-[#E8E9ED] mb-6">Coach Announcements 📢</h2>

            {broadcasts.map((broadcast) => (
                <div
                    key={broadcast.id}
                    className="card hover:border-[#FF6B35] cursor-pointer transition-all"
                    onClick={() => setSelectedBroadcast(broadcast)}
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#E8E9ED] mb-1">{broadcast.title}</h3>
                            <p className="text-[#9CA3AF] text-sm mb-2 line-clamp-2">{broadcast.message}</p>
                            <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                                <span>From: {broadcast.profiles?.full_name || 'Coach'}</span>
                                <span>•</span>
                                <span>{new Date(broadcast.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Broadcast Detail Modal */}
            {selectedBroadcast && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={() => setSelectedBroadcast(null)}>
                    <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="card animate-fadeIn">
                            <button
                                onClick={() => setSelectedBroadcast(null)}
                                className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#E8E9ED]">{selectedBroadcast.title}</h2>
                                    <p className="text-[#9CA3AF] text-sm">
                                        From {selectedBroadcast.profiles?.full_name || 'Coach'} • {new Date(selectedBroadcast.sent_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#0A0E27] rounded-lg p-6 mb-6">
                                <p className="text-[#E8E9ED] whitespace-pre-wrap leading-relaxed">{selectedBroadcast.message}</p>
                            </div>

                            <button onClick={() => setSelectedBroadcast(null)} className="w-full btn-primary">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}