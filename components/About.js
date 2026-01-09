'use client';

import { Award, Heart, Users, Trophy } from 'lucide-react';

export default function About() {
    const features = [
        {
            icon: Award,
            title: 'Certified Excellence',
            description: 'Certified personal trainer with 15+ years of experience transforming lives.',
        },
        {
            icon: Heart,
            title: 'Holistic Approach',
            description: 'Focus on physical fitness, nutrition, mental wellness, and sustainable habits.',
        },
        {
            icon: Users,
            title: 'Personalized Plans',
            description: 'Every program is tailored to your goals, lifestyle, and fitness level.',
        },
        {
            icon: Trophy,
            title: 'Proven Results',
            description: '500+ successful transformations with a 98% client satisfaction rate.',
        },
    ];

    return (
        <section id="about" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn">
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#E8E9ED] mb-4">
                        Your Success is <span className="gradient-text">My Mission</span>
                    </h2>
                    <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto">
                        I'm dedicated to helping high-performers achieve their fitness goals through
                        science-backed training, personalized nutrition, and unwavering accountability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="card text-center animate-fadeIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-[#E8E9ED] mb-2">{feature.title}</h3>
                                <p className="text-[#9CA3AF]">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Coach image and story */}
                <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fadeIn">
                        <img
                            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop"
                            alt="Elite Fitness Coach"
                            className="rounded-2xl shadow-2xl w-full object-cover"
                        />
                    </div>
                    <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-3xl font-bold text-[#E8E9ED]">
                            Meet Your Coach
                        </h3>
                        <p className="text-[#9CA3AF] leading-relaxed">
                            With over 15 years of experience in elite fitness coaching, I've helped hundreds of
                            professionals, entrepreneurs, and athletes transform their bodies and minds. My approach
                            combines cutting-edge training methodologies with personalized nutrition and mental
                            performance strategies.
                        </p>
                        <p className="text-[#9CA3AF] leading-relaxed">
                            I believe that true transformation goes beyond the gym. It's about building sustainable
                            habits, developing mental resilience, and creating a lifestyle that supports your highest
                            ambitions. Whether you're looking to build muscle, lose fat, or optimize performance,
                            I'll be with you every step of the way.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-4 py-2 bg-[#1A1F3A] border border-[#FF6B35]/30 rounded-full text-[#E8E9ED] text-sm">
                NASM Certified
              </span>
                            <span className="px-4 py-2 bg-[#1A1F3A] border border-[#FF6B35]/30 rounded-full text-[#E8E9ED] text-sm">
                Sports Nutrition
              </span>
                            <span className="px-4 py-2 bg-[#1A1F3A] border border-[#FF6B35]/30 rounded-full text-[#E8E9ED] text-sm">
                Strength Coach
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}