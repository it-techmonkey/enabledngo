import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';

const ADMIN_USER = {
    id: 'u-admin',
    name: 'Administrator',
    email: 'admin@enabled.ngo',
    password: 'enabled@2024',
    role: 'admin'
};

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const emailLower = (email || '').trim().toLowerCase();

        if (emailLower === ADMIN_USER.email && password === ADMIN_USER.password) {
            const { password: _, ...adminWithoutPassword } = ADMIN_USER;
            return NextResponse.json({ success: true, user: adminWithoutPassword });
        }

        const user = await getUserByEmail(emailLower);

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
