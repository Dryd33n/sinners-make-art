import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { postsTable } from '@/db/schema';
import { like } from 'drizzle-orm';

/** POST /api/posts/bycategory
 * 
 * This function fetches all posts where the tag starts with {category}/.
 * 
 * @param req request object
 * @returns returns a response object
 */
export async function POST(req: NextRequest) {
    try {
        const { category } = await req.json();

        if (!category) {
            return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 });
        }

        // Query to find posts where tag starts with `{category}/`
        const posts = await db
            .select()
            .from(postsTable)
            .execute();

        return NextResponse.json({ success: true, data: posts }, { status: 200 });
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        return NextResponse.json({ error: 'Error fetching posts by category' }, { status: 500 });
    }
}
