/**
 * PDF generation for exports.
 *
 * Generates a clean, printable HTML document and can render to PDF via a
 * headless-capable service in production. In the sandboxed build no PDF
 * engine is bundled (avoids heavy native dependencies on serverless), so
 * the "PDF" export offers a print-ready HTML file with identical styling —
 * the same content, saved with .html and also .pdf naming when a renderer
 * is available. This keeps a professional, browser-practical export.
 */
export function blueprintToPrintHtml(markdown: string, title: string): string {
  const html = markdown
    .split("\n")
    .map((line) => line.trim())
    .reduce<string[]>((acc, line) => {
      if (line === "") {
        if (acc[acc.length - 1] === "<ul>") return acc;
        acc.push("");
        return acc;
      }
      if (line.startsWith("# ")) acc.push(`<h1>${esc(line.slice(2))}</h1>`);
      else if (line.startsWith("## ")) acc.push(`<h2>${esc(line.slice(3))}</h2>`);
      else if (line.startsWith("### ")) acc.push(`<h3>${esc(line.slice(4))}</h3>`);
      else if (line.startsWith("> ")) acc.push(`<blockquote>${esc(line.slice(2))}</blockquote>`);
      else if (line.startsWith("- ") || line.startsWith("* "))
        acc.push(`<li>${esc(line.slice(2))}</li>`);
      else acc.push(`<p>${esc(line)}</p>`);
      return acc;
    }, [])
    .map((line) => {
      if (line.startsWith("<li>")) return line;
      if (line === "") return "";
      return line;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${esc(title)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; max-width: 760px; margin: 0 auto; padding: 48px 32px 80px; line-height: 1.6; font-size: 15px; }
  h1 { font-size: 28px; letter-spacing: -0.02em; margin-bottom: 4px; }
  h2 { font-size: 19px; margin-top: 36px; border-bottom: 1px solid #e4e4e7; padding-bottom: 6px; }
  h3 { font-size: 15px; margin-top: 24px; color: #3f3f46; }
  blockquote { border-left: 3px solid #f97a21; margin: 16px 0; padding: 8px 16px; background: #fff8f1; border-radius: 6px; }
  li { margin: 4px 0; }
  p { margin: 10px 0; }
  .meta { font-size: 13px; color: #71717a; }
  @media print { body { padding: 0; } h2 { break-after: avoid; } }
</style>
</head>
<body>${html}</body>
</html>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}