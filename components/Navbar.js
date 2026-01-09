'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Dumbbell } from 'lucide-react';

export default function Navbar({ onAuthClick }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] rounded-lg flex items-center justify-center">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text whitespace-nowrap">Elite Fitness Coach</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-[#E8E9ED] hover:text-[#FF6B35] transition-colors duration-300 font-medium whitespace-nowrap"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                        <button
                            onClick={() => onAuthClick('login')}
                            className="text-[#E8E9ED] hover:text-[#FF6B35] transition-colors duration-300 font-medium px-4 py-2 whitespace-nowrap"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => onAuthClick('signup')}
                            className="btn-primary whitespace-nowrap"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-[#E8E9ED] hover:text-[#FF6B35] transition-colors p-2 flex-shrink-0"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass border-t border-white/10">
                    <div className="container mx-auto px-6 py-6">
                        <div className="space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-[#E8E9ED] hover:text-[#FF6B35] transition-colors duration-300 font-medium py-3"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={() => { onAuthClick('login'); setIsMobileMenuOpen(false); }}
                                    className="w-full btn-secondary"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => { onAuthClick('signup'); setIsMobileMenuOpen(false); }}
                                    className="w-full btn-primary"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}