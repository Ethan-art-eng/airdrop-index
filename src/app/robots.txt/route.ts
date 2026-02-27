export function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: https://airdrop-index.vercel.app/sitemap.xml
`;
  return new Response(content, {
    headers: { "Content-Type": "text/plain" },
  });
}