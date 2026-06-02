import { unified, type Plugin } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

/**
 * Render markdown to HTML with a single remark plugin applied.
 * `attach` receives the processor so callers can pass plugin options.
 */
export async function render(
  markdown: string,
  attach: (processor: ReturnType<typeof unified>) => void
): Promise<string> {
  const processor = unified().use(remarkParse);
  attach(processor);
  processor
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true });
  const file = await processor.process(markdown);
  return String(file);
}
