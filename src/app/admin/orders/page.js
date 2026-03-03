'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Package, User, MapPin } from 'lucide-react';

function formatOrderDate(val) {
    if (!val) return '—';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleString('en-CA', { dateStyle: 'short', timeStyle: 'medium', hour12: false }) + ' (local)';
}

function normalizeOrder(order) {
    const id = order.id ?? order._id ?? '—';
    const address = order.address || {};
    const customer = order.customer ?? address.fullName ?? '—';
    const email = order.email ?? address.email ?? '—';
    const phone = address.phone ?? '—';
    const total = order.total ?? order.totalPrice ?? 0;
    const date = order.createdAt ?? order.date ?? order.createdat ?? null;
    const products = order.products || order.items || [];
    return { id, customer, email, phone, address, total, date, status: order.status ?? 'Processing', products };
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders', { cache: 'no-store' });
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const normalized = orders
        .map(normalizeOrder)
        .sort((a, b) => (new Date(b.date) || 0) - (new Date(a.date) || 0));

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">Orders Overview</h2>
                <p className="text-gray-400 font-medium text-sm mt-1">Manage and track customer purchases</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[640px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-8"></th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Total</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">Loading orders...</td></tr>
                            ) : normalized.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">No orders found.</td></tr>
                            ) : normalized.map((order) => (
                                <React.Fragment key={order.id}>
                                    <tr
                                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-400">
                                            {expandedId === order.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-bold text-[#f0312f]">#{String(order.id)}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <p className="font-bold text-gray-800">{order.customer}</p>
                                            <p className="text-xs text-gray-400 font-medium truncate max-w-[180px] sm:max-w-none">{order.email}</p>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{formatOrderDate(order.date)}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-black text-gray-900">Rp {Number(order.total).toLocaleString('id-ID')}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                    {expandedId === order.id && (
                                        <tr className="bg-gray-50/80">
                                            <td colSpan="6" className="px-3 sm:px-6 py-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-bold text-gray-700">Customer details</p>
                                                            <p className="text-gray-600">{order.customer}</p>
                                                            <p className="text-gray-500">{order.email}</p>
                                                            {order.phone && <p className="text-gray-500">{order.phone}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-bold text-gray-700">Address</p>
                                                            {order.address && (order.address.street || order.address.city) ? (
                                                                <>
                                                                    {order.address.street && <p className="text-gray-600">{order.address.street}</p>}
                                                                    <p className="text-gray-500">{[order.address.city, order.address.state, order.address.postalCode, order.address.country].filter(Boolean).join(', ')}</p>
                                                                </>
                                                            ) : <p className="text-gray-500">—</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-start gap-2">
                                                    <Package className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-700 mb-2">Products</p>
                                                        <ul className="space-y-1">
                                                            {(order.products || []).map((item, idx) => (
                                                                <li key={idx} className="text-gray-600 flex flex-wrap gap-x-2 gap-y-0">
                                                                    <span className="font-medium">{item.name || item.title || 'Product'}</span>
                                                                    <span>× {item.quantity ?? 1}</span>
                                                                    <span className="text-gray-500">Rp {Number(item.price ?? 0).toLocaleString('id-ID')}</span>
                                                                </li>
                                                            ))}
                                                            {(!order.products || order.products.length === 0) && <li className="text-gray-500">No items</li>}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-xs text-gray-400">Order date (local): {formatOrderDate(order.date)}</p>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
