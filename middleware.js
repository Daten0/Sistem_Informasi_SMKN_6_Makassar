export const config = {
  matcher: ["/preview/:path*"],
};

export default async function middleware(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const parts = pathname.split("/");

  // Fungsi helper standar Vercel untuk meneruskan request ke aplikasi Vite tanpa infinite loop
  const passThrough = () => new Response(null, { headers: { "x-middleware-next": "1" } });

  if (parts.length < 3 || !parts[2]) {
    return passThrough();
  }

  const id = parts[2];
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    return passThrough();
  }

  try {
    const restUrl = `${supabaseUrl}/rest/v1/list_berita?id=eq.${id}&select=gambar_berita,judul_berita,ringkasan`;
    const res = await fetch(restUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return passThrough();
    }

    const data = await res.json();
    const item = Array.isArray(data) ? data[0] : data;

    if (!item || !item.gambar_berita) {
      return passThrough();
    }

    const indexRes = await fetch(new URL("/index.html", url.origin));
    let html = await indexRes.text();

    html = html.replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${String(item.judul_berita).replace(/"/g, "&quot;")}" />`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${String(item.ringkasan || "").replace(/"/g, "&quot;")}" />`
    );
    html = html.replace(
      /<meta property="og:image" content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${String(item.gambar_berita).replace(/"/g, "&quot;")}" />`
    );
    html = html.replace(
      /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image" content="${String(item.gambar_berita).replace(/"/g, "&quot;")}" />`
    );
    
    // Perbaikan sintaks dan penambahan spasi pemisah sebelum kata Preview
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${String(item.judul_berita).replace(/</g, "&lt;").replace(/>/g, "&gt;")} - Preview</title>`
    );

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    // Jika terjadi error pada fetch atau logika, teruskan saja ke Vite agar web tidak down
    return passThrough(); 
  }
}