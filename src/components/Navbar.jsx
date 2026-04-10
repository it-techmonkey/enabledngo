'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { User, Info, ShoppingBag, TrendingUp, Heart, ShoppingCart, Menu } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    const handleNavbarToggle = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // Prevent background scroll when mobile menu is open.
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        // Auto-close menu when route changes.
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const handleAboutUsClick = () => {
        setIsOpen(false);
        if (pathname === '/') {
            // Already on home, just scroll
            const section = document.getElementById('about-us');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Navigate to home, then scroll after page load
            router.push('/#about-us');
        }
    };

    const handleSignupLogin = () => {
        router.push('/login');
    };

    return (
        <nav className="w-full bg-[#F0312F] text-white font-inter shadow-sm relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-semibold tracking-tight">
                    Enabled.
                </Link>
                <div className="hidden md:flex gap-5 items-center">
                    <button className="flex items-center gap-1.5 hover:underline min-h-[44px]" onClick={handleAboutUsClick}>
                        <Info className="w-4 h-4 shrink-0" aria-hidden /> About Us
                    </button>
                    <Link href="/products" className="flex items-center gap-1.5 hover:underline min-h-[44px] items-center">
                        <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden /> Impact Shop
                    </Link>
                    <Link href="/impact-outcomes" className="flex items-center gap-1.5 hover:underline min-h-[44px] items-center">
                        <TrendingUp className="w-4 h-4 shrink-0" aria-hidden /> Impact Outcomes
                    </Link>
                    <Link href="/be-a-donor" className="flex items-center gap-1.5 hover:underline min-h-[44px] items-center">
                        <Heart className="w-4 h-4 shrink-0" aria-hidden /> Be a Donor
                    </Link>
                    <Link href="/cart" className="flex items-center gap-1.5 hover:underline min-h-[44px] items-center">
                        <ShoppingCart className="w-4 h-4 shrink-0" aria-hidden /> Cart
                        {cartCount > 0 && <span className="bg-white text-[#F0312F] text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="flex items-center gap-2 bg-white text-[#F0312F] px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-gray-100 min-h-[44px] items-center">
                                <User className="w-4 h-4 shrink-0" aria-hidden />
                                {user.name}
                            </Link>
                            <button onClick={logout} className="text-white hover:underline transition-all">Logout</button>
                        </div>
                    ) : (
                        <button className="bg-white text-[#F0312F] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold" onClick={handleSignupLogin}>
                            Signup / Login
                        </button>
                    )}
                </div>
                <button
                    className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    onClick={handleNavbarToggle}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isOpen}
                    aria-controls="mobile-nav-menu"
                >
                    <Menu className="w-6 h-6" aria-hidden />
                </button>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div id="mobile-nav-menu" className="md:hidden bg-[#F0312F] px-4 pt-2 pb-4 space-y-1 shadow-lg absolute w-full left-0">
                    <button className="block w-full text-left px-3 py-3 rounded-md font-medium hover:bg-red-700 flex items-center gap-2 min-h-[44px] items-center" onClick={() => { handleAboutUsClick(); setIsOpen(false); }}>
                        <Info className="w-4 h-4 shrink-0" aria-hidden /> About Us
                    </button>
                    <Link href="/products" className="block w-full text-left px-3 py-3 rounded-md font-medium hover:bg-red-700 flex items-center gap-2 min-h-[44px] items-center" onClick={() => setIsOpen(false)}>
                        <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden /> Impact Shop
                    </Link>
                    <Link href="/impact-outcomes" className="block w-full text-left px-3 py-3 rounded-md font-medium hover:bg-red-700 flex items-center gap-2 min-h-[44px] items-center" onClick={() => setIsOpen(false)}>
                        <TrendingUp className="w-4 h-4 shrink-0" aria-hidden /> Impact Outcomes
                    </Link>
                    <Link href="/be-a-donor" className="block w-full text-left px-3 py-3 rounded-md font-medium hover:bg-red-700 flex items-center gap-2 min-h-[44px] items-center" onClick={() => setIsOpen(false)}>
                        <Heart className="w-4 h-4 shrink-0" aria-hidden /> Be a Donor
                    </Link>
                    <Link href="/cart" className="block w-full text-left px-3 py-3 rounded-md font-medium hover:bg-red-700 flex items-center justify-between min-h-[44px] items-center" onClick={() => setIsOpen(false)}>
                        <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4 shrink-0" aria-hidden /> Cart</span>
                        {cartCount > 0 && <span className="bg-white text-[#F0312F] text-[10px] font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
                    </Link>
                    {user ? (
                        <>
                            <Link href="/profile" className="block w-full text-left px-3 py-3 rounded-md font-medium hover:bg-red-700 flex items-center gap-2 min-h-[44px] items-center" onClick={() => setIsOpen(false)}>
                                <User className="w-4 h-4 shrink-0" aria-hidden />
                                Profile
                            </Link>
                            <button className="block w-full mt-2 bg-white text-[#F0312F] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-center font-semibold" onClick={() => { setIsOpen(false); logout(); }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <button className="block w-full mt-2 bg-white text-[#F0312F] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-center font-semibold" onClick={() => { setIsOpen(false); handleSignupLogin(); }}>
                            Signup / Login
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
