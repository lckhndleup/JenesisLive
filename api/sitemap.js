// Dinamik XML Sitemap Generator - Vercel Serverless Function
export default async function handler(req, res) {
  // Set correct headers for XML
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=86400"); // 24 saatlik cache

  const baseUrl = req.headers.host
    ? `https://${req.headers.host}`
    : "https://yoursite.vercel.app";

  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  // Site haritası URL'leri ve özellikler
  const pages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/index-highlights.html", priority: "0.8", changefreq: "monthly" },
    { url: "/index-playground.html", priority: "0.8", changefreq: "monthly" },
    { url: "/index-portfolio.html", priority: "0.8", changefreq: "monthly" },
    { url: "/about.html", priority: "0.9", changefreq: "monthly" },
    { url: "/contact.html", priority: "0.7", changefreq: "monthly" },
    { url: "/project01.html", priority: "0.8", changefreq: "monthly" },
    { url: "/project02.html", priority: "0.8", changefreq: "monthly" },
    { url: "/project03.html", priority: "0.8", changefreq: "monthly" },
    { url: "/project04.html", priority: "0.8", changefreq: "monthly" },
    { url: "/project05.html", priority: "0.8", changefreq: "monthly" },
    { url: "/project06.html", priority: "0.8", changefreq: "monthly" },
    { url: "/project07.html", priority: "0.8", changefreq: "monthly" },
    { url: "/project08.html", priority: "0.8", changefreq: "monthly" },
    { url: "/multimedia.html", priority: "0.6", changefreq: "monthly" },
    { url: "/resources.html", priority: "0.6", changefreq: "monthly" },
    { url: "/shortcodes.html", priority: "0.5", changefreq: "monthly" },
  ];

  // XML sitemap oluştur
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return res.status(200).send(sitemap);
}
