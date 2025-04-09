import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";
// Note: We don't import CSS files directly in Node.js

// Configuration
type Config = {
  width: number;
  height: number;
  contentDir: string;
  outputDir: string;
  defaultBackground: string;
  blogName: string;
  fontFamily: string;
  fontFamilyJP: string;
  fontsDir: string;
};

export const CONFIG: Config = {
  width: 1200,
  height: 630,
  contentDir: path.join(process.cwd(), "..", "..", "content"),
  outputDir: path.join(process.cwd(), "..", "..", "static", "og-images"),
  defaultBackground: path.join(
    process.cwd(),
    "..",
    "..",
    "static",
    "opengraph-image.png"
  ),
  blogName: "27ログ",
  fontFamily: "Noto Sans",
  fontFamilyJP: "Noto Sans JP",
  fontsDir: path.join(process.cwd(), "fonts"),
};

// Register fonts from downloaded Google Fonts
export async function registerFonts(config: Config): Promise<void> {
  try {
    // Ensure fonts directory exists
    if (!(await fs.pathExists(config.fontsDir))) {
      console.error(`Fonts directory not found: ${config.fontsDir}`);
      console.log(
        'Please run "npm run download-fonts" first to download the required fonts.'
      );
      return;
    }

    // Find font files in the fonts directory
    const fontFiles = await fs.readdir(config.fontsDir);

    // Find Noto Sans Regular
    const notoSansRegular = fontFiles.find(
      (file) =>
        (file.includes("NotoSans") && file.includes("Regular")) ||
        (file.includes("Noto-Sans") && file.includes("400"))
    );

    // Find Noto Sans Bold
    const notoSansBold = fontFiles.find(
      (file) =>
        (file.includes("NotoSans") && file.includes("Bold")) ||
        (file.includes("Noto-Sans") && file.includes("700"))
    );

    // Find Noto Sans JP Regular
    const notoSansJPRegular = fontFiles.find(
      (file) =>
        (file.includes("NotoSansJP") && file.includes("Regular")) ||
        (file.includes("Noto-Sans-JP") && file.includes("400"))
    );

    // Find Noto Sans JP Bold
    const notoSansJPBold = fontFiles.find(
      (file) =>
        (file.includes("NotoSansJP") && file.includes("Bold")) ||
        (file.includes("Noto-Sans-JP") && file.includes("700"))
    );

    // Register fonts if found
    if (notoSansRegular) {
      registerFont(path.join(config.fontsDir, notoSansRegular), {
        family: config.fontFamily,
      });
      console.log(`Registered: ${notoSansRegular}`);
    } else {
      console.warn("Noto Sans Regular font not found");
    }

    if (notoSansBold) {
      registerFont(path.join(config.fontsDir, notoSansBold), {
        family: config.fontFamily,
        weight: "bold",
      });
      console.log(`Registered: ${notoSansBold}`);
    } else {
      console.warn("Noto Sans Bold font not found");
    }

    if (notoSansJPRegular) {
      registerFont(path.join(config.fontsDir, notoSansJPRegular), {
        family: config.fontFamilyJP,
      });
      console.log(`Registered: ${notoSansJPRegular}`);
    } else {
      console.warn("Noto Sans JP Regular font not found");
    }

    if (notoSansJPBold) {
      registerFont(path.join(config.fontsDir, notoSansJPBold), {
        family: config.fontFamilyJP,
        weight: "bold",
      });
      console.log(`Registered: ${notoSansJPBold}`);
    } else {
      console.warn("Noto Sans JP Bold font not found");
    }

    console.log("Fonts registered successfully");
  } catch (error) {
    console.error("Error registering fonts:", error);
    console.log("Falling back to system fonts");
  }
}

// Check if text contains Japanese characters
function containsJapanese(text: string): boolean {
  return /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/.test(
    text
  );
}

