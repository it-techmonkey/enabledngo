'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronLeft, Lightbulb } from 'lucide-react';

const DONATION_AMOUNTS = [
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 200.000', value: 200000 },
    { label: 'Rp 500.000', value: 500000 }
];
const MIN_AMOUNT = 50000;

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
        .format(amount).replace('IDR', 'Rp').trim();
}

export default function DonatePage() {
    const router = useRouter();
    const params = useParams();
    const childId = params.id;

    const [child, setChild] = useState(null);
    const [childLoading, setChildLoading] = useState(true);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [customAmount, setCustomAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetch('/api/children', { cache: 'no-store' })
            .then((r) => r.json())
            .then((data) => {
                const found = Array.isArray(data)
                    ? data.find((c) => String(c.id) === String(childId))
                    : null;
                if (!found) router.push('/be-a-donor');
                else setChild(found);
            })
            .catch(() => router.push('/be-a-donor'))
            .finally(() => setChildLoading(false));
    }, [childId, router]);

    if (childLoading) return (
        <div className="font-sans flex flex-col min-h-screen font-inter">
            <Navbar />
            <main className="flex-grow flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#f0312f] border-t-transparent rounded-full" />
            </main>
            <Footer />
        </div>
    );
    if (!child) return null;

    const effectiveAmount = customAmount ? parseInt(customAmount) : selectedAmount;

    const handleAmountSelect = (val) => {
        setSelectedAmount(val);
        setCustomAmount('');
    };

    const handleCustomAmount = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        setCustomAmount(val);
        if (val) setSelectedAmount(0);
    };

    const isFormValid = () => {
        return effectiveAmount >= MIN_AMOUNT && form.name.trim() && form.email.trim() && form.phone.trim();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = [];
        if (!effectiveAmount || effectiveAmount < MIN_AMOUNT) errs.push(`Minimum donation is ${formatRupiah(MIN_AMOUNT)}`);
        if (!form.name.trim()) errs.push('Name is required');
        if (!form.email.trim()) errs.push('Email is required');
        if (!form.phone.trim()) errs.push('Phone number is required');
        if (errs.length > 0) { setErrors(errs); return; }

        setIsSubmitting(true);
        setErrors([]);

        const durationLabel = duration === '1' ? '1 Month'
            : duration === '3' ? '3 Months'
            : duration === '6' ? '6 Months'
            : duration === '12' ? '12 Months (1 Year)'
            : 'One-time';

        const totalAmount = duration ? effectiveAmount * parseInt(duration) : effectiveAmount;

        const payload = {
            // Donor details
            name: form.name,
            email: form.email,
            phone: form.phone,
            // Child details
            child_id: child.id,
            child_name: child.name,
            child_age: child.age,
            child_domicile: child.domicile,
            child_image: child.image,
            // Donation details
            amount: effectiveAmount,
            duration: durationLabel,
            total_amount: totalAmount,
            submitted_at: new Date().toISOString(),
        };

        try {
            const res = await fetch('/api/donor-registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Submission failed');
            setSubmitted(true);
            setTimeout(() => router.push('/be-a-donor'), 4000);
        } catch {
            setErrors(['Something went wrong. Please try again.']);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="font-sans flex flex-col min-h-screen font-inter">
                <Navbar />
                <main className="flex-grow bg-gray-50 flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Submitted!</h2>
                        <p className="text-gray-600">Thank you, <strong>{form.name}</strong>! Your donation for <strong>{child.name}</strong> has been recorded. Our team will reach out to you shortly.</p>
                        <p className="text-sm text-gray-400 mt-4">Redirecting you back...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="font-sans">
            <div className="flex flex-col min-h-screen font-inter">
                <Navbar />
                <main className="flex-grow bg-gray-50">
                    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        {/* Back button */}
                        <button
                            onClick={() => router.push('/be-a-donor')}
                            className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors min-h-[44px]"
                        >
                            <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden />
                            Back to Children
                        </button>

                        {/* Validation errors */}
                        {errors.length > 0 && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Please fix the following:</h3>
                                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                                            {errors.map((err, i) => <li key={i}>{err}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Child summary card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                            <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-48 w-full flex-shrink-0">
                                    <img src={child.image} alt={child.name} className="w-full h-48 sm:h-full object-cover" />
                                </div>
                                <div className="flex-1 p-4 sm:p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{child.name}</h2>
                                    <p className="text-sm text-gray-700 mb-2">
                                        <span className="font-semibold">Age:</span> {child.age}{' '}
                                        <span className="mx-1">|</span>{' '}
                                        <span className="font-semibold">Domicile:</span> {child.domicile}
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">{child.description}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Donation Amount */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Select Donation Amount</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                    {DONATION_AMOUNTS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleAmountSelect(opt.value)}
                                            className={`p-3 sm:p-4 border-2 rounded-lg font-semibold transition-all ${selectedAmount === opt.value && !customAmount
                                                    ? 'border-[#F0312F] bg-[#F0312F] text-white'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:border-[#F0312F] hover:bg-red-50'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Or Enter Custom Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">Rp</span>
                                        <input
                                            type="text"
                                            value={customAmount}
                                            onChange={handleCustomAmount}
                                            placeholder={`Minimum ${formatRupiah(MIN_AMOUNT)}`}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0312F] focus:border-transparent"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Minimum donation: {formatRupiah(MIN_AMOUNT)}</p>
                                </div>
                            </div>

                            {/* Donation Duration */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Donation</h3>
                                <div className="space-y-3">
                                    {[
                                        { value: '1', label: '(1 Month)', months: 1 },
                                        { value: '3', label: '(3 Months)', months: 3 },
                                        { value: '6', label: '(6 Months)', months: 6 },
                                        { value: '12', label: '(12 Months)', months: 12 }
                                    ].map(opt => (
                                        <label key={opt.value} className="flex items-center cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="duration"
                                                value={opt.value}
                                                checked={duration === opt.value}
                                                onChange={e => setDuration(e.target.value)}
                                                className="w-5 h-5 text-[#F0312F] border-gray-300 focus:ring-[#F0312F] focus:ring-2"
                                            />
                                            <span className="ml-3 text-base text-gray-700 group-hover:text-gray-900">
                                                {opt.label} {formatRupiah(effectiveAmount * opt.months)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
                                    <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-500" aria-hidden />
                                    Select a duration to support {child.name} over multiple months
                                </p>
                            </div>

                            {/* Donor Information – guest only; no login required */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Information</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Enter your details below to complete the donation. No account required.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0312F] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0312F] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="Enter your phone number"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0312F] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                    By proceeding, you agree to our{' '}
                                    <a href="#" className="text-[#F0312F] hover:underline">Terms of Use</a>,{' '}
                                    <a href="#" className="text-[#F0312F] hover:underline">Privacy Policy</a>, and{' '}
                                    <a href="#" className="text-[#F0312F] hover:underline">Safeguarding Policy</a>.{' '}
                                    Your donation will help provide essential support to children in need.
                                </p>
                                <button
                                    type="submit"
                                    disabled={!isFormValid() || isSubmitting}
                                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${isFormValid() && !isSubmitting
                                            ? 'bg-[#F0312F] text-white hover:bg-red-700 cursor-pointer'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT DONATION'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
