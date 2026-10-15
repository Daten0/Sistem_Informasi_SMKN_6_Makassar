export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const id = url.pathname.split("/").pop() || url.searchParams.get("id") || "";

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

  let item = null;
  if (supabaseUrl && supabaseKey && id) {
    try {
      const restUrl = `${supabaseUrl}/rest/v1/list_berita?id=eq.${id}&select=gambar_berita,judul_berita,ringkasan,konten,kategori_berita,created_at,tags`;
      const fetchRes = await fetch(restUrl, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
      });
      if (fetchRes.ok) {
        const data = await fetchRes.json();
        item = Array.isArray(data) ? data[0] : data;
      }
    } catch (e) {
      // ignore
    }
  }

  const title = item ? String(item.judul_berita) : "Preview Berita";
  const image = item && item.gambar_berita ? String(item.gambar_berita) : "https://sistem-informasi-smkn-6-makassar.vercel.app/school-logo.png";
  const desc = item && item.ringkasan ? String(item.ringkasan) : "Sistem Informasi SMKN 6 Makassar";

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title.replace(/</g,"&lt;").replace(/>/g,"&gt;")} - Preview</title>
<meta property="og:title" content="${title.replace(/"/g,"&quot;")}" />
<meta property="og:description" content="${desc.replace(/"/g,"&quot;")}" />
<meta property="og:type" content="article" />
<meta property="og:image" content="${image.replace(/"/g,"&quot;")}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${image.replace(/"/g,"&quot;")}" />
<link rel="icon" href="/src/assets/school-logo.png" />
<style>
body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 24px;color:#111;line-height:1.6}
img{max-width:100%;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.12)}
h1{font-size:1.8rem;margin-top:0}
</style>
</head>
<body>
${item ? `<img src="${image}" alt="${title.replace(/"/g,"&quot;")}" style="width:100%;height:auto;max-height:420px;object-fit:cover;border-radius:12px;" />
<h1>${title.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</h1>
<p style="font-size:1.1rem;color:#555">${desc.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>
<div style="margin-top:24px;padding:16px;background:#f6f7f9;border-radius:10px;">${String(item.konten||"").replace(/</g,"&lt;").replace(/>/g,"&gt;").substring(0,800)}</div>` : `<h1>Berita tidak ditemukan</h1>`}
<div style="margin-top:32px;"><a href="/" style="text-decoration:none;color:#2563eb;font-weight:600;">← Kembali ke Beranda</a></div>
</body>
</html>`;

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.end(html);
}
