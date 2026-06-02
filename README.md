# Cyberpunk Codex

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Zbiór homebrew zasad i materiałów do kampanii **Cyberpunk RED**, zbudowany na [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

## 🚀 Struktura projektu

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/
│   │       └── zasady/      # Homebrew zasady (autogenerowane w sidebarze)
│   └── content.config.ts
├── astro.config.mjs
├── Dockerfile
├── package.json
└── tsconfig.json
```

Starlight szuka plików `.md` lub `.mdx` w katalogu `src/content/docs/`. Każdy plik jest wystawiany jako trasa na podstawie swojej nazwy. Treści zasad trafiają do `src/content/docs/zasady/` i są automatycznie dodawane do sidebara.

Obrazy można dodawać do `src/assets/` i osadzać w Markdown przez relatywny link. Statyczne pliki (np. favicony) umieszcza się w katalogu `public/`.

## 🧞 Komendy

Wszystkie komendy uruchamiane są z katalogu głównego projektu:

| Komenda                   | Działanie                                        |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instaluje zależności                             |
| `npm run dev`             | Uruchamia serwer deweloperski na `localhost:4321`|
| `npm run build`           | Buduje produkcyjną wersję strony do `./dist/`    |
| `npm run preview`         | Podgląd zbudowanej strony przed wdrożeniem       |
| `npm run astro ...`       | Komendy CLI, np. `astro add`, `astro check`      |
| `npm run astro -- --help` | Pomoc dla Astro CLI                              |

## 🐳 Docker

Projekt zawiera wielostopniowy `Dockerfile`, który buduje statyczną stronę (Node) i serwuje ją przez nginx. Finalny obraz zawiera tylko pliki statyczne i nginx — bez Node.js i źródeł.

```bash
# Zbuduj obraz
docker build -t codex79 .

# Uruchom kontener (strona dostępna na http://localhost:8080)
docker run -p 8080:80 codex79
```

## 👀 Więcej informacji

Sprawdź [dokumentację Starlight](https://starlight.astro.build/), [dokumentację Astro](https://docs.astro.build) lub dołącz do [serwera Discord Astro](https://astro.build/chat).
