import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { username, password } = await req.json();

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const response = NextResponse.redirect(new URL('/admin', req.url));

        // Set an HTTP-Only cookie (more secure)
        response.cookies.set('auth', 'true', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            path: '/', 
            maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
        });

        return response;
    } else {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
}

export async function GET() {
    const authCookie = (await cookies()).get('auth');
    console.log('Server-side authStatus check: ', authCookie);
    return NextResponse.json({ authenticated: authCookie?.value === 'true' });
}
