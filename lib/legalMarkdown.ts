// Single-responsibility helpers for legal pages: locale, file IO, md → HTML, title extraction.
import { readFile } from "fs/promises";
import { join } from "path";

export type LocaleCode = "en" | "pt";

export function deriveLocale(raw?: string): LocaleCode {
  return raw?.startsWith("pt") ? "pt" : "en";
}

export async function loadMarkdown(kind: "privacy" | "terms", code: LocaleCode) {
  const base = join(process.cwd(), "content", "legal");
  const primary = join(base, `${kind}.${code}.md`);
  const fallback = join(base, `${kind}.en.md`);
  try {
    return await readFile(primary, "utf-8");
  } catch {
    return await readFile(fallback, "utf-8");
  }
}

export function stampToday(md: string) {
  const today = new Date().toISOString().slice(0, 10);
  return md.replace(/\{\{TODAY\}\}/g, today);
}

// Very small Markdown subset: h1–h3, paragraphs, bold, italic, links, lists, hr.
// Keep it predictable for our curated legal copy. < 100 LOC by design.
export function markdownToHtml(md: string) {
  let s = md.trim();

  // Horizontal rules
  s = s.replace(/^\s*---\s*$/gm, "<hr />");

  // Headings
  s = s
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Emphasis
  s = s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  s = s.replace(/\[(.+?)\]\((.+?)\)/g, (_m, text, url) => {
    const ext = String(url).startsWith("http");
    const attrs = ext ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}"${attrs}>${text}</a>`;
  });

  // Lists (simple blocks of "- " or "* ")
  s = s.replace(
    /(^|\n)(?:[-*] .+(?:\n[-*] .+)*)/g,
    (block) => {
      const items = block
        .trim()
        .split("\n")
        .map((line) => line.replace(/^[-*]\s+/, "").trim())
        .map((li) => `<li>${li}</li>`)
        .join("");
      return `\n<ul>${items}</ul>`;
    }
  );

  // Paragraphs: wrap loose lines not already tags into <p>
  const out: string[] = [];
  let para: string[] = [];
  for (const line of s.split("\n")) {
    const t = line.trim();
    const isTag = /^<\/?[\w-]+/.test(t);
    if (!t) {
      if (para.length) {
        out.push(`<p>${para.join(" ")}</p>`);
        para = [];
      }
      continue;
    }
    if (isTag) {
      if (para.length) {
        out.push(`<p>${para.join(" ")}</p>`);
        para = [];
      }
      out.push(t);
    } else {
      para.push(t);
    }
  }
  if (para.length) out.push(`<p>${para.join(" ")}</p>`);
  return out.join("\n");
}

// Pull out first <h1> as page title and return remaining HTML body.
export function extractTitle(html: string) {
  const m = html.match(/<h1>(.*?)<\/h1>/i);
  if (!m) return { title: "", body: html };
  const title = m[1];
  const body = html.replace(m[0], "").trim();
  return { title, body };
}
