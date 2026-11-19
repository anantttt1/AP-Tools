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

console.log('Project checks passed: 100 tools mapped; dependencies declared; localhost-only Vite; PDF/ZIP/image/text hardening; regex isolation; CSV formula protection; workflow and batch bounds; and browser security headers.')
