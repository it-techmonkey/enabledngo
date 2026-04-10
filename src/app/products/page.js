'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { FileDown, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8;
const PRODUCTS_CACHE_KEY = 'enabledngo_products_cache_v1';

export default function ProductsPage() {
  const { addToCart, cartCount } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [addedToast, setAddedToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Fetch products via our proxy API to avoid CORS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cached = sessionStorage.getItem(PRODUCTS_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length) {
            setAllProducts(parsed);
            setLoading(false);
          }
        } else {
          setLoading(true);
        }
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        // Handle both array and { products: [] } shaped responses
        const normalized = Array.isArray(data) ? data : (data.products || data.data || []);
        setAllProducts(normalized);
        sessionStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(normalized));
      } catch (err) {
        console.error('Products fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter + sort
  const filteredProducts = allProducts
    .filter((p) => {
      const q = searchTerm.toLowerCase();
      return (
        (p.name || p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const nameA = (a.name || a.title || '').toLowerCase();
      const nameB = (b.name || b.title || '').toLowerCase();
      if (sortOrder === 'asc') return nameA.localeCompare(nameB);
      if (sortOrder === 'desc') return nameB.localeCompare(nameA);
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    const name = product.name || product.title || 'Item';
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setAddedToast(name);
    toastTimeoutRef.current = setTimeout(() => {
      setAddedToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col min-h-screen font-inter">
        <Navbar />
        {/* Floating cart FAB – mobile only, always visible */}
        <a
          href="/cart"
          className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#f0312f] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all"
          aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-white text-[#f0312f] text-xs font-bold rounded-full border-2 border-[#f0312f]">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </a>
        {/* Added to cart toast */}
        {addedToast && (
          <div
            role="alert"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#f0312f] text-white text-sm font-semibold rounded-lg shadow-lg whitespace-nowrap max-w-[calc(100vw-2rem)] overflow-hidden text-ellipsis"
          >
            &quot;{addedToast}&quot; added to cart
          </div>
        )}
        <main className="flex-grow overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 pb-16">
            {/* Search and Sort Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 w-full">
              <input
                placeholder="Search by name, category, or description..."
                className="w-full sm:flex-1 min-h-[44px] px-4 py-3 border-2 border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f0312f] focus:border-[#f0312f] transition-all"
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search products"
              />
              <select
                className="w-full sm:w-auto sm:min-w-[140px] min-h-[44px] pl-4 pr-10 py-3 border-2 border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f0312f] bg-white hover:border-[#f0312f] transition-all cursor-pointer appearance-none bg-no-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23222' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundSize: '1.25rem',
                  backgroundPosition: 'right 0.75rem center',
                }}
                value={sortOrder}
                onChange={handleSort}
                aria-label="Sort products"
              >
                <option value="default">Default</option>
                <option value="asc">A-Z (Alphabetical)</option>
                <option value="desc">Z-A (Reverse)</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-3 p-4 rounded-xl shadow-sm">
                    <div className="bg-gray-300 h-40 w-full rounded-md"></div>
                    <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                    <div className="bg-gray-300 h-10 w-full rounded-md mt-2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <p className="text-red-500 text-lg font-semibold mb-2">Could not load products</p>
                <p className="text-gray-500 text-sm">{error}</p>
                <button
                  className="mt-4 bg-[#f0312f] text-white px-6 py-2 rounded hover:bg-red-700 transition"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No products found matching &quot;{searchTerm}&quot;</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {paginatedProducts.map((product, idx) => {
                      const isNew = product.createdAt
                        ? Date.now() - new Date(product.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
                        : false;
                      return (
                      <div
                        key={product._id || product.id || idx}
                        className="group flex flex-col rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 bg-white relative"
                      >
                        <div className="relative aspect-video overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                          <img
                            src={product.image || product.imageUrl || '/Girly.png'}
                            alt={product.name || product.title || 'Product'}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => { e.target.src = '/Girly.png'; }}
                          />
                          {isNew && (
                            <span className="absolute top-2 left-2 bg-[#f0312f] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col flex-grow p-4 gap-2">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-[#f0312f] transition-colors flex-1">
                              {product.name || product.title || 'Product'}
                            </h3>
                            {product.category && (
                              <span className="text-[9px] bg-red-50 text-[#f0312f] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shrink-0">
                                {product.category}
                              </span>
                            )}
                          </div>

                          {product.price !== undefined && (
                            <p className="text-[#f0312f] font-black text-lg">
                              Rp {Number(product.price).toLocaleString('id-ID')}
                            </p>
                          )}

                          {product.description && (
                            <p className="text-gray-500 text-xs line-clamp-2 font-medium leading-relaxed">{product.description}</p>
                          )}

                          {/* Features Preview */}
                          {product.features && product.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.features.slice(0, 2).map((feature, i) => (
                                <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                                  {feature}
                                </span>
                              ))}
                              {product.features.length > 2 && <span className="text-[10px] text-gray-400">+{product.features.length - 2} more</span>}
                            </div>
                          )}

                          <div className="mt-auto pt-4 space-y-2">
                            {(product.status === 'Out of Stock' || product.inStock === false) ? (
                              <div className="w-full py-3 rounded-xl bg-gray-200 text-gray-500 font-black text-sm text-center cursor-not-allowed">
                                Out of Stock
                              </div>
                            ) : (
                              <button
                                className="w-full bg-[#f0312f] text-white py-3 rounded-xl hover:bg-red-700 transition font-black text-sm shadow-lg shadow-red-100 active:scale-95"
                                onClick={() => handleAddToCart(product)}
                              >
                                Add to Cart
                              </button>
                            )}

                            {product.pdfFile && (
                              <button
                                className="w-full bg-white text-[#3455b9] border border-blue-100 py-2.5 rounded-xl hover:bg-blue-50 transition font-bold text-xs flex items-center justify-center gap-2 min-h-[44px]"
                                onClick={() => window.open(product.pdfFile, '_blank')}
                              >
                                <FileDown className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                DOWNLOAD PDF
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}

                {/* Previous / Next Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                      className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed font-medium min-h-[44px] flex items-center gap-1"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                    >
                      <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden />
                      Previous
                    </button>
                    <span className="text-gray-600 text-sm px-2">
                      Page {safePage} of {totalPages}
                    </span>
                    <button
                      className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed font-medium min-h-[44px] flex items-center gap-1"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
