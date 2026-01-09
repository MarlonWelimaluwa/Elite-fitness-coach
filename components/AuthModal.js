'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthModal({ mode, onClose, onSuccess }) {
    const [authMode, setAuthMode] = useState(mode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (authMode === 'signup') {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName,
                        },
                    },
                });

                if (signUpError) throw signUpError;

                if (data.user) {
                    setShowSuccess(true);
                }
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (signInError) throw signInError;

                if (data.user) {
                    onSuccess();
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'Authentication failed');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0A0E27]/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#1A1F3A] border border-[#252A4A] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors">
                        <X size={24} />
                    </button>

                    {showSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Account Created Successfully! </h2>
                            <p className="text-[#9CA3AF] text-lg mb-6 leading-relaxed">
                                We've sent a verification email to <span className="text-[#FF6B35] font-semibold">{formData.email}</span>
                            </p>
                            <div className="bg-[#0A0E27]/50 border border-[#FF6B35]/30 rounded-lg p-6 mb-6">
                                <p className="text-[#E8E9ED] text-sm leading-relaxed">
                                    Please check your inbox and click the verification link to activate your account. Once verified, you can sign in and start your fitness journey!
                                </p>
                            </div>
                            <button onClick={onClose} className="w-full btn-primary">
                                Got it!
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">{authMode === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
                                <p className="text-[#9CA3AF]">
                                    {authMode === 'signup' ? 'Join our elite fitness community today' : 'Sign in to track your progress'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {authMode === 'signup' && (
                                    <div>
                                        <label className="text-sm font-medium text-[#E8E9ED] mb-1.5 block">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-[#9CA3AF] transition-colors">
                                                <User size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                className="input pl-12"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium text-[#E8E9ED] mb-1.5 block">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-[#9CA3AF] transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="input pl-12"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-[#E8E9ED] mb-1.5 block">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-[#9CA3AF] transition-colors">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="input pl-12"
                                            placeholder="••••••••"
                                            minLength="6"
                                        />
                                    </div>
                                    {authMode === 'signup' && <p className="text-xs text-[#9CA3AF] mt-1.5 ml-1">Must be at least 6 characters</p>}
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                                        <p className="text-red-500 text-sm leading-relaxed">{error}</p>
                                    </div>
                                )}

                                <button type="submit" disabled={loading} className="w-full btn-primary mt-6">
                                    {loading ? (
                                        <div className="spinner mx-auto border-2 w-5 h-5"></div>
                                    ) : (
                                        authMode === 'signup' ? 'Create Account' : 'Sign In'
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-[#9CA3AF] text-sm">
                                    {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                                    <button
                                        onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                                        className="text-[#FF6B35] hover:underline font-semibold ml-1"
                                    >
                                        {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}