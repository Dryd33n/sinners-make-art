import { NextRequest, NextResponse } from 'next/server';
import { db } from './../../../db/index';
import { homeTable } from './../../../db/schema';

export async function POST(req: NextRequest) {
    const { title, text } = await req.json();

    const data = {
        about_title: title,
        about_text: text,
    };

    /* CLEAR TABLE */
    try {
        await db.delete(homeTable).execute();
        console.log('Table cleared successfully');
    } catch (error) {
        console.error('Error clearing table:', error);
        return NextResponse.json({ error: 'Error clearing table' }, { status: 500 });
    }

    /* INSERT DATA */
    try {
        const response = await db.insert(homeTable).values(data).execute();
        console.log('Data inserted successfully:', response);
        return NextResponse.json({ success: true, response }, { status: 200 });
    } catch (error) {
        console.error('Error inserting data:', error);
        return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
