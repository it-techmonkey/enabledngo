'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Heart, Package, Globe, LogOut, ChevronLeft, ChevronRight, Users, Menu } from 'lucide-react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [adminName, setAdminName] = useState('Administrator');
    const [adminEmail, setAdminEmail] = useState('');

    useEffect(() => {
        if (pathname !== '/admin/login') {
            const token = sessionStorage.getItem('admin_token');
            if (!token) {
                router.push('/admin/login');
            } else {
                setIsAuthChecking(false);
            }
        } else {
            setIsAuthChecking(false);
        }
    }, [pathname, router]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Load admin profile from localStorage
    useEffect(() => {
        const loadProfile = () => {
            try {
                const saved = localStorage.getItem('admin_profile');
                if (saved) {
                    const p = JSON.parse(saved);
                    if (p.name) setAdminName(p.name);
                    if (p.email) setAdminEmail(p.email);
                } else {
                    setAdminEmail(sessionStorage.getItem('admin_email') || 'admin@enabled.ngo');
                }
            } catch {}
        };
        loadProfile();
        window.addEventListener('admin_profile_updated', loadProfile);
        return () => window.removeEventListener('admin_profile_updated', loadProfile);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_email');
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', Icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', Icon: ShoppingBag },
        { name: 'Children', href: '/admin/children', Icon: Users },
        { name: 'Donations', href: '/admin/donations', Icon: Heart },
        { name: 'Orders', href: '/admin/orders', Icon: Package },
        { name: 'Go to Website', href: '/', Icon: Globe },
    ];

    if (isAuthChecking) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#f0312f] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const pageTitle = pathname === '/admin/profile'
        ? 'Profile'
        : navItems.find(i => i.href === pathname)?.name || 'Admin';

    return (
        <div className="flex min-h-screen bg-[#f8f9fa] font-inter">
            {/* Mobile backdrop */}
            <div
                role="button"
                tabIndex={0}
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                onKeyDown={(e) => e.key === 'Enter' && setMobileMenuOpen(false)}
                className={`fixed inset-0 bg-black/50 z-20 transition-opacity md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            {/* Sidebar — only fixed on mobile (max-md); on desktop it stays in flow so content is not overlapped */}
            <aside className={`flex flex-col bg-white border-r border-gray-200 shadow-sm overflow-y-auto
                max-md:fixed max-md:left-0 max-md:top-0 max-md:bottom-0 max-md:z-30 max-md:w-[min(280px,85vw)] max-md:max-w-[280px] max-md:transform max-md:transition-transform max-md:duration-300 max-md:ease-out
                md:sticky md:top-0 md:h-screen md:shrink-0 md:transition-[width] md:duration-300
                ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}
                ${mobileMenuOpen ? 'max-md:translate-x-0 max-md:shadow-xl' : 'max-md:-translate-x-full'}`}>
                <div className="p-6 flex items-center gap-3 border-b border-gray-100 shrink-0">
                    <div className="w-8 h-8 bg-[#f0312f] rounded flex items-center justify-center text-white font-bold text-lg shrink-0">E</div>
                    {isSidebarOpen && <span className="font-black text-xl tracking-tight text-gray-800">Admin.</span>}
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 min-h-[44px] ${isActive
                                    ? 'bg-red-50 text-[#f0312f] font-bold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium'
                                    }`}
                            >
                                <item.Icon className="w-5 h-5 shrink-0" aria-hidden />
                                {isSidebarOpen && <span className="truncate">{item.name}</span>}
                            </Link>
                        );
                    })}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-gray-500 hover:bg-red-50 hover:text-[#f0312f] font-medium min-h-[44px] text-left"
                    >
                        <LogOut className="w-5 h-5 shrink-0" aria-hidden />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-14 sm:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
                            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        >
                            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" aria-hidden /> : <ChevronRight className="w-5 h-5" aria-hidden />}
                        </button>
                        <h1 className="text-base sm:text-xl font-bold text-gray-800 truncate">{pageTitle}</h1>
                    </div>

                    {/* Clickable profile — navigates to /admin/profile */}
                    <Link href="/admin/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800 group-hover:text-[#f0312f] transition-colors">{adminName}</p>
                            <p className="text-xs text-gray-400 font-medium">{adminEmail}</p>
                        </div>
                        <div className="w-10 h-10 bg-[#f0312f] rounded-full flex items-center justify-center font-black text-white text-base border-2 border-white shadow-sm shrink-0">
                            {adminName?.[0]?.toUpperCase() || 'A'}
                        </div>
                    </Link>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
