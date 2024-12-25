import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialLinks } from '@/db/schema';
import { eq } from 'drizzle-orm';

/** POST /api/social-links
 * 
 * This function is used to add a new social link to the database.
 * 
 * @param req request object
 * @returns returns a response object
 */
export async function POST(req: NextRequest) {
    const { name, url } = await req.json();

    // Validate request body
    if (!name || !url) {
        return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }

    try {
        // Insert new social link into the database
        const response = await db.insert(socialLinks).values({ name, url }).execute();
        console.log('Social link added successfully:', response);
        return NextResponse.json({ success: true, response }, { status: 200 });
    } catch (error) {
        console.error('Error adding social link:', error);
        return NextResponse.json({ error: 'Error adding social link' }, { status: 500 });
    }
}

/** GET /api/social-links
 * 
 * This function retrieves all social links from the database.
 * 
 * @returns returns a response object
 */
export async function GET() {
    try {
        const links = await db.select().from(socialLinks).execute();
        return NextResponse.json({ success: true, data: links }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving social links:', error);
        return NextResponse.json({ error: 'Error retrieving social links' }, { status: 500 });
    }
}

/** DELETE /api/social-links/:id
 * 
 * This function deletes a social link by its ID.
 * 
 * @param req request object
 * @returns returns a response object
 */
export async function DELETE(req: NextRequest) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
    }

    try {
        await db.delete(socialLinks).where(eq(socialLinks.id, Number(id))).execute();
        console.log('Social link deleted successfully:', id);
        return NextResponse.json({ success: true, message: 'Social link deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting social link:', error);
        return NextResponse.json({ error: 'Error deleting social link' }, { status: 500 });
    }
}