// app/api/rate-proxy/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    const res = await fetch('https://www.dolarbluebolivia.click/api/exchange_currencies');
    if (!res.ok) throw new Error('Bad status ' + res.status);
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'proxy_error' }, { status: 500 });
  }
}
