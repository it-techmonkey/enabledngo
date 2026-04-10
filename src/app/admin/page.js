'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Package, Plus, FileText, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function isThisMonth(dateStr) {
    if (!dateStr) return false;
    try {
        const d = new Date(dateStr);
        const now = new Date();
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    } catch {
        return false;
    }
}

function isToday(dateStr) {
    if (!dateStr) return false;
    try {
        const d = new Date(dateStr);
        const now = new Date();
        return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate()
        );
    } catch {
        return false;
    }
}

export default function AdminDashboard() {
    const [counts, setCounts] = useState({ products: null, donations: null, orders: null });
    const [trends, setTrends] = useState({ products: null, donations: null, orders: null });
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');

    const fetchAll = async (showLoading = true) => {
        try {
            setError('');
            if (showLoading) setLoading(true);
            else setIsRefreshing(true);
            const [productsRes, donationsRes, ordersRes] = await Promise.all([
                fetch('/api/admin/products', { cache: 'no-store' }),
                fetch('/api/donor-registrations', { cache: 'no-store' }),
                fetch('/api/admin/orders', { cache: 'no-store' }),
            ]);

            if (!productsRes.ok || !donationsRes.ok || !ordersRes.ok) {
                throw new Error('Failed to load dashboard data');
            }

            const [products, donations, orders] = await Promise.all([
                productsRes.json(),
                donationsRes.json(),
                ordersRes.json(),
            ]);

            const productArr = Array.isArray(products) ? products : [];
            const donationArr = Array.isArray(donations) ? donations : [];
            const orderArr = Array.isArray(orders) ? orders : [];

            const productsThisMonth = productArr.filter((p) => isThisMonth(p.createdAt || p.createdat)).length;
            const donationsThisMonth = donationArr.filter((d) => isThisMonth(d.submitted_at)).length;
            const ordersToday = orderArr.filter((o) => isToday(o.createdAt || o.createdat || o.date)).length;

            setCounts({
                products: productArr.length,
                donations: donationArr.length,
                orders: orderArr.length,
            });
            setTrends({
                products: productsThisMonth > 0 ? `+${productsThisMonth} this month` : 'No new this month',
                donations: donationsThisMonth > 0 ? `+${donationsThisMonth} this month` : 'No new this month',
                orders: ordersToday > 0 ? `+${ordersToday} today` : 'None today',
            });
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError('Unable to refresh dashboard right now. Please try again.');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        const onFocus = () => fetchAll(false);
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    const stats = [
        {
            label: 'Total Products',
            value: counts.products,
            trend: trends.products,
            Icon: ShoppingBag,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            label: 'Donor Registrations',
            value: counts.donations,
            trend: trends.donations,
            Icon: Heart,
            color: 'text-red-600 bg-red-50',
        },
        {
            label: 'Total Orders',
            value: counts.orders,
            trend: trends.orders,
            Icon: Package,
            color: 'text-green-600 bg-green-50',
        },
    ];

    const trendClass = (trendText = '') =>
        trendText.startsWith('+')
            ? 'text-green-700 bg-green-50'
            : 'text-gray-500 bg-gray-100';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-end">
                <button
                    type="button"
                    onClick={() => fetchAll(false)}
                    disabled={loading || isRefreshing}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed min-h-[40px]"
                >
                    <RefreshCw className={`w-4 h-4 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden />
                    Refresh data
                </button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] group">
                        <div className="flex items-start justify-between">
                            <div className={`w-11 h-11 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <stat.Icon className="w-6 h-6 text-current" aria-hidden />
                            </div>
                            {loading ? (
                                <span className="h-6 w-28 bg-gray-100 rounded-full animate-pulse" />
                            ) : (
                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${trendClass(stat.trend)}`}>
                                    {stat.trend}
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            {loading ? (
                                <div className="h-9 w-16 bg-gray-100 rounded-lg animate-pulse mt-1" />
                            ) : (
                                <h3 className="text-3xl font-semibold text-gray-900 mt-1 tracking-tight">
                                    {stat.value ?? '—'}
                                </h3>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Quick Actions</h2>
                    <p className="text-sm text-gray-500 mb-4">Common tasks for day-to-day operations.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/admin/products"
                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-[#f0312f] transition-colors border border-transparent hover:border-red-100 min-h-[64px]"
                        >
                            <Plus className="w-5 h-5 shrink-0" aria-hidden />
                            <span className="font-medium text-sm">Add Product</span>
                        </Link>
                        <Link
                            href="/admin/donations"
                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-[#f0312f] transition-colors border border-transparent hover:border-red-100 min-h-[64px]"
                        >
                            <FileText className="w-5 h-5 shrink-0" aria-hidden />
                            <span className="font-medium text-sm">View Donors</span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
