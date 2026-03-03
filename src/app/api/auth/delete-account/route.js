import { NextResponse } from 'next/server';
import { getUsers, deleteUserById } from '@/lib/db';

function invalidateAuthUsersCache() {
    globalThis.__authUsersCache = null;
    globalThis.__authUsersCacheTime = 0;
}

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
        }

        const users = await getUsers();
        const emailLower = (email || '').trim().toLowerCase();
        const user = users.find(
            (u) => (u.email || '').trim().toLowerCase() === emailLower && u.password === password
        );
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
        }

        const ok = await deleteUserById(user.id);
        if (!ok) {
            return NextResponse.json({ success: false, message: 'Failed to delete account' }, { status: 500 });
        }
        invalidateAuthUsersCache();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
