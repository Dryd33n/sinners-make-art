import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { postsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

/** POST /api/admin/about
 * 
 * This function is used to update the about section of the website. Clears the homeTable and then
 * populates the first row with content for the about me section
 * 
 * @param req request object
 * @returns returns a response object
 */
export async function POST(req: NextRequest) {
    /* PARSE REQUEST BODY */
    const { title, description, type, content, tag, order, portfolio } = await req.json();

    /* VALIDATE REQUEST BODY */
    const data = {
          title: title,
          description: description,
          type: type,
          content: content,
          tag: tag,
          order: order,
          portfolio: portfolio,
    };

    /* INSERT DATA */
    try {
        const response = await db.insert(postsTable).values(data).execute();
        console.log('Data inserted successfully:', response);
        return NextResponse.json({ success: true, response }, { status: 200 });
    } catch (error) {
        console.error('Error inserting data:', error);
        return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
    }
}

export async function GET() {
    try {
      const treeData = await db.select().from(postsTable).execute();
      return NextResponse.json({ success: true, data: treeData }, { status: 200 });
    } catch (error) {
      console.error('Error loading posts information:', error);
      return NextResponse.json({ error: 'Error loading navigation tree' }, { status: 500 });
    }
}

/** DELETE /api/posts/:id
 * 
 * This function deletes a post by its ID.
 * 
 * @param req request object
 * @returns returns a response object
 */
export async function DELETE(req: NextRequest) {
    const postId = await req.json();

    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    try {
        await db.delete(postsTable).where(eq(postsTable.id, Number(postId))).execute();
        console.log('Post deleted successfully:', postId);
        return NextResponse.json({ success: true, message: 'Post deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
    }
}