'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';

const DEFAULT_PROFILE = { name: 'Administrator', email: 'admin@enabled.ngo' };
const STORAGE_KEY = 'admin_profile';
const DEFAULT_PASSWORD = 'enabled@2024';

const inputCls = 'w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#f0312f] transition-all font-medium text-gray-800';

export default function AdminProfilePage() {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [toast, setToast] = useState(null); // { msg, type: 'success'|'error' }
    const [profileSaving, setProfileSaving] = useState(false);
    const [pwdSaving, setPwdSaving] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setProfile(JSON.parse(saved));
        } catch {}
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleProfileSave = (e) => {
        e.preventDefault();
        if (!profile.name.trim() || !profile.email.trim()) {
            showToast('Name and email cannot be empty.', 'error');
            return;
        }
        setProfileSaving(true);
        setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
                sessionStorage.setItem('admin_email', profile.email);
                window.dispatchEvent(new Event('admin_profile_updated'));
                showToast('Profile updated successfully!');
            } catch {
                showToast('Failed to save profile.', 'error');
            } finally {
                setProfileSaving(false);
            }
        }, 500);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        const storedPwd = localStorage.getItem('admin_password') || DEFAULT_PASSWORD;
        if (pwdForm.current !== storedPwd) {
            showToast('Current password is incorrect.', 'error');
            return;
        }
        if (pwdForm.newPwd.length < 6) {
            showToast('New password must be at least 6 characters.', 'error');
            return;
        }
        if (pwdForm.newPwd !== pwdForm.confirm) {
            showToast('New passwords do not match.', 'error');
            return;
        }
        setPwdSaving(true);
        setTimeout(() => {
            try {
                localStorage.setItem('admin_password', pwdForm.newPwd);
                setPwdForm({ current: '', newPwd: '', confirm: '' });
                showToast('Password changed successfully!');
            } catch {
                showToast('Failed to change password.', 'error');
            } finally {
                setPwdSaving(false);
            }
        }, 500);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl font-bold text-sm animate-in slide-in-from-top-2 duration-300 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    {toast.msg}
                </div>
            )}

            {/* Avatar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-[#f0312f] flex items-center justify-center text-white text-3xl font-black shrink-0 shadow-lg shadow-red-100">
                    {profile.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-800">{profile.name}</h2>
                    <p className="text-gray-400 text-sm font-medium">{profile.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-widest bg-red-50 text-[#f0312f] px-2 py-0.5 rounded-full">Full Access</span>
                </div>
            </div>

            {/* Edit Profile */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-800 mb-5 pb-4 border-b border-gray-100 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#f0312f]" /> Edit Profile
                </h3>
                <form onSubmit={handleProfileSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Display Name</label>
                        <input className={inputCls} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Administrator" />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                            <Mail className="w-3 h-3 inline mr-1" />Email Address
                        </label>
                        <input type="email" className={inputCls} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="admin@enabled.ngo" />
                    </div>
                    <button type="submit" disabled={profileSaving} className="w-full py-4 bg-[#f0312f] text-white rounded-2xl font-bold text-base shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50">
                        {profileSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-800 mb-5 pb-4 border-b border-gray-100 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#f0312f]" /> Change Password
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Current Password</label>
                        <div className="relative">
                            <input type={showCurrent ? 'text' : 'password'} className={`${inputCls} pr-12`} value={pwdForm.current} onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })} placeholder="••••••••" />
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">New Password</label>
                        <div className="relative">
                            <input type={showNew ? 'text' : 'password'} className={`${inputCls} pr-12`} value={pwdForm.newPwd} onChange={(e) => setPwdForm({ ...pwdForm, newPwd: e.target.value })} placeholder="Min. 6 characters" />
                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Confirm New Password</label>
                        <input type="password" className={inputCls} value={pwdForm.confirm} onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })} placeholder="Re-enter new password" />
                    </div>
                    <button type="submit" disabled={pwdSaving} className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold text-base hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-50">
                        {pwdSaving ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
