import { visit } from "unist-util-visit";
import type { Root, Text } from "mdast";

const EMBED_REGEX = /!\[\[([^\]]+?)\]\]/g;
const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|webp|avif|bmp)$/i;

export function remarkWikiEmbeds() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const value = node.value;
      if (!value.includes("![[")) return;

      const children: any[] = [];
      let lastIndex = 0;

      for (const match of value.matchAll(EMBED_REGEX)) {
        const [full, target] = match;
        const matchIndex = match.index!;

        if (matchIndex > lastIndex) {
          children.push({ type: "text", value: value.slice(lastIndex, matchIndex) });
        }

        if (IMAGE_EXTENSIONS.test(target)) {
          children.push({
            type: "html",
            value: `<img src="/api/assets/${target}" alt="${target}" class="wiki-embed" />`,
          });
        }

        lastIndex = matchIndex + full.length;
      }

      if (children.length === 0) return;

      if (lastIndex < value.length) {
        children.push({ type: "text", value: value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...children);
      return index + children.length;
    });
  };
}
