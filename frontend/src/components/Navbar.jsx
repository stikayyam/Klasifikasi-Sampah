import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Clock, Info, Moon, Sun, Github, Twitter } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleDarkMode = () => {
            const darkMode = localStorage.getItem('darkMode') === 'true';
            setIsDarkMode(darkMode);
        };

        handleScroll();
        handleDarkMode();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('storage', handleDarkMode);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', handleDarkMode);
        };
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsMenuOpen(false);
        }
    };

    const navItems = [
        { id: 'home', label: 'Beranda', icon: Home },
        { id: 'history', label: 'Riwayat', icon: Clock },
        { id: 'info', label: 'Jenis Sampah', icon: Info },
    ];

    const MotionDiv = motion.div;
    const MotionButton = motion.button;

    return (
        <MotionDiv
            className={`glass-panel sticky top-0 z-50 px-6 py-4 transition-all duration-300 ${
                isScrolled ? 'bg-dark/80 backdrop-blur-xl border-b border-white/10' : ''
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <MotionDiv
                    className="flex items-center space-x-3 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection('home')}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg animate-glow">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold gradient-text">
                        EcoSort
                    </span>
                </MotionDiv>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <MotionButton
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </MotionButton>
                    ))}
                    
                    {/* Dark Mode Toggle */}
                    <MotionButton
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-blue-400" />
                        )}
                    </MotionButton>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-3">
                    {/* Dark Mode Toggle Mobile */}
                    <MotionButton
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-blue-400" />
                        )}
                    </MotionButton>

                    <MotionButton
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <AnimatePresence mode="wait">
                            {isMenuOpen ? (
                                <X key="close" className="w-6 h-6 text-white" />
                            ) : (
                                <Menu key="menu" className="w-6 h-6 text-white" />
                            )}
                        </AnimatePresence>
                    </MotionButton>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <MotionDiv
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden mt-4 pt-4 border-t border-white/10"
                    >
                        <div className="space-y-2">
                            {navItems.map((item, index) => (
                                <MotionButton
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="w-full flex items-center space-x-3 text-left text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors px-4 py-3 rounded-lg"
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, x: 10 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </MotionButton>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex justify-center space-x-4">
                                <MotionButton
                                    whileHover={{ scale: 1.2, rotate: 15 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                                >
                                    <Github className="w-5 h-5 text-gray-400" />
                                </MotionButton>
                                <MotionButton
                                    whileHover={{ scale: 1.2, rotate: -15 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                                >
                                    <Twitter className="w-5 h-5 text-blue-400" />
                                </MotionButton>
                            </div>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </MotionDiv>
    );
};

export default Navbar;
