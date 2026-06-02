# Design: Obsidian markdown plugins → Starlight

**Date:** 2026-06-02
**Status:** Approved

## Problem

The project added a `src/lib/markdown/` folder containing three remark plugins meant to
extend markdown with Obsidian-style syntax, plus a standalone `pipeline.ts`. None of it
works in the current project:

- `pipeline.ts` builds its own `unified()` processor. This is **not** how Starlight renders
  markdown — Starlight has its own pipeline and accepts custom remark plugins via
  `markdown.remarkPlugins` in `astro.config.mjs`. The standalone pipeline is never invoked.
- Both `../types` and `../../types` imports (`VaultIndex`, `IndexNode`, `TocEntry`,
  `ParsedPage`) reference files that do not exist.
- `pipeline.ts` re-implements TOC extraction and heading IDs, which Starlight already does
  natively.
- `wiki-embeds.ts` points at a non-existent `/api/assets/` endpoint.
- Packages used by the standalone pipeline are not declared in `package.json`.

**Actual usage in content** (`src/content/docs/zasady/`): 3 wikilinks
(`[[Cyberpsychoza]]`, `[[Lifepath generator|Lifepath]]`, `[[Lifepath generator|Tragicznej Historii Miłosnej]]`),
zero embeds, zero HTML comments. `Lifepath generator` has no matching page (broken link).

## Goal

Make all three plugins function correctly on the project's real markdown files by integrating
them as native remark plugins in Starlight's pipeline, installing missing packages, and
removing all non-existent references.

## Architecture

Three remark plugins registered in `astro.config.mjs` under `markdown.remarkPlugins`, running
inside Starlight's own pipeline. `pipeline.ts` is **deleted** (redundant; duplicates Starlight
features; never invoked). No API endpoints, no `VaultIndex` type system.

**Key technique:** all plugins emit proper **mdast nodes** using `data.hName` / `data.hProperties`
rather than raw HTML strings. This renders identically in `.md` and `.mdx`, needs no
`allowDangerousHtml`, and avoids MDX treating raw HTML as JSX.

Plugin order: `wikilinks` → `wiki-embeds` → `strip-comments`.

## Components

### `src/lib/markdown/vault-index.ts` (new)

- Globs `src/content/docs/**/*.{md,mdx}` once; memoized at module load.
- For each file computes the Starlight URL slug:
  - Path relative to `src/content/docs`, extension removed.
  - Each path segment slugified with `github-slugger` (matches Starlight; preserves Polish
    diacritics such as `hakowanie-agentów`, strips punctuation such as `netrunning-v20`).
  - A `slug:` value in frontmatter overrides the computed slug (Starlight behaviour).
  - Segments joined with `/`.
- Keys the resulting `/slug` by:
  - file **basename** (lowercased), and
  - frontmatter **`title`** (lowercased), if present.
- Frontmatter `title` / `slug` read via a small regex over the leading `---` block — no YAML
  dependency.
- Exports a function returning `Map<string, string>` (lookup key → `/slug`).

### `src/lib/markdown/plugins/wikilinks.ts` (rewrite)

- Regex `(?<!!)\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g` (already excludes `![[`).
- Resolves `target.trim().toLowerCase()` against the vault index.
- Match → mdast `link` node: `url: "/" + slug`, child text = label (display or target),
  `data.hProperties.className = ["wikilink"]`.
- No match → generic node: `data.hName = "span"`,
  `data.hProperties.className = ["wikilink-broken"]`, child text = label. Non-clickable.
- Splits the surrounding text node, preserving non-wikilink text.

### `src/lib/markdown/plugins/wiki-embeds.ts` (rewrite)

- Regex `!\[\[([^\]]+?)\]\]/g`.
- Image targets (`.png|.jpg|.jpeg|.gif|.svg|.webp|.avif|.bmp`) → mdast `image` node.
- Images live in `public/media/`, served at `/media/<target>` (Astro strips `public/` from
  the URL).
- **Existence check (build time):** if `public/media/<target>` exists →
  `url: "/media/" + target`, `data.hProperties.className = ["wiki-embed"]`.
- If the file does **not** exist → use the placeholder asset
  `url: "/media/placeholder.svg"`, `alt: target`,
  `data.hProperties.className = ["wiki-embed", "wiki-embed-missing"]`. The original target is
  kept in `alt` and a `title` so the intended file is still discoverable.
- `alt` is always set to the original `target`.
- Non-image embeds ignored (current behaviour).

### `public/media/placeholder.svg` (new)

- A simple static placeholder image shown for embeds whose target file is missing
  (e.g. a "missing image" / broken-frame graphic). Kept in the same `public/media/` folder so
  it serves at `/media/placeholder.svg`.

### `src/lib/markdown/plugins/strip-comments.ts` (keep)

- Removes mdast `html` nodes that are entirely `<!-- ... -->`. Minor cleanup only;
  registered directly in the pipeline.

### `src/styles/wiki.css` (new)

- `.wikilink`, `.wikilink-broken` (dashed red underline, `cursor: help`), `.wiki-embed`
  (responsive max-width), `.wiki-embed-missing` (muted/dashed styling to signal a placeholder).
- Registered via Starlight `customCss`.

### `astro.config.mjs` (edit)

- Add top-level `markdown: { remarkPlugins: [remarkWikilinks, remarkWikiEmbeds, remarkStripComments] }`.
- Add `customCss: ['./src/styles/wiki.css']` to the Starlight options.
- `remarkWikilinks` and `remarkWikiEmbeds` need no options (they build/consume the vault index
  internally).

### `package.json` (edit)

- Add `unist-util-visit` and `github-slugger` (both already present transitively) to
  `dependencies`.

## Data flow

Build time: Astro reads each `.md`/`.mdx` → Starlight remark pipeline runs the three custom
plugins (wikilinks → embeds → strip-comments) → remark-rehype → HTML. The vault index is built
once at module load and shared across all files.

## Testing / verification

- `npm run build` succeeds with no unresolved-import or type errors.
- Built HTML spot-checks:
  - `[[Cyberpsychoza]]` → `<a href="/zasady/cyberpsychoza" class="wikilink">Cyberpsychoza</a>`
  - `[[Lifepath generator|Lifepath]]` → `<span class="wikilink-broken">Lifepath</span>`
  - `![[exists.png]]` (file present in `public/media/`) → `<img src="/media/exists.png" class="wiki-embed">`
  - `![[ghost.png]]` (file absent) → `<img src="/media/placeholder.svg" alt="ghost.png" class="wiki-embed wiki-embed-missing">`
- `npm run dev` visual check on `Zasady` and `Tabela Relacji PC` pages: valid link navigates,
  broken link shows dashed styling and is not clickable.

## Out of scope (YAGNI)

Custom TOC, heading-ID generation (Starlight native), `/api/assets` endpoint,
`VaultIndex`/`IndexNode`/`ParsedPage`/`TocEntry` types, backlinks, graph view, non-image embeds.
