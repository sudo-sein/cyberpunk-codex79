import { existsSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { visit } from "unist-util-visit";
import type { Root, Text, Image } from "mdast";
import type { Properties } from "hast";
import type { VFile } from "vfile";

const EMBED_REGEX = /!\[\[([^\]]+?)\]\]/g;
const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|svg|webp|avif|bmp)$/i;

interface WikiEmbedsOptions {
  /** Directory holding embeddable images. Defaults to <cwd>/src/assets/media. */
  mediaDir?: string;
  /** Image shown when an embed target is missing. Defaults to <cwd>/src/assets/placeholder.svg. */
  placeholder?: string;
}

/**
 * Turn an absolute asset path into a posix path relative to the markdown file.
 * This is the form `astro:assets` recognises for optimisation: a local path that
 * does NOT start with "/" (a leading "/" would be treated as a public asset and
 * left unoptimised). Astro resolves it against the markdown file just like a
 * hand-written `![](../foo.png)` reference.
 */
function relativeUrl(mdFile: string, assetPath: string): string {
  let rel = relative(dirname(mdFile), assetPath).split(sep).join("/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

/** Parse an Obsidian size suffix: "300" -> {width:300}, "300x200" -> {width,height}. */
function parseSize(raw: string | undefined): { width?: number; height?: number } {
  const m = raw?.trim().match(/^(\d+)(?:x(\d+))?$/);
  if (!m) return {};
  const width = Number(m[1]);
  return m[2] ? { width, height: Number(m[2]) } : { width };
}

export function remarkWikiEmbeds(options: WikiEmbedsOptions = {}) {
  const mediaDir = options.mediaDir ?? join(process.cwd(), "src", "assets", "media");
  const placeholder =
    options.placeholder ?? join(process.cwd(), "src", "assets", "placeholder.svg");

  return (tree: Root, file: VFile) => {
    const mdFile = typeof file?.path === "string" ? file.path : undefined;

    visit(tree, "text", (node: Text, i, parent) => {
      if (!parent || typeof i !== "number") return;
      const value = node.value;
      if (!value.includes("![[")) return;

      const children: any[] = [];
      let lastIndex = 0;
      EMBED_REGEX.lastIndex = 0;

      for (const match of value.matchAll(EMBED_REGEX)) {
        const [full, rawInner] = match;
        const start = match.index!;
        if (start > lastIndex) {
          children.push({ type: "text", value: value.slice(lastIndex, start) });
        }

        const [rawTarget, rawSize] = rawInner.split("|");
        const target = rawTarget.trim();

        if (IMAGE_EXTENSIONS.test(target)) {
          const exists = existsSync(join(mediaDir, target));
          const assetPath = exists ? join(mediaDir, target) : placeholder;
          const url = mdFile
            ? relativeUrl(mdFile, assetPath)
            : assetPath.split(sep).join("/");

          const { width, height } = parseSize(rawSize);
          const hProperties: Properties = {
            className: exists ? ["wiki-embed"] : ["wiki-embed", "wiki-embed-missing"],
          };
          if (width) hProperties.width = width;
          if (height) hProperties.height = height;
          if (!exists) hProperties.title = `Brak pliku: ${target}`;

          const image: Image = {
            type: "image",
            url,
            alt: target,
            ...(exists ? {} : { title: `Brak pliku: ${target}` }),
            data: { hProperties },
          };
          children.push(image);
        } else {
          // Non-image embed (e.g. another note): leave the original text in place.
          children.push({ type: "text", value: full });
        }

        lastIndex = start + full.length;
      }

      if (children.length === 0) return;
      if (lastIndex < value.length) {
        children.push({ type: "text", value: value.slice(lastIndex) });
      }

      parent.children.splice(i, 1, ...children);
      return i + children.length;
    });
  };
}
