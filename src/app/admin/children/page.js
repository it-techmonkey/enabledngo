'use client';

import { useState, useEffect, useRef } from 'react';
import { Pencil, Trash2, X, ImagePlus, Users } from 'lucide-react';

const EMPTY = {
    name: '', age: '', domicile: '', parentsOccupation: '', description: '', image: '',
};

const inputCls = 'w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#f0312f] transition-all font-medium';

export default function AdminChildrenPage() {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [addPreview, setAddPreview] = useState('');
    const addFileRef = useRef(null);

    const [editChild, setEditChild] = useState(null);
    const [editPreview, setEditPreview] = useState('');
    const editFileRef = useRef(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => { fetchChildren(); }, []);

    const fetchChildren = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/children', { cache: 'no-store' });
            const data = await res.json();
            setChildren(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const toBase64 = (file) => new Promise((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(file);
    });

    /* ── ADD ── */
    const handleAddImg = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const b64 = await toBase64(file);
        setAddPreview(b64);
        setForm((p) => ({ ...p, image: b64 }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/children', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, age: Number(form.age) }),
            });
            if (res.ok) { closeAdd(); fetchChildren(); }
        } catch (err) { console.error(err); }
    };

    const closeAdd = () => {
        setIsAddOpen(false); setForm(EMPTY); setAddPreview('');
        if (addFileRef.current) addFileRef.current.value = '';
    };

    /* ── EDIT ── */
    const openEdit = (child) => {
        setEditChild({ ...child, age: String(child.age ?? '') });
        setEditPreview(child.image || '');
    };

    const handleEditImg = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const b64 = await toBase64(file);
        setEditPreview(b64);
        setEditChild((p) => ({ ...p, image: b64 }));
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/children', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editChild, age: Number(editChild.age) }),
            });
            if (res.ok) { closeEdit(); fetchChildren(); }
        } catch (err) { console.error(err); }
    };

    const closeEdit = () => {
        setEditChild(null); setEditPreview('');
        if (editFileRef.current) editFileRef.current.value = '';
    };

    /* ── DELETE ── */
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            const res = await fetch('/api/admin/children', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteTarget.id }),
            });
            if (res.ok) { setDeleteTarget(null); fetchChildren(); }
        } catch (err) { console.error(err); }
        finally { setIsDeleting(false); }
    };

    /* ── shared image picker ── */
    const ImagePicker = ({ preview, setPreview, setData, fileRef, onUpload, isEdit }) => (
        <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Child Photo <span className="text-[#f0312f]">*</span>
            </label>
            <div
                className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#f0312f] hover:bg-red-50 transition-all"
                onClick={() => fileRef.current?.click()}
            >
                {preview ? (
                    <div className="relative w-full flex items-center justify-center">
                        <img src={preview} alt="Preview" className="max-h-40 object-contain rounded-lg" />
                        <button type="button"
                            onClick={(e) => { e.stopPropagation(); setPreview(''); setData((p) => ({ ...p, image: '' })); if (fileRef.current) fileRef.current.value = ''; }}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-500"
                        ><X className="w-4 h-4" /></button>
                    </div>
                ) : (
                    <>
                        <ImagePlus className="w-8 h-8 text-gray-300" />
                        <p className="text-sm text-gray-400 font-medium">{isEdit ? 'Click to replace photo' : 'Click to upload photo'}</p>
                        <p className="text-xs text-gray-300">PNG, JPG, WEBP supported</p>
                    </>
                )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </div>
    );

    /* ── shared form body ── */
    const FormFields = ({ data, setData }) => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Name <span className="text-[#f0312f]">*</span></label>
                    <input required className={inputCls} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="e.g. Ahmad Rizki Pratama" />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Age <span className="text-[#f0312f]">*</span></label>
                    <input required type="number" min="1" max="18" className={inputCls} value={data.age} onChange={(e) => setData({ ...data, age: e.target.value })} placeholder="e.g. 14" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Domicile / Location <span className="text-[#f0312f]">*</span></label>
                <input required className={inputCls} value={data.domicile} onChange={(e) => setData({ ...data, domicile: e.target.value })} placeholder="e.g. Jakarta Selatan, DKI Jakarta" />
            </div>
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Parents' Occupation <span className="text-[#f0312f]">*</span></label>
                <input required className={inputCls} value={data.parentsOccupation} onChange={(e) => setData({ ...data, parentsOccupation: e.target.value })} placeholder="e.g. Ibu sebagai penjahit, Ayah sebagai buruh" />
            </div>
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Description <span className="text-[#f0312f]">*</span></label>
                <textarea required className={`${inputCls} h-28 resize-none`} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="Tell donors about this child's story and needs..." />
            </div>
        </>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Children Who Need Support</h2>
                    <p className="text-gray-400 font-medium text-sm mt-1">{children.length} child{children.length !== 1 ? 'ren' : ''} listed on the Be a Donor page</p>
                </div>
                <button onClick={() => setIsAddOpen(true)} className="bg-[#f0312f] text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-100 active:scale-95">
                    + Add Child
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="bg-white rounded-2xl p-20 text-center text-gray-400 font-medium shadow-sm border border-gray-100">Loading...</div>
            ) : children.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-100">
                    <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No children added yet. Add a child to list them on the Be a Donor page.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {children.map((child) => (
                        <div key={child.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                            <div className="h-48 bg-gray-50 overflow-hidden">
                                {child.image ? (
                                    <img src={child.image} alt={child.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Users className="w-12 h-12 text-gray-200" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="font-black text-gray-800 text-lg mb-1">{child.name}</h3>
                                <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 font-medium mb-2">
                                    <span>Age {child.age}</span>
                                    <span>·</span>
                                    <span>{child.domicile}</span>
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-2 mb-1"><span className="font-bold text-gray-500">Parents:</span> {child.parentsOccupation}</p>
                                <p className="text-xs text-gray-500 line-clamp-3 flex-grow">{child.description}</p>
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                                    <button onClick={() => openEdit(child)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors">
                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button onClick={() => setDeleteTarget(child)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── ADD MODAL ── */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 py-8">
                        <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-gray-800">Add Child</h3>
                                <button onClick={closeAdd} className="text-gray-400 hover:text-gray-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <ImagePicker preview={addPreview} setPreview={setAddPreview} setData={setForm} fileRef={addFileRef} onUpload={handleAddImg} isEdit={false} />
                                <FormFields data={form} setData={setForm} />
                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={closeAdd} className="flex-1 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                                    <button type="submit" disabled={!addPreview} className="flex-1 bg-[#f0312f] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-100 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Add Child</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── EDIT MODAL ── */}
            {editChild && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 py-8">
                        <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-gray-800">Edit Child</h3>
                                <button onClick={closeEdit} className="text-gray-400 hover:text-gray-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleEditSave} className="space-y-4">
                                <ImagePicker preview={editPreview} setPreview={setEditPreview} setData={setEditChild} fileRef={editFileRef} onUpload={handleEditImg} isEdit={true} />
                                <FormFields data={editChild} setData={setEditChild} />
                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={closeEdit} className="flex-1 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                                    <button type="submit" disabled={!editPreview} className="flex-1 bg-[#f0312f] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-100 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DELETE CONFIRM ── */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                <Trash2 className="w-6 h-6 text-[#f0312f]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-800">Remove Child?</h3>
                                <p className="text-sm text-gray-400 mt-0.5">They will be removed from the Be a Donor page.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-6">
                            {deleteTarget.image && <img src={deleteTarget.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />}
                            <div>
                                <p className="font-bold text-gray-800">{deleteTarget.name}</p>
                                <p className="text-xs text-gray-400">Age {deleteTarget.age} · {deleteTarget.domicile}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} disabled={isDeleting} className="flex-1 py-3 rounded-2xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-3 rounded-2xl font-bold bg-[#f0312f] text-white hover:bg-red-700 transition-all disabled:opacity-50">
                                {isDeleting ? 'Removing...' : 'Yes, Remove'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
