import { describe, it, expect } from "vitest";
import { render } from "./helpers/render";
import { remarkStripComments } from "../src/lib/markdown/plugins/strip-comments";

const run = (md: string) =>
  render(md, (p) => p.use(remarkStripComments));

describe("remarkStripComments", () => {
  it("removes a standalone HTML comment", async () => {
    const html = await run("before\n\n<!-- secret -->\n\nafter");
    expect(html).not.toContain("secret");
    expect(html).toContain("before");
    expect(html).toContain("after");
  });

  it("leaves normal content intact when there are no comments", async () => {
    const html = await run("# Heading\n\ntext");
    expect(html).toContain("Heading");
    expect(html).toContain("text");
  });
});
