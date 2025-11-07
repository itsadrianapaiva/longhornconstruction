
import type { JSX } from "react";
import {
  deriveLocale,
  loadMarkdown,
  stampToday,
  markdownToHtml,
  extractTitle,
} from "@/lib/legalMarkdown";

type Params = Promise<{ locale?: string }>;

export default async function TermsPage({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { locale: raw } = await params;
  const code = deriveLocale(raw);
  const md = await loadMarkdown("terms", code);
  const html = markdownToHtml(stampToday(md));
  const { title, body } = extractTitle(html);

  return (
    <main id="top" className="mx-auto max-w-4xl px-6 py-16">
       <header className="mb-10 border-b border-white/10 pb-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">
          {title || (code === "pt" ? "Termos de Utilização" : "Terms of Use")}
        </h1>
        <p className="mt-2 text-sm text-black/50">
          {code === "pt"
            ? "Documento informativo. Última atualização em tempo real."
            : "Informational document. Last updated rendered dynamically."}
        </p>
      </header>

      <article
        className={[
          "prose prose-invert prose-lg md:prose-xl",
          "[&>h2]:mt-8 [&>h2]:scroll-mt-24",
          "[&>h3]:mt-6",
          "prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-[color:var(--brand)]",
          "prose-hr:border-white/10",
          "prose-li:marker:text-white/40",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: body }}
      />

      <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
        <a
          href="#top"
          className="underline decoration-white/30 hover:decoration-[color:var(--brand)]"
        >
          {code === "pt" ? "Voltar ao topo" : "Back to top"}
        </a>
      </div>
    </main>
  );
}