
import fs from 'node:fs'
const catalog = fs.readFileSync(new URL('../src/data/tools.ts', import.meta.url), 'utf8')
const match = catalog.match(/export const tools: Tool\[\] = (\[[\s\S]*?\]);/)
if (!match) {
  console.error('Could not parse tools array')
  process.exit(1)
}
let tools
try {
  tools = (0, eval)('(' + match[1] + ')')
} catch (e) {
  console.error('Failed to eval tools array', e)
  process.exit(1)
}
if (!Array.isArray(tools) || tools.length < 50) {
  console.error('Expected at least 50 tools, got', tools?.length)
  process.exit(1)
}
const ids = new Set()
for (const t of tools) {
  if (!t.id || !t.name || !t.category) {
    console.error('Invalid tool entry', t)
    process.exit(1)
  }
  if (ids.has(t.id)) {
    console.error('Duplicate tool id', t.id)
    process.exit(1)
  }
  ids.add(t.id)
}
console.log(`OK: ${tools.length} tools verified`)
