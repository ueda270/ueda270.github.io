import path from "path";
import { registerFonts, generateOgImage, CONFIG } from "./index";
// Note: We don't import CSS files directly in Node.js

// Test function to generate a sample OpenGraph image
async function generateTestImage(): Promise<void> {
  // Register fonts
  await registerFonts(CONFIG);
  console.log("Generating test OpenGraph image...");

  const title = "Test OpenGraph Image";
  const outputPath = path.join(process.cwd(), "test-og-image.png");
  generateOgImage(title, outputPath, CONFIG, "en");
  console.log(`Test image generated at: ${outputPath}`);
}

// Run the test
generateTestImage().catch((error) => {
  console.error("Error generating test image:", error);
  process.exit(1);
});
