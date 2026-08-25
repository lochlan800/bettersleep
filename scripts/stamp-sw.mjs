// Stamps the service worker with the current build's asset hash so that each
// deploy gets its own cache name. Without this the cache name is constant,
// the activate handler's cleanup never fires, and browsers can keep serving
// an old build to people who already have the app installed.
import { readFileSync, writeFileSync } from 'fs'

const html = readFileSync('dist/index.html', 'utf8')
const match = html.match(/assets\/index-([A-Za-z0-9_-]+)\.js/)

if (!match) {
  console.error('stamp-sw: could not find the hashed JS bundle in dist/index.html')
  process.exit(1)
}

const buildId = match[1]
const swPath = 'dist/sw.js'
const sw = readFileSync(swPath, 'utf8')

if (!sw.includes('__BUILD_ID__')) {
  console.error('stamp-sw: __BUILD_ID__ placeholder missing from sw.js')
  process.exit(1)
}

writeFileSync(swPath, sw.replaceAll('__BUILD_ID__', buildId))
console.log(`stamp-sw: cache name set to myrunningdiary-${buildId}`)
