'use client';

import { Dumbbell, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0A0E27] border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center">
                                <Dumbbell className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">Elite Fitness Coach</span>
                        </div>
                        <p className="text-[#9CA3AF] text-sm">Transforming high-performers through personalized fitness coaching, nutrition guidance, and mindset training.</p>
                    </div>

                    <div className="md:pl-20">
                        <h4 className="text-[#E8E9ED] font-semibold mb-4 md:pl-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#home" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Home</a></li>
                            <li><a href="#about" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">About</a></li>
                            <li><a href="#services" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Services</a></li>
                            <li><a href="#testimonials" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Testimonials</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[#E8E9ED] font-semibold mb-4 md:pl-8">Services</h4>
                        <ul className="space-y-2 md:pl-8">
                            <li><a href="#services" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Personal Training</a></li>
                            <li><a href="#services" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Nutrition Coaching</a></li>
                            <li><a href="#services" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Mindset Coaching</a></li>
                            <li><a href="#services" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Transformation Program</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[#E8E9ED] font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="w-10 h-10 bg-[#1A1F3A] rounded-lg flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                                <Instagram className="w-5 h-5 text-[#E8E9ED]" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#1A1F3A] rounded-lg flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                                <Facebook className="w-5 h-5 text-[#E8E9ED]" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#1A1F3A] rounded-lg flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                                <Twitter className="w-5 h-5 text-[#E8E9ED]" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#1A1F3A] rounded-lg flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                                <Linkedin className="w-5 h-5 text-[#E8E9ED]" />
                            </a>
                        </div>
                        <p className="text-[#9CA3AF] text-sm">Follow for daily fitness tips and motivation</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-[#9CA3AF] text-sm mb-4 md:mb-0">© {currentYear} Elite Fitness Coach. All rights reserved. Designed & Developed by Marlon.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Privacy Policy</a>
                        <a href="#" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Terms of Service</a>
                        <a href="#" className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors text-sm">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}