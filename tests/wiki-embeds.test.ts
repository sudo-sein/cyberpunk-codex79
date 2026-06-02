import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render } from "./helpers/render";
import { remarkWikiEmbeds } from "../src/lib/markdown/plugins/wiki-embeds";

const here = dirname(fileURLToPath(import.meta.url));
const mediaDir = join(here, "fixtures", "media");

const run = (md: string) =>
  render(md, (p) => p.use(remarkWikiEmbeds, { mediaDir }));

describe("remarkWikiEmbeds", () => {
  it("renders an existing image from /media", async () => {
    const html = await run("![[exists.png]]");
    expect(html).toContain('src="/media/exists.png"');
    expect(html).toContain('class="wiki-embed"');
    expect(html).toContain('alt="exists.png"');
  });

  it("renders the placeholder for a missing image", async () => {
    const html = await run("![[ghost.png]]");
    expect(html).toContain('src="/media/placeholder.svg"');
    expect(html).toContain("wiki-embed-missing");
    expect(html).toContain('alt="ghost.png"');
  });

  it("ignores non-image embeds", async () => {
    const html = await run("![[note.md]]");
    expect(html).not.toContain("<img");
    expect(html).toContain("![[note.md]]");
  });

  it("leaves plain text untouched", async () => {
    const html = await run("no embeds here");
    expect(html).toContain("no embeds here");
    expect(html).not.toContain("<img");
  });
});
