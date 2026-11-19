# AP TOOLS — Security and privacy notes

## Processing model

AP TOOLS is a static, browser-only application. The included tools process file contents in the current browser tab and do not upload selected files to an AP TOOLS backend. There is no sign-in, analytics integration, payment service or application API in this build. The stylesheet loads web fonts from Google when internet access is available; this can create a normal request to Google's font servers, but selected file contents are not sent with that request.

## Safeguards in this build

- Static-host response headers are provided in `_headers`: restrictive Content Security Policy, clickjacking protection, MIME sniffing protection, referrer policy and permissions policy. A hosting provider must actually apply these headers. For Vercel, configure the equivalent headers in its deployment configuration.
- The development server and preview server bind to `127.0.0.1`, not every network interface. Vite is on the supported 8.3 patch line. React Router was upgraded from 7.1.x to 7.18.6 after reviewing published navigation advisories; this app uses declarative `BrowserRouter` mode rather than Framework Mode. Vite uses the supported 8.3 patch line; React Router was upgraded from 7.1.x to the patched 7.18.x line after reviewing its published navigation advisories. This app uses declarative `BrowserRouter` mode rather than Framework Mode.
- ZIP paths are checked to reject traversal, drive prefixes and special object-property names. Archive entry counts, input sizes and decompressed/output sizes are bounded.
- PDF.js disables eval and XFA features, has page and render-pixel limits, and destroys its loading task after processing.
- Image decoding has file-size and decoded-pixel limits. Image-to-PDF checks PNG/JPEG file signatures rather than trusting only the file's MIME label.
- Regex evaluation runs in a disposable Web Worker with input/pattern limits and a 750 ms timeout.
- Random passwords and random integers use the browser cryptographic random-number generator. Text encryption uses AES-256-GCM with PBKDF2-HMAC-SHA-256 (600,000 iterations), a random salt and a random IV.
- JSON-to-CSV and batch CSV output escape formula-leading cells to reduce spreadsheet formula-injection risk.
- User HTML previews run in a sandboxed iframe with a restrictive preview Content Security Policy.

## Resource limits

| Area | Limit |
|---|---:|
| Individual browser file input (general) | 80 MB |
| ZIP input | 60 MB |
| ZIP entries | 250 |
| Generated/extracted ZIP output | 120 MB |
| PDF input | 60 MB |
| PDF pages | 250 |
| PDF rendering | 24 million pixels per page; 50 million total |
| Image decode | 32 million pixels per image |
| Image-to-PDF / collage | 50 images and 50 million combined pixels |
| Batch Center | 100 files / 120 MB input / 160 MB output |
| Workflow Studio | 20 steps / 10 MB total text |
| Regex test text | 200,000 characters; 750 ms worker timeout |

These are defensive application limits, not a guarantee against all browser or device memory exhaustion. Large PDFs, archives and images should be processed on a device with adequate available memory.

## Local storage

Favorites, recent tool IDs, notes, tasks, and saved workflows are stored in browser local storage. Local storage is not encrypted by this application. Do not put secrets, private documents or sensitive personal information into saved workflow names or text fields. Saving a workflow containing any non-empty text-encryption/decryption password field (including whitespace-only values) is blocked, but other saved workflow text is still stored without encryption.

## Important limitations

- The password-strength result is a simple local estimate, not a security audit.
- JWT decoding displays claims but does not verify the token signature or issuer.
- Text encryption is password-based; there is no password recovery. Keep the password and encrypted output safe.
- PDF password encryption/decryption and OCR for scanned PDFs are not included.
- ZIP support is ZIP only, not RAR or 7z.
- Browser support and available memory affect image/PDF formats and maximum practical file sizes.

## Scope of this review

This is a source/configuration review with automated static checks. It is not a third-party penetration test, formal security certification, or a substitute for a successful dependency install, production build and browser-based end-to-end QA on the target hosting provider.
