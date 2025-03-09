import { NextRequest, NextResponse } from 'next/server';
import { db } from './../../../db/index';
import { hometable } from './../../../db/schema';


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
    const { title, text, images, secondTitle, secondText } = await req.json();

    /* VALIDATE REQUEST BODY */
    const data = {
        about_title: title,
        about_text: text,
        about_images: images, 
        second_title: secondTitle,
        second_text: secondText
    };

    /* CLEAR TABLE */
    try {
        await db.delete(hometable).execute();
    } catch (error) {
        console.error('Error clearing table:', error);
        return NextResponse.json({ error: 'Error clearing table' }, { status: 500 });
    }

    /* INSERT DATA */
    try {
        const response = await db.insert(hometable).values(data).execute();
        return NextResponse.json({ success: true, response }, { status: 200 });
    } catch (error) {
        console.error('Error inserting data:', error);
        return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
