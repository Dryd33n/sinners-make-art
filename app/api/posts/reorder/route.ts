import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/** PUT /api/posts/reorder
 * 
 * This function updates the order of multiple posts in the database.
 * 
 * @param req request object
 * @returns returns a response object
 */
export async function PUT(req: NextRequest) {
    try {
        const { updates } = await req.json(); // Expecting an array of { id, order }
        if (!Array.isArray(updates)) {
            return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
        }

        for (const update of updates) {
            const { id, order } = update;
            if (!id || order == null) {
                continue; // Skip invalid entries
            }

            await db
                .update(postsTable)
                .set({ order })
                .where(eq(postsTable.id, id))
                .execute();
        }

        console.log('Post orders updated successfully');
        return NextResponse.json({ success: true, message: 'Post orders updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating post orders:', error);
        return NextResponse.json({ error: 'Error updating post orders' }, { status: 500 });
    }
}
