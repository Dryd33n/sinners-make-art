import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { navTreeTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/admin/nav-tree
 * 
 * Fetches all paths for the navigation tree.
 * 
 * @returns Returns a response object containing the paths.
 */
export async function GET() {
    try {
        const navTreeData = await db.select().from(navTreeTable).execute();

        const paths = navTreeData.map((node: { id: number; path: string; link_ovveride: string }) => ({
            id: node.id,
            path: node.path,
            linkOverride: node.link_ovveride,
        }));

        return NextResponse.json({ success: true, data: paths }, { status: 200 });
    } catch (error) {
        console.error('Error fetching paths:', error);
        return NextResponse.json({ error: 'Error fetching paths' }, { status: 500 });
    }
}

/**
 * POST /api/admin/nav-tree
 * 
 * Updates the navigation tree with link overrides.
 * 
 * @param req Request object containing overrides.
 * @returns Returns a response object indicating success or failure.
 */
export async function POST(req: NextRequest) {
    try {
        const { overrides } = await req.json();

        if (!Array.isArray(overrides)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        const updatePromises = overrides.map((override: { id: number; linkOverride: string }) =>
            db.update(navTreeTable)
                .set({ link_ovveride: override.linkOverride || 'auto' })
                .where(eq(navTreeTable.id, override.id))
        );

        await Promise.all(updatePromises);

        return NextResponse.json({ success: true, message: 'Overrides successfully updated' }, { status: 200 });
    } catch (error) {
        console.error('Error updating overrides:', error);
        return NextResponse.json({ error: 'Error updating overrides' }, { status: 500 });
    }
}
