
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ToolCard from '../components/ToolCard'
import { Download, Heart, RotateCcw, ShieldCheck, AlertCircle, Copy, FileUp, Clock3, Play, Pause, Square, Plus, Trash2 } from 'lucide-react'
import { tools } from '../data/tools'
import { useAppStore } from '../store/useAppStore'
import { processTool, type ProcessResult } from '../lib/processor'

const fileToolIds = new Set([
  'zip-creator','zip-extractor','file-type','file-size','file-hash','file-compare','bulk-rename',
  'pdf-merge','pdf-split','pdf-images','images-pdf','pdf-text','pdf-watermark','pdf-rotate','pdf-info','pdf-page-numbers','pdf-inspector','pdf-remove-pages','pdf-organize-pages','pdf-split-every-page','pdf-header-footer','pdf-metadata-editor','pdf-crop','pdf-flatten-forms','pdf-compare',
  'image-compress','image-resize','image-crop','image-convert','image-rotate','image-flip','image-grayscale','image-watermark','image-base64','image-metadata','image-color','favicon','image-collage','image-pdf'
])
const multipleIds = new Set(['zip-creator','file-compare','bulk-rename','pdf-merge','pdf-compare','images-pdf','image-pdf','image-collage'])
const help: Record<string,string> = {
  'pdf-split':'Upload a PDF. Enter page numbers separated by commas, e.g. 1,3,5. Leave blank to copy all pages.',
  'image-crop':'Enter crop rectangle as x,y,width,height in source-image pixels, e.g. 0,0,800,600.',
  'image-color':'Enter pixel coordinates as x,y, e.g. 10,10.',
  'emi':'Enter principal, annual interest rate (%), term in months, e.g. 500000,9,60.',
  'simple-interest':'Enter principal, annual rate (%), time in years, e.g. 10000,5,2.',
  'compound-interest':'Enter principal, annual rate (%), years, e.g. 10000,5,2.',
  'date-difference':'Enter two dates separated by a comma, e.g. 2026-01-01,2026-12-31.',
  'bmi':'Enter weight in kilograms and height in centimetres, e.g. 70,175.',
  'ratio':'Enter a ratio like 12:18.',
  'unit-length':'Enter value and unit, e.g. 5,km. Units: mm, cm, m, km, in, ft, yd, mi.',
  'unit-weight':'Enter value and unit, e.g. 70,kg. Units: mg, g, kg, tonne, lb, oz.',
  'unit-temp':'Enter value and unit C/F/K, e.g. 100,C.',
  'unit-data':'Enter value and unit, e.g. 5,GB. Units: B, KB, MB, GB, TB, KiB, MiB, GiB.',
  'unit-speed':'Enter value and unit, e.g. 100,km/h. Units: m/s, km/h, mph, knot.',
  'random-number':'Enter minimum and maximum separated by comma, e.g. 1,100.',
  'percentage':'Enter the base amount. Enter the percentage in the second field.',
  'gst':'Enter amount. Enter GST rate in the second field.',
  'discount':'Enter original price. Enter discount percentage in the second field.',
  'text-encrypt':'Enter text. Enter encryption password in the second field. Keep both safe.',
  'text-decrypt':'Paste AP TOOLS encrypted Base64 text. Enter password in the second field.',
  'regex':'Enter text to test. Enter regular expression in the second field.',
  'timestamp':'Enter Unix timestamp in seconds or milliseconds.',
  'password':'Enter desired password length (8–128).',
  'uuid':'Enter number of UUIDs to generate (1–100).',
  'random-string':'Enter optional allowed characters. Set output length in the second field.',
  'lorem':'Enter the number of placeholder paragraphs (1–30).',
  'pdf-watermark':'Upload a PDF. Enter watermark text below.',
  'pdf-rotate':'Upload a PDF. Enter rotation: 90, 180 or 270 degrees.',
  'image-watermark':'Upload an image. Enter watermark text in the second field.',
  'image-resize':'Upload an image and set maximum width/height.',
  'image-compress':'Upload an image and choose output quality and format.',
  'image-convert':'Upload an image and choose output format.',
  'image-rotate':'Upload an image. Enter rotation in the second field: 90, 180 or 270.',
  'file-compare':'Choose two text files.',
  'bulk-rename':'Choose files. Files are not renamed in place; a ZIP with renamed copies is created.',
  'images-pdf':'Choose JPG or PNG images. Each image becomes one PDF page.',
  'image-collage':'Choose two or more images to create a simple grid collage.',
  'pdf-inspector':'Inspect page count, dimensions and metadata for the selected PDF.'
}
const textPlaceholders: Record<string,string> = {
  'word-counter':'Paste or type text here...','case-converter':'Enter text to convert...','remove-spaces':'Paste text...','duplicate-lines':'Enter lines...','sort-lines':'Enter lines...','reverse-text':'Enter text...','text-diff':'Enter the first text block...','slug-generator':'Enter a title or phrase...','lorem':'3','markdown-preview':'# Hello AP TOOLS\n\nWrite **Markdown** here...','text-binary':'Enter text...','binary-text':'01001000 01101001','text-morse':'Hello world','morse-text':'.... . .-.. .-.. --- / .-- --- .-. .-.. -..',
  'json-format':'{"name":"AP TOOLS","free":true}','json-minify':'Paste JSON...','json-csv':'[{"name":"AP TOOLS","category":"Utility"}]','csv-json':'name,category\nAP TOOLS,Utility','xml-escape':'Enter HTML/XML text...','base64-encode':'Enter text...','base64-decode':'Paste Base64...','url-encode':'Enter URL or text...','url-decode':'Enter encoded URL...','jwt-decode':'Paste JWT token...','uuid':'1','regex':'Enter test text...','timestamp':'1735689600','html-minify':'Paste HTML...','css-gradient':'#635BFF','css-shadow':'0 4px 16px rgba(0,0,0,.12)','color-convert':'#635BFF','random-string':'Leave blank for default character set','hash-text':'Enter text to hash...','regex-escape':'Enter text to escape...','markdown-html':'# Hello\n\nMarkdown to HTML','html-preview':'<h1>Hello AP TOOLS</h1><p>Preview your HTML here.</p>',
  'calculator':'(25 + 5) * 2','percentage':'1000','gst':'1000','discount':'1000','emi':'500000,9,60','simple-interest':'10000,5,2','compound-interest':'10000,5,2','age':'2000-01-01','date-difference':'2026-01-01,2026-12-31','bmi':'70,175','average':'10,20,30,40','ratio':'12:18','unit-length':'5,km','unit-weight':'70,kg','unit-temp':'100,C','unit-data':'5,GB','unit-speed':'100,km/h','qr-generator':'https://example.com','barcode':'123456789012','password':'16','password-strength':'Enter password to check','text-encrypt':'Text to encrypt...','text-decrypt':'Encrypted Base64 payload...','random-number':'1,100'
}

