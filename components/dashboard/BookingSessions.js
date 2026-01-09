'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function BookingSessions({ user }) {
    const [bookings, setBookings] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookForm, setShowBookForm] = useState(false);
    const [formData, setFormData] = useState({
        session_type: '1-on-1 Training',
        session_date: '',
        session_time: '',
        notes: '',
    });

    useEffect(() => {
        fetchBookings();
        fetchAvailableSlots();
    }, [user]);

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('user_id', user.id)
                .order('session_date', { ascending: true });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const { data, error } = await supabase
                .from('available_slots')
                .select('*')
                .gte('slot_date', new Date().toISOString().split('T')[0])
                .eq('is_booked', false)
                .order('slot_date', { ascending: true })
                .order('slot_time', { ascending: true });

            if (error) throw error;
            setAvailableSlots(data || []);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert([
                    {
                        user_id: user.id,
                        session_type: formData.session_type,
                        session_date: formData.session_date,
                        session_time: formData.session_time,
                        notes: formData.notes,
                        status: 'pending',
                    },
                ])
                .select()
                .single();

            if (error) throw error;

            const slot = availableSlots.find(
                (s) => s.slot_date === formData.session_date && s.slot_time === formData.session_time
            );

            if (slot) {
                await supabase
                    .from('available_slots')
                    .update({ is_booked: true })
                    .eq('id', slot.id);
            }

            setShowBookForm(false);
            setFormData({
                session_type: '1-on-1 Training',
                session_date: '',
                session_time: '',
                notes: '',
            });
            fetchBookings();
            fetchAvailableSlots();
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to book session. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId, sessionDate, sessionTime) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('id', bookingId);

            if (error) throw error;

            const { data: slotData } = await supabase
                .from('available_slots')
                .select('id')
                .eq('slot_date', sessionDate)
                .eq('slot_time', sessionTime)
                .single();

            if (slotData) {
                await supabase
                    .from('available_slots')
                    .update({ is_booked: false })
                    .eq('id', slotData.id);
            }

            fetchBookings();
            fetchAvailableSlots();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking. Please try again.');
        }
    };

    const sessionTypes = ['1-on-1 Training', 'Nutrition Consultation', 'Progress Review', 'Goal Setting'];

    const uniqueDates = [...new Set(availableSlots.map((slot) => slot.slot_date))];

    const getTimesForDate = (date) => {
        return availableSlots.filter((slot) => slot.slot_date === date).map((slot) => slot.slot_time);
    };

    if (loading && bookings.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#E8E9ED]">Book a Session</h1>
                <button onClick={() => setShowBookForm(true)} className="btn-primary flex items-center">
                    <Plus size={20} className="mr-2" />
                    New Booking
                </button>
            </div>

            {showBookForm && (
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#E8E9ED]">Book New Session</h2>
                        <button onClick={() => setShowBookForm(false)} className="text-[#9CA3AF] hover:text-[#E8E9ED]">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Session Type</label>
                            <select value={formData.session_type} onChange={(e) => setFormData({ ...formData, session_type: e.target.value })} className="input">
                                {sessionTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Date</label>
                            <select value={formData.session_date} onChange={(e) => setFormData({ ...formData, session_date: e.target.value, session_time: '' })} required className="input">
                                <option value="">Select a date</option>
                                {uniqueDates.map((date) => (
                                    <option key={date} value={date}>
                                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {formData.session_date && (
                            <div>
                                <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Time</label>
                                <select value={formData.session_time} onChange={(e) => setFormData({ ...formData, session_time: e.target.value })} required className="input">
                                    <option value="">Select a time</option>
                                    {getTimesForDate(formData.session_date).map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Notes (Optional)</label>
                            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input resize-none" rows="3" placeholder="Any specific topics or questions..."></textarea>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={loading || !formData.session_date || !formData.session_time} className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? <div className="spinner"></div> : 'Book Session'}
                            </button>
                            <button type="button" onClick={() => setShowBookForm(false)} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                <div className="card">
                    <h2 className="text-xl font-bold text-[#E8E9ED] mb-4">My Bookings</h2>
                    {bookings.length === 0 ? (
                        <p className="text-[#9CA3AF] text-center py-8">No bookings yet. Schedule your first session!</p>
                    ) : (
                        <div className="space-y-3">
                            {bookings.map((booking) => (
                                <div key={booking.id} className={`bg-[#1A1F3A] rounded-lg p-4 border ${booking.status === 'confirmed' ? 'border-green-500/30' : booking.status === 'cancelled' ? 'border-red-500/30' : 'border-yellow-500/30'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-[#E8E9ED] font-semibold">{booking.session_type}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                          {booking.status}
                        </span>
                                            </div>
                                            <div className="flex items-center text-[#9CA3AF] text-sm mb-1">
                                                <Calendar size={16} className="mr-2" />
                                                {new Date(booking.session_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center text-[#9CA3AF] text-sm">
                                                <Clock size={16} className="mr-2" />
                                                {booking.session_time}
                                            </div>
                                            {booking.notes && <p className="text-[#9CA3AF] text-sm mt-2 italic">{booking.notes}</p>}
                                        </div>
                                        {booking.status === 'pending' && (
                                            <button onClick={() => handleCancel(booking.id, booking.session_date, booking.session_time)} className="text-red-500 hover:text-red-400 text-sm font-medium">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold text-[#E8E9ED] mb-4">Available Slots</h2>
                    {availableSlots.length === 0 ? (
                        <p className="text-[#9CA3AF] text-center py-8">No available slots at the moment. Check back soon!</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {availableSlots.slice(0, 6).map((slot) => (
                                <div key={slot.id} className="bg-[#1A1F3A] rounded-lg p-3 border border-white/5">
                                    <div className="text-[#E8E9ED] font-medium text-sm mb-1">{new Date(slot.slot_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                    <div className="text-[#9CA3AF] text-sm">{slot.slot_time}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}