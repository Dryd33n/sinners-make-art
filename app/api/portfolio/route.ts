import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { postsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

/** GET /api/portfolio
 * 
 * This function returns posts where portfolio is true.
 * 
 * @param req request object
 * @returns returns a response object
 */
export async function GET() {
    try {
        const portfolioPosts = await db.select().from(postsTable).where(eq(postsTable.portfolio, true)).execute();
        return NextResponse.json({ success: true, data: portfolioPosts }, { status: 200 });
    } catch (error) {
        console.error('Error loading portfolio posts:', error);
        return NextResponse.json({ error: 'Error loading portfolio posts' }, { status: 500 });
    }
}