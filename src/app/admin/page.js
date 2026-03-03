'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Package, Plus, FileText } from 'lucide-react';
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

    const fetchAll = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const [productsRes, donationsRes, ordersRes] = await Promise.all([
                fetch('/api/admin/products', { cache: 'no-store' }),
                fetch('/api/donor-registrations', { cache: 'no-store' }),
                fetch('/api/admin/orders', { cache: 'no-store' }),
            ]);

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
        } finally {
            setLoading(false);
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
            color: 'bg-blue-500',
        },
        {
            label: 'Donor Registrations',
            value: counts.donations,
            trend: trends.donations,
            Icon: Heart,
            color: 'bg-red-500',
        },
        {
            label: 'Total Orders',
            value: counts.orders,
            trend: trends.orders,
            Icon: Package,
            color: 'bg-green-500',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.Icon className="w-6 h-6 text-current opacity-80" aria-hidden />
                            </div>
                            {loading ? (
                                <span className="h-6 w-28 bg-gray-100 rounded-full animate-pulse" />
                            ) : (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {stat.trend}
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                            {loading ? (
                                <div className="h-9 w-16 bg-gray-100 rounded-lg animate-pulse mt-1" />
                            ) : (
                                <h3 className="text-3xl font-black text-gray-900 mt-1">
                                    {stat.value ?? '—'}
                                </h3>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/products"
                            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-[#f0312f] transition-all border border-transparent hover:border-red-100 group min-h-[120px]"
                        >
                            <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform shrink-0" aria-hidden />
                            <span className="font-bold text-sm">Add Product</span>
                        </Link>
                        <Link
                            href="/admin/donations"
                            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-[#f0312f] transition-all border border-transparent hover:border-red-100 group min-h-[120px]"
                        >
                            <FileText className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform shrink-0" aria-hidden />
                            <span className="font-bold text-sm">View Donors</span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
