export function iconFromHtml(html: string, pageUrl: string): string {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  let icon = "";
  let apple = "";
  for (const tag of tags) {
    const rel = (/rel=["']([^"']+)["']/i.exec(tag)?.[1] ?? "").toLowerCase();
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1] ?? "";
    if (!href || href.startsWith("data:")) continue;
    const parts = rel.split(/\s+/);
    if (parts.includes("icon") && !rel.includes("apple")) icon = href;
    else if (rel.includes("apple-touch-icon") && !apple) apple = href;
  }
  const chosen = icon || apple;
  if (!chosen) return "";
  try {
    const url = new URL(chosen, pageUrl);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}
