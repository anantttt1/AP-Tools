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
  }
]

export const categories = ["All Tools", ...Array.from(new Set(tools.map(t => t.category)))]
