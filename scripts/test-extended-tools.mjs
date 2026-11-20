import assert from 'node:assert/strict'
import { createHmac, webcrypto } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const tempPath = path.join(process.cwd(), 'scripts', '.extended-processor-test.mjs')
const source = fs.readFileSync(path.join(process.cwd(), 'src/lib/extendedProcessor.ts'), 'utf8')
fs.writeFileSync(tempPath, ts.transpile(source, { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }))
const { processExtendedTool } = await import(pathToFileURL(tempPath).href + '?test=' + Date.now())

if (!globalThis.crypto) globalThis.crypto = webcrypto

const run = async (id, input = '', secondary = '') => {
  const result = await processExtendedTool(id, input, secondary)
  assert.ok(result && (result.kind === 'text' || result.kind === 'html'), `${id} returned an invalid result shape`)
  return result.value
}
const same = async (id, input, expected, secondary = '') => {
  assert.equal(await run(id, input, secondary), expected, `${id} produced an unexpected result`)
}

await same('camel-case', 'Hello AP Tools', 'helloApTools')
await same('pascal-case', 'hello ap tools', 'HelloApTools')
await same('snake-case', 'Hello AP Tools', 'hello_ap_tools')
await same('kebab-case', 'Hello AP Tools', 'hello-ap-tools')
await same('line-breaks-remove', 'hello\nworld', 'hello world')
await same('line-numbers-add', 'A\nB', '1. A\n2. B')
await same('line-numbers-remove', '1. A\n2. B', 'A\nB')
await same('title-case', 'hello world', 'Hello World')
await same('sentence-case', 'HELLO WORLD. GOOD MORNING.', 'Hello world. Good morning.')
await same('text-to-hex', 'Hi', '48 69')
await same('hex-to-text', '48 69', 'Hi')
await same('text-to-decimal', 'Hi', '72 105')
await same('decimal-to-text', '72 105', 'Hi')
await same('unicode-escape', 'A😊', 'A\\u{1f60a}')
await same('unicode-unescape', 'A\\u{1f60a}', 'A😊')
await same('markdown-escape', 'a*b', 'a\\*b')
await same('markdown-unescape', 'a\\*b', 'a*b')
await same('json-stringify-text', 'hello "world"', '"hello \\"world\\""')
await same('json-parse-text', '"hello"', 'hello')
await same('lines-to-json', 'red\nblue', '[\n  "red",\n  "blue"\n]')
await same('json-to-lines', '["red","blue"]', 'red\nblue')
assert.equal((await run('csv-to-tsv', 'name,score\nAda,10')).replace(/\r\n/g, '\n'), 'name\tscore\nAda\t10')
assert.equal((await run('tsv-to-csv', 'name\tscore\nAda\t10')).replace(/\r\n/g, '\n'), 'name,score\nAda,10')
assert.ok((await run('csv-to-tsv', 'value\n=1+1')).includes("'=1+1"), 'CSV-to-TSV must neutralize formula-leading cells')
assert.ok((await run('tsv-to-csv', 'value\n@SUM(A1:A2)')).includes("'@SUM(A1:A2)"), 'TSV-to-CSV must neutralize formula-leading cells')
await same('json-sort-keys', '{"z":1,"a":2}', '{\n  "a": 2,\n  "z": 1\n}')
assert.deepEqual(JSON.parse(await run('json-flatten', '{"user":{"name":"Ada","active":true}}')), { 'user.name': 'Ada', 'user.active': true })
assert.deepEqual(JSON.parse(await run('json-unflatten', '{"user.name":"Ada","user.active":true}')), { user: { name: 'Ada', active: true } })
await same('base64url-encoder', 'hello', 'aGVsbG8')
await same('base64url-decoder', 'aGVsbG8', 'hello')
await same('sql-escape', "O'Reilly", "'O''Reilly'")
await same('sql-minifier', "SELECT '-- not a comment' AS note /* remove me */ FROM users -- trailing comment\nWHERE active=1", "SELECT '-- not a comment' AS note FROM users WHERE active=1")
const formattedSql = await run('sql-formatter', "select 'from and where' as note from users")
assert.ok(formattedSql.includes("'from and where'"), 'SQL formatter must preserve quoted words')
assert.ok(formattedSql.includes('\nFROM users'), 'SQL formatter must put FROM on a new line')
assert.match(await run('url-parser', 'https://example.com/path?q=1'), /Hostname: example\.com/)
assert.match(await run('query-string-parser', 'tag=one&tag=two'), /"tag": \[\n    "one",\n    "two"/)
await same('query-string-builder', '{"tag":["one","two"],"q":"hello world"}', 'tag=one&tag=two&q=hello+world')
assert.match(await run('uuid-validator', '550e8400-e29b-41d4-a716-446655440000'), /Valid UUID/)
assert.match(await run('email-validator', 'ada@example.com'), /syntax looks valid/)
assert.match(await run('ipv4-validator', '192.168.1.1'), /Valid IPv4/)
assert.match(await run('mac-validator', '00:1A:2B:3C:4D:5E'), /Valid MAC/)
assert.match(await run('isbn-validator', '9780306406157'), /Valid ISBN-13/)
assert.match(await run('credit-card-validator', '4242424242424242'), /Luhn checksum passed/)
assert.match(await run('color-contrast-checker', '#000000,#FFFFFF'), /21\.00:1/)
await same('rgb-to-hex', '99,91,255', '#635BFF')
assert.match(await run('hex-to-rgb', '#635BFF'), /RGB: 99, 91, 255/)
await same('px-to-rem', '24,16', '1.5rem')
await same('rem-to-px', '1.5,16', '24px')
assert.match(await run('color-contrast-checker', '#000000,#FFFFFF'), /21\.00:1/)
await same('decimal-to-binary', '42', '101010')
await same('decimal-to-hex', '255', 'FF')
await same('hex-to-decimal', 'FF', '255')
await same('decimal-to-octal', '64', '100')
await same('roman-to-decimal', 'MCMXCIV', '1994')
await same('decimal-to-roman', '1994', 'MCMXCIV')
await same('number-to-words', '12345', 'twelve thousand three hundred forty-five')
assert.match(await run('prime-checker', '97'), /is prime/)
assert.match(await run('prime-checker', '99'), /is not prime/)
await same('factorial-calculator', '10', '3628800')
await same('gcd-lcm-calculator', '24,36', 'GCD: 12\nLCM: 72')
await same('percentage-change', '100,125', 'Change: 25.00%\nIncrease')
await same('tip-calculator', '1200,10,3', 'Tip: 120.00\nTotal: 1320.00\nPer person: 440.00')
await same('date-add-days', '2026-01-31,1', '2026-02-01')
await same('working-days-calculator', '2026-01-05,2026-01-09', 'Weekdays (inclusive): 5\nWeekends excluded: yes\nPublic holidays excluded: no')
assert.match(await run('time-duration-calculator', '09:30,17:45'), /Duration: 8 hours, 15 minutes, 0 seconds/)
assert.match(await run('reading-time-estimator', 'one two three four', '200'), /Words: 4/)
const message = 'AP Creative Tools HMAC check'
const key = 'local-test-secret'
const expectedHmac = createHmac('sha256', key).update(message).digest('hex')
await same('hmac-sha256', message, expectedHmac, key)
assert.ok((await run('csv-to-html', 'name\n<script>alert(1)</script>')).includes('&lt;script&gt;'))
assert.ok((await run('text-to-html', '<img src=x onerror=alert(1)>')).includes('&lt;img'))

await assert.rejects(() => run('hex-to-text', 'GG'), /hexadecimal/i)
await assert.rejects(() => run('json-parse-text', '{bad json'), /JSON/i)
await assert.rejects(() => run('roman-to-decimal', 'IIII'), /canonical/i)
await assert.rejects(() => run('prime-checker', '9007199254740991'), /1,000,000,000/)
await assert.rejects(() => run('base64url-decoder', '%%%'), /Base64/i)
await assert.rejects(() => run('hmac-sha256', message, ''), /secret key/i)

console.log('Extended processor tests passed: transformations, encodings, JSON/CSV, HMAC, validators, colour, number systems, maths, dates, HTML escaping and invalid-input handling.')

fs.rmSync(tempPath, { force: true })
