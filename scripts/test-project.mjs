import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const pkg = JSON.parse(read('package.json'))
const catalog = read('src/data/tools.ts')
const processor = read('src/lib/processor.ts')
const toolPage = read('src/pages/ToolPage.tsx')
const vite = read('vite.config.ts')
const serviceWorker = read('public/sw.js')
const headers = read('_headers')
const workflows = read('src/pages/Workflows.tsx')
const batchCenter = read('src/pages/BatchCenter.tsx')
const settings = read('src/pages/Settings.tsx')
const dependencies = {...pkg.dependencies, ...pkg.devDependencies}

const ids = [...catalog.matchAll(/"id": "([^"]+)"/g)].map(match => match[1])
const cases = new Set([...processor.matchAll(/case '([^']+)'/g)].map(match => match[1]))
const interactive = new Set(['stopwatch', 'countdown', 'pomodoro', 'notes', 'todo'])
assert.equal(ids.length, 100, `Expected 100 catalog entries, got ${ids.length}`)
assert.equal(new Set(ids).size, 100, 'Catalog IDs must be unique')
for (const id of ids) assert.ok(cases.has(id) || interactive.has(id), `Missing processor/widget for ${id}`)

const importedPackages = new Set()
for (const file of ['src/main.tsx', 'src/App.tsx', 'src/components/Layout.tsx', 'src/components/ToolCard.tsx', 'src/pages/Home.tsx', 'src/pages/Tools.tsx', 'src/pages/ToolPage.tsx', 'src/pages/BatchCenter.tsx', 'src/pages/Workflows.tsx', 'src/pages/Workspace.tsx', 'src/pages/Settings.tsx', 'src/store/useAppStore.ts', 'src/lib/processor.ts', 'vite.config.ts']) {
  const source = read(file)
  for (const match of source.matchAll(/from\s*['"]([^./][^'"]*)['"]|import\s*['"]([^./][^'"]*)['"]/g)) {
    const specifier = match[1] || match[2]
    const name = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0]
    if (name !== 'node:') importedPackages.add(name)
  }
}
for (const name of importedPackages) assert.ok(dependencies[name], `Imported package ${name} is not declared in package.json`)

assert.ok(Number.parseInt(pkg.devDependencies.vite.match(/\d+/)?.[0] || '0', 10) >= 8, 'Vite must be on the patched Vite 8 release line')
assert.ok(Number.parseInt(pkg.dependencies['react-router-dom'].match(/(\d+)\.(\d+)/)?.[2] || '0', 10) >= 18, 'React Router must be on the patched 7.18+ line')
assert.ok(pkg.dependencies.react.startsWith('^19.3.') && pkg.dependencies['react-dom'].startsWith('^19.3.'), 'React and React DOM should use the current patched 19.3 line')
assert.ok(vite.includes("host: '127.0.0.1'"), 'Development server must bind to localhost only')
assert.ok(vite.includes('port: 3000') && vite.includes('strictPort: false'), 'Development server must use a Windows-friendly port with fallback enabled')
assert.ok(!vite.includes('0.0.0.0'), 'Development server must not be exposed on all interfaces')
assert.ok(Number.parseInt(pkg.dependencies['pdfjs-dist'].match(/\d+\.(\d+)/)?.[1] || '0', 10) >= 2, 'PDF.js must be on the patched 6.x line with the arbitrary-JavaScript advisory fixed')
assert.ok(!processor.includes('isEvalSupported:'), 'Removed PDF.js options must not be passed to the current typed API')
assert.ok(processor.includes('enableXfa:false'), 'PDF.js XFA support must be disabled')
assert.ok(processor.includes('safeZipPath'), 'ZIP paths must be validated before archive writes')
assert.ok(headers.includes('Content-Security-Policy:'), 'Static hosting security headers are required')
assert.ok(headers.includes("object-src 'none'"), 'CSP must disable embedded objects')
assert.ok(serviceWorker.includes("url.search) return"), 'Service worker must not cache query/API responses')
assert.ok(serviceWorker.includes("startsWith('/assets/')"), 'Service worker must cache only app assets')
assert.ok(!toolPage.includes('dangerouslySetInnerHTML'), 'UI must not inject unsanitized HTML into the application DOM')
assert.ok(processor.includes('runRegexInWorker') && processor.includes('Regular expression timed out'), 'Regex evaluation must be isolated and time-limited')
assert.ok(processor.includes('MAX_ARCHIVE_ENTRIES = 250') && processor.includes('MAX_ARCHIVE_OUTPUT_BYTES = 120 * 1024 * 1024'), 'Archive resource limits must be enforced')
assert.ok(processor.includes('MAX_IMAGE_PIXELS = 32_000_000') && processor.includes('MAX_PDF_TOTAL_RENDER_PIXELS = 50_000_000'), 'Image/PDF pixel limits must be enforced')
assert.ok(processor.includes('iterations=600000') && processor.includes("name:'AES-GCM'"), 'Text encryption must use PBKDF2 with AES-GCM')
assert.ok(processor.includes('safeCell') && processor.includes("`'${value}`"), 'JSON-to-CSV must escape formula-leading values')
assert.ok(processor.includes('isPng=') && processor.includes('isJpeg='), 'Images-to-PDF must check binary signatures, not only MIME labels')
assert.ok(processor.includes('Mode: ${modeText}') && processor.includes('frequencies=new Map'), 'Average calculator must include mode as well as mean and median')
assert.ok(processor.includes("type==='image/jpeg'"), 'JPEG conversion must fill transparency with a white background')
assert.ok(workflows.includes('secondary: string') && workflows.includes('Saved workflows are stored unencrypted'), 'Workflow secondary inputs and storage warning must be explicit')
assert.ok(workflows.includes('step.secondary.length > 0'), 'Workflow save must block whitespace-only encryption passwords too')
assert.ok(batchCenter.includes('list.length>100') && batchCenter.includes('120*1024*1024'), 'Batch selection limits must be enforced before processing')
assert.ok(toolPage.includes('requestId.current') && toolPage.includes("id==='random-string'"), 'Tool runs must ignore stale results and expose random-string length')
assert.equal([...toolPage.matchAll(/'image-rotate':/g)].length, 1, 'Tool help object must not contain a duplicate image-rotate key')
assert.ok(settings.includes('Browser storage could not be cleared'), 'Settings must handle browser storage errors')

console.log('Project checks passed: 100 tools mapped; dependencies declared; localhost-only Vite; PDF/ZIP/image/text hardening; regex isolation; CSV formula protection; workflow and batch bounds; and browser security headers.')
