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
    "id": "todo",
    "name": "To-do List",
    "category": "Utilities",
    "description": "Manage tasks locally in your browser.",
    "icon": "list-check"
  }
]

export const categories = ["All Tools", ...Array.from(new Set(tools.map(t => t.category)))]
