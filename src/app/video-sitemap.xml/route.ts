import { NextResponse } from "next/server";
import videoData from "@/lib/youtube-videos.json";

export async function GET() {
  const BASE_URL = "https://justinsuranceco.com";
  const entries = Object.entries(
    videoData as Record<string, { videoId: string; title: string }>
  );

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  for (const [path, video] of entries) {
    const title = video.title
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    xml += `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <video:video>
      <video:thumbnail_loc>https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg</video:thumbnail_loc>
      <video:title>${title}</video:title>
      <video:description>Insurance exam prep video from the Insurance Exam Prep YouTube channel by Justin vom Eigen, Founder of JustInsurance.</video:description>
      <video:content_loc>https://www.youtube.com/watch?v=${video.videoId}</video:content_loc>
      <video:player_loc>https://www.youtube-nocookie.com/embed/${video.videoId}</video:player_loc>
    </video:video>
  </url>`;
  }

  xml += `\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
