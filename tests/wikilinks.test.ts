import { describe, it, expect } from "vitest";
import { render } from "./helpers/render";
import { remarkWikilinks } from "../src/lib/markdown/plugins/wikilinks";

const index = new Map<string, string>([
  ["cyberpsychoza", "/zasady/cyberpsychoza"],
]);

const run = (md: string) =>
  render(md, (p) => p.use(remarkWikilinks, { index }));

describe("remarkWikilinks", () => {
  it("renders a resolved wikilink as an anchor with class", async () => {
    const html = await run("Zobacz [[Cyberpsychoza]] tutaj.");
    expect(html).toContain('<a class="wikilink" href="/zasady/cyberpsychoza">Cyberpsychoza</a>');
  });

  it("uses the display label after the pipe", async () => {
    const html = await run("[[Cyberpsychoza|psychoza]]");
    expect(html).toContain('<a class="wikilink" href="/zasady/cyberpsychoza">psychoza</a>');
  });

  it("renders an unresolved wikilink as a broken span", async () => {
    const html = await run("[[Lifepath generator|Lifepath]]");
    expect(html).toContain('<span class="wikilink-broken"');
    expect(html).toContain(">Lifepath</span>");
  });

  it("ignores image embeds (leading !)", async () => {
    const html = await run("![[picture.png]]");
    expect(html).not.toContain("wikilink");
    expect(html).toContain("![[picture.png]]");
  });

  it("preserves surrounding text", async () => {
    const html = await run("before [[Cyberpsychoza]] after");
    expect(html).toContain("before ");
    expect(html).toContain(" after");
  });
});
