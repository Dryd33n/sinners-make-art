import { NextRequest, NextResponse } from 'next/server';
import { db } from './../../../../db/index';
import { navTreeTable } from './../../../../db/schema';




/** POST /api/admin/about
 * 
 * This function is used to update the about section of the website. Clears the homeTable and then
 * populates the first row with content for the about me section
 * 
 * @param req request object
 * @returns returns a response object
 */
export async function POST(req: NextRequest) {
    interface Node {
        name: string;
        path: string;
        order: number;
    }

    console.log("Beginning POST request to update nav tree...");

    /* PARSE REQUEST BODY */
    const { treeData } = await req.json();

    console.log("Attempting to update nav tree with data:", treeData);

    /* CLEAR TABLE */
    try {
        await db.delete(navTreeTable).execute();
        console.log('Nav Table cleared successfully');
    } catch (error) {
        console.error('Error clearing nav table:', error);
        return NextResponse.json({ error: 'Error clearing table' }, { status: 500 });
    }

    console.log("Nav Table cleared successfully, inserting data...");

    /* INSERT DATA */
    try {
        const insertPromises = treeData.map((node: Node) =>
            db.insert(navTreeTable).values({
              name: node.name,
              path: node.path,
              order: node.order,
            })
          );
    
          const response = await Promise.all(insertPromises);
        return NextResponse.json({ success: true, response }, { status: 200 });
    } catch (error) {
        console.error('Error inserting data:', error);
        return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
    }
}

export async function GET() {
    try {
      const treeData = await db.select().from(navTreeTable).execute();
      return NextResponse.json({ success: true, data: treeData }, { status: 200 });
    } catch (error) {
      console.error('Error loading navigation tree:', error);
      return NextResponse.json({ error: 'Error loading navigation tree' }, { status: 500 });
    }
  }