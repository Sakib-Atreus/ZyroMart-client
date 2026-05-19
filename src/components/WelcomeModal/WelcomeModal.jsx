import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { MdLocalShipping, MdVerified } from 'react-icons/md';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { BiSupport } from 'react-icons/bi';

const perks = [
    { icon: <MdLocalShipping size={16} />, label: 'Free Shipping over $50' },
    { icon: <RiSecurePaymentLine size={16} />, label: 'Secure Payment' },
    { icon: <MdVerified size={16} />, label: 'Verified Vendors Only' },
    { icon: <BiSupport size={16} />, label: '24/7 Customer Support' },
];

const STORAGE_KEY = 'zyromart_welcome_shown';

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(STORAGE_KEY)) return;
        const timer = setTimeout(() => setIsOpen(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const close = () => {
        localStorage.setItem(STORAGE_KEY, '1');
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={close}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative z-10 w-full max-w-3xl md:h-[400px] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={close}
                            className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 rounded-full p-1.5 shadow-md transition-all duration-200 hover:scale-110"
                            aria-label="Close modal"
                        >
                            <IoClose size={20} />
                        </button>

                        {/* Left Side — pure CSS design, no image */}
                        <div className="md:w-[45%] h-52 md:h-full relative overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#FF4500] via-[#d93d00] to-[#8B1A00]">

                            {/* Decorative background circles */}
                            <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full" />
                            <div className="absolute top-16 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                            <div className="absolute -bottom-12 left-6 w-52 h-52 bg-black/15 rounded-full" />
                            <div className="absolute bottom-10 -right-10 w-36 h-36 bg-yellow-400/10 rounded-full" />

                            {/* SVG Shopping Bag */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                    viewBox="0 0 120 130"
                                    className="w-36 h-36 md:w-44 md:h-44 drop-shadow-2xl"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Bag body */}
                                    <rect x="10" y="40" width="100" height="78" rx="10" fill="white" fillOpacity="0.18" />
                                    <rect x="10" y="40" width="100" height="78" rx="10" stroke="white" strokeOpacity="0.5" strokeWidth="2.5" />
                                    {/* Bag handle left */}
                                    <path d="M38 40 C38 20 82 20 82 40" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
                                    {/* Inner highlight stripe */}
                                    <rect x="10" y="40" width="100" height="18" rx="0" fill="white" fillOpacity="0.08" />
                                    {/* ZM monogram */}
                                    <text x="60" y="90" textAnchor="middle" fontSize="22" fontWeight="800" fill="white" fontFamily="sans-serif" letterSpacing="2">ZM</text>
                                    {/* Star accent */}
                                    <circle cx="60" cy="105" r="3" fill="#FBBF24" />
                                    <circle cx="48" cy="105" r="2" fill="white" fillOpacity="0.4" />
                                    <circle cx="72" cy="105" r="2" fill="white" fillOpacity="0.4" />
                                </svg>
                            </div>

                            {/* Floating sale tag */}
                            <div className="absolute top-12 right-5 bg-yellow-400 text-yellow-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-lg rotate-6">
                                SALE!
                            </div>

                            {/* Content — badge top, text bottom */}
                            <div className="absolute inset-0 flex flex-col justify-between p-6">
                                <div>
                                    <span className="bg-white text-[#FF4500] text-xs font-extrabold px-3 py-1 rounded-full shadow">
                                        LIMITED OFFER
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white/80 text-xs uppercase tracking-widest mb-1">Don't miss out</p>
                                    <h3 className="text-white text-3xl font-extrabold leading-tight drop-shadow-lg">
                                        Up to <span className="text-yellow-300">50% OFF</span><br />Today Only!
                                    </h3>
                                    <p className="text-white/70 text-xs mt-2">On selected products from top vendors</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="md:w-[55%] bg-white flex flex-col justify-between px-7 py-6">
                            {/* Header */}
                            <div>
                                <p className="text-[#FF4500] text-xs font-bold uppercase tracking-widest mb-1">Multi-Vendor Marketplace</p>
                                <h2 className="text-2xl font-extrabold text-gray-900 leading-snug mb-2">
                                    Welcome to <span className="text-[#FF4500]">ZyroMart</span>!
                                </h2>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Thousands of products. Hundreds of verified vendors. One smart place to shop — electronics, fashion, accessories & more.
                                </p>
                            </div>

                            {/* Perks */}
                            <div className="grid grid-cols-2 gap-2 my-4">
                                {perks.map((perk, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                        <span className="text-[#FF4500]">{perk.icon}</span>
                                        <span className="text-gray-600 text-[11px] font-medium leading-tight">{perk.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div>
                                <button
                                    onClick={close}
                                    className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-200 active:scale-95 text-sm"
                                >
                                    Shop Now →
                                </button>
                                <p className="text-center text-gray-300 text-[11px] mt-2">No account needed to browse</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeModal;
