// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Cyberpunk Codex",
      description:
        "Zbiór homebrew zasad i materiałów do kampanii Cyberpunk RED.",
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
