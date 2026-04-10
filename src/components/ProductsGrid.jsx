'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ProductsGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data.slice(0, 4)); // Show top 4 on home
                setLoading(false);
            })
            .catch(err => {
                console.error('Products fetch error:', err);
                setLoading(false);
            });
    }, []);

    return (
        <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-20 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Available Products</h2>
                        <p className="text-gray-500 mt-1">Support our mission by shopping our Impact Shop</p>
                    </div>
                    <Link
                        href="/products"
                        className="bg-[#f0312f] text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                    >
                        View Impact Shop
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl p-4 h-80 animate-pulse border border-gray-100">
                                <div className="bg-gray-100 w-full h-40 rounded-2xl mb-4"></div>
                                <div className="bg-gray-100 h-4 w-3/4 rounded mb-2"></div>
                                <div className="bg-gray-100 h-4 w-1/2 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100">
                        <p className="text-gray-400 font-bold">No products currently available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href="/products"
                                className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300"
                            >
                                <div className="aspect-[4/3] bg-gray-50 p-6 overflow-hidden relative">
                                    <img
                                        src={product.image || '/Girly.png'}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => e.target.src = '/Girly.png'}
                                    />
                                    {product.status === 'Available' && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg shadow-green-100">
                                                Available
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-[#f0312f] transition-colors truncate">
                                            {product.name}
                                        </h3>
                                        {product.category && (
                                            <span className="text-[8px] bg-red-50 text-[#f0312f] px-1.5 py-0.5 rounded font-black uppercase shrink-0">
                                                {product.category}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[#f0312f] font-semibold text-lg">
                                        Rp {Number(product.price).toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-[10px] text-gray-500 font-semibold mt-2 uppercase tracking-widest flex items-center gap-0.5">
                                        Details
                                        <ChevronRight className="w-3 h-3 shrink-0" aria-hidden />
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
