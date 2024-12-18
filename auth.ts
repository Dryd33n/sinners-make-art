// app/auth.ts
import { cookies } from 'next/headers';

export async function authStatus(): Promise<boolean> {
    const authCookie = (await cookies()).get('auth');
    console.log('Server-side authStatus check: ', authCookie);
    return authCookie?.value === 'true';
}
