'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Calendar, RefreshCw, IndianRupee, Clock } from 'lucide-react';

export default function AdminDonorRegistrationsPage() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDonations();
    }, []);

    useEffect(() => {
        const onFocus = () => fetchDonations(true);
        window.addEventListener('focus', onFocus);
        const onVisibility = () => { if (document.visibilityState === 'visible') fetchDonations(true); };
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    const fetchDonations = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const res = await fetch('/api/donor-registrations', { cache: 'no-store' });
            const data = await res.json();
            setDonations(Array.isArray(data) ? data.slice().reverse() : []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filtered = donations.filter((d) => {
        const q = search.toLowerCase();
        return (
            d.name?.toLowerCase().includes(q) ||
            d.email?.toLowerCase().includes(q) ||
            d.phone?.includes(q) ||
            d.child_name?.toLowerCase().includes(q)
        );
    });

    const formatDate = (iso) => {
        if (!iso) return '—';
        try {
            return new Date(iso).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        } catch {
            return iso;
        }
    };

    const formatRupiah = (amount) => {
        if (!amount) return '—';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
            .format(amount).replace('IDR', 'Rp').trim();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Donor Registrations</h2>
                    <p className="text-gray-400 font-medium text-sm mt-1">
                        {loading ? 'Loading...' : `${donations.length} donation${donations.length !== 1 ? 's' : ''} submitted from the website`}
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <input
                            type="text"
                            placeholder="Search by donor, child, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#f0312f] transition-all"
                        />
                    </div>
                    <button
                        onClick={() => fetchDonations(true)}
                        disabled={refreshing}
                        className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center text-gray-400 font-medium">
                    Loading donations...
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
                    <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">
                        {search
                            ? 'No donations match your search.'
                            : 'No donations yet. They will appear here once someone submits the donation form on the website.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((d) => (
                        <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row">

                                {/* Child panel */}
                                <div className="md:w-56 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center justify-center p-5 gap-3 shrink-0">
                                    {d.child_image ? (
                                        <img
                                            src={d.child_image}
                                            alt={d.child_name}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center border-2 border-white shadow">
                                            <Users className="w-8 h-8 text-red-200" />
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Donating to</p>
                                        <p className="font-black text-gray-800 text-sm leading-tight">{d.child_name || '—'}</p>
                                        {d.child_age && (
                                            <p className="text-xs text-gray-400 mt-0.5">Age {d.child_age} · {d.child_domicile}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Details panel */}
                                <div className="flex-1 p-5 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                        {/* Donor identity */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                                <span className="text-[#f0312f] font-black text-base">
                                                    {d.name?.[0]?.toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800">{d.name || '—'}</p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 shrink-0" />
                                                    {formatDate(d.submitted_at)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Donation amount badge */}
                                        <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                                                <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                                                <span className="font-black text-sm">{formatRupiah(d.amount)}</span>
                                                <span className="text-xs font-medium text-green-500">/mo</span>
                                            </div>
                                            {d.duration && d.duration !== 'One-time' && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3 shrink-0" />
                                                    <span>{d.duration}</span>
                                                    {d.total_amount && (
                                                        <span className="text-gray-400">· Total {formatRupiah(d.total_amount)}</span>
                                                    )}
                                                </div>
                                            )}
                                            {d.duration === 'One-time' && (
                                                <span className="text-xs text-gray-400">One-time donation</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="truncate">{d.email || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span>{d.phone || '—'}</span>
                                        </div>
                                        {d.city && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                <span>{d.city}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
