#!/usr/bin/env node

/**
 * Critical Image Optimization Script
 * Converts the large images identified in Lighthouse report to WebP and AVIF
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUBLIC_DIR = path.join(__dirname, '..', 'public')

// Critical images from Lighthouse report
const CRITICAL_IMAGES = [
  'about_pfp.png',
  'Damien.jpg', 
  'keimyung_logo.png',
  'acoris_logo.jpg',
  'Henri_poincaré_logo.png',
  'Logo-plus-simple.png'
]

async function optimizeCriticalImage(imagePath, current, total) {
  const baseName = path.parse(imagePath).name
  const extension = path.parse(imagePath).ext
  const dir = path.dirname(imagePath)
  
  try {
    console.log(`[${current}/${total}] Processing: ${path.basename(imagePath)}`)
    
    const metadata = await sharp(imagePath).metadata()
    console.log(`  📏 Size: ${metadata.width}x${metadata.height}, ${Math.round(metadata.size / 1024)}KB`)
    
    // WebP version
    const webpPath = path.join(dir, `${baseName}.webp`)
    if (!fs.existsSync(webpPath)) {
      await sharp(imagePath)
        .webp({ quality: 85, effort: 4 })
        .toFile(webpPath)
      
      const webpStats = fs.statSync(webpPath)
      console.log(`  ✓ WebP: ${Math.round(webpStats.size / 1024)}KB (${Math.round(((metadata.size - webpStats.size) / metadata.size) * 100)}% smaller)`)
    } else {
      console.log(`  ⏭ WebP exists`)
    }
    
    // AVIF version
    const avifPath = path.join(dir, `${baseName}.avif`)
    if (!fs.existsSync(avifPath)) {
      await sharp(imagePath)
        .avif({ quality: 70, effort: 4 })
        .toFile(avifPath)
      
      const avifStats = fs.statSync(avifPath)
      console.log(`  ✓ AVIF: ${Math.round(avifStats.size / 1024)}KB (${Math.round(((metadata.size - avifStats.size) / metadata.size) * 100)}% smaller)`)
    } else {
      console.log(`  ⏭ AVIF exists`)
    }
    
  } catch (error) {
    console.error(`✗ Error processing ${path.basename(imagePath)}:`, error.message)
  }
}

async function main() {
  console.log('🚀 Optimizing critical images for performance...\n')

  let processedCount = 0
  
  for (const imageName of CRITICAL_IMAGES) {
    const imagePath = path.join(PUBLIC_DIR, imageName)
    
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠ Skipping missing: ${imageName}`)
      continue
    }
    
    processedCount++
    await optimizeCriticalImage(imagePath, processedCount, CRITICAL_IMAGES.length)
    console.log('')
  }

  console.log('✅ Critical image optimization complete!')
  console.log('\n📈 Expected Performance Impact:')
  console.log('• Faster First Contentful Paint (FCP)')
  console.log('• Reduced Largest Contentful Paint (LCP)')
  console.log('• Better Lighthouse performance score')
  console.log('• ~1.7MB bandwidth savings on initial load')
}

main().catch(console.error)