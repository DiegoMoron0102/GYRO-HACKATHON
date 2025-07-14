// src/app/api/rate-proxy/route.ts

export async function GET() {
  try {
    const res = await fetch("https://www.dolarbluebolivia.click/api/exchange_currencies");
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Fallo al obtener datos externos." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
