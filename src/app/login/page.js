'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                router.push('/');
            } else {
                setErrorMsg(result.message || 'Invalid email or password.');
            }
        } catch (err) {
            setErrorMsg('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-inter">
            <Navbar />
            <main className="flex-grow flex justify-center items-center bg-gray-50 py-12 px-4">
                <div className="w-full max-w-sm p-8 border border-gray-200 rounded-2xl bg-white shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-gray-900">Welcome back</h1>
                        <p className="text-gray-500 text-sm mt-1">Log in to your Enabled account</p>
                    </div>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="text-sm font-bold text-gray-600 block mb-1">
                                Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f0312f] focus:border-[#f0312f] transition-all font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-bold text-gray-600 block mb-1">
                                Password <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f0312f] focus:border-[#f0312f] transition-all font-medium"
                                required
                            />
                        </div>
                        {errorMsg && (
                            <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl">{errorMsg}</p>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#f0312f] text-white rounded-xl hover:bg-red-700 transition font-bold shadow-lg shadow-red-100 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                    <p className="text-center mt-6 text-sm text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-[#f0312f] font-bold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
