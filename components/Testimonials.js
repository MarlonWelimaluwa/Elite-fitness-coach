'use client';

import { Star } from 'lucide-react';

export default function Testimonials() {
    const testimonials = [
        {
            name: 'Marcus Chen',
            role: 'Tech CEO',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop',
            rating: 5,
            text: 'Working with Elite Fitness Coach transformed not just my body, but my entire approach to health and performance. Down 30 pounds and feeling stronger than ever at 45.',
        },
        {
            name: 'Sarah Mitchell',
            role: 'Entrepreneur',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop',
            rating: 5,
            text: 'The personalized approach and accountability made all the difference. I finally have a sustainable fitness routine that fits my busy schedule. Best investment I have made.',
        },
        {
            name: 'David Rodriguez',
            role: 'Investment Banker',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop',
            rating: 5,
            text: 'I have tried countless trainers and programs. This is the only one that delivered real, lasting results. The holistic approach to fitness, nutrition, and mindset is unmatched.',
        },
        {
            name: 'Emily Watson',
            role: 'Marketing Director',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop',
            rating: 5,
            text: 'The coaching went beyond just workouts. I learned how to fuel my body properly and developed habits that stick. Three months in and I feel like a completely different person.',
        },
        {
            name: 'James Park',
            role: 'Software Engineer',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop',
            rating: 5,
            text: 'As someone who sits at a desk all day, I was struggling with back pain and low energy. The customized program addressed my specific needs and the results speak for themselves.',
        },
        {
            name: 'Lisa Anderson',
            role: 'Attorney',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&h=150&auto=format&fit=crop',
            rating: 5,
            text: 'Elite Fitness Coach understands the demands of high-performance careers. The flexibility and results-focused approach fit perfectly into my lifestyle. Highly recommend.',
        },
    ];

    return (
        <section id="testimonials" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn">
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#E8E9ED] mb-4">
                        Real People, <span className="gradient-text">Real Results</span>
                    </h2>
                    <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto">
                        Join hundreds of high-performers who have transformed their bodies and lives through our proven coaching system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="card animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex items-center mb-4">
                                <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                                <div>
                                    <h4 className="text-lg font-bold text-[#E8E9ED]">{testimonial.name}</h4>
                                    <p className="text-sm text-[#9CA3AF]">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="flex mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-[#FF6B35] fill-current" />
                                ))}
                            </div>
                            <p className="text-[#9CA3AF] leading-relaxed">{testimonial.text}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-block card">
                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold gradient-text mb-2">500+</div>
                                <div className="text-[#9CA3AF]">Happy Clients</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold gradient-text mb-2">98%</div>
                                <div className="text-[#9CA3AF]">Success Rate</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold gradient-text mb-2">4.9</div>
                                <div className="text-[#9CA3AF]">Average Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}