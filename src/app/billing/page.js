'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function BillingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        phone: "",
        email: user?.email || "",
        apartment: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        saveInfo: true
    });

    // Update form when user data becomes available (e.g. after mount/refresh)
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || user.name || "",
                email: prev.email || user.email || ""
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!user) {
            alert("Please log in to place an order.");
            router.push('/login');
            return;
        }

        setIsSubmitting(true);
        const address = {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            street: `${formData.apartment ? formData.apartment + ", " : ""}${formData.street}`,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: "Indonesia"
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user._id, // Secure attribution
                    address,
                    products: cartItems,
                    totalPrice: cartTotal
                })
            });

            if (res.ok) {
                alert("✅ Order placed successfully!");
                clearCart();
                router.push('/orders');
            } else {
                const data = await res.json();
                alert(`❌ Error: ${data.error || "Failed to place order"}`);
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("❌ An error occurred while placing your order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full p-3 rounded bg-[#f5f5f5] border border-transparent focus:border-[#3455b9] focus:bg-white outline-none transition-all";
    const labelClasses = "text-sm text-[#999099] font-medium mb-1 block";

    return (
        <div className="font-sans">
            <div className="flex flex-col min-h-screen font-inter">
                <Navbar />
                <main className="flex-grow bg-[#fafafa] py-10 px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Breadcrumbs */}
                        <div className="mb-8 text-sm text-gray-500">
                            <span className="text-gray-400">Account / My Account / Product / CheckOut / </span>
                            <span className="text-gray-900 font-medium">Billing Details</span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Billing Form */}
                            <div className="lg:w-1/2">
                                <h2 className="text-3xl font-bold mb-8 text-gray-800">Billing Details</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className={labelClasses}>
                                            Full Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Street Address <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            required
                                            placeholder="House number and street name"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Apartment, floor, etc. (optional)
                                        </label>
                                        <input
                                            name="apartment"
                                            value={formData.apartment}
                                            onChange={handleChange}
                                            className={inputClasses}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Town/City <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Phone Number <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            required
                                            type="tel"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Email Address <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            required
                                            type="email"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="saveInfo"
                                            id="saveInfo"
                                            checked={formData.saveInfo}
                                            onChange={handleChange}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                        <label htmlFor="saveInfo" className="text-sm text-gray-700 cursor-pointer">
                                            Save this information for faster check-out next time
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto px-10 py-4 bg-[#db4444] hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded shadow-md transition-all active:scale-95 mt-4 flex items-center justify-center gap-2 min-h-[48px]"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden />
                                                Placing order…
                                            </>
                                        ) : (
                                            'Place Order'
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Order Summary (Visual only for now) */}
                            <div className="lg:w-1/2 flex flex-col justify-center">
                                <div className="bg-white p-6 sm:p-10 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold mb-6 text-gray-800">Your Order</h3>
                                    <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-[10px] font-bold">{item.quantity}x</span>
                                                    <span className="text-gray-700 truncate max-w-[150px]">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-gray-900">Rp {((item.price || 0) * (item.quantity || 1)).toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between pb-2 border-b border-gray-100">
                                            <span className="text-gray-600">Product Total</span>
                                            <span className="font-bold text-[#f0312f]">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between pb-2 border-b border-gray-100">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                        {/* Payment Methods */}
                                        <div className="py-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <input type="radio" name="payment" id="bank" checked readOnly className="w-4 h-4" />
                                                    <label htmlFor="bank" className="font-medium">Bank Transfer</label>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold">VISA</div>
                                                    <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold">MASTER</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="payment" id="cod" disabled className="w-4 h-4" />
                                                <label htmlFor="cod" className="text-gray-400">Cash on delivery (Indonesia only)</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
