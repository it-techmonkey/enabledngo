'use client';

import { useState, useEffect, useRef } from 'react';
import { Pencil, Trash2, X, ImagePlus, Search, RefreshCw } from 'lucide-react';

const EMPTY_PRODUCT = {
    name: '',
    price: '',
    category: '',
    status: 'Available',
    image: '',
    description: '',
    features: '',
    quantity: '1',
    inStock: true,
};

const inputCls = 'w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#f0312f] transition-all font-medium';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Add modal
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
    const [addImagePreview, setAddImagePreview] = useState('');
    const [addQtyError, setAddQtyError] = useState('');
    const addFileRef = useRef(null);

    // Edit modal
    const [editProduct, setEditProduct] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');
    const [editQtyError, setEditQtyError] = useState('');
    const editFileRef = useRef(null);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const res = await fetch('/api/admin/products', { cache: 'no-store' });
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /* ── helpers ── */
    const toBase64 = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });

    const validateQty = (raw) => {
        const val = raw === '' ? '' : parseInt(raw, 10);
        return val !== '' && (val < 1 || val > 99) ? 'Max cart quantity must be between 1 and 99' : '';
    };

    /* ── ADD ── */
    const handleAddImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const b64 = await toBase64(file);
        setAddImagePreview(b64);
        setNewProduct((p) => ({ ...p, image: b64 }));
    };

    const handleAddQtyChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        setAddQtyError(validateQty(raw));
        setNewProduct((p) => ({ ...p, quantity: raw }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (addQtyError) return;
        const processed = {
            ...newProduct,
            features: newProduct.features.split(',').map((f) => f.trim()).filter(Boolean),
            price: Number(newProduct.price),
            quantity: Number(newProduct.quantity),
            createdAt: new Date().toISOString(),
        };
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processed),
            });
            if (res.ok) {
                closeAdd();
                fetchProducts();
                setSuccessMessage('Product added successfully.');
                setTimeout(() => setSuccessMessage(''), 2500);
            }
        } catch (err) { console.error('Add error:', err); }
    };

    const closeAdd = () => {
        setIsAddOpen(false);
        setNewProduct(EMPTY_PRODUCT);
        setAddImagePreview('');
        setAddQtyError('');
        if (addFileRef.current) addFileRef.current.value = '';
    };

    /* ── EDIT ── */
    const openEdit = (product) => {
        setEditProduct({
            ...product,
            price: String(product.price ?? ''),
            quantity: String(product.quantity ?? '1'),
            features: Array.isArray(product.features) ? product.features.join(', ') : (product.features || ''),
        });
        setEditImagePreview(product.image || '');
        setEditQtyError('');
    };

    const handleEditImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const b64 = await toBase64(file);
        setEditImagePreview(b64);
        setEditProduct((p) => ({ ...p, image: b64 }));
    };

    const handleEditQtyChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        setEditQtyError(validateQty(raw));
        setEditProduct((p) => ({ ...p, quantity: raw }));
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        if (editQtyError) return;
        const processed = {
            ...editProduct,
            features: typeof editProduct.features === 'string'
                ? editProduct.features.split(',').map((f) => f.trim()).filter(Boolean)
                : editProduct.features,
            price: Number(editProduct.price),
            quantity: Number(editProduct.quantity),
        };
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processed),
            });
            if (res.ok) {
                closeEdit();
                fetchProducts();
                setSuccessMessage('Product updated successfully.');
                setTimeout(() => setSuccessMessage(''), 2500);
            }
        } catch (err) { console.error('Edit error:', err); }
    };

    const closeEdit = () => {
        setEditProduct(null);
        setEditImagePreview('');
        setEditQtyError('');
        if (editFileRef.current) editFileRef.current.value = '';
    };

    /* ── DELETE ── */
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        const id = deleteTarget.id ?? deleteTarget._id;
        if (id == null) {
            console.error('Delete error: product has no id');
            return;
        }
        setIsDeleting(true);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setDeleteTarget(null);
                fetchProducts();
                setSuccessMessage('Product deleted successfully.');
                setTimeout(() => setSuccessMessage(''), 2500);
            } else {
                const errData = await res.json().catch(() => ({}));
                console.error('Delete error:', errData?.error || res.statusText);
            }
        } catch (err) { console.error('Delete error:', err); }
        finally { setIsDeleting(false); }
    };

    /* ── shared form fields renderer ── */
    const renderFormFields = (product, setProduct, imgPreview, setImgPreview, fileRef, onImgUpload, qtyError, onQtyChange, isEdit) => (
        <>
            {/* Image */}
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    Product Image <span className="text-[#f0312f]">*</span>
                </label>
                <div
                    className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#f0312f] hover:bg-red-50 transition-all"
                    onClick={() => fileRef.current?.click()}
                >
                    {imgPreview ? (
                        <div className="relative w-full flex items-center justify-center">
                            <img src={imgPreview} alt="Preview" className="max-h-40 object-contain rounded-lg" />
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setImgPreview(''); setProduct((p) => ({ ...p, image: '' })); if (fileRef.current) fileRef.current.value = ''; }}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <ImagePlus className="w-8 h-8 text-gray-300" />
                            <p className="text-sm text-gray-400 font-medium">{isEdit ? 'Click to replace image' : 'Click to upload image'}</p>
                            <p className="text-xs text-gray-300">PNG, JPG, WEBP supported</p>
                        </>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImgUpload} />
            </div>

            {/* Name + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Product Name <span className="text-[#f0312f]">*</span></label>
                    <input required className={inputCls} value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} placeholder="e.g. Sterimar nose hygiene" />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Category <span className="text-[#f0312f]">*</span></label>
                    <input required className={inputCls} value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} placeholder="e.g. Medical Supplies" />
                </div>
            </div>

            {/* Price + Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Price (Rp) <span className="text-[#f0312f]">*</span></label>
                    <input required type="number" min="0" className={inputCls} value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} placeholder="e.g. 150000" />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                        Max cart quantity <span className="text-[#f0312f]">*</span>
                        <span className="ml-1 text-gray-300 font-medium normal-case">(max a user can add per product, 1–99)</span>
                    </label>
                    <input
                        required type="number" min="1" max="99"
                        className={`w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-medium ${qtyError ? 'border-red-400 focus:ring-red-200 focus:border-red-500' : 'border-gray-100 focus:ring-red-100 focus:border-[#f0312f]'}`}
                        value={product.quantity}
                        onChange={onQtyChange}
                        placeholder="1 – 99"
                    />
                    {qtyError && <p className="mt-1 ml-1 text-xs text-red-500 font-bold">{qtyError}</p>}
                </div>
            </div>

            {/* Status: Add modal shows only Available; Edit modal shows Available + Out of Stock (no Discontinued) */}
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Status</label>
                <select className={inputCls} value={product.status} onChange={(e) => setProduct({ ...product, status: e.target.value })}>
                    <option value="Available">Available</option>
                    {isEdit && <option value="Out of Stock">Out of Stock</option>}
                </select>
            </div>

            {/* Features */}
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    Product Features <span className="text-gray-300 font-medium normal-case">(comma-separated, optional)</span>
                </label>
                <input className={inputCls} value={product.features} onChange={(e) => setProduct({ ...product, features: e.target.value })} placeholder="e.g. Waterproof, 2 Year Warranty, Portable" />
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Description <span className="text-[#f0312f]">*</span></label>
                <textarea required className={`${inputCls} h-24 resize-none`} value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} placeholder="Brief description of the product..." />
            </div>
        </>
    );

    const filteredProducts = products.filter((product) => {
        const q = search.trim().toLowerCase();
        const productStatus = product.status === 'Available' ? 'available' : 'out';
        const searchOk = !q || [
            product.name,
            product.category,
            product.description,
        ].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
        const statusOk = statusFilter === 'all' || statusFilter === productStatus;
        return searchOk && statusOk;
    });

    return (
        <div className="space-y-6">
            {successMessage && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-semibold">
                    {successMessage}
                </div>
            )}
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="min-w-0">
                    <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Manage Products</h2>
                    <p className="text-gray-500 text-sm mt-1">{filteredProducts.length} of {products.length} products</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <div className="relative sm:w-72">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#f0312f]"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#f0312f]"
                    >
                        <option value="all">All status</option>
                        <option value="available">Available</option>
                        <option value="out">Out of Stock</option>
                    </select>
                    <button
                        onClick={() => fetchProducts(true)}
                        disabled={refreshing}
                        className="px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                        title="Refresh list"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
                    </button>
                    <button onClick={() => setIsAddOpen(true)} className="bg-[#f0312f] text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold whitespace-nowrap">
                        + Add New Product
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/80 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Qty</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">Loading products...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">No products found.</td></tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product.id || product._id || product.name} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                                <img src={product.image} alt="" className="w-full h-full object-contain" onError={(e) => e.target.src = '/Girly.png'} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-800 truncate max-w-[280px]">{product.name}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[280px]">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{product.category}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{product.quantity ?? '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${product.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(product)}
                                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                aria-label="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(product)}
                                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                aria-label="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── ADD PRODUCT MODAL ── */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 py-8">
                        <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-gray-800">Add New Product</h3>
                                <button onClick={closeAdd} className="text-gray-400 hover:text-gray-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg" aria-label="Close">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleAddProduct} className="space-y-4">
                                {renderFormFields(newProduct, setNewProduct, addImagePreview, setAddImagePreview, addFileRef, handleAddImageUpload, addQtyError, handleAddQtyChange, false)}
                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={closeAdd} className="flex-1 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]">Cancel</button>
                                    <button type="submit" disabled={!!addQtyError || !addImagePreview} className="flex-1 bg-[#f0312f] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">Add Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── EDIT PRODUCT MODAL ── */}
            {editProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 py-8">
                        <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-gray-800">Edit Product</h3>
                                <button onClick={closeEdit} className="text-gray-400 hover:text-gray-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg" aria-label="Close">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleEditSave} className="space-y-4">
                                {renderFormFields(editProduct, setEditProduct, editImagePreview, setEditImagePreview, editFileRef, handleEditImageUpload, editQtyError, handleEditQtyChange, true)}
                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={closeEdit} className="flex-1 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]">Cancel</button>
                                    <button type="submit" disabled={!!editQtyError || !editImagePreview} className="flex-1 bg-[#f0312f] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DELETE CONFIRMATION MODAL ── */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                <Trash2 className="w-6 h-6 text-[#f0312f]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-800">Delete Product?</h3>
                                <p className="text-sm text-gray-400 font-medium mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-6">
                            <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 overflow-hidden shrink-0">
                                <img src={deleteTarget.image} alt="" className="w-full h-full object-contain" onError={(e) => e.target.src = '/Girly.png'} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{deleteTarget.name}</p>
                                <p className="text-xs text-gray-400">{deleteTarget.category} · Rp {Number(deleteTarget.price).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} disabled={isDeleting} className="flex-1 py-3 rounded-2xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={handleDeleteConfirm} disabled={isDeleting} className="flex-1 py-3 rounded-2xl font-bold bg-[#f0312f] text-white hover:bg-red-700 transition-all disabled:opacity-50">
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
