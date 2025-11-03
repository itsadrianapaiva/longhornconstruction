/* v1.0 check-project-media */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const PUB = path.join(ROOT, "public");
const I18N = path.join(ROOT, "i18n");

const existsPublic = (rel) =>
  fs.existsSync(path.join(PUB, rel.replace(/^\//, "")));

function check(locale) {
  const p = path.join(I18N, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  const items = data?.projects?.items || [];
  let bad = 0;

  for (const proj of items) {
    const id = proj.id;
    const thumb = proj.thumbnail?.src;
    if (thumb && !existsPublic(thumb)) {
      console.error(`✗ ${locale}:${id} missing thumbnail ${thumb}`);
      bad++;
    }
    for (const [i, slide] of (proj.gallery || []).entries()) {
      for (const s of slide.sources || []) {
        if (
          !s?.src ||
          !/^\/media\/projects\//.test(s.src) ||
          !existsPublic(s.src)
        ) {
          console.error(`✗ ${locale}:${id} gallery[${i}] bad ${s?.src}`);
          bad++;
        }
      }
    }
  }
  if (bad === 0) console.log(`✓ ${locale} OK`);
  return bad;
}

const total = check("en") + check("pt");
process.exitCode = total === 0 ? 0 : 1;
