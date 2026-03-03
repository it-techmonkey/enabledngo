import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

// Shared auth cache (signup invalidates so new users can log in)
const AUTH_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

async function getUsersForAuth() {
    const now = Date.now();
    if (globalThis.__authUsersCache != null && now - (globalThis.__authUsersCacheTime || 0) < AUTH_CACHE_TTL_MS) {
        return globalThis.__authUsersCache;
    }
    const users = await getUsers();
    globalThis.__authUsersCache = users;
    globalThis.__authUsersCacheTime = now;
    return users;
}

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const users = await getUsersForAuth();
        const emailLower = (email || '').trim().toLowerCase();

        const user = users.find(u => (u.email || '').trim().toLowerCase() === emailLower && u.password === password);

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
