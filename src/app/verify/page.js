'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail } from 'lucide-react';

export default function VerifyPage() {
    return (
        <div className="font-sans">
            <div className="flex flex-col min-h-screen font-inter">
                <Navbar />
                <main className="flex-grow flex items-center justify-center bg-[#fafafa] py-12 px-4">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-10 text-center flex flex-col items-center gap-6 border border-gray-100">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                            <Mail className="w-8 h-8 text-[#f0312f]" aria-hidden />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            Please verify your email
                        </h1>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Check your inbox for the verification link. Once verified, you'll have full access to our community platform.
                        </p>
                        <div className="pt-6 w-full">
                            <Link
                                href="/"
                                className="inline-block w-full py-3 px-6 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                            >
                                Go Back Home
                            </Link>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                            Didn't receive the email? <button className="text-[#3455b9] font-bold hover:underline">Resend Link</button>
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