// Generate OpenGraph image for a single post
export async function generateOgImage(
  title: string,
  outputPath: string,
  config: Config,
  language: string = "en"
): Promise<void> {

  // Create canvas
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext("2d");

  // Load background image
  try {
    const backgroundImage = await loadImage(config.defaultBackground);
    ctx.drawImage(backgroundImage, 0, 0, config.width, config.height);
  } catch (error) {
    console.error(`Error loading background image: ${error}`);
    // Use a solid color background as fallback
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, config.width, config.height);
  }

  // Determine font family based on content
  const hasJapanese = containsJapanese(title);
  const fontFamily = hasJapanese ? config.fontFamilyJP : config.fontFamily;

  // Draw title
  ctx.fillStyle = "#1e1e1e";
  ctx.textBaseline = "middle";

  // Calculate font size and handle text wrapping
  let fontSize = 60;
  const maxWidth = config.width * 0.8;
  const lineHeight = fontSize * 1.2;

  // Adjust font size for longer titles
  if (title.length > 50) {
    fontSize = 48;
  } else if (title.length > 80) {
    fontSize = 40;
  }

  ctx.font = `bold ${fontSize}px "${fontFamily}"`;

  // Wrap text function
  function wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    // Handle Japanese text differently (character by character)
    if (hasJapanese) {
      const chars = text.split("");
      currentLine = chars[0];

      for (let i = 1; i < chars.length; i++) {
        const char = chars[i];
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);
      return lines;
    }

    // Handle other languages (word by word)
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + " " + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  // Draw wrapped text
  const lines = wrapText(title, maxWidth);
  const totalTextHeight = lines.length * lineHeight;
  const textY = (config.height - totalTextHeight) / 2;

  ctx.textAlign = "left";
  lines.forEach((line, index) => {
    ctx.fillText(line, 0.1 * config.width, textY + index * lineHeight);
  });

  // Draw blog name
  ctx.font = `bold 32px "${fontFamily}"`;
  ctx.textAlign = "center";
  ctx.fillText(config.blogName, config.width / 2, config.height - 100);

  // Save the image
  const buffer = canvas.toBuffer("image/png");
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, buffer);

  console.log(`Generated OG image: ${outputPath}`);
}

// Process all blog posts
async function processAllPosts(config: Config): Promise<void> {
  // Ensure output directory exists
  await fs.ensureDir(config.outputDir);

  // Find all markdown files in content directory
  const contentGlob = path.join(config.contentDir, "**", "*.md");
  const markdownFiles = await glob(contentGlob);

  console.log(`Found ${markdownFiles.length} markdown files`);

  // Process each file
  for (const filePath of markdownFiles) {
    try {
      // Read file content
      const content = await fs.readFile(filePath, "utf-8");

      // Parse frontmatter
      const { data } = matter(content);
      const title = data.title || "Untitled";
      const language = data.language || "en";

      // Determine output path
      const relativePath = path.relative(config.contentDir, filePath);
      const relativeDir = path.dirname(relativePath);
      const baseName = path.basename(filePath, path.extname(filePath));

      // Handle index.md files specially
      const outputFileName =
        baseName === "index" ? path.basename(relativeDir) : baseName;

      const outputPath = path.join(
        config.outputDir,
        relativeDir,
        `${outputFileName}.png`
      );

      // Generate OG image
      await generateOgImage(title, outputPath, config, language);
    } catch (error) {
      console.error(`Error processing file ${filePath}: ${error}`);
    }
  }
}

// Main function
async function main(): Promise<void> {
  try {
    console.log("Starting OpenGraph image generation...");

    // Call registerFonts for logging purposes
    await registerFonts(CONFIG);

    // Process all posts
    await processAllPosts(CONFIG);

    console.log("OpenGraph image generation completed successfully!");
  } catch (error) {
    console.error("Error generating OpenGraph images:", error);
    process.exit(1);
  }
}

// Run the main function
main();
