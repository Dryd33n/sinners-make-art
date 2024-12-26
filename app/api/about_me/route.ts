import { NextResponse } from 'next/server';
import { db } from './../../../db/index';
import { hometable } from './../../../db/schema';

export async function GET() {
    try {
        const response = await db.select().from(hometable).execute();
        return NextResponse.json({ success: true, response }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return NextResponse.json({ error: 'Error retrieving data' }, { status: 500 });
    }
}