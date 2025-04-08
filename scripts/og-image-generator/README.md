# OpenGraph Image Generator

This tool automatically generates OpenGraph images for blog articles. These images are used by social media platforms when sharing links to your blog posts.

## Features

- Generates OpenGraph images for all blog posts
- Supports multiple languages, including Japanese
- Uses the Canvas API for image generation
- Downloads and uses Google Fonts (Noto Sans and Noto Sans JP)
- Integrates with GitHub Actions for automatic generation

## How It Works

1. The script scans all markdown files in the `content` directory
2. For each file, it extracts the title from the frontmatter
3. It generates an OpenGraph image with the title and blog name
4. The image is saved to the `static/og-images` directory, preserving the content directory structure
5. The custom OpenGraph template in `layouts/partials/templates/opengraph.html` uses these images

## Local Development

To run the generator locally:

```bash
cd scripts/og-image-generator
npm install
npm run download-fonts  # Download the required fonts first
npm run generate        # Generate the OpenGraph images
```

## GitHub Actions Integration

The OpenGraph images are automatically generated when:

1. You push changes to markdown files in the `content` directory
2. You manually trigger the workflow

The Hugo build workflow will run after the OpenGraph image generation is complete.

## Configuration

You can modify the configuration in `src/index.ts`:

```typescript
const CONFIG = {
  width: 1200,
  height: 630,
  contentDir: path.join(process.cwd(), 'content'),
  outputDir: path.join(process.cwd(), 'static', 'og-images'),
  defaultBackground: path.join(process.cwd(), 'static', 'opengraph-image.png'),
  blogName: 'もにょログ',
  fontFamily: 'Noto Sans',
  fontFamilyJP: 'Noto Sans JP',
  fontsDir: path.join(process.cwd(), 'fonts'),
};
```

## Customization

To customize the appearance of the OpenGraph images:

1. Modify the `generateOgImage` function in `src/index.ts`
2. Replace the default background image at `static/opengraph-image.png`
3. Adjust the font settings in the configuration

## Font Usage

This project downloads and uses Google Fonts:

- [Noto Sans](https://fonts.google.com/specimen/Noto+Sans) - For Latin text
- [Noto Sans JP](https://fonts.google.com/specimen/Noto+Sans+JP) - For Japanese text

The fonts are downloaded automatically when you run:

```bash
npm run download-fonts
```

This script fetches the font files from Google Fonts and stores them in the `scripts/og-image-generator/fonts` directory. The font files are then used by the Canvas API to render text in the OpenGraph images.

## GitHub Actions Integration

The GitHub Actions workflow will:

1. Download the required fonts
2. Generate OpenGraph images for all blog posts
3. Commit the generated images back to the repository
4. Trigger the Hugo build workflow

This ensures that your OpenGraph images are always up-to-date with your content.