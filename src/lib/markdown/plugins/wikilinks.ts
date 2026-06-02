import { visit } from "unist-util-visit";
import type { Root, Text } from "mdast";
import { getVaultIndex } from "../vault-index";

interface WikilinksOptions {
  /** Override the lookup map (used in tests). Defaults to the real vault index. */
  index?: Map<string, string>;
}

const WIKILINK_REGEX = /(?<!!)\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

export function remarkWikilinks(options: WikilinksOptions = {}) {
  return (tree: Root) => {
    const index = options.index ?? getVaultIndex();

    visit(tree, "text", (node: Text, i, parent) => {
      if (!parent || typeof i !== "number") return;
      const value = node.value;
      if (!value.includes("[[")) return;

      const children: any[] = [];
      let lastIndex = 0;
      WIKILINK_REGEX.lastIndex = 0;

      for (const match of value.matchAll(WIKILINK_REGEX)) {
        const [full, target, display] = match;
        const start = match.index!;
        if (start > lastIndex) {
          children.push({ type: "text", value: value.slice(lastIndex, start) });
        }

        const key = target.trim().toLowerCase();
        const label = display?.trim() || target.trim();
        const url = index.get(key);

        if (url) {
          children.push({
            type: "emphasis", // known to-hast handler; tag/attrs overridden below
            children: [{ type: "text", value: label }],
            data: {
              hName: "a",
              hProperties: { className: ["wikilink"], href: url },
            },
          });
        } else {
          children.push({
            type: "emphasis", // known to-hast handler; tag/attrs overridden below
            children: [{ type: "text", value: label }],
            data: {
              hName: "span",
              hProperties: {
                className: ["wikilink-broken"],
                title: `Brak strony: ${target.trim()}`,
              },
            },
          });
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
