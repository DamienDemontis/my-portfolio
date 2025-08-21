#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts existing JPG images to WebP and AVIF formats
 * Run with: node scripts/optimize-images.js
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PHOTOGRAPHY_DIR = path.join(__dirname, '..', 'public', 'photography')
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png']
const MAX_WIDTH = 1920 // Maximum width for web display
const MAX_HEIGHT = 1080 // Maximum height for web display

async function optimizeImage(inputPath, outputDir, filename, current, total) {
  const baseName = path.parse(filename).name
  
  try {
    console.log(`[${current}/${total}] Processing: ${filename}`)
    
    // Get image metadata to check size
    const metadata = await sharp(inputPath).metadata()
    const needsResize = metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT
    
    // Create a base sharp instance with optional resizing
    const getSharpInstance = () => {
      let instance = sharp(inputPath)
      if (needsResize) {
        instance = instance.resize(MAX_WIDTH, MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true
        })
        console.log(`  📏 Resizing from ${metadata.width}x${metadata.height} to fit ${MAX_WIDTH}x${MAX_HEIGHT}`)
      }
      return instance
    }
    // Generate WebP version
    const webpPath = path.join(outputDir, `${baseName}.webp`)
    if (!fs.existsSync(webpPath)) {
      await getSharpInstance()
        .webp({ quality: 85, effort: 4 })
        .toFile(webpPath)
      console.log(`  ✓ Generated WebP: ${baseName}.webp`)
    } else {
      console.log(`  ⏭ Skipped WebP (exists): ${baseName}.webp`)
    }

    // Generate AVIF version
    const avifPath = path.join(outputDir, `${baseName}.avif`)
    if (!fs.existsSync(avifPath)) {
      await getSharpInstance()
        .avif({ quality: 70, effort: 4 })
        .toFile(avifPath)
      console.log(`  ✓ Generated AVIF: ${baseName}.avif`)
    } else {
      console.log(`  ⏭ Skipped AVIF (exists): ${baseName}.avif`)
    }

    // Optimize original (optional - reduces quality slightly but significant size reduction)
    const optimizedPath = path.join(outputDir, `${baseName}_optimized.jpg`)
    if (!fs.existsSync(optimizedPath)) {
      await getSharpInstance()
        .jpeg({ quality: 85, progressive: true })
        .toFile(optimizedPath)
      console.log(`  ✓ Optimized original: ${baseName}_optimized.jpg`)
    }

  } catch (error) {
    console.error(`✗ Error processing ${filename}:`, error.message)
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n')

  if (!fs.existsSync(PHOTOGRAPHY_DIR)) {
    console.error(`Photography directory not found: ${PHOTOGRAPHY_DIR}`)
    process.exit(1)
  }

  const files = fs.readdirSync(PHOTOGRAPHY_DIR)
  const imageFiles = files.filter(file => 
    SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase())
  )

  console.log(`Found ${imageFiles.length} image(s) to process:\n`)

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i]
    const inputPath = path.join(PHOTOGRAPHY_DIR, file)
    await optimizeImage(inputPath, PHOTOGRAPHY_DIR, file, i + 1, imageFiles.length)
    console.log('')
  }

  console.log('✅ Image optimization complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Test the optimized images in your application')
  console.log('2. Update image references if using _optimized versions')
  console.log('3. Deploy and check Lighthouse scores')
}

// Check if sharp is available
try {
  await import('sharp')
  main().catch(console.error)
} catch (error) {
  console.error('❌ Sharp is not installed. Install it with:')
  console.error('npm install --save-dev sharp')
  console.error('\nThen run this script again.')
  process.exit(1)
}