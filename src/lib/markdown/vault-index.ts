import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";
import { slug as githubSlug } from "github-slugger";

const DEFAULT_DOCS_DIR = join(process.cwd(), "src", "content", "docs");
const MARKDOWN_EXT = /\.(md|mdx)$/i;

function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (MARKDOWN_EXT.test(name)) files.push(full);
  }
  return files;
}

function parseFrontmatter(raw: string): { title?: string; slug?: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const body = match[1];
  const read = (key: string): string | undefined => {
    const m = body.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"));
    if (!m) return undefined;
    return m[1].replace(/^["']|["']$/g, "").trim();
  };
  return { title: read("title"), slug: read("slug") };
}

function computeSlug(relPath: string, frontmatterSlug?: string): string {
  if (frontmatterSlug) return "/" + frontmatterSlug.replace(/^\/+/, "");
  const segments = relPath
    .replace(MARKDOWN_EXT, "")
    .split(sep)
    .filter((s) => s && s.toLowerCase() !== "index")
    .map((s) => githubSlug(s));
  return "/" + segments.join("/");
}

/** Pure, testable build of the target -> "/slug" map for a docs directory. */
export function buildVaultIndex(docsDir: string = DEFAULT_DOCS_DIR): Map<string, string> {
  const map = new Map<string, string>();
  let files: string[];
  try {
    files = walk(docsDir);
  } catch {
    return map; // directory missing -> empty index
  }
  for (const file of files) {
    const rel = relative(docsDir, file);
    const fm = parseFrontmatter(readFileSync(file, "utf8"));
    const url = computeSlug(rel, fm.slug);
    map.set(basename(file).replace(MARKDOWN_EXT, "").toLowerCase(), url);
    if (fm.title) map.set(fm.title.toLowerCase(), url);
  }
  return map;
}

let cached: Map<string, string> | null = null;

/** Memoized index for the real docs directory, used by the remark plugins. */
export function getVaultIndex(): Map<string, string> {
  if (!cached) cached = buildVaultIndex();
  return cached;
}
