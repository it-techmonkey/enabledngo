import { NextResponse } from 'next/server';
import { getUsers, insertUser } from '@/lib/db';

function invalidateAuthUsersCache() {
    globalThis.__authUsersCache = null;
    globalThis.__authUsersCacheTime = 0;
}

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();
        const emailLower = (email || '').trim().toLowerCase();

        const users = await getUsers();
        if (users.find(u => (u.email || '').trim().toLowerCase() === emailLower)) {
            return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 400 });
        }

        const newUser = {
            id: `u-${Date.now()}`,
            name: (name || '').trim(),
            email: emailLower,
            password,
            role: 'user'
        };

        const ok = await insertUser(newUser);
        if (!ok) {
            return NextResponse.json({ success: false, message: 'Failed to create account' }, { status: 500 });
        }
        invalidateAuthUsersCache();

        const { password: _, ...userWithoutPassword } = newUser;
        return NextResponse.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