const extendedHelp: Record<string,string> = {
  'lines-prefix':'Enter the text to add before each line in Additional input.',
  'lines-suffix':'Enter the text to add after each line in Additional input.',
  'markdown-table':'Paste CSV with a header row and at least one data row.',
  'csv-to-markdown':'Paste CSV with a header row and at least one data row.',
  'xml-formatter':'Paste well-formed XML. DTD and entity declarations are rejected for safety.',
  'xml-minifier':'Paste well-formed XML. DTD and entity declarations are rejected for safety.',
  'json-to-xml':'Paste a JSON object, array or scalar value.',
  'xml-to-json':'Paste well-formed XML. DTD and entity declarations are rejected for safety.',
  'color-contrast-checker':'Enter foreground and background HEX colours separated by a comma, e.g. #111111,#FFFFFF.',
  'rgb-to-hex':'Enter red, green and blue values from 0–255, e.g. 99,91,255.',
  'px-to-rem':'Enter pixel value and optional root font size, e.g. 24,16. Default root size is 16px.',
  'rem-to-px':'Enter rem value and optional root font size, e.g. 1.5,16. Default root size is 16px.',
  'aspect-ratio-calculator':'Enter whole-number width and height separated by a comma, e.g. 1920,1080.',
  'tip-calculator':'Enter bill, tip percentage and optional number of people, e.g. 1200,10,3.',
  'gcd-lcm-calculator':'Enter two whole numbers separated by a comma, e.g. 24,36.',
  'percentage-change':'Enter original and new values separated by a comma, e.g. 100,125.',
  'date-add-days':'Enter date and signed number of days, e.g. 2026-01-01,30.',
  'working-days-calculator':'Enter start and end dates as YYYY-MM-DD,YYYY-MM-DD. Public holidays are not excluded.',
  'time-duration-calculator':'Enter two times as HH:MM or HH:MM:SS separated by a comma, e.g. 09:30,17:45.',
  'number-to-words':'Enter a whole number from 0 to 999,999,999,999.',
  'prime-generator':'Enter the upper limit (2–1,000,000).',
  'fibonacci-generator':'Enter the number of Fibonacci terms (1–1,000).',
  'hmac-sha256':'Enter the message below and the secret key in Additional input. The key remains in this browser session.',
  'credit-card-validator':'Enter digits only or a card number with spaces/hyphens. This checks the Luhn checksum only.',
  'isbn-validator':'Enter an ISBN-10 or ISBN-13; spaces and hyphens are optional.',
  'pdf-remove-pages':'Enter page numbers to remove, separated by commas, e.g. 2,4.',
  'pdf-organize-pages':'Enter every page exactly once in the new order, e.g. 3,1,2. The number of entries must match the PDF page count.',
  'pdf-header-footer':'Enter header text, |, then footer text. Example: CONFIDENTIAL | Page copy.',
  'pdf-metadata-editor':'Enter JSON with supported fields: title, author, subject, keywords, creator, producer.',
  'pdf-crop':'Enter crop x,y,width,height in PDF points, e.g. 20,20,550,750. Must fit every page.',
  'reading-time-estimator':'Paste text below. Optional Additional input sets reading speed in words per minute (50–1,000); default is 200.'
}
const extendedPlaceholders: Record<string,string> = {
  'line-numbers-add':'Paste lines to number...','line-numbers-remove':'1. First line\\n2. Second line',
  'lines-prefix':'Paste lines to prefix...','lines-suffix':'Paste lines to suffix...','words-sort':'Paste words to sort...',
  'word-frequency':'Paste text to count word frequency...','keyword-density':'Paste content to calculate keyword density...',
  'sentence-count':'Paste sentences...','paragraph-count':'Paste paragraphs...','text-cleaner':'Paste text to clean...',
  'whitespace-normalizer':'Paste text with extra spaces or blank lines...','title-case':'the quick brown fox',
  'sentence-case':'THIS IS A SENTENCE. THIS IS ANOTHER.','camel-case':'hello world example','pascal-case':'hello world example',
  'snake-case':'Hello world example','kebab-case':'Hello world example','constant-case':'Hello world example',
  'alternating-case':'make this text alternate','remove-emojis':'Text 😊 with emojis 🚀','extract-emails':'Contact alex@example.com for help',
  'extract-urls':'Visit https://example.com for details','text-to-hex':'Hello','hex-to-text':'48 65 6c 6c 6f',
  'text-to-decimal':'Hello','decimal-to-text':'72 101 108 108 111','unicode-escape':'Hello नमस्ते',
  'unicode-unescape':'Hello \\u{1f680}','markdown-toc':'# Title\\n## Section one\\n### Details',
  'markdown-table':'name,score\\nAlex,95\\nSam,88','csv-to-markdown':'name,score\\nAlex,95\\nSam,88',
  'json-stringify-text':'Hello "world"','json-parse-text':'"Hello world"','lines-to-json':'apple\\nbanana\\ncherry',
  'json-to-lines':'["apple","banana","cherry"]','csv-to-tsv':'name,score\\nAlex,95','tsv-to-csv':'name\\tscore\\nAlex\\t95',
  'csv-to-html':'name,score\\nAlex,95','json-sort-keys':'{"z":1,"a":{"y":2,"b":3}}',
  'json-flatten':'{"user":{"name":"Alex","active":true}}','json-unflatten':'{"user.name":"Alex","user.active":true}',
  'xml-formatter':'<root><item>One</item><item>Two</item></root>','xml-minifier':'<root>  <item>One</item> </root>',
  'json-to-xml':'{"name":"Alex","score":95}','xml-to-json':'<user><name>Alex</name><score>95</score></user>',
  'css-formatter':'body{color:#333;margin:0;padding:8px}','css-minifier':'body { color: #333; margin: 0; }',
  'sql-formatter':'select id,name from users where active = 1 order by name','sql-minifier':'SELECT  id, name  FROM users;',
  'sql-escape':"O'Reilly",'url-parser':'https://example.com/path?name=Alex#top',
  'query-string-parser':'name=Alex&tag=one&tag=two','query-string-builder':'{"name":"Alex","tag":["one","two"]}',
  'base64url-encoder':'Hello world','base64url-decoder':'SGVsbG8gd29ybGQ',
  'uuid-validator':'550e8400-e29b-41d4-a716-446655440000','email-validator':'alex@example.com',
  'url-validator':'https://example.com','ipv4-validator':'192.168.1.1','mac-validator':'00:1A:2B:3C:4D:5E',
  'hex-color-validator':'#635BFF','credit-card-validator':'4242 4242 4242 4242','isbn-validator':'9780306406157',
  'color-contrast-checker':'#111111,#FFFFFF','color-shade-generator':'#635BFF','rgb-to-hex':'99,91,255',
  'hex-to-rgb':'#635BFF','px-to-rem':'24,16','rem-to-px':'1.5,16','aspect-ratio-calculator':'1920,1080',
  'binary-to-decimal':'101010','decimal-to-binary':'42','decimal-to-hex':'255','hex-to-decimal':'FF',
  'decimal-to-octal':'64','roman-to-decimal':'MCMXCIV','decimal-to-roman':'1994','number-to-words':'123456',
  'prime-checker':'97','prime-generator':'100','factorial-calculator':'10','fibonacci-generator':'10',
  'gcd-lcm-calculator':'24,36','percentage-change':'100,125','tip-calculator':'1200,10,3',
  'date-add-days':'2026-01-01,30','working-days-calculator':'2026-01-01,2026-01-31',
  'time-duration-calculator':'09:30,17:45','reading-time-estimator':'Paste your article or document text...'
}


