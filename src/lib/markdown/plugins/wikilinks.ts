import { visit } from "unist-util-visit";
import type { Root, Text } from "mdast";
import type { VaultIndex, IndexNode } from "../../types";

interface WikilinksOptions {
  index: VaultIndex;
}

const WIKILINK_REGEX = /(?<!!)\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

export function remarkWikilinks(options: WikilinksOptions) {
  const slugMap = buildSlugMap(options.index.tree);

  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const value = node.value;
      if (!value.includes("[[")) return;

      const children: any[] = [];
      let lastIndex = 0;

      for (const match of value.matchAll(WIKILINK_REGEX)) {
        const [full, target, display] = match;
        const matchIndex = match.index!;

        if (matchIndex > lastIndex) {
          children.push({ type: "text", value: value.slice(lastIndex, matchIndex) });
        }

        const slug = slugMap.get(target.trim().toLowerCase());
        const label = display?.trim() || target.trim();

        children.push({
          type: "html",
          value: slug
            ? `<a href="/${slug}" class="wikilink">${label}</a>`
            : `<a class="wikilink-broken">${label}</a>`,
        });

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

function buildSlugMap(nodes: IndexNode[]): Map<string, string> {
  const map = new Map<string, string>();

  function walk(nodes: IndexNode[]) {
    for (const node of nodes) {
      if (node.type === "file" && node.slug) {
        map.set(node.name.toLowerCase(), node.slug);
        if (node.title) {
          map.set(node.title.toLowerCase(), node.slug);
        }
      }
      if (node.children) walk(node.children);
    }
  }

  walk(nodes);
  return map;
}
