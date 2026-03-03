'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { signup } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setErrorMsg('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signup(formData);
            if (result.success) {
                router.push('/');
            } else {
                setErrorMsg(result.message || 'Signup failed. Please try again.');
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
                        <h1 className="text-3xl font-black text-gray-900">Create account</h1>
                        <p className="text-gray-500 text-sm mt-1">Join the Enabled community</p>
                    </div>
                    <form onSubmit={handleSignup} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="name" className="text-sm font-bold text-gray-600 block mb-1">
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f0312f] focus:border-[#f0312f] transition-all font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm font-bold text-gray-600 block mb-1">
                                Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
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
                                name="password"
                                id="password"
                                placeholder="Min. 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f0312f] focus:border-[#f0312f] transition-all font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="text-sm font-bold text-gray-600 block mb-1">
                                Confirm Password <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Repeat password"
                                value={formData.confirmPassword}
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
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="text-center mt-6 text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#f0312f] font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
