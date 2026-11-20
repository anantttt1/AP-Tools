export type Tool = {
  id: string
  name: string
  category: string
  description: string
  icon: string
}

export const tools: Tool[] = [
  {
    "id": "zip-creator",
    "name": "ZIP Creator",
    "category": "Files",
    "description": "Create a ZIP archive from multiple files.",
    "icon": "archive"
  },
  {
    "id": "zip-extractor",
    "name": "ZIP Extractor",
    "category": "Files",
    "description": "Extract files from a ZIP archive in your browser.",
    "icon": "archive"
  },
  {
    "id": "file-type",
    "name": "File Type Detector",
    "category": "Files",
    "description": "Detect common file signatures and report the browser-provided MIME type.",
    "icon": "file-search"
  },
  {
    "id": "file-size",
    "name": "File Size Converter",
    "category": "Files",
    "description": "Convert bytes, KB, MB and GB.",
    "icon": "hard-drive"
  },
  {
    "id": "file-hash",
    "name": "File Checksum",
    "category": "Files",
    "description": "Generate SHA-256 checksum for a file.",
    "icon": "fingerprint"
  },
  {
    "id": "file-compare",
    "name": "Text File Compare",
    "category": "Files",
    "description": "Compare the text content of two files.",
    "icon": "files"
  },
  {
    "id": "bulk-rename",
    "name": "Bulk File Renamer",
    "category": "Files",
    "description": "Create a ZIP containing renamed copies of multiple selected files.",
    "icon": "files"
  },
  {
    "id": "text-file",
    "name": "Text File Creator",
    "category": "Files",
    "description": "Create and download a plain text file.",
    "icon": "file-plus"
  },
  {
    "id": "json-file",
    "name": "JSON File Creator",
    "category": "Files",
    "description": "Create and download a JSON file.",
    "icon": "file-json"
  },
  {
    "id": "csv-file",
    "name": "CSV File Creator",
    "category": "Files",
    "description": "Create and download a CSV file.",
    "icon": "file-spreadsheet"
  },
  {
    "id": "pdf-merge",
    "name": "Merge PDF",
    "category": "PDF",
    "description": "Combine multiple PDF documents into one.",
    "icon": "file-pdf"
  },
  {
    "id": "pdf-split",
    "name": "Split PDF",
    "category": "PDF",
    "description": "Extract selected pages from a PDF.",
    "icon": "scissors"
  },
  {
    "id": "pdf-images",
    "name": "PDF to Images",
    "category": "PDF",
    "description": "Render PDF pages as downloadable images.",
    "icon": "images"
  },
  {
    "id": "images-pdf",
    "name": "Images to PDF",
    "category": "PDF",
    "description": "Combine images into a PDF document.",
    "icon": "file-image"
  },
  {
    "id": "pdf-text",
    "name": "PDF Text Extractor",
    "category": "PDF",
    "description": "Extract selectable text from PDF pages.",
    "icon": "file-text"
  },
  {
    "id": "pdf-watermark",
    "name": "PDF Watermark",
    "category": "PDF",
    "description": "Add a text watermark to every PDF page.",
    "icon": "stamp"
  },
  {
    "id": "pdf-rotate",
    "name": "Rotate PDF",
    "category": "PDF",
    "description": "Rotate all pages in a PDF document.",
    "icon": "rotate-cw"
  },
  {
    "id": "pdf-info",
    "name": "PDF Information",
    "category": "PDF",
    "description": "Inspect page count and basic PDF metadata.",
    "icon": "info"
  },
  {
    "id": "pdf-page-numbers",
    "name": "PDF Page Numbers",
    "category": "PDF",
    "description": "Add page numbers to PDF pages.",
    "icon": "list-ordered"
  },
  {
    "id": "pdf-inspector",
    "name": "PDF Page Inspector",
    "category": "PDF",
    "description": "Inspect PDF page dimensions and page information.",
    "icon": "info"
  },
  {
    "id": "image-compress",
    "name": "Image Compressor",
    "category": "Images",
    "description": "Compress images in your browser.",
    "icon": "image-down"
  },
  {
    "id": "image-resize",
    "name": "Image Resizer",
    "category": "Images",
    "description": "Resize images to fit maximum width and height without enlarging the source.",
    "icon": "maximize"
  },
  {
    "id": "image-crop",
    "name": "Image Cropper",
    "category": "Images",
    "description": "Crop an image using browser canvas.",
    "icon": "crop"
  },
  {
    "id": "image-convert",
    "name": "Image Format Converter",
    "category": "Images",
    "description": "Convert images between PNG, JPEG and WebP.",
    "icon": "refresh-cw"
  },
  {
    "id": "image-rotate",
    "name": "Image Rotator",
    "category": "Images",
    "description": "Rotate an image by 90 degree increments.",
    "icon": "rotate-cw"
  },
  {
    "id": "image-flip",
    "name": "Image Flip",
    "category": "Images",
    "description": "Flip images horizontally or vertically.",
    "icon": "flip-horizontal"
  },
  {
    "id": "image-grayscale",
    "name": "Grayscale Image",
    "category": "Images",
    "description": "Convert an image to grayscale.",
    "icon": "contrast"
  },
  {
    "id": "image-watermark",
    "name": "Image Watermark",
    "category": "Images",
    "description": "Add a text watermark to an image.",
    "icon": "stamp"
  },
  {
    "id": "image-base64",
    "name": "Image to Base64",
    "category": "Images",
    "description": "Convert an image into a Base64 data URL.",
    "icon": "code"
  },
  {
    "id": "base64-image",
    "name": "Base64 to Image",
    "category": "Images",
    "description": "Preview and download an image from Base64.",
    "icon": "image"
  },
  {
    "id": "image-color",
    "name": "Image Color Picker",
    "category": "Images",
    "description": "Read a pixel color from an uploaded image.",
    "icon": "pipette"
  },
  {
    "id": "image-metadata",
    "name": "Image Metadata",
    "category": "Images",
    "description": "Inspect image dimensions, type and file size.",
    "icon": "scan"
  },
  {
    "id": "favicon",
    "name": "Favicon Generator",
    "category": "Images",
    "description": "Generate a favicon from an uploaded image.",
    "icon": "app-window"
  },
  {
    "id": "image-collage",
    "name": "Image Collage",
    "category": "Images",
    "description": "Create a simple grid collage from images.",
    "icon": "layout-grid"
  },
  {
    "id": "image-pdf",
    "name": "Image to PDF",
    "category": "Images",
    "description": "Create a PDF from one or more images.",
    "icon": "file-pdf"
  },
  {
    "id": "word-counter",
    "name": "Word Counter",
    "category": "Text",
    "description": "Count words, characters, sentences and paragraphs.",
    "icon": "calculator"
  },
  {
    "id": "case-converter",
    "name": "Case Converter",
    "category": "Text",
    "description": "Convert text to uppercase, lowercase and title case.",
    "icon": "case-sensitive"
  },
  {
    "id": "remove-spaces",
    "name": "Remove Extra Spaces",
    "category": "Text",
    "description": "Normalize repeated spaces and line breaks.",
    "icon": "eraser"
  },
  {
    "id": "duplicate-lines",
    "name": "Remove Duplicate Lines",
    "category": "Text",
    "description": "Remove repeated lines from text.",
    "icon": "list-filter"
  },
  {
    "id": "sort-lines",
    "name": "Sort Text Lines",
    "category": "Text",
    "description": "Sort lines alphabetically.",
    "icon": "list-ordered"
  },
  {
    "id": "reverse-text",
    "name": "Reverse Text",
    "category": "Text",
    "description": "Reverse text or the order of words.",
    "icon": "repeat"
  },
  {
    "id": "text-diff",
    "name": "Text Difference",
    "category": "Text",
    "description": "Compare two text blocks line by line.",
    "icon": "git-compare"
  },
  {
    "id": "slug-generator",
    "name": "Slug Generator",
    "category": "Text",
    "description": "Create URL-friendly slugs from text.",
    "icon": "link"
  },
  {
    "id": "lorem",
    "name": "Lorem Ipsum Generator",
    "category": "Text",
    "description": "Generate placeholder text.",
    "icon": "text"
  },
  {
    "id": "markdown-preview",
    "name": "Markdown Preview",
    "category": "Text",
    "description": "Preview basic Markdown content.",
    "icon": "file-code"
  },
  {
    "id": "text-binary",
    "name": "Text to Binary",
    "category": "Text",
    "description": "Convert text into binary representation.",
    "icon": "binary"
  },
  {
    "id": "binary-text",
    "name": "Binary to Text",
    "category": "Text",
    "description": "Decode binary into text.",
    "icon": "binary"
  },
  {
    "id": "text-morse",
    "name": "Text to Morse",
    "category": "Text",
    "description": "Encode text into Morse code.",
    "icon": "radio"
  },
  {
    "id": "morse-text",
    "name": "Morse to Text",
    "category": "Text",
    "description": "Decode Morse code into text.",
    "icon": "radio-tower"
  },
  {
    "id": "json-format",
    "name": "JSON Formatter",
    "category": "Developer",
    "description": "Format and validate JSON.",
    "icon": "braces"
  },
  {
    "id": "json-minify",
    "name": "JSON Minifier",
    "category": "Developer",
    "description": "Minify JSON by removing whitespace.",
    "icon": "braces"
  },
  {
    "id": "json-csv",
    "name": "JSON to CSV",
    "category": "Developer",
    "description": "Convert an array of JSON objects to CSV.",
    "icon": "file-spreadsheet"
  },
  {
    "id": "csv-json",
    "name": "CSV to JSON",
    "category": "Developer",
    "description": "Convert CSV rows into JSON objects.",
    "icon": "file-json"
  },
  {
    "id": "xml-escape",
    "name": "HTML Entity Encoder",
    "category": "Developer",
    "description": "Escape special HTML characters.",
    "icon": "code"
  },
  {
    "id": "base64-encode",
    "name": "Base64 Encoder",
    "category": "Developer",
    "description": "Encode text as Base64.",
    "icon": "binary"
  },
  {
    "id": "base64-decode",
    "name": "Base64 Decoder",
    "category": "Developer",
    "description": "Decode Base64 text.",
    "icon": "binary"
  },
  {
    "id": "url-encode",
    "name": "URL Encoder",
    "category": "Developer",
    "description": "Encode text for use in URLs.",
    "icon": "link"
  },
  {
    "id": "url-decode",
    "name": "URL Decoder",
    "category": "Developer",
    "description": "Decode URL-encoded text.",
    "icon": "link"
  },
  {
    "id": "jwt-decode",
    "name": "JWT Decoder",
    "category": "Developer",
    "description": "Decode JWT header and payload locally.",
    "icon": "key"
  },
  {
    "id": "uuid",
    "name": "UUID Generator",
    "category": "Developer",
    "description": "Generate random UUID v4 identifiers.",
    "icon": "fingerprint"
  },
  {
    "id": "regex",
    "name": "Regex Tester",
    "category": "Developer",
    "description": "Test a regular expression against text.",
    "icon": "regex"
  },
  {
    "id": "timestamp",
    "name": "Timestamp Converter",
    "category": "Developer",
    "description": "Convert Unix timestamps into readable dates and show seconds and milliseconds.",
    "icon": "clock"
  },
  {
    "id": "html-minify",
    "name": "HTML Minifier",
    "category": "Developer",
    "description": "Remove comments and excess whitespace from HTML.",
    "icon": "code"
  },
  {
    "id": "css-gradient",
    "name": "CSS Gradient Generator",
    "category": "Developer",
    "description": "Build CSS linear gradients visually.",
    "icon": "palette"
  },
  {
    "id": "css-shadow",
    "name": "CSS Shadow Generator",
    "category": "Developer",
    "description": "Generate CSS box-shadow declarations.",
    "icon": "square"
  },
  {
    "id": "color-convert",
    "name": "Color Converter",
    "category": "Developer",
    "description": "Convert a HEX color into RGB and HSL values.",
    "icon": "palette"
  },
  {
    "id": "random-string",
    "name": "Random String Generator",
    "category": "Developer",
    "description": "Generate random strings using secure browser randomness.",
    "icon": "shuffle"
  },
  {
    "id": "hash-text",
    "name": "SHA-256 Text Hash",
    "category": "Developer",
    "description": "Generate a SHA-256 digest using Web Crypto.",
    "icon": "fingerprint"
  },
  {
    "id": "regex-escape",
    "name": "Regex Escape",
    "category": "Developer",
    "description": "Escape special characters for regular expressions.",
    "icon": "regex"
  },
  {
    "id": "markdown-html",
    "name": "Markdown to HTML",
    "category": "Developer",
    "description": "Convert basic Markdown syntax to HTML.",
    "icon": "file-code"
  },
  {
    "id": "html-preview",
    "name": "HTML Preview",
    "category": "Developer",
    "description": "Preview HTML in a sandboxed frame.",
    "icon": "monitor"
  },
  {
    "id": "calculator",
    "name": "Calculator",
    "category": "Calculators",
    "description": "Perform basic arithmetic calculations.",
    "icon": "calculator"
  },
  {
    "id": "percentage",
    "name": "Percentage Calculator",
    "category": "Calculators",
    "description": "Calculate a percentage of a base amount.",
    "icon": "percent"
  },
  {
    "id": "gst",
    "name": "GST Calculator",
    "category": "Calculators",
    "description": "Calculate GST amount and total on a base price.",
    "icon": "receipt"
  },
  {
    "id": "discount",
    "name": "Discount Calculator",
    "category": "Calculators",
    "description": "Calculate sale price after a discount.",
    "icon": "tag"
  },
  {
    "id": "emi",
    "name": "EMI Calculator",
    "category": "Calculators",
    "description": "Estimate monthly loan payments.",
    "icon": "banknote"
  },
  {
    "id": "simple-interest",
    "name": "Simple Interest",
    "category": "Calculators",
    "description": "Calculate simple interest.",
    "icon": "landmark"
  },
  {
    "id": "compound-interest",
    "name": "Compound Interest",
    "category": "Calculators",
    "description": "Calculate compound interest.",
    "icon": "trending-up"
  },
  {
    "id": "age",
    "name": "Age Calculator",
    "category": "Calculators",
    "description": "Calculate age from date of birth.",
    "icon": "cake"
  },
  {
    "id": "date-difference",
    "name": "Date Difference",
    "category": "Calculators",
    "description": "Calculate the number of days between dates.",
    "icon": "calendar"
  },
  {
    "id": "bmi",
    "name": "BMI Calculator",
    "category": "Calculators",
    "description": "Calculate body mass index.",
    "icon": "activity"
  },
  {
    "id": "average",
    "name": "Average Calculator",
    "category": "Calculators",
    "description": "Calculate mean, median, mode, minimum and maximum.",
    "icon": "chart-no-axes-column"
  },
  {
    "id": "ratio",
    "name": "Ratio Calculator",
    "category": "Calculators",
    "description": "Simplify a ratio and calculate each side’s percentage share.",
    "icon": "scale"
  },
  {
    "id": "unit-length",
    "name": "Length Converter",
    "category": "Converters",
    "description": "Convert metric and imperial length units.",
    "icon": "ruler"
  },
  {
    "id": "unit-weight",
    "name": "Weight Converter",
    "category": "Converters",
    "description": "Convert weight and mass units.",
    "icon": "weight"
  },
  {
    "id": "unit-temp",
    "name": "Temperature Converter",
    "category": "Converters",
    "description": "Convert Celsius, Fahrenheit and Kelvin.",
    "icon": "thermometer"
  },
  {
    "id": "unit-data",
    "name": "Data Storage Converter",
    "category": "Converters",
    "description": "Convert bytes, KB, MB, GB and TB.",
    "icon": "database"
  },
  {
    "id": "unit-speed",
    "name": "Speed Converter",
    "category": "Converters",
    "description": "Convert km/h, mph and m/s.",
    "icon": "gauge"
  },
  {
    "id": "qr-generator",
    "name": "QR Code Generator",
    "category": "QR & Barcode",
    "description": "Generate QR codes for text, URLs and contact details.",
    "icon": "qr-code"
  },
  {
    "id": "barcode",
    "name": "Barcode Generator",
    "category": "QR & Barcode",
    "description": "Generate Code 128 barcodes for supported text and numeric values.",
    "icon": "barcode"
  },
  {
    "id": "password",
    "name": "Password Generator",
    "category": "Security",
    "description": "Generate strong random passwords locally.",
    "icon": "key-round"
  },
  {
    "id": "password-strength",
    "name": "Password Strength Checker",
    "category": "Security",
    "description": "Estimate password strength locally.",
    "icon": "shield-check"
  },
  {
    "id": "text-encrypt",
    "name": "Text Encryptor",
    "category": "Security",
    "description": "Encrypt text using a password and Web Crypto.",
    "icon": "lock"
  },
  {
    "id": "text-decrypt",
    "name": "Text Decryptor",
    "category": "Security",
    "description": "Decrypt text created by AP TOOLS text encryptor.",
    "icon": "unlock"
  },
  {
    "id": "random-number",
    "name": "Random Number Generator",
    "category": "Utilities",
    "description": "Generate random numbers securely.",
    "icon": "dice-5"
  },
  {
    "id": "stopwatch",
    "name": "Stopwatch",
    "category": "Utilities",
    "description": "Use a simple stopwatch.",
    "icon": "timer"
  },
  {
    "id": "countdown",
    "name": "Countdown Timer",
    "category": "Utilities",
    "description": "Set a browser-based countdown timer.",
    "icon": "hourglass"
  },
  {
    "id": "pomodoro",
    "name": "Pomodoro Timer",
    "category": "Utilities",
    "description": "Focus with configurable work and break sessions.",
    "icon": "timer-reset"
  },
  {
    "id": "notes",
    "name": "Quick Notes",
    "category": "Utilities",
    "description": "Save private notes in this browser.",
    "icon": "notebook-pen"
  },
  {
    "id": "todo",
    "name": "To-do List",
    "category": "Utilities",
    "description": "Manage tasks locally in your browser.",
    "icon": "list-check"
  },
  {
    "id": "line-breaks-remove",
    "name": "Remove Line Breaks",
    "category": "Text",
    "description": "Join wrapped text lines into a single paragraph.",
    "icon": "align-left"
  },
  {
    "id": "line-numbers-add",
    "name": "Add Line Numbers",
    "category": "Text",
    "description": "Prefix each line with a sequential line number.",
    "icon": "list-ordered"
  },
  {
    "id": "line-numbers-remove",
    "name": "Remove Line Numbers",
    "category": "Text",
    "description": "Remove leading numbering from pasted text.",
    "icon": "list-filter"
  },
  {
    "id": "lines-prefix",
    "name": "Prefix Every Line",
    "category": "Text",
    "description": "Add custom text to the start of every line.",
    "icon": "text-cursor-input"
  },
  {
    "id": "lines-suffix",
    "name": "Suffix Every Line",
    "category": "Text",
    "description": "Add custom text to the end of every line.",
    "icon": "text-cursor-input"
  },
  {
    "id": "lines-reverse",
    "name": "Reverse Line Order",
    "category": "Text",
    "description": "Reverse the order of lines without changing line content.",
    "icon": "arrow-down-up"
  },
  {
    "id": "lines-shuffle",
    "name": "Shuffle Lines",
    "category": "Text",
    "description": "Randomly shuffle lines using browser cryptographic randomness.",
    "icon": "shuffle"
  },
  {
    "id": "words-sort",
    "name": "Sort Words Alphabetically",
    "category": "Text",
    "description": "Sort the words in a text block alphabetically.",
    "icon": "arrow-down-a-z"
  },
  {
    "id": "word-frequency",
    "name": "Word Frequency Counter",
    "category": "Text",
    "description": "Count repeated words and show the most frequent terms.",
    "icon": "chart-column"
  },
  {
    "id": "keyword-density",
    "name": "Keyword Density Checker",
    "category": "Text",
    "description": "Measure the frequency and density of words in text.",
    "icon": "chart-no-axes-combined"
  },
  {
    "id": "sentence-count",
    "name": "Sentence Counter",
    "category": "Text",
    "description": "Count sentences and estimate average sentence length.",
    "icon": "file-text"
  },
  {
    "id": "paragraph-count",
    "name": "Paragraph Counter",
    "category": "Text",
    "description": "Count paragraphs and report paragraph lengths.",
    "icon": "align-justify"
  },
  {
    "id": "text-cleaner",
    "name": "Text Cleaner",
    "category": "Text",
    "description": "Remove control characters and tidy pasted text safely.",
    "icon": "wand-sparkles"
  },
  {
    "id": "whitespace-normalizer",
    "name": "Whitespace Normalizer",
    "category": "Text",
    "description": "Normalize spaces, tabs and blank lines in text.",
    "icon": "pilcrow"
  },
  {
    "id": "title-case",
    "name": "Title Case Converter",
    "category": "Text",
    "description": "Convert text to title case while preserving punctuation.",
    "icon": "case-sensitive"
  },
  {
    "id": "sentence-case",
    "name": "Sentence Case Converter",
    "category": "Text",
    "description": "Capitalize sentence beginnings and lowercase remaining text.",
    "icon": "case-sensitive"
  },
  {
    "id": "camel-case",
    "name": "Camel Case Converter",
    "category": "Text",
    "description": "Convert a phrase into camelCase.",
    "icon": "code"
  },
  {
    "id": "pascal-case",
    "name": "Pascal Case Converter",
    "category": "Text",
    "description": "Convert a phrase into PascalCase.",
    "icon": "code"
  },
  {
    "id": "snake-case",
    "name": "Snake Case Converter",
    "category": "Text",
    "description": "Convert a phrase into snake_case.",
    "icon": "code"
  },
  {
    "id": "kebab-case",
    "name": "Kebab Case Converter",
    "category": "Text",
    "description": "Convert a phrase into kebab-case.",
    "icon": "code"
  },
  {
    "id": "constant-case",
    "name": "CONSTANT_CASE Converter",
    "category": "Text",
    "description": "Convert a phrase into CONSTANT_CASE.",
    "icon": "code"
  },
  {
    "id": "alternating-case",
    "name": "Alternating Case Converter",
    "category": "Text",
    "description": "Alternate lowercase and uppercase letters in text.",
    "icon": "case-sensitive"
  },
  {
    "id": "remove-emojis",
    "name": "Remove Emojis",
    "category": "Text",
    "description": "Remove emoji symbols from a text block.",
    "icon": "eraser"
  },
  {
    "id": "non-ascii-remover",
    "name": "Remove Non-ASCII Characters",
    "category": "Text",
    "description": "Keep only printable ASCII characters in pasted text.",
    "icon": "filter"
  },
  {
    "id": "extract-emails",
    "name": "Extract Email Addresses",
    "category": "Text",
    "description": "Find and list unique email-like strings from text.",
    "icon": "at-sign"
  },
  {
    "id": "extract-urls",
    "name": "Extract URLs",
    "category": "Text",
    "description": "Find and list unique HTTP or HTTPS URLs from text.",
    "icon": "link"
  },
  {
    "id": "extract-phone-numbers",
    "name": "Extract Phone Numbers",
    "category": "Text",
    "description": "Find phone-like number strings in pasted text.",
    "icon": "phone"
  },
  {
    "id": "text-to-hex",
    "name": "Text to Hex Converter",
    "category": "Encoding",
    "description": "Encode UTF-8 text bytes as hexadecimal.",
    "icon": "binary"
  },
  {
    "id": "hex-to-text",
    "name": "Hex to Text Converter",
    "category": "Encoding",
    "description": "Decode hexadecimal bytes into UTF-8 text.",
    "icon": "binary"
  },
  {
    "id": "text-to-decimal",
    "name": "Text to Decimal Codes",
    "category": "Encoding",
    "description": "Convert each Unicode character into its decimal code point.",
    "icon": "hash"
  },
  {
    "id": "decimal-to-text",
    "name": "Decimal Codes to Text",
    "category": "Encoding",
    "description": "Convert decimal Unicode code points back into text.",
    "icon": "hash"
  },
  {
    "id": "unicode-escape",
    "name": "Unicode Escape Converter",
    "category": "Encoding",
    "description": "Escape non-ASCII characters using Unicode code point notation.",
    "icon": "code"
  },
  {
    "id": "unicode-unescape",
    "name": "Unicode Unescape Converter",
    "category": "Encoding",
    "description": "Decode Unicode escape sequences into readable text.",
    "icon": "code"
  },
  {
    "id": "html-unescape",
    "name": "HTML Entity Decoder",
    "category": "Encoding",
    "description": "Decode common HTML entities into their text characters.",
    "icon": "code"
  },
  {
    "id": "html-strip-tags",
    "name": "HTML Tag Stripper",
    "category": "Encoding",
    "description": "Remove HTML tags and return readable page text.",
    "icon": "file-code"
  },
  {
    "id": "text-to-html",
    "name": "Text to HTML Converter",
    "category": "Encoding",
    "description": "Wrap plain text as safe HTML with preserved line breaks.",
    "icon": "file-code"
  },
  {
    "id": "markdown-toc",
    "name": "Markdown TOC Generator",
    "category": "Text",
    "description": "Generate a table of contents from Markdown headings.",
    "icon": "list"
  },
  {
    "id": "markdown-table",
    "name": "Markdown Table Generator",
    "category": "Text",
    "description": "Convert comma-separated rows into a Markdown table.",
    "icon": "table"
  },
  {
    "id": "markdown-escape",
    "name": "Markdown Escape",
    "category": "Text",
    "description": "Escape Markdown punctuation so it displays literally.",
    "icon": "code"
  },
  {
    "id": "markdown-unescape",
    "name": "Markdown Unescape",
    "category": "Text",
    "description": "Remove backslash escapes from Markdown punctuation.",
    "icon": "code"
  },
  {
    "id": "json-stringify-text",
    "name": "Text to JSON String",
    "category": "Developer",
    "description": "Encode plain text as a JSON string literal.",
    "icon": "braces"
  },
  {
    "id": "json-parse-text",
    "name": "JSON String to Text",
    "category": "Developer",
    "description": "Decode a JSON string literal into plain text.",
    "icon": "braces"
  },
  {
    "id": "lines-to-json",
    "name": "Lines to JSON Array",
    "category": "Developer",
    "description": "Convert newline-separated values into a JSON array.",
    "icon": "brackets"
  },
  {
    "id": "json-to-lines",
    "name": "JSON Array to Lines",
    "category": "Developer",
    "description": "Convert a JSON array into newline-separated values.",
    "icon": "brackets"
  },
  {
    "id": "csv-to-tsv",
    "name": "CSV to TSV Converter",
    "category": "Developer",
    "description": "Convert comma-separated values to tab-separated values.",
    "icon": "table"
  },
  {
    "id": "tsv-to-csv",
    "name": "TSV to CSV Converter",
    "category": "Developer",
    "description": "Convert tab-separated values to comma-separated values.",
    "icon": "table"
  },
  {
    "id": "csv-to-markdown",
    "name": "CSV to Markdown Table",
    "category": "Developer",
    "description": "Convert CSV data into a Markdown table.",
    "icon": "table"
  },
  {
    "id": "csv-to-html",
    "name": "CSV to HTML Table",
    "category": "Developer",
    "description": "Convert CSV data into a safe HTML table preview.",
    "icon": "table"
  },
  {
    "id": "json-sort-keys",
    "name": "JSON Key Sorter",
    "category": "Developer",
    "description": "Sort object keys recursively in valid JSON.",
    "icon": "braces"
  },
  {
    "id": "json-flatten",
    "name": "JSON Flattener",
    "category": "Developer",
    "description": "Flatten nested JSON objects into dotted key paths.",
    "icon": "braces"
  },
  {
    "id": "json-unflatten",
    "name": "JSON Unflattener",
    "category": "Developer",
    "description": "Rebuild nested JSON objects from dotted key paths.",
    "icon": "braces"
  },
  {
    "id": "xml-formatter",
    "name": "XML Formatter",
    "category": "Developer",
    "description": "Format XML with readable indentation and validation.",
    "icon": "file-code"
  },
  {
    "id": "xml-minifier",
    "name": "XML Minifier",
    "category": "Developer",
    "description": "Remove XML comments and inter-tag whitespace.",
    "icon": "file-code"
  },
  {
    "id": "json-to-xml",
    "name": "JSON to XML Converter",
    "category": "Developer",
    "description": "Convert a JSON object into a simple XML document.",
    "icon": "file-code"
  },
  {
    "id": "xml-to-json",
    "name": "XML to JSON Converter",
    "category": "Developer",
    "description": "Convert XML elements and attributes into JSON.",
    "icon": "file-json"
  },
  {
    "id": "css-formatter",
    "name": "CSS Formatter",
    "category": "Developer",
    "description": "Format CSS declarations with basic readable indentation.",
    "icon": "file-code"
  },
  {
    "id": "css-minifier",
    "name": "CSS Minifier",
    "category": "Developer",
    "description": "Remove CSS comments and redundant whitespace.",
    "icon": "file-code"
  },
  {
    "id": "sql-formatter",
    "name": "SQL Formatter",
    "category": "Developer",
    "description": "Format common SQL clauses onto separate lines.",
    "icon": "database"
  },
  {
    "id": "sql-minifier",
    "name": "SQL Minifier",
    "category": "Developer",
    "description": "Remove SQL comments and redundant whitespace.",
    "icon": "database"
  },
  {
    "id": "sql-escape",
    "name": "SQL String Escape",
    "category": "Developer",
    "description": "Escape a value for a SQL string literal; not a query builder.",
    "icon": "database"
  },
  {
    "id": "url-parser",
    "name": "URL Parser",
    "category": "Developer",
    "description": "Parse a URL into protocol, host, path and query components.",
    "icon": "link"
  },
  {
    "id": "query-string-parser",
    "name": "Query String Parser",
    "category": "Developer",
    "description": "Parse URL query parameters into a readable JSON object.",
    "icon": "list-tree"
  },
  {
    "id": "query-string-builder",
    "name": "Query String Builder",
    "category": "Developer",
    "description": "Build a URL query string from a JSON object.",
    "icon": "list-tree"
  },
  {
    "id": "base64url-encoder",
    "name": "Base64URL Encoder",
    "category": "Encoding",
    "description": "Encode UTF-8 text using URL-safe Base64.",
    "icon": "binary"
  },
  {
    "id": "base64url-decoder",
    "name": "Base64URL Decoder",
    "category": "Encoding",
    "description": "Decode URL-safe Base64 into UTF-8 text.",
    "icon": "binary"
  },
  {
    "id": "hmac-sha256",
    "name": "HMAC SHA-256 Generator",
    "category": "Security",
    "description": "Create an HMAC-SHA-256 digest using a key entered locally.",
    "icon": "fingerprint"
  },
  {
    "id": "uuid-validator",
    "name": "UUID Validator",
    "category": "Validation",
    "description": "Validate UUID versions and canonical UUID formatting.",
    "icon": "check-circle"
  },
  {
    "id": "email-validator",
    "name": "Email Validator",
    "category": "Validation",
    "description": "Check common email address syntax locally.",
    "icon": "mail-check"
  },
  {
    "id": "url-validator",
    "name": "URL Validator",
    "category": "Validation",
    "description": "Check whether text is a valid HTTP or HTTPS URL.",
    "icon": "globe"
  },
  {
    "id": "ipv4-validator",
    "name": "IPv4 Validator",
    "category": "Validation",
    "description": "Validate IPv4 dotted-decimal addresses.",
    "icon": "network"
  },
  {
    "id": "mac-validator",
    "name": "MAC Address Validator",
    "category": "Validation",
    "description": "Validate common MAC address notations.",
    "icon": "network"
  },
  {
    "id": "hex-color-validator",
    "name": "HEX Color Validator",
    "category": "Validation",
    "description": "Validate three-, six-, and eight-digit HEX color values.",
    "icon": "palette"
  },
  {
    "id": "credit-card-validator",
    "name": "Card Number Checksum",
    "category": "Validation",
    "description": "Validate card-number format using the Luhn checksum only.",
    "icon": "credit-card"
  },
  {
    "id": "isbn-validator",
    "name": "ISBN Validator",
    "category": "Validation",
    "description": "Validate ISBN-10 and ISBN-13 checksums.",
    "icon": "book-open"
  },
  {
    "id": "color-contrast-checker",
    "name": "Color Contrast Checker",
    "category": "Developer",
    "description": "Calculate WCAG contrast ratio for two HEX colors.",
    "icon": "contrast"
  },
  {
    "id": "color-shade-generator",
    "name": "Color Shade Generator",
    "category": "Developer",
    "description": "Generate lighter and darker HEX shades from one color.",
    "icon": "palette"
  },
  {
    "id": "rgb-to-hex",
    "name": "RGB to HEX Converter",
    "category": "Developer",
    "description": "Convert RGB color values into a HEX color.",
    "icon": "palette"
  },
  {
    "id": "hex-to-rgb",
    "name": "HEX to RGB and HSL",
    "category": "Developer",
    "description": "Convert a HEX color into RGB and HSL values.",
    "icon": "palette"
  },
  {
    "id": "px-to-rem",
    "name": "PX to REM Converter",
    "category": "Converters",
    "description": "Convert CSS pixel values to rem units.",
    "icon": "ruler"
  },
  {
    "id": "rem-to-px",
    "name": "REM to PX Converter",
    "category": "Converters",
    "description": "Convert CSS rem values to pixels.",
    "icon": "ruler"
  },
  {
    "id": "aspect-ratio-calculator",
    "name": "Aspect Ratio Calculator",
    "category": "Calculators",
    "description": "Calculate an image or video aspect ratio from its dimensions.",
    "icon": "ratio"
  },
  {
    "id": "binary-to-decimal",
    "name": "Binary to Decimal",
    "category": "Converters",
    "description": "Convert a binary integer into decimal.",
    "icon": "binary"
  },
  {
    "id": "decimal-to-binary",
    "name": "Decimal to Binary",
    "category": "Converters",
    "description": "Convert a whole number into binary.",
    "icon": "binary"
  },
  {
    "id": "decimal-to-hex",
    "name": "Decimal to HEX",
    "category": "Converters",
    "description": "Convert a whole number into hexadecimal.",
    "icon": "binary"
  },
  {
    "id": "hex-to-decimal",
    "name": "HEX to Decimal",
    "category": "Converters",
    "description": "Convert a hexadecimal integer into decimal.",
    "icon": "binary"
  },
  {
    "id": "decimal-to-octal",
    "name": "Decimal to Octal",
    "category": "Converters",
    "description": "Convert a whole number into octal.",
    "icon": "binary"
  },
  {
    "id": "roman-to-decimal",
    "name": "Roman Numeral to Number",
    "category": "Converters",
    "description": "Convert a valid Roman numeral into an integer.",
    "icon": "calculator"
  },
  {
    "id": "decimal-to-roman",
    "name": "Number to Roman Numeral",
    "category": "Converters",
    "description": "Convert an integer from 1 to 3999 into Roman numerals.",
    "icon": "calculator"
  },
  {
    "id": "number-to-words",
    "name": "Number to Words",
    "category": "Converters",
    "description": "Spell out a whole number in English words.",
    "icon": "spell-check"
  },
  {
    "id": "prime-checker",
    "name": "Prime Number Checker",
    "category": "Calculators",
    "description": "Check whether an integer is prime.",
    "icon": "calculator"
  },
  {
    "id": "prime-generator",
    "name": "Prime Number Generator",
    "category": "Calculators",
    "description": "Generate prime numbers up to a safe upper bound.",
    "icon": "calculator"
  },
  {
    "id": "factorial-calculator",
    "name": "Factorial Calculator",
    "category": "Calculators",
    "description": "Calculate a non-negative integer factorial.",
    "icon": "calculator"
  },
  {
    "id": "fibonacci-generator",
    "name": "Fibonacci Sequence Generator",
    "category": "Calculators",
    "description": "Generate a requested number of Fibonacci terms.",
    "icon": "calculator"
  },
  {
    "id": "gcd-lcm-calculator",
    "name": "GCD and LCM Calculator",
    "category": "Calculators",
    "description": "Calculate the greatest common divisor and least common multiple.",
    "icon": "calculator"
  },
  {
    "id": "percentage-change",
    "name": "Percentage Change Calculator",
    "category": "Calculators",
    "description": "Calculate percentage increase or decrease between two values.",
    "icon": "percent"
  },
  {
    "id": "tip-calculator",
    "name": "Tip and Bill Split Calculator",
    "category": "Calculators",
    "description": "Calculate a tip, total bill and per-person share.",
    "icon": "receipt"
  },
  {
    "id": "date-add-days",
    "name": "Date Add or Subtract Days",
    "category": "Calculators",
    "description": "Add or subtract calendar days from a date.",
    "icon": "calendar"
  },
  {
    "id": "working-days-calculator",
    "name": "Working Days Calculator",
    "category": "Calculators",
    "description": "Count weekdays between two dates, excluding weekends.",
    "icon": "calendar-days"
  },
  {
    "id": "time-duration-calculator",
    "name": "Time Duration Calculator",
    "category": "Calculators",
    "description": "Calculate elapsed time between two clock times or add durations.",
    "icon": "clock"
  },
  {
    "id": "reading-time-estimator",
    "name": "Reading Time Estimator",
    "category": "Text",
    "description": "Estimate reading time from a word count and selected pace.",
    "icon": "book-open"
  }
]

export const categories = ["All Tools", ...Array.from(new Set(tools.map(t => t.category)))]
