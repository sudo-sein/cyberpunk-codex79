import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

/**
 * Render markdown to HTML with a single remark plugin applied.
 * `attach` receives the processor so callers can pass plugin options.
 */
export async function render(
  markdown: string,
  attach: (processor: ReturnType<typeof unified>) => void,
  path?: string
): Promise<string> {
  const processor = unified();
  processor.use(remarkParse);
  attach(processor);
  processor
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true });
  const file = await processor.process(path ? { value: markdown, path } : markdown);
  return String(file);
}
