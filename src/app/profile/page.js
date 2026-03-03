'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);

    useEffect(() => {
        if (!loading) {
            setIsLoading(false);
        }
    }, [user, loading]);

    useEffect(() => {
        if (!user?.email) return;
        setOrdersLoading(true);
        fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
            .then((res) => res.ok ? res.json() : [])
            .then((data) => setOrders(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)) : []))
            .catch(() => setOrders([]))
            .finally(() => setOrdersLoading(false));
    }, [user?.email]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDeleteError('');
        setDeleteSubmitting(true);
        try {
            const res = await fetch('/api/auth/delete-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, password: deletePassword })
            });
            const data = await res.json();
            if (data.success) {
                logout();
                router.push('/');
            } else {
                setDeleteError(data.message || 'Failed to delete account');
            }
        } catch {
            setDeleteError('Something went wrong. Please try again.');
        } finally {
            setDeleteSubmitting(false);
        }
    };

    const recentOrders = orders.slice(0, 5);

    return (
        <div className="font-sans">
            <div className="flex flex-col min-h-screen font-inter">
                <Navbar />
                <main className="flex-grow bg-[#fafafa] flex items-center justify-center py-12 px-4">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Profile</h2>
                            {user && (
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {user.name ? user.name[0] : 'U'}
                                </div>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                            </div>
                        ) : user ? (
                            <div className="space-y-6">
                                <div className="group">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                    <p className="text-lg text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                                        {user.name || 'N/A'}
                                    </p>
                                </div>

                                <div className="group">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                    <p className="text-lg text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                                        {user.email}
                                    </p>
                                </div>

                                {/* Order history */}
                                <div className="pt-2 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Order History</p>
                                        {orders.length > 0 && (
                                            <Link href="/orders" className="text-sm font-bold text-[#f0312f] hover:underline">
                                                View all
                                            </Link>
                                        )}
                                    </div>
                                    {ordersLoading ? (
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                                            ))}
                                        </div>
                                    ) : recentOrders.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No orders yet.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {recentOrders.map((order) => (
                                                <li key={order.id || order._id} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                                                    <span className="text-gray-700 truncate mr-2">
                                                        {(order.products || order.items || []).map((p) => p.name).filter(Boolean).join(', ') || 'Order'}
                                                    </span>
                                                    <span className="font-semibold text-gray-900 shrink-0">{formatCurrency(order.totalPrice || order.total)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="pt-4 space-y-3">
                                    <button
                                        onClick={() => router.push('/orders')}
                                        className="w-full border border-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                    >
                                        View My Orders
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-[#3455b9] text-white p-3 rounded-lg hover:bg-blue-800 shadow-md transition-all active:scale-95 font-bold"
                                    >
                                        Logout
                                    </button>

                                    {!showDeleteConfirm ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="w-full text-red-600 border border-red-200 p-3 rounded-lg hover:bg-red-50 transition-all font-medium text-sm"
                                        >
                                            Delete my account
                                        </button>
                                    ) : (
                                        <div className="border border-red-200 rounded-lg p-4 bg-red-50/50 space-y-3">
                                            <p className="text-sm text-gray-700 font-medium">Confirm account deletion. Enter your password:</p>
                                            <form onSubmit={handleDeleteAccount} className="space-y-2">
                                                <input
                                                    type="password"
                                                    value={deletePassword}
                                                    onChange={(e) => setDeletePassword(e.target.value)}
                                                    placeholder="Your password"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                    required
                                                    autoComplete="current-password"
                                                />
                                                {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError(''); }}
                                                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={deleteSubmitting}
                                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        {deleteSubmitting ? 'Deleting…' : 'Delete account'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-6 font-medium italic">Please log in to view your profile.</p>
                                <Link
                                    href="/login"
                                    className="inline-block bg-[#3455b9] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-md"
                                >
                                    Login Now
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
