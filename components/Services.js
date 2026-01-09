'use client';

import { Dumbbell, Apple, Brain, Calendar } from 'lucide-react';

export default function Services() {
    const services = [
        {
            icon: Dumbbell,
            title: '1-on-1 Personal Training',
            description: 'Customized workout programs designed specifically for your goals, fitness level, and schedule.',
            features: ['Personalized workout plans', 'Form correction & technique', 'Progressive overload strategy', 'Flexible scheduling'],
            price: '$199/month',
        },
        {
            icon: Apple,
            title: 'Nutrition Coaching',
            description: 'Science-backed nutrition plans that fuel your performance and support your transformation.',
            features: ['Custom meal plans', 'Macro tracking guidance', 'Supplement recommendations', 'Weekly check-ins'],
            price: '$149/month',
        },
        {
            icon: Brain,
            title: 'Mindset Coaching',
            description: 'Develop the mental resilience and habits needed for long-term success and peak performance.',
            features: ['Goal setting strategies', 'Habit formation techniques', 'Stress management', 'Accountability system'],
            price: '$129/month',
        },
        {
            icon: Calendar,
            title: 'Complete Transformation',
            description: 'All-inclusive coaching program combining training, nutrition, and mindset for maximum results.',
            features: ['Everything included', 'Priority support access', '90-day transformation plan', 'Results guaranteed'],
            price: '$399/month',
            featured: true,
        },
    ];

    return (
        <section id="services" className="py-20 relative bg-gradient-to-b from-[#0A0E27] to-[#1A1F3A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn">
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#E8E9ED] mb-4">
                        Programs That <span className="gradient-text">Deliver Results</span>
                    </h2>
                    <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto">
                        Choose the coaching program that aligns with your goals. All programs include unlimited support and access to our exclusive training platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div key={index} className={`card relative animate-fadeIn ${service.featured ? 'ring-2 ring-[#FF6B35]' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                                {service.featured && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</span>
                                    </div>
                                )}
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-full flex items-center justify-center mb-4">
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#E8E9ED] mb-3">{service.title}</h3>
                                <p className="text-[#9CA3AF] mb-6">{service.description}</p>
                                <ul className="space-y-3 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-[#9CA3AF]">
                                            <span className="text-[#FF6B35] mr-2">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto pt-6 border-t border-white/10">
                                    <div className="text-3xl font-bold text-[#E8E9ED] mb-4">{service.price}</div>
                                    <a href="#contact" className={`block text-center py-3 rounded-lg font-semibold transition-all ${service.featured ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] text-white hover:shadow-lg' : 'bg-[#1A1F3A] text-[#E8E9ED] border border-[#FF6B35]/30 hover:bg-[#FF6B35]'}`}>
                                        Get Started
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-[#9CA3AF] mb-6">Not sure which program is right for you? Book a free consultation to discuss your goals.</p>
                    <a href="#contact" className="btn-primary">Book Free Consultation</a>
                </div>
            </div>
        </section>
    );
}