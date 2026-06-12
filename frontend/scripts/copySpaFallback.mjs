import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const distDirectory = path.resolve(scriptDirectory, '../dist')
const indexPath = path.join(distDirectory, 'index.html')
const fallbackPath = path.join(distDirectory, '404.html')

if (!existsSync(indexPath)) {
  console.error('[copySpaFallback] dist/index.html not found — run vite build first')
  process.exit(1)
}

copyFileSync(indexPath, fallbackPath)
console.log('[copySpaFallback] copied index.html → 404.html')
