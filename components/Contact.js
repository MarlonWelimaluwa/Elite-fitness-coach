'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { error: insertError } = await supabase.from('contact_messages').insert([
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                },
            ]);

            if (insertError) throw insertError;

            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            console.error('Error submitting contact form:', err);
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <section id="contact" className="py-20 relative bg-gradient-to-b from-[#0A0E27] to-[#1A1F3A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn">
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#E8E9ED] mb-4">
                        Ready to <span className="gradient-text">Transform?</span>
                    </h2>
                    <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto">
                        Get in touch to schedule your free consultation and start your journey to peak performance.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="animate-fadeIn">
                        <h3 className="text-2xl font-bold text-[#E8E9ED] mb-6">Get In Touch</h3>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-[#E8E9ED] mb-1">Email</h4>
                                    <p className="text-[#9CA3AF]">coach@elitefitness.com</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-[#E8E9ED] mb-1">Phone</h4>
                                    <p className="text-[#9CA3AF]">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-[#E8E9ED] mb-1">Location</h4>
                                    <p className="text-[#9CA3AF]">Los Angeles, CA</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 card">
                            <h4 className="text-lg font-semibold text-[#E8E9ED] mb-4">What to Expect</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start text-[#9CA3AF]">
                                    <span className="text-[#FF6B35] mr-2">1.</span>
                                    <span>Free 30-minute consultation call</span>
                                </li>
                                <li className="flex items-start text-[#9CA3AF]">
                                    <span className="text-[#FF6B35] mr-2">2.</span>
                                    <span>Assessment of your goals and current fitness level</span>
                                </li>
                                <li className="flex items-start text-[#9CA3AF]">
                                    <span className="text-[#FF6B35] mr-2">3.</span>
                                    <span>Customized program recommendation</span>
                                </li>
                                <li className="flex items-start text-[#9CA3AF]">
                                    <span className="text-[#FF6B35] mr-2">4.</span>
                                    <span>Start your transformation journey</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <form onSubmit={handleSubmit} className="card">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[#E8E9ED] mb-2">
                                        Full Name *
                                    </label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="input" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#E8E9ED] mb-2">
                                        Email Address *
                                    </label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-[#E8E9ED] mb-2">
                                        Phone Number
                                    </label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="+1 (555) 123-4567" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-[#E8E9ED] mb-2">
                                        Message *
                                    </label>
                                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows="5" className="input resize-none" placeholder="Tell me about your fitness goals..."></textarea>
                                </div>

                                {success && (
                                    <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
                                        <p className="text-green-500 text-sm">Message sent successfully! I will get back to you within 24 hours.</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                                        <p className="text-red-500 text-sm">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary flex items-center justify-center gap-2 group transition-all duration-300"
                                >
                                    {loading ? (
                                        <div className="spinner h-5 w-5"></div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            <span className="font-semibold">Send Message</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}