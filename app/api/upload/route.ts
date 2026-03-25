import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// POST /api/upload — upload image to Cloudinary
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Generate signature for signed upload
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'know-korea';
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

  // Use Web Crypto API for SHA-1
  const encoder = new TextEncoder();
  const data = encoder.encode(paramsToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('api_key', apiKey);
  uploadFormData.append('timestamp', timestamp);
  uploadFormData.append('signature', signature);
  uploadFormData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: uploadFormData }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Cloudinary error: ${err}` }, { status: 500 });
  }

  const result = await res.json();
  return NextResponse.json({ url: result.secure_url });
}
