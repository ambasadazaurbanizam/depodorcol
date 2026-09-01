import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const RECIPIENT_EMAIL = process.env.CONTRIBUTION_EMAIL || 'sergey.belyuga@gmail.com';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.resend.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || '587');
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const SMTP_REQUIRE_TLS = String(process.env.SMTP_REQUIRE_TLS || 'true').toLowerCase() === 'true';
const SMTP_USER = process.env.SMTP_USER || 'resend';
const SMTP_PASS = process.env.SMTP_PASS || process.env.RESEND_API_KEY || '';
const SMTP_FROM = process.env.SMTP_FROM || 'onboarding@resend.dev';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const type = String(formData.get('type') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const attachments = formData.getAll('attachments') as File[];

  if (!name || !email || !type || !message) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

  if (!SMTP_PASS) {
    return NextResponse.json({ error: 'SMTP is not configured. Set RESEND_API_KEY or SMTP_PASS in the environment.' }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      requireTLS: SMTP_REQUIRE_TLS,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();

    const attachmentList = await Promise.all(
      attachments
        .filter((file) => file && typeof file.name === 'string' && file.size > 0)
        .map(async (file) => ({
          filename: file.name,
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type || 'application/octet-stream',
        }))
    );

    const body = [
      'Dorćol depo muzej user shared information',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Type of information: ${type}`,
      `Message: ${message}`,
      `Attached files: ${attachmentList.length > 0 ? attachmentList.map((file) => file.filename).join(', ') : 'None'}`,
    ].join('\n');

    await transporter.sendMail({
      from: SMTP_FROM,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: 'Dorcol depo muzej user shared information',
      text: body,
      attachments: attachmentList,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.error('Contribution email failure:', details);
    return NextResponse.json(
      { error: `Email delivery failed: ${details}` },
      { status: 500 }
    );
  }
}
