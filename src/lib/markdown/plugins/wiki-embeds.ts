import { existsSync } from "node:fs";
import { join } from "node:path";
import { visit } from "unist-util-visit";
import type { Root, Text } from "mdast";

const EMBED_REGEX = /!\[\[([^\]]+?)\]\]/g;
const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|webp|avif|bmp)$/i;
const PLACEHOLDER_URL = "/media/placeholder.svg";

interface WikiEmbedsOptions {
  /** Directory holding embeddable images. Defaults to <cwd>/public/media. */
  mediaDir?: string;
}

export function remarkWikiEmbeds(options: WikiEmbedsOptions = {}) {
  const mediaDir = options.mediaDir ?? join(process.cwd(), "public", "media");

  return (tree: Root) => {
    visit(tree, "text", (node: Text, i, parent) => {
      if (!parent || typeof i !== "number") return;
      const value = node.value;
      if (!value.includes("![[")) return;

      const children: any[] = [];
      let lastIndex = 0;
      EMBED_REGEX.lastIndex = 0;

      for (const match of value.matchAll(EMBED_REGEX)) {
        const [full, rawTarget] = match;
        const target = rawTarget.trim();
        const start = match.index!;
        if (start > lastIndex) {
          children.push({ type: "text", value: value.slice(lastIndex, start) });
        }

        if (IMAGE_EXTENSIONS.test(target)) {
          const exists = existsSync(join(mediaDir, target));
          children.push(
            exists
              ? {
                  type: "image",
                  url: `/media/${target}`,
                  alt: target,
                  data: { hProperties: { className: ["wiki-embed"] } },
                }
              : {
                  type: "image",
                  url: PLACEHOLDER_URL,
                  alt: target,
                  title: `Brak pliku: ${target}`,
                  data: {
                    hProperties: {
                      className: ["wiki-embed", "wiki-embed-missing"],
                      title: `Brak pliku: ${target}`,
                    },
                  },
                }
          );
        } else {
          // Non-image embed: leave the original text in place.
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
