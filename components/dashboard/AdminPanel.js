'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('slots');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddSlotForm, setShowAddSlotForm] = useState(false);
    const [slotFormData, setSlotFormData] = useState({
        slot_date: '',
        slot_time: '',
    });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [slotsRes, bookingsRes, profilesRes] = await Promise.all([
                supabase.from('available_slots').select('*').order('slot_date', { ascending: true }).order('slot_time', { ascending: true }),
                supabase.from('bookings').select('*, profiles(full_name, email)').order('session_date', { ascending: false }),
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
            ]);

            setAvailableSlots(slotsRes.data || []);
            setAllBookings(bookingsRes.data || []);
            setClients(profilesRes.data || []);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('available_slots').insert([
                {
                    slot_date: slotFormData.slot_date,
                    slot_time: slotFormData.slot_time,
                    is_booked: false,
                },
            ]);

            if (error) throw error;

            setShowAddSlotForm(false);
            setSlotFormData({ slot_date: '', slot_time: '' });
            fetchAdminData();
        } catch (error) {
            console.error('Error adding slot:', error);
            alert('Failed to add slot. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!confirm('Are you sure you want to delete this slot?')) return;

        try {
            const { error } = await supabase.from('available_slots').delete().eq('id', slotId);
            if (error) throw error;
            fetchAdminData();
        } catch (error) {
            console.error('Error deleting slot:', error);
            alert('Failed to delete slot. Please try again.');
        }
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
            if (error) throw error;
            fetchAdminData();
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Failed to update booking. Please try again.');
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
        <div className="space-y-6 animate-fadeIn">
            <h1 className="text-3xl font-bold text-[#E8E9ED]">Admin Panel</h1>

            <div className="flex gap-4 border-b border-white/10">
                <button onClick={() => setActiveTab('slots')} className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'slots' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35]' : 'text-[#9CA3AF] hover:text-[#E8E9ED]'}`}>
                    Available Slots
                </button>
                <button onClick={() => setActiveTab('bookings')} className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'bookings' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35]' : 'text-[#9CA3AF] hover:text-[#E8E9ED]'}`}>
                    All Bookings
                </button>
                <button onClick={() => setActiveTab('clients')} className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'clients' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35]' : 'text-[#9CA3AF] hover:text-[#E8E9ED]'}`}>
                    Clients
                </button>
            </div>

            {activeTab === 'slots' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#E8E9ED]">Manage Available Slots</h2>
                        <button onClick={() => setShowAddSlotForm(true)} className="btn-primary flex items-center">
                            <Plus size={20} className="mr-2" />
                            Add Slot
                        </button>
                    </div>

                    {showAddSlotForm && (
                        <div className="card">
                            <h3 className="text-xl font-bold text-[#E8E9ED] mb-4">Add New Time Slot</h3>
                            <form onSubmit={handleAddSlot} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Date</label>
                                        <input type="date" value={slotFormData.slot_date} onChange={(e) => setSlotFormData({ ...slotFormData, slot_date: e.target.value })} required className="input" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#E8E9ED] mb-2">Time</label>
                                        <input type="time" value={slotFormData.slot_time} onChange={(e) => setSlotFormData({ ...slotFormData, slot_time: e.target.value })} required className="input" />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="btn-primary">Add Slot</button>
                                    <button type="button" onClick={() => setShowAddSlotForm(false)} className="btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="card">
                        <div className="space-y-3">
                            {availableSlots.length === 0 ? (
                                <p className="text-[#9CA3AF] text-center py-8">No slots available. Add your first slot!</p>
                            ) : (
                                availableSlots.map((slot) => (
                                    <div key={slot.id} className="bg-[#1A1F3A] rounded-lg p-4 flex items-center justify-between border border-white/5">
                                        <div>
                                            <span className="text-[#E8E9ED] font-medium">{new Date(slot.slot_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            <span className="text-[#9CA3AF] ml-4">{slot.slot_time}</span>
                                            <span className={`ml-4 text-xs px-2 py-1 rounded-full ${slot.is_booked ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {slot.is_booked ? 'Booked' : 'Available'}
                      </span>
                                        </div>
                                        <button onClick={() => handleDeleteSlot(slot.id)} className="text-[#9CA3AF] hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'bookings' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#E8E9ED]">All Bookings</h2>
                    <div className="card">
                        <div className="space-y-3">
                            {allBookings.length === 0 ? (
                                <p className="text-[#9CA3AF] text-center py-8">No bookings yet.</p>
                            ) : (
                                allBookings.map((booking) => (
                                    <div key={booking.id} className="bg-[#1A1F3A] rounded-lg p-4 border border-white/5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="text-[#E8E9ED] font-semibold">{booking.profiles?.full_name || 'Unknown'}</h4>
                                                <p className="text-[#9CA3AF] text-sm">{booking.profiles?.email}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {booking.status}
                      </span>
                                        </div>
                                        <div className="text-sm text-[#9CA3AF] mb-3">
                                            <div><strong>Session:</strong> {booking.session_type}</div>
                                            <div><strong>Date:</strong> {new Date(booking.session_date).toLocaleDateString()} at {booking.session_time}</div>
                                            {booking.notes && <div><strong>Notes:</strong> {booking.notes}</div>}
                                        </div>
                                        {booking.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')} className="flex items-center text-green-500 hover:text-green-400 text-sm font-medium">
                                                    <CheckCircle size={16} className="mr-1" />
                                                    Confirm
                                                </button>
                                                <button onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')} className="flex items-center text-red-500 hover:text-red-400 text-sm font-medium">
                                                    <XCircle size={16} className="mr-1" />
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'clients' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#E8E9ED]">All Clients</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clients.length === 0 ? (
                            <p className="text-[#9CA3AF] col-span-3 text-center py-8">No clients yet.</p>
                        ) : (
                            clients.map((client) => (
                                <div key={client.id} className="card">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-full flex items-center justify-center mr-3">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-[#E8E9ED] font-semibold">{client.full_name || 'No Name'}</h4>
                                            <p className="text-[#9CA3AF] text-sm">{client.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-[#9CA3AF]">
                                        <div>Joined: {new Date(client.created_at).toLocaleDateString()}</div>
                                        {client.phone && <div>Phone: {client.phone}</div>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}