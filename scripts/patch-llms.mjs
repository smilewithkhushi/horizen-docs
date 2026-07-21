// Patch two classes of bad URLs in llms.txt and llms-full.txt that
// docusaurus-plugin-llms emits when routeBasePath is '/':
//
// 1. Spurious /docs/ prefix — the plugin uses file paths, not routes, so
//    files anywhere under docs/ get https://docs.horizen.io/docs/... instead
//    of https://docs.horizen.io/...
//
// 2. Wrong per-page .md path for files with a custom `slug:` frontmatter.
//    e.g. docs/vela/introduction/what-is-vela.md with slug /vela/introduction
//    → plugin emits /vela/introduction/what-is-vela.md
//    → llms-per-page actually wrote  /vela/introduction.md  (route-based)
//    We detect mismatches by checking whether the .md file exists in build/.

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, basename } from 'path';

const outDir = resolve('build');
const siteUrl = 'https://docs.horizen.io';

function patchContent(raw) {
  // Pass 1: strip spurious /docs/ prefix.
  let fixed = raw.split(`${siteUrl}/docs/`).join(`${siteUrl}/`);

  // Pass 2: for every .md link, check the file exists; if not, try the
  // parent directory path (handles slug-remapped files).
  fixed = fixed.replace(
    new RegExp(`${siteUrl.replace(/\./g, '\\.')}(/[^)\\s]+\\.md)`, 'g'),
    (match, urlPath) => {
      const diskPath = resolve(outDir, urlPath.replace(/^\//, ''));
      if (existsSync(diskPath)) return match; // already correct

      // Try: remove the filename and use the parent dir as the .md path
      // e.g. /vela/introduction/what-is-vela.md → /vela/introduction.md
      const parentPath = dirname(urlPath) + '.md';
      const parentDisk = resolve(outDir, parentPath.replace(/^\//, ''));
      if (existsSync(parentDisk)) {
        return `${siteUrl}${parentPath}`;
      }

      return match; // leave unchanged if we can't find the right path
    }
  );

  return fixed;
}

let anyPatched = false;
for (const name of ['llms.txt', 'llms-full.txt']) {
  const file = resolve(outDir, name);
  const raw = readFileSync(file, 'utf-8');
  const fixed = patchContent(raw);
  if (fixed !== raw) {
    writeFileSync(file, fixed, 'utf-8');
    console.log(`[patch-llms] Patched ${name}`);
    anyPatched = true;
  }
}
if (!anyPatched) console.log('[patch-llms] Nothing to patch.');
