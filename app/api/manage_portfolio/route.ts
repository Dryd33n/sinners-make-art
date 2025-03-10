import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { portfolio } from '@/db/schema';

/** POST /api/manage_portfolio
 * 
 * This function is used to add a list of portfolio posts to the database.
 * 
 * @param req request object
 * @returns returns a response object
 */
export async function POST(req: NextRequest) {
    try {
        const { posts } = await req.json();

        // Delete current table
        await db.delete(portfolio);

        // Re-upload the list of portfolio posts
        await db.insert(portfolio).values(posts);

        return NextResponse.json({ success: true, message: 'Portfolio posts updated successfully' });
    } catch (error) {
        console.error('Error updating portfolio posts:', error);
        return NextResponse.json({ success: false, message: 'Error updating portfolio posts' }, { status: 500 });
    }
}

/** GET /api/manage_portfolio
 * 
 * This function retrieves all portfolio posts from the database.
 * 
 * @returns returns a response object
 */
export async function GET() {
    try {
        const portfolioPosts = await db.select().from(portfolio);
        return NextResponse.json({ success: true, data: portfolioPosts });
    } catch (error) {
        console.error('Error fetching portfolio posts:', error);
        return NextResponse.json({ success: false, message: 'Error fetching portfolio posts' }, { status: 500 });
    }
}

