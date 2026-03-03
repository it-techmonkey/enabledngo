'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@enabled.ngo',
    password: 'enabled@2024'
};

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                sessionStorage.setItem('admin_token', 'enabled_admin_authenticated');
                sessionStorage.setItem('admin_email', email);
                router.push('/admin');
            } else {
                setError('Invalid credentials. Please try again.');
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#f0312f]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f0312f] rounded-2xl mb-4 shadow-2xl shadow-red-900/50">
                        <span className="text-2xl font-black text-white">E</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Enabled Admin</h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Sign in to access the control panel</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@enabled.ngo"
                                required
                                className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#f0312f] focus:border-[#f0312f] transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                required
                                className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#f0312f] focus:border-[#f0312f] transition-all font-medium"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-medium p-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#f0312f] hover:bg-red-600 text-white rounded-2xl font-black text-base shadow-xl shadow-red-900/40 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In to Admin Panel'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-xs text-slate-500 text-center font-medium flex items-center justify-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden />
                            This panel is restricted to authorized administrators only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
