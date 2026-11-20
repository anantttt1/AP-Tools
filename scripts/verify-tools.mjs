
import fs from 'node:fs'
const catalog = fs.readFileSync(new URL('../src/data/tools.ts', import.meta.url), 'utf8')
const processor = fs.readFileSync(new URL('../src/lib/processor.ts', import.meta.url), 'utf8')
const extendedProcessor = fs.readFileSync(new URL('../src/lib/extendedProcessor.ts', import.meta.url), 'utf8')
const toolIds = [...catalog.matchAll(/"id": "([^"]+)"/g)].map(m => m[1])
const processorIds = new Set([processor, extendedProcessor].flatMap(source => [...source.matchAll(/case '([^']+)'/g)].map(m => m[1])))
const interactive = new Set(['stopwatch','countdown','pomodoro','notes','todo'])
const duplicates = toolIds.filter((id, i) => toolIds.indexOf(id) !== i)
const missing = toolIds.filter(id => !processorIds.has(id) && !interactive.has(id))
if (toolIds.length < 300) throw new Error(`Expected at least 300 tools, found ${toolIds.length}`)
if (duplicates.length) throw new Error(`Duplicate tool IDs: ${duplicates.join(', ')}`)
if (missing.length) throw new Error(`Tools without processor or interactive widget: ${missing.join(', ')}`)
console.log(`Catalog check passed: ${toolIds.length} unique tools; every tool has a processor or interactive widget.`)
