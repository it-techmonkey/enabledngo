'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingCart, FileText, ArrowRight, ChevronLeft, Minus, Plus, Shield } from 'lucide-react';

const DEFAULT_MAX_QUANTITY = 9;

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useCart();
  const [quantityMessage, setQuantityMessage] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRemoveItem = (id) => removeFromCart(id);
  const handleUpdateQuantity = (id, currentQty, delta, maxQty = DEFAULT_MAX_QUANTITY) => {
    const cap = maxQty ?? DEFAULT_MAX_QUANTITY;
    const newQty = currentQty + delta;
    if (newQty > cap) {
      setQuantityMessage(`Maximum quantity for this item is ${cap}.`);
      setTimeout(() => setQuantityMessage(null), 3000);
      return;
    }
    if (newQty >= 1) updateQuantity(id, newQty);
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#fafafa] font-inter">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Page header */}
          <div className="mb-8">
            <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Cart</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-gray-500 mt-1">
              {cartItems.length > 0
                ? `${cartItems.length} item${cartItems.length === 1 ? '' : 's'} in your cart`
                : 'Your cart is empty'}
            </p>
          </div>

          {quantityMessage && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium" role="alert">
              {quantityMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Cart items column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="py-16 px-6 sm:py-20 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <ShoppingCart className="w-10 h-10 text-gray-400" aria-hidden />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                      Add items from the Impact Shop to support our mission. Every purchase helps.
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center justify-center gap-2 bg-[#f0312f] text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-all min-h-[48px] shadow-lg shadow-red-100/50"
                    >
                      <ShoppingCart className="w-4 h-4" aria-hidden />
                      Continue to Impact Shop
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => {
                    if (!item) return null;
                    const lineTotal = (item.price || 0) * (item.quantity || 1);
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="w-full sm:w-28 shrink-0 flex flex-col gap-2">
                          <div className="h-40 sm:h-28 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                            <img
                              src={item.image || '/Girly.png'}
                              alt={item.name}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => { e.target.src = '/Girly.png'; }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty (max {item.maxQuantity ?? DEFAULT_MAX_QUANTITY})</span>
                            <div className="inline-flex items-center border-2 border-gray-200 rounded-xl bg-gray-50/80 overflow-hidden w-fit">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity || 1, -1, item.maxQuantity)}
                                disabled={(item.quantity || 1) <= 1}
                                className="p-2 sm:p-2.5 hover:bg-white transition-colors text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 sm:w-10 text-center font-bold text-gray-900 tabular-nums text-sm">
                                {item.quantity || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity || 1, 1, item.maxQuantity)}
                                disabled={(item.quantity || 1) >= (item.maxQuantity ?? DEFAULT_MAX_QUANTITY)}
                                className="p-2 sm:p-2.5 hover:bg-white transition-colors text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                              {formatCurrency(item.price)} each
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 px-3 py-2 rounded-lg transition-colors"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="sm:text-right flex justify-between sm:block items-center sm:items-end">
                          <span className="sm:hidden text-gray-500 text-sm">Subtotal</span>
                          <p className="text-lg font-bold text-[#f0312f] tabular-nums">
                            {formatCurrency(lineTotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Order notes */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-500 shrink-0" aria-hidden />
                      Order notes
                    </h3>
                    <textarea
                      placeholder="Special instructions, delivery notes, or a message for the recipient…"
                      className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f0312f]/20 focus:border-[#f0312f] text-sm resize-none transition-shadow h-24"
                      rows={3}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => router.push('/products')}
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all min-h-[48px]"
                    >
                      <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden />
                      Continue shopping
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Remove all items from your cart? This cannot be undone.')) clearCart();
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50/50 transition-all min-h-[48px]"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" aria-hidden />
                      Empty cart
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Order summary sidebar */}
            {cartItems.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                  <div className="p-6 sm:p-7 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                      Order summary
                    </h2>
                  </div>
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-900 tabular-nums">{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-500">Calculated at checkout</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-[#f0312f] tabular-nums">{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-7 pt-0 space-y-4">
                    {user ? (
                      <button
                        type="button"
                        onClick={() => router.push('/billing')}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#f0312f] hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all min-h-[52px] shadow-lg shadow-red-100/50"
                      >
                        Proceed to checkout
                        <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
                      </button>
                    ) : (
                      <>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                          <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden />
                          <p className="text-sm text-amber-800 font-medium">
                            Sign in to complete your order and save your details for next time.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => router.push('/login')}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#f0312f] hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all min-h-[52px]"
                        >
                          Sign in to checkout
                        </button>
                      </>
                    )}
                  </div>
                  <div className="px-6 sm:px-7 pb-6 flex flex-wrap justify-center gap-3">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Secure payment</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">Visa, Mastercard, bank transfer</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
