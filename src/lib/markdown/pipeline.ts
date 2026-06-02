import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { remarkStripComments } from "./plugins/strip-comments";
import { remarkWikilinks } from "./plugins/wikilinks";
import { remarkWikiEmbeds } from "./plugins/wiki-embeds";
import type { VaultIndex, TocEntry, ParsedPage } from "../types";
import type { Root, PhrasingContent } from "mdast";
import type { Root as HastRoot } from "hast";
import { visit } from "unist-util-visit";

interface ParseOptions {
  index: VaultIndex;
  stripComments: boolean;
}

export async function parseMarkdown(
  content: string,
  options: ParseOptions
): Promise<ParsedPage> {
  const toc: TocEntry[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(remarkWikilinks, { index: options.index })
    .use(remarkWikiEmbeds)
    .use(options.stripComments ? remarkStripComments : [])
    .use(remarkExtractToc, { toc })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHeadingIds)
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(content);

  return {
    html: String(result),
    toc,
    frontmatter: {},
  };
}

interface TocPluginOptions {
  toc: TocEntry[];
}

function rehypeHeadingIds() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: any) => {
      if (/^h[1-6]$/.test(node.tagName)) {
        const text = getTextContent(node);
        const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
        node.properties = node.properties || {};
        node.properties.id = id;
      }
    });
  };
}

function getTextContent(node: any): string {
  if (node.type === "text") return node.value;
  if (node.children) return node.children.map(getTextContent).join("");
  return "";
}

function remarkExtractToc(options: TocPluginOptions) {
  return (tree: Root) => {
    visit(tree, "heading", (node) => {
      const text = node.children
        .filter((c: PhrasingContent): c is PhrasingContent & { value: string } => c.type === "text")
        .map((c: PhrasingContent & { value: string }) => c.value)
        .join("");

      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      options.toc.push({ depth: node.depth, text, id });
    });
  };
}
