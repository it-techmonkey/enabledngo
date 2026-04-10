import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const user = await getUserByEmail(email);

        if (!user || user.password !== password) {
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
