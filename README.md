# AP TOOLS

**All your tools. One place.**

AP TOOLS is a frontend-first utility platform built with React 19.3, React Router 7.18, TypeScript and Vite 8. It uses browser APIs and client-side libraries to process supported files locally. There is no AP TOOLS backend, mandatory account, or paid API dependency.

## What's included

- Minimal light-theme interface with advanced micro-interactions
- Responsive collapsible sidebar
- Homepage, searchable 100-tool directory, favorites, recent tools and settings
- Dedicated reusable tool workspaces
- Batch Center for applying supported operations to multiple files and downloading results as ZIP
- Workflow Studio for chaining supported browser processors, including a second input for tools that need one
- Local notes, task list, stopwatch, countdown and Pomodoro timer
- Local favorites and recent history
- Installable PWA manifest with PNG/SVG icons and limited app-shell caching
- Static-host security headers: restrictive CSP, frame protections, permissions policy and no-referrer defaults
- Resource limits for archives, PDFs, image pixels, text parsing and batch output; unsafe ZIP paths are rejected
- CSV formula-injection protection, disposable timed regex workers, cryptographic random generation and AES-GCM text encryption
- File and PDF utilities, image tools, text utilities, developer tools, calculators, QR/barcode and security utilities

## Run on Windows

1. Install Node.js 22.12 or newer (Node.js 24 LTS/current is suitable).
2. Extract this ZIP.
3. Double-click `start.bat`, or open this folder in VS Code and run:

```bash
npm install
npm run dev
```

4. Open the local URL shown in the terminal (usually `http://localhost:3000` (Vite will choose another available port if needed)).

## Production build and checks

```bash
npm run verify:catalog
npm test
npm run typecheck
npm run build
npm run preview
```

Deploy the generated `dist` folder to Cloudflare Pages or another static host.

## Browser-only processing notes

- ZIP support is ZIP format via JSZip; it is not a universal RAR/7z extractor.
- PDF merge, page extraction, page numbering, rotation, watermark, page inspection, text extraction and PDF-to-image rendering are included. Password encryption is not included; the similarly named directory entry is explicitly a PDF page inspector.
- Image operations use Canvas and browser image decoding. Input formats depend on the browser.
- PDF-to-image and PDF text extraction use PDF.js with eval/XFA features disabled, explicit page and rendering-pixel limits, and cleanup after processing.
- Batch operations process selected files one by one in the browser (up to 100 files / 120 MB input and 160 MB output).
- Workflow Studio passes supported text or generated-file outputs from one step to the next (up to 20 steps). Not every possible combination of tools is meaningful. Saved workflow content is stored in unencrypted browser local storage; do not save passwords or private data. Any non-empty encryption-password field is blocked from workflow saves.
- Notes, tasks, favorites and recent tool IDs are stored in local browser storage. Original files are not retained by history.
- AI generation, cloud storage, cross-device sync, user accounts, payment processing, PDF password encryption, OCR and server-only website checks are intentionally not included because this build has no backend or paid API.
- Browser memory is finite: archive extraction, PDF/image work and batch operations have explicit limits; stay below those limits on mobile devices. The regex tester runs patterns inside a disposable worker and terminates runs that exceed its time limit.
- The UI loads Google Fonts from Google when online; local processing does not send selected file contents to Google.

See [SECURITY.md](./SECURITY.md) for the security model, resource limits and important limitations.

## Privacy

AP TOOLS does not upload selected files to an AP TOOLS server. Processing is local for the included client-side tools. Your browser, installed extensions and any third-party hosting or browser services remain outside the app's control.

## Project structure

```text
src/
  components/   Shared layout and tool cards
  data/         100-tool catalog
  lib/          Browser-side processing engine
  pages/        Homepage, directory, workspace, batch, workflows, settings
  store/        Local UI state
public/         PWA manifest, icon and service worker
scripts/        Catalog and project integrity checks
```
