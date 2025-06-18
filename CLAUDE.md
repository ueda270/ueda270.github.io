# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Hugo Blog Architecture

This is a Hugo-based Japanese blog called "27ログ" using the PaperMod theme. The site is deployed to GitHub Pages.

### Core Structure
- **Content**: Blog posts are in `content/posts/` as markdown files with frontmatter
- **Theme**: Uses PaperMod theme in `themes/PaperMod/` (git submodule)
- **Config**: Site configuration in `config.yml` (Japanese language, blog name "27ログ")
- **Static Assets**: Images and OpenGraph images in `static/`
- **Generated Site**: Built files in `public/` directory

### Development Commands

```bash
# Start development server
hugo server -D  # -D: include draft posts

# Build site for production
hugo

# Generate OpenGraph images (from scripts/og-image-generator/)
cd scripts/og-image-generator
npm run generate
```

### OpenGraph Image Generation

Custom TypeScript tool at `scripts/og-image-generator/` that:
- Reads all markdown posts from `content/`
- Generates OpenGraph images using Canvas API
- Supports Japanese text with Noto Sans JP fonts
- Outputs images to `static/og-images/`
- Uses background template `static/opengraph-image.png`

Commands:
```bash
cd scripts/og-image-generator
npm run build    # Compile TypeScript
npm run start    # Generate images
npm run generate # Build and generate
npm run test     # Test functionality
```

### Content Organization
- Posts can be single markdown files or bundles (index.md in folder)
- Images for posts go in same directory as post
- Japanese content requires proper font handling in OG generator
- OpenSearch integration for specific pages using `with-opensearch` layout

### Theme Customization
- Custom CSS in `assets/css/extended/custom.css`
- Extended head template in `layouts/partials/extend_head.html`
- Custom OpenGraph templates in `layouts/partials/templates/`

### Important Notes
- Site uses Japanese language (ja-jp) as default
- Blog name configured as "27ログ" in both config.yml and OG generator
- OpenGraph images are auto-generated - don't edit manually in static/og-images/
- Theme is git submodule - use `git submodule update` when needed