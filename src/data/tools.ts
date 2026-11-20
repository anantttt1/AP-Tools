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
    "id": "pdf-compress",
    "name": "Compress PDF",
    "category": "PDF",
    "description": "Re-save PDF documents with object streams to reduce avoidable file overhead where possible.",
    "icon": "file-archive"
  },
  {
    "id": "pdf-repair",
    "name": "Repair PDF",
    "category": "PDF",
    "description": "Rebuild a readable PDF structure by loading and re-saving supported PDF documents.",
    "icon": "wrench"
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
    "id": "pdf-to-powerpoint",
    "name": "PDF to PowerPoint",
    "category": "PDF",
    "description": "Convert each PDF page into a visual PowerPoint slide. Runs locally in the browser; slide contents are images rather than editable text.",
    "icon": "presentation"
  },
  {
    "id": "powerpoint-to-pdf",
    "name": "PowerPoint to PDF",
    "category": "PDF",
    "description": "Convert a local PPTX presentation into a PDF in your browser. Image-based slides are preserved; complex layouts may be simplified.",
    "icon": "file-pdf"
  },
  {
    "id": "html-to-pdf",
    "name": "HTML to PDF",
    "category": "PDF",
    "description": "Render a local HTML file to PDF in your browser. Scripts and active embedded content are removed; external resources may not render.",
    "icon": "file-code"
  },
  {
    "id": "word-to-pdf",
    "name": "Word to PDF",
    "category": "PDF",
    "description": "Convert DOCX text into a downloadable PDF entirely in your browser. Document files stay on your device.",
    "icon": "file-pdf"
  },
  {
    "id": "pdf-to-word",
    "name": "PDF to Word",
    "category": "PDF",
    "description": "Extract selectable PDF text into an editable Word document, processed locally in your browser.",
    "icon": "file-text"
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
  },
  {
    "id": "pdf-remove-pages",
    "name": "Remove Pages from PDF",
    "category": "PDF",
    "description": "Delete selected page numbers from a PDF and download a new copy.",
    "icon": "file-minus"
  },
  {
    "id": "pdf-organize-pages",
    "name": "Organize PDF Pages",
    "category": "PDF",
    "description": "Reorder every PDF page by entering its page sequence.",
    "icon": "list-ordered"
  },
  {
    "id": "pdf-split-every-page",
    "name": "Split PDF into Separate Pages",
    "category": "PDF",
    "description": "Save each page of a PDF as its own PDF in one ZIP download.",
    "icon": "files"
  },
  {
    "id": "pdf-header-footer",
    "name": "Add Header and Footer to PDF",
    "category": "PDF",
    "description": "Stamp custom header and footer text on every PDF page.",
    "icon": "text"
  },
  {
    "id": "pdf-metadata-editor",
    "name": "Edit PDF Metadata",
    "category": "PDF",
    "description": "Set document title, author, subject and keywords.",
    "icon": "file-pen"
  },
  {
    "id": "pdf-crop",
    "name": "Crop PDF Pages",
    "category": "PDF",
    "description": "Set a crop box for PDF pages using point coordinates.",
    "icon": "crop"
  },
  {
    "id": "pdf-flatten-forms",
    "name": "Flatten PDF Forms",
    "category": "PDF",
    "description": "Flatten supported AcroForm fields into page content.",
    "icon": "layers"
  },
  {
    "id": "pdf-compare",
    "name": "Compare PDF Text",
    "category": "PDF",
    "description": "Compare selectable text extracted from two PDF documents.",
    "icon": "file-diff"
  },
  {
    "id": "pdf-extract-pages",
    "name": "Extract PDF Pages",
    "category": "PDF",
    "description": "Extract selected page ranges from a PDF into a new document.",
    "icon": "file-output"
  },
  {
    "id": "pdf-sign-visible",
    "name": "Add Signature to PDF",
    "category": "PDF",
    "description": "Place a typed visual signature on the first PDF page; this is not a certificate-backed digital signature.",
    "icon": "signature"
  },
  {
    "id": "pdf-edit-annotate",
    "name": "Add Text to PDF",
    "category": "PDF",
    "description": "Add a text note to the first page of a PDF document.",
    "icon": "file-pen"
  },
  {
    "id": "pdf-scan-images",
    "name": "Scan Images to PDF",
    "category": "PDF",
    "description": "Combine photos or scanned page images into a PDF document.",
    "icon": "scan"
  },
  {
    "id": "text-trim-lines",
    "name": "Text Trim Lines",
    "category": "Text",
    "description": "Perform text trim lines locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-remove-blank-lines",
    "name": "Text Remove Blank Lines",
    "category": "Text",
    "description": "Perform text remove blank lines locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-unique-words",
    "name": "Text Unique Words",
    "category": "Text",
    "description": "Perform text unique words locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-word-sort",
    "name": "Text Word Sort",
    "category": "Text",
    "description": "Perform text word sort locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-char-frequency",
    "name": "Character Frequency Counter",
    "category": "Text",
    "description": "Count character frequency in text.",
    "icon": "wrench"
  },
  {
    "id": "text-reading-stats",
    "name": "Text Statistics",
    "category": "Text",
    "description": "Show words, characters, sentences, paragraphs and average word length.",
    "icon": "wrench"
  },
  {
    "id": "text-remove-punctuation",
    "name": "Text Remove Punctuation",
    "category": "Text",
    "description": "Perform text remove punctuation locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-remove-numbers",
    "name": "Text Remove Numbers",
    "category": "Text",
    "description": "Perform text remove numbers locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-keep-numbers",
    "name": "Text Keep Numbers",
    "category": "Text",
    "description": "Perform text keep numbers locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-keep-letters",
    "name": "Text Keep Letters",
    "category": "Text",
    "description": "Perform text keep letters locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-replace",
    "name": "Text Replace",
    "category": "Text",
    "description": "Perform text replace locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-prefix-lines",
    "name": "Text Prefix Lines",
    "category": "Text",
    "description": "Perform text prefix lines locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-suffix-lines",
    "name": "Text Suffix Lines",
    "category": "Text",
    "description": "Perform text suffix lines locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-sort-desc",
    "name": "Text Sort Desc",
    "category": "Text",
    "description": "Perform text sort desc locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-sort-numeric",
    "name": "Text Sort Numeric",
    "category": "Text",
    "description": "Perform text sort numeric locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-dedupe-case-insensitive",
    "name": "Text Dedupe Case Insensitive",
    "category": "Text",
    "description": "Perform text dedupe case insensitive locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-reverse-lines",
    "name": "Text Reverse Lines",
    "category": "Text",
    "description": "Perform text reverse lines locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-indent",
    "name": "Text Indent",
    "category": "Text",
    "description": "Perform text indent locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-unindent",
    "name": "Text Unindent",
    "category": "Text",
    "description": "Perform text unindent locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-tab-to-space",
    "name": "Text Tab To Space",
    "category": "Text",
    "description": "Perform text tab to space locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-space-to-tab",
    "name": "Text Space To Tab",
    "category": "Text",
    "description": "Perform text space to tab locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-normalize-quotes",
    "name": "Text Normalize Quotes",
    "category": "Text",
    "description": "Perform text normalize quotes locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-remove-accents",
    "name": "Text Remove Accents",
    "category": "Text",
    "description": "Perform text remove accents locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-count-unique-lines",
    "name": "Text Count Unique Lines",
    "category": "Text",
    "description": "Perform text count unique lines locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-extract-hashtags",
    "name": "Text Extract Hashtags",
    "category": "Text",
    "description": "Perform text extract hashtags locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-extract-mentions",
    "name": "Text Extract Mentions",
    "category": "Text",
    "description": "Perform text extract mentions locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-extract-ipv4",
    "name": "Text Extract Ipv4",
    "category": "Text",
    "description": "Perform text extract ipv4 locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-extract-domains",
    "name": "Text Extract Domains",
    "category": "Text",
    "description": "Perform text extract domains locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-extract-dates",
    "name": "Text Extract Dates",
    "category": "Text",
    "description": "Perform text extract dates locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-mask-email",
    "name": "Text Mask Email",
    "category": "Text",
    "description": "Perform text mask email locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-mask-phone",
    "name": "Text Mask Phone",
    "category": "Text",
    "description": "Perform text mask phone locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-mask-card",
    "name": "Text Mask Card",
    "category": "Text",
    "description": "Perform text mask card locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-to-upper",
    "name": "Text To Upper",
    "category": "Text",
    "description": "Perform text to upper locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-to-lower",
    "name": "Text To Lower",
    "category": "Text",
    "description": "Perform text to lower locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-to-title",
    "name": "Text To Title",
    "category": "Text",
    "description": "Perform text to title locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-to-sentence",
    "name": "Text To Sentence",
    "category": "Text",
    "description": "Perform text to sentence locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-to-mirror",
    "name": "Text To Mirror",
    "category": "Text",
    "description": "Perform text to mirror locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-wrap-80",
    "name": "Text Wrap 80",
    "category": "Text",
    "description": "Perform text wrap 80 locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "text-unwrap",
    "name": "Text Unwrap",
    "category": "Text",
    "description": "Perform text unwrap locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "json-validate",
    "name": "JSON Validator",
    "category": "Developer",
    "description": "Validate JSON and report whether it parses successfully.",
    "icon": "wrench"
  },
  {
    "id": "json-to-yaml-lite",
    "name": "JSON to YAML",
    "category": "Developer",
    "description": "Convert JSON values into a safe YAML subset.",
    "icon": "wrench"
  },
  {
    "id": "yaml-validate-lite",
    "name": "YAML Basic Validator",
    "category": "Developer",
    "description": "Check indentation and common structural errors in a YAML subset.",
    "icon": "wrench"
  },
  {
    "id": "url-parse",
    "name": "URL Parser",
    "category": "Developer",
    "description": "Parse a URL into protocol, host, path, query and fragment.",
    "icon": "wrench"
  },
  {
    "id": "url-query-encode",
    "name": "Url Query Encode",
    "category": "Developer",
    "description": "Perform url query encode locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "url-query-decode",
    "name": "Url Query Decode",
    "category": "Developer",
    "description": "Perform url query decode locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "html-escape-advanced",
    "name": "Html Escape Advanced",
    "category": "Developer",
    "description": "Perform html escape advanced locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "html-unescape-advanced",
    "name": "Html Unescape Advanced",
    "category": "Developer",
    "description": "Perform html unescape advanced locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "css-color-to-rgb",
    "name": "Css Color To Rgb",
    "category": "Developer",
    "description": "Perform css color to rgb locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "css-rgb-to-hex",
    "name": "Css Rgb To Hex",
    "category": "Developer",
    "description": "Perform css rgb to hex locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "css-rem-to-em",
    "name": "Css Rem To Em",
    "category": "Developer",
    "description": "Perform css rem to em locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "css-em-to-rem",
    "name": "Css Em To Rem",
    "category": "Developer",
    "description": "Perform css em to rem locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "css-clamp-generator",
    "name": "Css Clamp Generator",
    "category": "Developer",
    "description": "Perform css clamp generator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "css-media-query",
    "name": "Css Media Query",
    "category": "Developer",
    "description": "Perform css media query locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "css-flex-center",
    "name": "Css Flex Center",
    "category": "Developer",
    "description": "Perform css flex center locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "css-grid-generator",
    "name": "Css Grid Generator",
    "category": "Developer",
    "description": "Perform css grid generator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "html-meta-generator",
    "name": "Html Meta Generator",
    "category": "Developer",
    "description": "Perform html meta generator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "html-link-generator",
    "name": "Html Link Generator",
    "category": "Developer",
    "description": "Perform html link generator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "html-image-tag",
    "name": "Html Image Tag",
    "category": "Developer",
    "description": "Perform html image tag locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "sql-in-list",
    "name": "Sql In List",
    "category": "Developer",
    "description": "Perform sql in list locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "sql-quote",
    "name": "Sql Quote",
    "category": "Developer",
    "description": "Perform sql quote locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "regex-email-check",
    "name": "Regex Email Check",
    "category": "Developer",
    "description": "Perform regex email check locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "regex-url-check",
    "name": "Regex Url Check",
    "category": "Developer",
    "description": "Perform regex url check locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "regex-password-check",
    "name": "Regex Password Check",
    "category": "Developer",
    "description": "Perform regex password check locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "base64url-encode",
    "name": "Base64URL Encoder",
    "category": "Developer",
    "description": "Encode UTF-8 text using URL-safe Base64.",
    "icon": "wrench"
  },
  {
    "id": "base64url-decode",
    "name": "Base64URL Decoder",
    "category": "Developer",
    "description": "Decode URL-safe Base64 as UTF-8 text.",
    "icon": "wrench"
  },
  {
    "id": "hex-validator",
    "name": "Hex Validator",
    "category": "Developer",
    "description": "Perform hex validator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "credit-card-luhn",
    "name": "Credit Card Luhn",
    "category": "Developer",
    "description": "Perform credit card luhn locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "iban-format-check",
    "name": "Iban Format Check",
    "category": "Developer",
    "description": "Perform iban format check locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "binary-to-octal",
    "name": "Binary To Octal",
    "category": "Converters",
    "description": "Perform binary to octal locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "octal-to-binary",
    "name": "Octal To Binary",
    "category": "Converters",
    "description": "Perform octal to binary locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "hex-to-binary",
    "name": "Hex To Binary",
    "category": "Developer",
    "description": "Perform hex to binary locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "binary-to-hex",
    "name": "Binary To Hex",
    "category": "Converters",
    "description": "Perform binary to hex locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "decimal-to-base",
    "name": "Decimal To Base",
    "category": "Converters",
    "description": "Perform decimal to base locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "base-to-decimal",
    "name": "Base To Decimal",
    "category": "Converters",
    "description": "Perform base to decimal locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "celsius-to-fahrenheit",
    "name": "Celsius To Fahrenheit",
    "category": "Converters",
    "description": "Perform celsius to fahrenheit locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "fahrenheit-to-celsius",
    "name": "Fahrenheit To Celsius",
    "category": "Converters",
    "description": "Perform fahrenheit to celsius locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "kg-to-lb",
    "name": "Kg To Lb",
    "category": "Converters",
    "description": "Perform kg to lb locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "lb-to-kg",
    "name": "Lb To Kg",
    "category": "Converters",
    "description": "Perform lb to kg locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "cm-to-inch",
    "name": "Cm To Inch",
    "category": "Converters",
    "description": "Perform cm to inch locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "inch-to-cm",
    "name": "Inch To Cm",
    "category": "Converters",
    "description": "Perform inch to cm locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "km-to-mile",
    "name": "Km To Mile",
    "category": "Converters",
    "description": "Perform km to mile locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "mile-to-km",
    "name": "Mile To Km",
    "category": "Converters",
    "description": "Perform mile to km locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "litre-to-gallon",
    "name": "Litre To Gallon",
    "category": "Converters",
    "description": "Perform litre to gallon locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "gallon-to-litre",
    "name": "Gallon To Litre",
    "category": "Converters",
    "description": "Perform gallon to litre locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "bytes-to-mb",
    "name": "Bytes To Mb",
    "category": "Converters",
    "description": "Perform bytes to mb locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "mb-to-bytes",
    "name": "Mb To Bytes",
    "category": "Converters",
    "description": "Perform mb to bytes locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "unix-ms-to-date",
    "name": "Unix Ms To Date",
    "category": "Converters",
    "description": "Perform unix ms to date locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "date-to-unix-ms",
    "name": "Date To Unix Ms",
    "category": "Converters",
    "description": "Perform date to unix ms locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "loan-interest-only",
    "name": "Loan Interest Only",
    "category": "Converters",
    "description": "Perform loan interest only locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "compound-growth",
    "name": "Compound Growth",
    "category": "Calculators",
    "description": "Perform compound growth locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "profit-margin",
    "name": "Profit Margin",
    "category": "Calculators",
    "description": "Perform profit margin locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "markup-calculator",
    "name": "Markup Calculator",
    "category": "Calculators",
    "description": "Perform markup calculator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "sales-tax-calculator",
    "name": "Sales Tax Calculator",
    "category": "Calculators",
    "description": "Perform sales tax calculator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "percentage-of-number",
    "name": "Percentage Of Number",
    "category": "Converters",
    "description": "Perform percentage of number locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "break-even-calculator",
    "name": "Break Even Calculator",
    "category": "Calculators",
    "description": "Perform break even calculator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "average-speed-calculator",
    "name": "Average Speed Calculator",
    "category": "Calculators",
    "description": "Perform average speed calculator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "pace-calculator",
    "name": "Pace Calculator",
    "category": "Calculators",
    "description": "Perform pace calculator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "fuel-cost-calculator",
    "name": "Fuel Cost Calculator",
    "category": "Calculators",
    "description": "Perform fuel cost calculator locally in your browser with input validation.",
    "icon": "wrench"
  },
  {
    "id": "date-weekday",
    "name": "Date Weekday",
    "category": "Converters",
    "description": "Perform date weekday locally in your browser with input validation.",
    "icon": "wrench"
  }
]

export const categories = ["All Tools", ...Array.from(new Set(tools.map(t => t.category)))]
