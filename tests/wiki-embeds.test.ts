import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render } from "./helpers/render";
import { remarkWikiEmbeds } from "../src/lib/markdown/plugins/wiki-embeds";

const here = dirname(fileURLToPath(import.meta.url));
const mediaDir = join(here, "fixtures", "media");
const placeholder = join(here, "fixtures", "placeholder.svg");
// A markdown file two directories below `fixtures`, so relative paths to the
// sibling `media/` and `placeholder.svg` are predictable.
const mdPath = join(here, "fixtures", "docs", "zasady", "Custom.md");

const run = (md: string) =>
  render(md, (p) => p.use(remarkWikiEmbeds, { mediaDir, placeholder }), mdPath);

describe("remarkWikiEmbeds", () => {
  it("emits a relative src for an existing image (astro:assets optimisable)", async () => {
    const html = await run("![[exists.png]]");
    expect(html).toContain('src="../../media/exists.png"');
    expect(html).toContain('class="wiki-embed"');
    expect(html).toContain('alt="exists.png"');
    // Must NOT be a public-absolute path, or astro:assets skips optimisation.
    expect(html).not.toContain('src="/');
  });

  it("parses the |width size suffix", async () => {
    const html = await run("![[exists.png|300]]");
    expect(html).toContain('src="../../media/exists.png"');
    expect(html).toContain('width="300"');
    expect(html).not.toContain("height=");
  });

  it("parses the |WxH size suffix", async () => {
    const html = await run("![[exists.png|300x200]]");
    expect(html).toContain('width="300"');
    expect(html).toContain('height="200"');
  });

  it("falls back to the placeholder for a missing image", async () => {
    const html = await run("![[ghost.png]]");
    expect(html).toContain('src="../../placeholder.svg"');
    expect(html).toContain("wiki-embed-missing");
    expect(html).toContain('alt="ghost.png"');
    expect(html).toContain('title="Brak pliku: ghost.png"');
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
