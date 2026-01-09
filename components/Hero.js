'use client';

import { TrendingUp, Target, Zap } from 'lucide-react';

export default function Hero({ onGetStarted }) {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]"></div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B35] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00D9FF] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
                <div className="text-center animate-fadeIn">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 bg-[#1A1F3A] border border-[#FF6B35]/30 rounded-full px-8 py-3 mb-12">
                        <Zap className="w-5 h-5 text-[#FF6B35]" />
                        <span className="text-sm sm:text-base text-[#9CA3AF] font-medium">Transform Your Body in 90 Days</span>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-10">
                        <span className="text-[#E8E9ED]">Unleash Your</span>
                        <br />
                        <span className="gradient-text">Peak Performance</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg sm:text-xl lg:text-2xl text-[#9CA3AF] max-w-4xl mx-auto leading-relaxed mb-12 px-4">
                        Elite fitness coaching designed for high-performers who demand results.
                        Personalized training, nutrition, and accountability to achieve your goals.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
                        <button onClick={onGetStarted} className="btn-primary text-base sm:text-lg px-10 py-4 w-full sm:w-auto">
                            Start Your Transformation
                        </button>
                        <a href="#services" className="btn-secondary text-base sm:text-lg px-10 py-4 w-full sm:w-auto">
                            Explore Programs
                        </a>
                    </div>

                    {/* Stats - 3 Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="card text-center">
                            <TrendingUp className="w-12 h-12 text-[#FF6B35] mx-auto mb-5" />
                            <div className="text-5xl font-bold text-[#E8E9ED] mb-4">500+</div>
                            <div className="text-lg text-[#9CA3AF]">Transformations</div>
                        </div>
                        <div className="card text-center">
                            <Target className="w-12 h-12 text-[#FF6B35] mx-auto mb-5" />
                            <div className="text-5xl font-bold text-[#E8E9ED] mb-4">98%</div>
                            <div className="text-lg text-[#9CA3AF]">Success Rate</div>
                        </div>
                        <div className="card text-center">
                            <Zap className="w-12 h-12 text-[#FF6B35] mx-auto mb-5" />
                            <div className="text-5xl font-bold text-[#E8E9ED] mb-4">15+</div>
                            <div className="text-lg text-[#9CA3AF]">Years Experience</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-[#FF6B35] rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-[#FF6B35] rounded-full animate-pulse"></div>
                </div>
            </div>
        </section>
    );
}