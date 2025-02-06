import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    console.log(email, subject, message);

    const data = await resend.emails.send({
      from: "no-reply@sinners-make.art",
      to: "mlaronde@sinners-make.art",
      subject: 'New Contact From Sinners Make Art Contact Form: "'+subject+'"',
      text: email + " has sent you a message make sure to forward this email to them when you reply \n\n"+ message,
    });

    resend.emails.send({
        from: "no-reply@sinners-make.art",
        to: email,
        subject: 'Sinners Make Art Contact Form: "'+subject+'"',
        text: "Thank you for contacting Sinners Make Art. We will get back to you as soon as possible. \n\n"+ message,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
    }
  }
}
