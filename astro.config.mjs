// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { unified } from "@astrojs/markdown-remark";
import { remarkWikilinks } from "./src/lib/markdown/plugins/wikilinks";
import { remarkWikiEmbeds } from "./src/lib/markdown/plugins/wiki-embeds";
import { remarkStripComments } from "./src/lib/markdown/plugins/strip-comments";

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkWikilinks, remarkWikiEmbeds, remarkStripComments],
    }),
  },
  integrations: [
    starlight({
      title: "Cyberpunk Codex",
      description:
        "Zbiór homebrew zasad i materiałów do kampanii Cyberpunk RED.",
      customCss: ["./src/styles/wiki.css"],
      locales: {
        root: { label: "Polski", lang: "pl" },
      },
      sidebar: [
        { slug: "wprowadzenie" },
        {
          label: "Zasady",
          items: [{ autogenerate: { directory: "zasady" } }],
        },
        {
          label: "Black Box",
          items: [{ autogenerate: { directory: "black-box" } }],
        },
      ],
    }),
  ],
});
