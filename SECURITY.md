# AP TOOLS — Security and privacy notes

## Processing model

AP TOOLS is a static, browser-only application. The included tools process file contents in the current browser tab and do not upload selected files to an AP TOOLS backend. There is no sign-in, analytics integration, payment service or application API in this build. The stylesheet loads web fonts from Google when internet access is available; this can create a normal request to Google's font servers, but selected file contents are not sent with that request.

## Safeguards in this build

- Vercel response headers are configured in `vercel.json`; `_headers` provides equivalent static-hosting rules for platforms that support that file. The configured policy includes a restrictive Content Security Policy, clickjacking protection, MIME-sniffing protection, HSTS, referrer policy and a permissions policy. Confirm headers at the deployed edge after any hosting change.
- The development and preview servers bind to `127.0.0.1`, not every network interface. Vite is pinned to the Vite 8.3 patch line and React Router to the 7.18 patch line. This app uses declarative `BrowserRouter` mode, not React Router Framework Mode.
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
- The HMAC-SHA-256 tool keeps its secret key in component memory only while the page is open; the key is not written to local storage. The workflow saver refuses to save non-empty HMAC keys, in addition to text-encryption/decryption passwords.
- PDF page organization requires a complete one-to-one page order. PDF comparison compares selectable text only; it is not a visual or pixel-level comparison. PDF cropping applies the same point-based crop rectangle to all pages and rejects a rectangle that does not fit any page.
- PDF password encryption/decryption, OCR for scanned PDFs and Microsoft Office document conversions are not included.
- ZIP support is ZIP only, not RAR or 7z.
- Browser support and available memory affect image/PDF formats and maximum practical file sizes.

## Scope of this review

This is a source/configuration review with automated repository checks. It is not a third-party penetration test, formal security certification, malicious-file corpus test or a substitute for cross-browser end-to-end QA using representative PDFs, image formats and malformed inputs. Deployed security headers should be checked after every configuration change.
