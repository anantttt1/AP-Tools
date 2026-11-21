export function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.hidden = true
  document.body.appendChild(link)
  link.click()
  link.remove()

  // Mobile browsers can take longer to start consuming the object URL.
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
}

