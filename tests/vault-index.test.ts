import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildVaultIndex } from "../src/lib/markdown/vault-index";

const here = dirname(fileURLToPath(import.meta.url));
const DOCS = join(here, "fixtures", "docs");

describe("buildVaultIndex", () => {
  const index = buildVaultIndex(DOCS);

  it("keys a file by its basename (lowercased)", () => {
    expect(index.get("cyberpsychoza")).toBe("/zasady/cyberpsychoza");
  });

  it("keys a file by its frontmatter title (lowercased)", () => {
    expect(index.get("cyberpsychoza i jej skutki")).toBe("/zasady/cyberpsychoza");
  });

  it("slugifies punctuation like Starlight (v2.0 -> v20)", () => {
    expect(index.get("netrunning v2.0")).toBe("/zasady/netrunning-v20");
  });

  it("honors a slug frontmatter override", () => {
    expect(index.get("custom")).toBe("/zasady/custom-override");
  });

  it("returns an empty map for a missing directory", () => {
    expect(buildVaultIndex(join(DOCS, "does-not-exist")).size).toBe(0);
  });
});
