// ======================================================================
// update-i18n-media.js
// Groups and updates media for each project folder without duplicates
// Auto-creates new projects inside i18n/en.json and i18n/pt.json
// ======================================================================

import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "media", "projects");
const i18nDir = path.join(process.cwd(), "i18n");
const locales = ["en", "pt"];

console.log("🛠️ Updating i18n project media arrays...\n");

function groupMediaFiles(files) {
  const groups = {};

  for (const file of files) {
    const ext = path.extname(file).slice(1);
    const base = file.replace(/\.(jpg|jpeg|webp|avif)$/i, "");
    const size =
      base.includes("-lg") ? "lg" : base.includes("-sm") ? "sm" : "base";
    const key = base.replace(/-lg|-sm/i, "");

    if (!groups[key]) groups[key] = {};
    if (!groups[key][size]) groups[key][size] = [];
    groups[key][size].push({ file, ext });
  }

  return groups;
}

function generateMediaArray(projectName, files) {
  const groups = groupMediaFiles(files);
  const media = [];

  for (const [key, variants] of Object.entries(groups)) {
    for (const size of Object.keys(variants)) {
      const width = size === "lg" ? 2560 : 1600;
      const height = size === "lg" ? 1600 : 1000;
      const formats = variants[size].map(v => v.ext);

      media.push({
        type: "image",
        base: key,
        size,
        formats,
        sources: variants[size].map(v => ({
          src: `/media/projects/${projectName}/${v.file}`,
          format: v.ext
        })),
        alt: `${projectName} — ${key}`,
        width,
        height
      });
    }
  }

  return media.sort((a, b) => a.base.localeCompare(b.base, undefined, { numeric: true }));
}

const projects = fs
  .readdirSync(root, { withFileTypes: true })
  .filter(f => f.isDirectory())
  .map(f => f.name);

for (const locale of locales) {
  const filePath = path.join(i18nDir, `${locale}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!json.projects || !json.projects.items) {
    console.error(`✗ Missing projects.items in ${locale}.json`);
    continue;
  }

  for (const projectName of projects) {
    const mediaDir = path.join(root, projectName);
    const files = fs
      .readdirSync(mediaDir)
      .filter(f => /\.(jpg|jpeg|webp|avif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const media = generateMediaArray(projectName, files);
    let project = json.projects.items.find(p => p.id === projectName);

    if (!project) {
      const title = projectName
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());

      project = {
        id: projectName,
        title,
        category: "residential",
        technology: ["Sismo"],
        description: locale === "pt" ? "" : "",
        media
      };

      json.projects.items.push(project);
      console.log(`➕ Added new project "${projectName}" to ${locale}.json`);
    } else {
      project.media = media;
      console.log(`✓ Updated ${locale}.json → ${projectName}`);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf8");
}

console.log("\n✅ All i18n project entries updated successfully.");
