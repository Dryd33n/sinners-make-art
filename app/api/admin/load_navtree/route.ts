import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { navTreeTable } from '@/db/schema';

export async function GET() {
  try {
    const treeData = await db.select().from(navTreeTable).execute();
    return NextResponse.json({ success: true, data: treeData }, { status: 200 });
  } catch (error) {
    console.error('Error loading navigation tree:', error);
    return NextResponse.json({ error: 'Error loading navigation tree' }, { status: 500 });
  }
}