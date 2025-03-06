#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * This script optimizes all images in the public directory to improve page load times.
 * It uses sharp to resize and compress images, and creates WebP and AVIF versions.
 *
 * Usage:
 * node scripts/optimize-images.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const glob = require("glob");

// Configuration
const config = {
  // Directories to scan for images
  directories: ["public", "src/assets"],
  // Image extensions to process
  extensions: [".jpg", ".jpeg", ".png", ".gif"],
  // Sizes to generate (width in pixels)
  sizes: [640, 750, 828, 1080, 1200, 1920],
  // Quality settings (0-100)
  quality: {
    jpeg: 80,
    webp: 75,
    avif: 60,
  },
  // Skip files larger than this size (in bytes)
  maxFileSize: 10 * 1024 * 1024, // 10MB
};

// Create optimized directory if it doesn't exist
const optimizedDir = path.join(process.cwd(), "public", "optimized");
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Function to get all image files
function getImageFiles() {
  let files = [];

  config.directories.forEach((dir) => {
    config.extensions.forEach((ext) => {
      const pattern = path.join(process.cwd(), dir, `**/*${ext}`);
      const matches = glob.sync(pattern);
      files = [...files, ...matches];
    });
  });

  return files;
}

// Function to optimize a single image
async function optimizeImage(filePath) {
  try {
    const stats = fs.statSync(filePath);

    // Skip large files
    if (stats.size > config.maxFileSize) {
      console.log(`Skipping large file: ${filePath}`);
      return;
    }

    const filename = path.basename(filePath);
    const fileExt = path.extname(filePath).toLowerCase();
    const baseName = path.basename(filePath, fileExt);

    // Get image metadata
    const metadata = await sharp(filePath).metadata();

    // Process each size
    for (const size of config.sizes) {
      // Skip if the original is smaller
      if (metadata.width <= size) continue;

      const resizeOptions = {
        width: size,
        withoutEnlargement: true,
      };

      // Create directory for this size if it doesn't exist
      const sizeDir = path.join(optimizedDir, `w${size}`);
      if (!fs.existsSync(sizeDir)) {
        fs.mkdirSync(sizeDir, { recursive: true });
      }

      // Original format (JPEG/PNG)
      await sharp(filePath)
        .resize(resizeOptions)
        .jpeg({ quality: config.quality.jpeg })
        .toFile(path.join(sizeDir, `${baseName}.jpg`));

      // WebP format
      await sharp(filePath)
        .resize(resizeOptions)
        .webp({ quality: config.quality.webp })
        .toFile(path.join(sizeDir, `${baseName}.webp`));

      // AVIF format
      await sharp(filePath)
        .resize(resizeOptions)
        .avif({ quality: config.quality.avif })
        .toFile(path.join(sizeDir, `${baseName}.avif`));
    }

    console.log(`Optimized: ${filename}`);
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error);
  }
}

// Main function
async function main() {
  console.log("Starting image optimization...");

  const files = getImageFiles();
  console.log(`Found ${files.length} images to process`);

  // Process files in batches to avoid memory issues
  const batchSize = 5;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(batch.map((file) => optimizeImage(file)));
    console.log(
      `Processed ${Math.min(i + batchSize, files.length)}/${
        files.length
      } images`
    );
  }

  console.log("Image optimization complete!");
  console.log(`Optimized images are in: ${optimizedDir}`);
  console.log(
    "Use these images with the Next.js Image component for best performance."
  );
}

main().catch(console.error);