const relatedToolMap: Record<string,string[]> = {
  "pdf-merge": ["pdf-split", "pdf-rotate", "pdf-watermark", "pdf-page-numbers", "pdf-remove-pages", "pdf-organize-pages", "pdf-split-every-page"],
  "pdf-remove-pages": ["pdf-organize-pages", "pdf-split-every-page", "pdf-merge", "pdf-compare"],
  "pdf-organize-pages": ["pdf-remove-pages", "pdf-split-every-page", "pdf-merge", "pdf-page-numbers"],
  "pdf-split-every-page": ["pdf-merge", "pdf-remove-pages", "pdf-organize-pages", "pdf-compare"],
  "pdf-header-footer": ["pdf-watermark", "pdf-page-numbers", "pdf-metadata-editor"],
  "pdf-metadata-editor": ["pdf-info", "pdf-inspector", "pdf-header-footer"],
  "pdf-crop": ["pdf-rotate", "pdf-images", "pdf-watermark"],
  "pdf-flatten-forms": ["pdf-metadata-editor", "pdf-compare", "pdf-merge"],
  "pdf-compare": ["pdf-text", "pdf-merge", "pdf-remove-pages"],
  "text-encrypt": ["text-decrypt", "password", "password-strength"],
  "text-decrypt": ["text-encrypt", "password", "password-strength"],
  "base64-encode": ["base64-decode", "base64url-encoder", "text-to-hex"],
  "base64-decode": ["base64-encode", "base64url-decoder", "hex-to-text"],
  "base64url-encoder": ["base64url-decoder", "base64-encode"],
  "base64url-decoder": ["base64url-encoder", "base64-decode", "hex-to-text"],
  "json-csv": ["csv-json", "json-format", "csv-to-markdown"],
  "csv-json": ["json-csv", "csv-to-tsv", "json-format"],
  "csv-to-tsv": ["tsv-to-csv", "csv-json", "csv-to-markdown"],
  "tsv-to-csv": ["csv-to-tsv", "csv-json", "json-csv"],
  "json-format": ["json-minify", "json-sort-keys", "json-flatten"],
  "json-minify": ["json-format", "json-sort-keys", "json-flatten"],
  "json-flatten": ["json-unflatten", "json-format", "json-sort-keys"],
  "json-unflatten": ["json-flatten", "json-format", "json-sort-keys"],
  "pdf-split": ["pdf-merge", "pdf-page-numbers", "pdf-info"],
  "pdf-images": ["images-pdf", "image-compress", "image-convert"],
  "images-pdf": ["pdf-images", "pdf-merge", "pdf-info"],
  "image-pdf": ["pdf-images", "pdf-merge", "image-compress"],
  "pdf-text": ["word-counter", "text-diff", "html-strip-tags"],
  "pdf-watermark": ["pdf-page-numbers", "pdf-rotate", "pdf-merge"],
  "pdf-rotate": ["pdf-merge", "pdf-split", "pdf-page-numbers"],
  "pdf-page-numbers": ["pdf-merge", "pdf-watermark", "pdf-split", "pdf-header-footer", "pdf-organize-pages"],
  "image-compress": ["image-resize", "image-convert", "image-crop"],
  "image-resize": ["image-compress", "image-crop", "image-convert"],
  "image-convert": ["image-compress", "image-resize", "image-pdf"],
  "image-base64": ["base64-image", "base64-encode", "base64-decode"],
  "base64-image": ["image-base64", "image-convert", "image-metadata"],
  "text-binary": ["binary-text", "text-to-hex", "text-to-decimal"],
  "binary-text": ["text-binary", "decimal-to-binary", "binary-to-decimal"],
  "text-to-hex": ["hex-to-text", "text-to-decimal", "decimal-to-text"],
  "hex-to-text": ["text-to-hex", "base64-encode", "base64-decode"],
  "text-to-decimal": ["decimal-to-text", "text-to-hex", "text-binary"],
  "decimal-to-text": ["text-to-decimal", "hex-to-text", "binary-text", "unicode-unescape"],
  "text-morse": ["morse-text", "text-binary", "text-to-hex"],
  "morse-text": ["text-morse", "binary-text", "hex-to-text"],
  "url-encode": ["url-decode", "url-parser", "query-string-builder"],
  "url-decode": ["url-encode", "url-parser", "query-string-parser"],
  "query-string-parser": ["query-string-builder", "url-parser", "url-decode"],
  "query-string-builder": ["query-string-parser", "url-parser", "url-encode"],
  "xml-escape": ["html-unescape", "html-strip-tags", "text-to-html"],
  "html-unescape": ["xml-escape", "html-strip-tags", "text-to-html"],
  "text-to-html": ["html-strip-tags", "html-unescape", "markdown-html"],
  "markdown-html": ["markdown-preview", "html-strip-tags", "text-to-html"],
  "markdown-table": ["csv-to-markdown", "csv-to-html", "csv-to-tsv"],
  "csv-to-markdown": ["markdown-table", "csv-to-html", "tsv-to-csv"],
  "csv-to-html": ["csv-to-markdown", "markdown-table", "html-strip-tags"],
  "json-to-xml": ["xml-to-json", "json-format", "json-sort-keys"],
  "xml-to-json": ["json-to-xml", "xml-formatter", "json-format"],
  "xml-formatter": ["xml-minifier", "xml-to-json", "json-to-xml"],
  "xml-minifier": ["xml-formatter", "xml-to-json", "json-to-xml"],
  "css-formatter": ["css-minifier", "css-gradient", "css-shadow"],
  "css-minifier": ["css-formatter", "css-gradient", "css-shadow"],
  "rgb-to-hex": ["hex-to-rgb", "color-contrast-checker", "color-shade-generator"],
  "hex-to-rgb": ["rgb-to-hex", "color-contrast-checker", "color-shade-generator"],
  "color-contrast-checker": ["color-shade-generator", "hex-to-rgb", "rgb-to-hex"],
  "color-shade-generator": ["color-contrast-checker", "hex-to-rgb", "rgb-to-hex"],
  "px-to-rem": ["rem-to-px", "aspect-ratio-calculator", "css-gradient"],
  "rem-to-px": ["px-to-rem", "aspect-ratio-calculator", "css-gradient", "css-formatter"],
  "decimal-to-binary": ["binary-to-decimal", "decimal-to-hex", "decimal-to-octal"],
  "binary-to-decimal": ["decimal-to-binary", "hex-to-decimal", "decimal-to-hex", "decimal-to-octal"],
  "decimal-to-hex": ["hex-to-decimal", "decimal-to-binary", "decimal-to-octal"],
  "hex-to-decimal": ["decimal-to-hex", "binary-to-decimal", "decimal-to-octal"],
  "decimal-to-octal": ["decimal-to-binary", "decimal-to-hex", "hex-to-decimal"],
  "decimal-to-roman": ["roman-to-decimal", "number-to-words", "factorial-calculator"],
  "roman-to-decimal": ["decimal-to-roman", "number-to-words", "factorial-calculator"],
  "prime-checker": ["prime-generator", "factorial-calculator", "gcd-lcm-calculator"],
  "prime-generator": ["prime-checker", "fibonacci-generator", "factorial-calculator"],
  "hmac-sha256": ["text-encrypt", "text-decrypt", "hash-text", "file-hash"],
  "date-add-days": ["date-difference", "working-days-calculator", "age"],
  "working-days-calculator": ["date-add-days", "date-difference", "age"],
  "time-duration-calculator": ["timestamp", "stopwatch", "countdown"],
  "line-numbers-add": ["line-numbers-remove", "lines-reverse", "sort-lines"],
  "line-numbers-remove": ["line-numbers-add", "sort-lines", "duplicate-lines"],
  "lines-prefix": ["lines-suffix", "line-breaks-remove", "line-numbers-add"],
  "lines-suffix": ["lines-prefix", "line-breaks-remove", "line-numbers-add"],
  "lines-reverse": ["sort-lines", "lines-shuffle", "line-numbers-add"],
  "lines-shuffle": ["lines-reverse", "sort-lines", "duplicate-lines"],
  "words-sort": ["word-frequency", "keyword-density", "sentence-count"],
  "word-frequency": ["keyword-density", "word-counter", "reading-time-estimator"],
  "keyword-density": ["word-frequency", "word-counter", "reading-time-estimator"],
  "sentence-count": ["paragraph-count", "word-counter", "reading-time-estimator"],
  "paragraph-count": ["sentence-count", "word-counter", "text-cleaner"],
  "text-cleaner": ["whitespace-normalizer", "remove-spaces", "line-breaks-remove"],
  "whitespace-normalizer": ["remove-spaces", "line-breaks-remove", "text-cleaner"],
  "title-case": ["sentence-case", "camel-case", "pascal-case"],
  "sentence-case": ["title-case", "alternating-case", "word-counter"],
  "camel-case": ["pascal-case", "snake-case", "kebab-case"],
  "pascal-case": ["camel-case", "snake-case", "constant-case"],
  "snake-case": ["kebab-case", "camel-case", "constant-case"],
  "kebab-case": ["snake-case", "camel-case", "pascal-case"],
  "constant-case": ["snake-case", "kebab-case", "camel-case"],
  "alternating-case": ["title-case", "sentence-case", "case-converter"],
  "remove-emojis": ["non-ascii-remover", "text-cleaner", "whitespace-normalizer"],
  "extract-emails": ["email-validator", "extract-urls", "extract-phone-numbers"],
  "extract-urls": ["url-validator", "url-parser", "extract-emails"],
  "extract-phone-numbers": ["extract-emails", "extract-urls", "text-cleaner"],
  "unicode-escape": ["unicode-unescape", "text-to-hex", "decimal-to-text"],
  "unicode-unescape": ["unicode-escape", "decimal-to-text", "text-to-decimal"],
  "markdown-toc": ["markdown-table", "markdown-preview", "markdown-html"],
  "markdown-escape": ["markdown-unescape", "markdown-preview", "markdown-html"],
  "markdown-unescape": ["markdown-escape", "markdown-preview", "markdown-html"],
  "json-stringify-text": ["json-parse-text", "json-format", "lines-to-json"],
  "json-parse-text": ["json-stringify-text", "json-to-lines", "json-format"],
  "lines-to-json": ["json-to-lines", "json-format", "json-stringify-text"],
  "json-to-lines": ["lines-to-json", "json-parse-text", "json-format"],
  "sql-formatter": ["sql-minifier", "sql-escape", "json-format"],
  "sql-minifier": ["sql-formatter", "sql-escape", "json-format"],
  "email-validator": ["extract-emails", "url-validator", "uuid-validator"],
  "url-validator": ["url-parser", "query-string-parser", "extract-urls"],
  "ipv4-validator": ["mac-validator", "url-validator", "email-validator"],
  "mac-validator": ["ipv4-validator", "uuid-validator", "hex-color-validator"],
  "hex-color-validator": ["color-contrast-checker", "rgb-to-hex", "hex-to-rgb"],
  "factorial-calculator": ["prime-checker", "fibonacci-generator", "gcd-lcm-calculator"],
  "gcd-lcm-calculator": ["factorial-calculator", "prime-checker", "percentage-change"],
  "percentage-change": ["percentage", "discount", "tip-calculator"],
  "tip-calculator": ["percentage", "gst", "discount"],
  "reading-time-estimator": ["word-counter", "word-frequency", "sentence-count"]
  "zip-creator": ["zip-extractor","bulk-rename","file-type"],
  "zip-extractor": ["zip-creator","file-type","file-size"],
  "file-type": ["file-size","file-hash","file-compare"],
  "file-size": ["file-type","file-hash","image-compress"],
  "file-hash": ["hash-text","hmac-sha256","file-compare"],
  "file-compare": ["text-diff","pdf-compare","file-type"],
  "bulk-rename": ["zip-creator","zip-extractor","file-type"],
  "text-file": ["json-file","csv-file","text-cleaner"],
  "json-file": ["csv-file","text-file","json-format"],
  "csv-file": ["json-file","text-file","csv-json"],
  "pdf-info": ["pdf-inspector","pdf-metadata-editor","pdf-compare"],
  "pdf-inspector": ["pdf-info","pdf-metadata-editor","pdf-page-numbers"],
  "image-crop": ["image-resize","image-rotate","image-watermark"],
  "image-rotate": ["image-flip","image-crop","image-grayscale"],
  "image-flip": ["image-rotate","image-crop","image-grayscale"],
  "image-grayscale": ["image-convert","image-compress","image-watermark"],
  "image-watermark": ["image-crop","image-resize","image-compress"],
  "image-color": ["color-convert","hex-to-rgb","color-contrast-checker"],
  "image-metadata": ["image-color","image-base64","file-type"],
  "favicon": ["image-resize","image-convert","image-crop"],
  "image-collage": ["image-resize","image-compress","image-convert"],
  "word-counter": ["sentence-count","paragraph-count","reading-time-estimator","word-frequency"],
  "case-converter": ["title-case","sentence-case","camel-case","snake-case"],
  "remove-spaces": ["whitespace-normalizer","line-breaks-remove","text-cleaner"],
  "duplicate-lines": ["sort-lines","reverse-text","lines-reverse"],
  "sort-lines": ["duplicate-lines","reverse-text","lines-shuffle"],
  "reverse-text": ["sort-lines","duplicate-lines","lines-reverse"],
  "text-diff": ["file-compare","pdf-compare","word-counter"],
  "slug-generator": ["kebab-case","title-case","url-encode"],
  "lorem": ["text-to-html","word-counter","markdown-preview"],
  "markdown-preview": ["markdown-html","markdown-toc","markdown-table"],
  "jwt-decode": ["base64-decode","json-format","json-minify"],
  "uuid": ["uuid-validator","random-string","password"],
  "regex": ["regex-escape","text-diff","extract-urls"],
  "timestamp": ["date-difference","date-add-days","time-duration-calculator"],
  "html-minify": ["html-strip-tags","html-unescape","html-preview"],
  "css-gradient": ["css-shadow","color-convert","color-shade-generator"],
  "css-shadow": ["css-gradient","color-convert","color-shade-generator"],
  "color-convert": ["rgb-to-hex","hex-to-rgb","color-contrast-checker"],
  "random-string": ["password","password-strength","uuid"],
  "hash-text": ["hmac-sha256","file-hash","text-encrypt"],
  "regex-escape": ["regex","text-diff","url-encode"],
  "html-preview": ["markdown-preview","text-to-html","html-strip-tags"],
  "calculator": ["percentage","average","ratio"],
  "percentage": ["discount","gst","percentage-change"],
  "gst": ["discount","percentage","tip-calculator"],
  "discount": ["percentage","gst","percentage-change"],
  "emi": ["compound-interest","simple-interest","percentage"],
  "simple-interest": ["compound-interest","emi","percentage"],
  "compound-interest": ["simple-interest","emi","percentage-change"],
  "age": ["date-difference","date-add-days","working-days-calculator"],
  "date-difference": ["age","date-add-days","working-days-calculator"],
  "bmi": ["unit-weight","unit-length","average"],
  "average": ["calculator","ratio","percentage"],
  "ratio": ["aspect-ratio-calculator","average","percentage"],
  "unit-length": ["unit-weight","unit-data","unit-speed"],
  "unit-weight": ["unit-length","unit-temp","bmi"],
  "unit-temp": ["unit-length","unit-weight","calculator"],
  "unit-data": ["file-size","file-type","unit-length"],
  "unit-speed": ["unit-length","time-duration-calculator","calculator"],
  "qr-generator": ["barcode","image-convert","image-pdf"],
  "barcode": ["qr-generator","image-convert","image-pdf"],
  "password": ["password-strength","text-encrypt","text-decrypt"],
  "password-strength": ["password","text-encrypt","text-decrypt"],
  "random-number": ["random-string","prime-generator","calculator"],
  "stopwatch": ["countdown","pomodoro","time-duration-calculator"],
  "countdown": ["stopwatch","pomodoro","time-duration-calculator"],
  "pomodoro": ["stopwatch","countdown","todo"],
  "notes": ["todo","markdown-preview","text-file"],
  "todo": ["notes","pomodoro","markdown-preview"],
  "line-breaks-remove": ["whitespace-normalizer","text-cleaner","remove-spaces"],
  "non-ascii-remover": ["remove-emojis","text-cleaner","unicode-escape"],
  "html-strip-tags": ["html-unescape","text-to-html","html-minify"],
  "json-sort-keys": ["json-format","json-minify","json-flatten"],
  "sql-escape": ["sql-formatter","sql-minifier","json-format"],
  "url-parser": ["query-string-parser","url-encode","url-decode"],
  "uuid-validator": ["uuid","random-string","password"],
  "credit-card-validator": ["isbn-validator","email-validator","url-validator"],
  "isbn-validator": ["credit-card-validator","uuid-validator","email-validator"],
  "aspect-ratio-calculator": ["image-resize","image-crop","ratio"],
  "number-to-words": ["decimal-to-roman","roman-to-decimal","calculator"],
  "fibonacci-generator": ["prime-generator","factorial-calculator","prime-checker"],
}

