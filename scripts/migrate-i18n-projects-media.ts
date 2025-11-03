/* v1.0 migrate-i18n-projects-media
   Usage:
     npx ts-node scripts/migrate-i18n-projects-media.ts
     npx ts-node scripts/migrate-i18n-projects-media.ts --dry
*/

import fs from "node:fs";
import path from "node:path";

type Src = { src: string; format: string };
type OldMedia = {
  type: "image";
  base?: string;
  size?: "sm" | "lg" | "base" | string;
  formats?: string[];
  sources?: Src[];
  src?: string; // sometimes present on hardened UI
  alt?: string;
  width?: number;
  height?: number;
};

type OldProject = {
  id: string;
  title: string;
  category?: string;
  technology?: string[];
  description?: string;
  media?: OldMedia[];
  // any other fields preserved
  [k: string]: unknown;
};

type NewThumb = { src: string; alt: string; width: number; height: number };
type NewGalleryItem = { alt: string; width: number; height: number; sources: Src[] };

type I18nRoot = {
  projects?: { items?: OldProject[] };
  [k: string]: unknown;
};

const ROOT = process.cwd();
const I18N_DIR = path.join(ROOT, "i18n");
const PUBLIC_ROOT = path.join(ROOT, "public");
const PROJECTS_MEDIA_DIR = path.join(PUBLIC_ROOT, "media", "projects");
const LOCALES = ["en", "pt"] as const;

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");

function readJSON<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

function writeJSON(p: string, data: unknown) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}

function backupFile(p: string): string {
  const dir = path.dirname(p);
  const base = path.basename(p, ".json");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = path.join(dir, `${base}.backup.${stamp}.json`);
  fs.copyFileSync(p, backup);
  return backup;
}

function fileExistsRel(rel: string): boolean {
  // rel should start with "/"
  const abs = path.join(PUBLIC_ROOT, rel.replace(/^\//, ""));
  return fs.existsSync(abs);
}

function preferJpgFirst(sources: Src[] | undefined): string | null {
  if (!sources || sources.length === 0) return null;
  const jpg = sources.find(s => s.format.toLowerCase() === "jpg")?.src;
  return jpg ?? sources[0].src ?? null;
}

function uniqueBy<T>(arr: T[], keyFn: (t: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function sanitizeSources(sources: Src[] | undefined): Src[] {
  if (!sources) return [];
  // Only keep jpg and webp with non-empty src that exists on disk
  const keep = sources.filter(s =>
    s.src && s.src.trim() !== "" &&
    /\/media\/projects\//.test(s.src) &&
    (s.format === "jpg" || s.format === "webp") &&
    fileExistsRel(s.src)
  );
  // ensure deterministic order: jpg then webp
  return keep.sort((a, b) => {
    const rank = (f: string) => (f === "jpg" ? 0 : f === "webp" ? 1 : 2);
    return rank(a.format) - rank(b.format);
  });
}

function buildThumbnail(projectId: string, media: OldMedia[] | undefined, fallbackAlt: string): NewThumb | null {
  const images = media ?? [];
  // find first "sm" item
  const sm = images.find(m => m.type === "image" && m.size === "sm");
  const smSources = sanitizeSources(sm?.sources);
  let src: string | null = preferJpgFirst(smSources);

  // fallback: any source from first item
  if (!src) {
    const anySources = sanitizeSources(images.find(m => m.type === "image")?.sources);
    src = preferJpgFirst(anySources);
  }
  if (!src) return null;

  // If the path has -lg, try to coerce to -sm.jpg if present
  const coerced = src.replace(/-lg\.(jpg|webp)$/i, "-sm.jpg");
  const finalSrc = fileExistsRel(coerced) ? coerced : src;

  // default size for thumbnail
  const width = 1600;
  const height = 1000;

  const alt = sm?.alt?.trim() || fallbackAlt;
  return { src: finalSrc, alt, width, height };
}

function buildGallery(media: OldMedia[] | undefined, fallbackAlt: string): NewGalleryItem[] {
  const images = media ?? [];
  const lgItems = images.filter(m => m.type === "image" && m.size === "lg");

  const slides = lgItems.map(m => {
    const sources = sanitizeSources(m.sources);
    return {
      alt: (m.alt?.trim() || fallbackAlt),
      width: m.width && Number.isFinite(m.width) ? m.width : 2560,
      height: m.height && Number.isFinite(m.height) ? m.height : 1600,
      sources
    } as NewGalleryItem;
  });

  // remove slides with no valid sources
  const valid = slides.filter(s => s.sources.length > 0);

  // dedupe by first source src (safe and stable)
  return uniqueBy(valid, s => s.sources[0].src);
}

function migrateProject(p: OldProject): OldProject {
  const migrated: Record<string, unknown> = { ...p };

  // Build new structures
  const thumb = buildThumbnail(p.id, p.media, p.title);
  const gallery = buildGallery(p.media, p.title);

  // Assign and clean up
  if (thumb) migrated.thumbnail = thumb;
  else console.warn(`⚠️  ${p.id}: thumbnail could not be derived`);

  migrated.gallery = gallery;

  // Remove old media
  delete migrated.media;

  // Last pass: ensure no empty srcs snuck in
  if (thumb && (!thumb.src || thumb.src.trim() === "")) {
    console.warn(`⚠️  ${p.id}: empty thumbnail src removed`);
    delete migrated.thumbnail;
  }
  // Filter bad gallery items
  migrated.gallery = (migrated.gallery as NewGalleryItem[]).filter(g => g.sources.every(s => s.src && s.src.trim() !== ""));

  return migrated as OldProject;
}

function migrateLocale(localePath: string) {
  const data = readJSON<I18nRoot>(localePath);
  const items = data.projects?.items;
  if (!items) {
    console.error(`✗ Missing projects.items in ${path.basename(localePath)}`);
    return;
  }

  const outItems = items.map(migrateProject);
  const outData: I18nRoot = { ...data, projects: { ...(data.projects as any), items: outItems } };

  if (DRY) {
    console.log(`[dry] Would write ${path.basename(localePath)} with ${outItems.length} projects`);
    return;
  }

  const backup = backupFile(localePath);
  writeJSON(localePath, outData);
  console.log(`✓ Migrated ${path.basename(localePath)} (backup: ${path.basename(backup)})`);
}

function main() {
  console.log("🛠️  Migrating i18n project media to {thumbnail, gallery}...\n");
  for (const loc of LOCALES) {
    const localePath = path.join(I18N_DIR, `${loc}.json`);
    if (!fs.existsSync(localePath)) {
      console.warn(`⚠️  Skipping missing ${loc}.json`);
      continue;
    }
    migrateLocale(localePath);
  }
  console.log("\n✅ Done.");
}

main();
