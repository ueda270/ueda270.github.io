# Repository Guidelines

## Project Structure & Module Organization
- `content/`: Markdown posts (bundles at `content/posts/<slug>/index.md`) and pages.
- `layouts/`: Hugo templates and partials (custom OG/Twitter/meta templates).
- `assets/`: Pipeline assets (e.g., `css/extended/custom.css`).
- `static/`: Public static files (e.g., `og-images/`, `opensearch` files). Do not hand‑edit generated images here.
- `themes/PaperMod/`: Theme as a git submodule.
- `public/`: Build output. Never edit by hand.
- `config.yml`: Site configuration (ja-JP, PaperMod).
- `scripts/og-image-generator/`: TypeScript tool to generate OpenGraph images.

## Build, Test, and Development Commands
```bash
# Run locally (includes drafts)
hugo server -D

# Production build (outputs to public/)
hugo --gc --minify

# Generate OpenGraph images
cd scripts/og-image-generator && npm run generate
# (use `npm run build`, `npm run start`, or `npm run test` as needed)

# Initialize/update theme submodule
git submodule update --init --recursive
```

## Coding Style & Naming Conventions
- Markdown: place images alongside the post; use frontmatter; slugs in kebab-case.
- YAML/TOML: 2-space indentation; keep keys consistent with existing `config.yml`.
- TypeScript (OG tool): 2 spaces, camelCase, descriptive names; keep imports ordered.
- Filenames: kebab-case for content and assets, avoid spaces and non-ASCII in paths.

## Testing Guidelines
- No unit test suite for the Hugo site; validate by running `hugo` with no errors/warnings and checking pages locally.
- For OG images, run `npm run test` and verify outputs appear in `static/og-images/` and are referenced correctly in templates.
- Before PRs, smoke-test `hugo server -D` and click key pages (home, posts, tags, about).

## Commit & Pull Request Guidelines
- Commits use short prefixes seen in history: `feat:`, `fix:`, `style:`, `add post:`.
- PRs should include: purpose summary, linked issues, screenshots (if visual), and notes on content/SEO impact.
- If changing theme or templates, mention whether `themes/` submodule updates are required.
- Do not commit `public/` or `node_modules/` from the OG tool.

## Security & Configuration Tips
- Keep `baseURL` and language settings in `config.yml` accurate for GitHub Pages.
- Avoid secrets in content or config; this repo is public.