function UtilityWidget({id}:{id:string}) {
  const [seconds,setSeconds]=useState(0)
  const [running,setRunning]=useState(false)
  const [target,setTarget]=useState(25*60)
  const [breakMinutes,setBreakMinutes]=useState(5)
  const [phase,setPhase]=useState<'work'|'break'>('work')
  const [note,setNote]=useState(()=>{try{return localStorage.getItem('ap-tools-note')||''}catch{return ''}})
  const [task,setTask]=useState('')
  const [tasks,setTasks]=useState<string[]>(()=>{try{const v=JSON.parse(localStorage.getItem('ap-tools-tasks')||'[]');return Array.isArray(v)?v.filter((x):x is string=>typeof x==='string').map(x=>x.slice(0,300)).slice(0,500):[]}catch{return []}})
  useEffect(()=>{setRunning(false);setSeconds(0);setTarget(25*60);setBreakMinutes(5);setPhase('work')},[id])
  useEffect(()=>{
    if(!running)return
    const timer=window.setInterval(()=>setSeconds(value=>value+1),1000)
    return()=>clearInterval(timer)
  },[running])
  useEffect(()=>{
    if(!running||id==='stopwatch')return
    const limit=id==='pomodoro'&&phase==='break'?breakMinutes*60:target
    if(seconds>=limit){
      if(id==='pomodoro'&&phase==='work'){
        setPhase('break')
        setSeconds(0)
      }else{
        setRunning(false)
        if(id==='pomodoro'){setPhase('work');setSeconds(0)}
      }
    }
  },[seconds,running,id,phase,target,breakMinutes])
  useEffect(()=>{try{if(id==='notes')localStorage.setItem('ap-tools-note',note)}catch{/* Browser storage may be disabled or full. */}},[note,id])
  useEffect(()=>{try{if(id==='todo')localStorage.setItem('ap-tools-tasks',JSON.stringify(tasks))}catch{/* Browser storage may be disabled or full. */}},[tasks,id])
  const time=(n:number)=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`
  const addTask=()=>{const value=task.trim();if(value&&value.length<=300&&tasks.length<500){setTasks(v=>v.length>=500?v:[...v,value]);setTask('')}}
  if(id==='notes')return <div className="utility-widget"><label className="field-label">Your private note<textarea rows={10} maxLength={50000} value={note} onChange={e=>setNote(e.target.value)} placeholder="Write notes. Saved in this browser only."/></label><span className="subtle-hint">Autosaved locally · {note.length} characters</span></div>
  if(id==='todo')return <div className="utility-widget"><div className="todo-add"><input maxLength={300} value={task} onChange={e=>setTask(e.target.value)} placeholder="Add a task..." onKeyDown={e=>{if(e.key==='Enter')addTask()}}/><button className="button-primary" onClick={addTask}><Plus size={15}/> Add</button></div>{tasks.map((t,i)=><div className="todo-row" key={`${t}-${i}`}><span>{t}</span><button className="icon-button" onClick={()=>setTasks(v=>v.filter((_,j)=>j!==i))} aria-label={`Delete ${t}`}><Trash2 size={15}/></button></div>)}{!tasks.length&&<span className="subtle-hint">Your task list is empty.</span>}</div>
  const isCountdown=id==='countdown'||id==='pomodoro'
  const duration=id==='pomodoro'&&phase==='break'?breakMinutes*60:target
  const display=isCountdown?Math.max(0,duration-seconds):seconds
  return <div className="utility-widget timer-widget"><div className="timer-face"><Clock3 size={22}/><strong>{time(display)}</strong><span>{id==='pomodoro'?(phase==='work'?'Focus session':'Short break'):id==='countdown'?'Countdown':'Stopwatch'}</span></div>
    {id==='countdown'&&<label className="field-label timer-setting">Duration (minutes)<input type="number" min="1" max="240" value={Math.round(target/60)} onChange={e=>{const mins=Math.min(240,Math.max(1,Number(e.target.value)||1));setTarget(mins*60);setSeconds(0);setRunning(false)}}/></label>}
    {id==='pomodoro'&&<div className="settings-grid timer-setting"><label>Focus duration (minutes)<input type="number" min="1" max="240" value={Math.round(target/60)} onChange={e=>{setTarget(Math.min(240,Math.max(1,Number(e.target.value)||1))*60);setSeconds(0);setPhase('work');setRunning(false)}}/></label><label>Break duration (minutes)<input type="number" min="1" max="60" value={breakMinutes} onChange={e=>{setBreakMinutes(Math.min(60,Math.max(1,Number(e.target.value)||1)));setSeconds(0);setPhase('work');setRunning(false)}}/></label></div>}
    <div className="workspace-actions"><button className="button-primary" onClick={()=>{if(!running&&isCountdown&&seconds>=duration)setSeconds(0);setRunning(v=>!v)}}>{running?<Pause size={15}/>:<Play size={15}/>} {running?'Pause':'Start'}</button><button className="button-secondary" onClick={()=>{setRunning(false);setSeconds(0);setPhase('work')}}><Square size={14}/> Reset</button></div>
  </div>
}
export default function ToolPage() {
  const {id=''}=useParams()
  const tool=tools.find(t=>t.id===id)
  const addRecent=useAppStore(s=>s.addRecent)
  const favorites=useAppStore(s=>s.favorites)
  const toggleFavorite=useAppStore(s=>s.toggleFavorite)
  const navigate=useNavigate()
  const [files,setFiles]=useState<File[]>([])
  const [input,setInput]=useState('')
  const [secondary,setSecondary]=useState('')
  const [output,setOutput]=useState<ProcessResult|null>(null)
  const [error,setError]=useState('')
  const [busy,setBusy]=useState(false)
  const [quality,setQuality]=useState(80)
  const [width,setWidth]=useState(1200)
  const [height,setHeight]=useState(1200)
  const [format,setFormat]=useState('image/webp')
  const [prefix,setPrefix]=useState('file')
  const [start,setStart]=useState(1)
  const [flags,setFlags]=useState('g')
  const [previewUrl,setPreviewUrl]=useState('')
  const requestId=useRef(0)
  useEffect(()=>{if(output?.kind!=='blob'){setPreviewUrl('');return}const url=URL.createObjectURL(output.blob);setPreviewUrl(url);return()=>URL.revokeObjectURL(url)},[output])
  useEffect(()=>{requestId.current+=1;if(tool)addRecent(tool.id);setFiles([]);setInput('');setSecondary(id==='case-converter'?'upper':id==='image-flip'?'horizontal':'');setOutput(null);setError('');setBusy(false);setQuality(80);setWidth(1200);setHeight(1200);setFormat('image/webp');setPrefix('file');setStart(1);setFlags('g')},[tool,id,addRecent])



  
  if(!tool)return <div className="empty-state"><strong>Tool not found</strong><Link to="/tools">Back to tools</Link></div>
  const needsFiles=fileToolIds.has(id)
  const special=['stopwatch','countdown','pomodoro','notes','todo'].includes(id)
  const chooseToolFiles=(list:File[])=>{
    if(!multipleIds.has(id)&&list.length>1){setError('This tool accepts one file at a time. The first selected file is kept.');setFiles(list.slice(0,1));return}
    const maxCount:number=['images-pdf','image-pdf','image-collage'].includes(id)?50:(id==='file-compare'||id==='pdf-compare')?2:250
    if(list.length>maxCount){setError(`Choose no more than ${maxCount} file${maxCount===1?'':'s'} for this tool.`);return}
    const maxBytes=id==='file-compare'?20*1024*1024:id==='zip-extractor'?60*1024*1024:id==='pdf-compare'?120*1024*1024:80*1024*1024
    if(list.reduce((sum,file)=>sum+file.size,0)>maxBytes){setError(`Selected files exceed this tool's ${Math.round(maxBytes/1024/1024)} MB input limit.`);return}
    setFiles(list);setError('')
  }
  const run=async()=>{
    const currentRequest=++requestId.current
    setBusy(true);setError('');setOutput(null)
    try{
      const result=await processTool(id,files,input,secondary,{quality,width,height,format,prefix,start,flags})
      if(currentRequest===requestId.current)setOutput(result)
    }catch(e){if(currentRequest===requestId.current)setError(e instanceof Error?e.message:'Processing failed. Please try again.')}
    finally{if(currentRequest===requestId.current)setBusy(false)}
  }
  const favorite=favorites.includes(id)
  const explicitRelated=relatedToolMap[id]||[]
  const sameCategory=tools.filter(item=>item.id!==id&&item.category===tool.category).map(item=>item.id)
  const suggestedTools=[...new Set([...explicitRelated,...sameCategory])].filter(relatedId=>relatedId!==id).map(relatedId=>tools.find(item=>item.id===relatedId)).filter((item):item is (typeof tools)[number]=>Boolean(item)).slice(0,4)
  const download=()=>{
    if(output?.kind!=='blob')return
    const url=URL.createObjectURL(output.blob)
    const a=document.createElement('a');a.href=url;a.download=output.filename;a.click()
    window.setTimeout(()=>URL.revokeObjectURL(url),1000)
  }
  return <motion.div className="page-stack" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
    <div className="breadcrumbs"><Link to="/tools">All tools</Link><span>/</span><span>{tool.category}</span><span>/</span><strong>{tool.name}</strong></div>
    <div className="tool-page-heading"><div><div className="eyebrow">{tool.category.toUpperCase()} TOOL</div><h1>{tool.name}</h1><p>{tool.description}</p></div><button className={`favorite-large ${favorite?'selected':''}`} onClick={()=>toggleFavorite(id)}><Heart size={16} fill={favorite?'currentColor':'none'}/>{favorite?'Saved':'Add to favorites'}</button></div>
    <div className="workspace-card">
      <div className="workspace-top"><div><strong>Tool workspace</strong><p>Runs locally in your browser. Files are not sent to an AP TOOLS server.</p></div><span className="local-badge"><span/> Local processing</span></div>
      {special?<UtilityWidget id={id}/>:<>
        {needsFiles&&<div className="upload-zone" onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add('dragging')}} onDragLeave={e=>e.currentTarget.classList.remove('dragging')} onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove('dragging');chooseToolFiles(Array.from(e.dataTransfer.files))}}>
          <input id="tool-file-input" type="file" multiple={multipleIds.has(id)} accept={id==='images-pdf'||id==='image-pdf'?'.jpg,.jpeg,.png,image/jpeg,image/png':id.includes('pdf')?'.pdf,application/pdf':id.includes('image')||id.includes('favicon')||id.includes('collage')?'image/*':undefined} onChange={e=>{chooseToolFiles(Array.from(e.target.files||[]));e.currentTarget.value=''}}/>
          <label htmlFor="tool-file-input"><FileUp size={28}/><strong>Drop files here or browse</strong><span>{multipleIds.has(id)?'Select multiple files if needed.':'Select a file from your device.'}</span></label>
          {files.length>0&&<div className="selected-files">{files.map((f,i)=><div key={`${f.name}-${i}`}>{f.name}<span>{(f.size/1024).toFixed(1)} KB</span></div>)}</div>}
        </div>}
        {id==='image-compress'||id==='image-resize'||id==='image-convert'||id==='favicon'?<div className="settings-grid">
          {(id==='image-resize'||id==='image-compress')&&<label>Max width (px)<input type="number" min="1" max="12000" value={width} onChange={e=>setWidth(Number(e.target.value))}/></label>}
          {id==='image-resize'&&<label>Max height (px)<input type="number" min="1" max="12000" value={height} onChange={e=>setHeight(Number(e.target.value))}/></label>}
          <label>Quality · {quality}%<input type="range" min="10" max="100" value={quality} onChange={e=>setQuality(Number(e.target.value))}/></label>
          <label>Output format<select value={format} onChange={e=>setFormat(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select></label>
        </div>:null}
        {id==='bulk-rename'&&<div className="settings-grid"><label>Filename prefix<input value={prefix} onChange={e=>setPrefix(e.target.value)}/></label><label>Starting number<input type="number" value={start} onChange={e=>setStart(Number(e.target.value))}/></label></div>}
        {id==='image-flip'&&<label className="field-label">Flip direction<select value={secondary} onChange={e=>setSecondary(e.target.value)}><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></label>}
        {id==='case-converter'&&<label className="field-label">Conversion<select value={secondary} onChange={e=>setSecondary(e.target.value)}><option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="title">Title Case</option><option value="sentence">Sentence case</option></select></label>}
        {['percentage','gst','discount','regex','text-diff','text-encrypt','text-decrypt','css-gradient','image-rotate','random-string','hmac-sha256','reading-time-estimator','lines-prefix','lines-suffix'].includes(id)&&(id==='text-diff'?<label className="field-label">Second text block<textarea maxLength={10_000_000} value={secondary} onChange={e=>setSecondary(e.target.value)} rows={6} placeholder="Enter the second text block to compare..."/></label>:<label className="field-label">Additional input<input maxLength={id==='text-encrypt'||id==='text-decrypt'?1024:id==='regex'?500:id==='random-string'?3:id==='hmac-sha256'?4096:1000} type={id==='text-encrypt'||id==='text-decrypt'||id==='hmac-sha256'?'password':'text'} autoComplete={id==='text-encrypt'||id==='text-decrypt'||id==='hmac-sha256'?'new-password':'off'} value={secondary} onChange={e=>setSecondary(e.target.value)} placeholder={id==='text-encrypt'||id==='text-decrypt'||id==='hmac-sha256'?'Password / secret key':id==='regex'?'Regular expression':id==='image-rotate'?'90, 180 or 270':id==='random-string'?'Output length (1–256)':id==='reading-time-estimator'?'Words per minute (default 200)':id==='lines-prefix'||id==='lines-suffix'?'Text to add':'Enter required value'}/></label>)}
        {id==='regex'&&<label className="field-label">Regex flags<input maxLength={7} value={flags} onChange={e=>setFlags(e.target.value)} placeholder="g"/></label>}
        {id==='regex'&&<label className="field-label">Text to test<textarea maxLength={200_000} value={input} onChange={e=>setInput(e.target.value)} rows={5} placeholder="Text to test against regex..."/></label>}
        {!['regex'].includes(id)&&!needsFiles&&<label className="field-label">Input<textarea maxLength={10_000_000} value={input} onChange={e=>setInput(e.target.value)} rows={6} placeholder={extendedPlaceholders[id]||textPlaceholders[id]||'Enter text or value...'}/></label>}
        {needsFiles&&['pdf-split','pdf-remove-pages','pdf-organize-pages','pdf-header-footer','pdf-metadata-editor','pdf-crop','image-crop','image-color','pdf-watermark','pdf-rotate','image-watermark'].includes(id)&&<label className="field-label">{id==='pdf-split'?'Pages to extract':id==='pdf-remove-pages'?'Page numbers to remove':id==='pdf-organize-pages'?'New page order':id==='pdf-header-footer'?'Header | Footer':id==='pdf-metadata-editor'?'Metadata JSON':id==='pdf-crop'?'Crop rectangle (x,y,width,height) in points':id==='image-crop'?'Crop rectangle (x,y,width,height)':id==='image-color'?'Pixel coordinate (x,y)':id==='pdf-rotate'?'Rotation degrees':id==='image-watermark'?'Watermark text':'Watermark text'}{id==='pdf-metadata-editor'?<textarea rows={5} maxLength={10000} value={input} onChange={e=>setInput(e.target.value)} placeholder={extendedHelp[id]||help[id]||textPlaceholders[id]||'Enter the required values...'}/>:<input maxLength={10000} value={input} onChange={e=>setInput(e.target.value)} placeholder={extendedHelp[id]||help[id]||textPlaceholders[id]||'Enter the required values...'}/>}</label>}
        {(help[id]||extendedHelp[id])&&<div className="subtle-hint">{help[id]||extendedHelp[id]}</div>}
        <div className="workspace-actions"><button className="button-primary" disabled={busy} onClick={run}>{busy?'Processing...':'Run tool'} <span>→</span></button><button className="button-secondary" onClick={()=>{requestId.current+=1;setBusy(false);setInput('');setSecondary('');setFiles([]);setOutput(null);setError('')}}><RotateCcw size={15}/> Reset</button></div>
      </>}
      {error&&<div className="notice error"><AlertCircle size={17}/>{error}</div>}
      {output?.kind==='text'&&<div className="output-panel"><div className="output-heading"><strong>Result</strong><button className="button-secondary" onClick={()=>{if(!navigator.clipboard?.writeText){setError('Clipboard access is unavailable. Select and copy the result manually.');return}navigator.clipboard.writeText(output.value).catch(()=>setError('Clipboard access is unavailable. Select and copy the result manually.'))}}><Copy size={14}/> Copy</button></div><textarea readOnly rows={Math.min(16,Math.max(5,output.value.split('\n').length))} value={output.value}/></div>}
      {output?.kind==='blob'&&<div className="output-panel"><div className="output-heading"><strong>Result ready</strong><button className="button-primary small" onClick={download}><Download size={14}/> Download {output.filename}</button></div>{output.preview==='image'&&<img className="result-image" src={previewUrl} alt="Processed output"/>}{output.preview==='pdf'&&<span className="download-ready">PDF created successfully. Download it to view the document.</span>}<span className="subtle-hint">{output.filename} · {(output.blob.size/1024).toFixed(1)} KB</span></div>}
      {output?.kind==='html'&&<div className="output-panel"><div className="output-heading"><strong>Preview</strong></div><iframe title="HTML preview" sandbox="" referrerPolicy="no-referrer" srcDoc={output.value} className="html-preview-frame"/></div>}
    </div>

    <section className="section related-tools-section">
      <div className="section-head"><div><label>KEEP WORKING</label><h2>Related tools and next steps</h2><p>Continue your workflow with compatible tools.</p></div></div>
      <div className="tool-grid">
        {suggestedTools.map(related => <ToolCard key={related.id} tool={related} onOpen={() => navigate('/tool/' + related.id)} />)}
      </div>
    </section>
    <div className="privacy-note"><ShieldCheck size={17}/><span><strong>Privacy first.</strong> Processing happens locally for supported tools. Nothing is uploaded to an AP TOOLS server.</span></div>
  </motion.div>
}
