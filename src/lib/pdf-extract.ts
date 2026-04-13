// PDF.js dynamic loader + text extraction utility
// Adapted from student-qr.jsx reference — client-side PDF parsing

declare global {
  interface Window {
    pdfjsLib: any
  }
}

let loadingPromise: Promise<any> | null = null

export function loadPDFJS(): Promise<any> {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib)
  if (loadingPromise) return loadingPromise

  loadingPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js'
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'
      resolve(window.pdfjsLib)
    }
    s.onerror = () => {
      loadingPromise = null
      reject(new Error('Failed to load PDF.js'))
    }
    document.head.appendChild(s)
  })

  return loadingPromise
}

interface TextItem {
  text: string
  x: number
  y: number
}

/**
 * Extract rows of text from a PDF file.
 * Groups text items by Y position (< 4px tolerance) into rows,
 * sorts within rows by X position.
 * Returns array of string arrays — each inner array is one row of cell values.
 * First row is typically the header.
 */
export async function extractRowsFromPDF(file: File): Promise<string[][]> {
  const pdfjsLib = await loadPDFJS()
  const ab = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: ab }).promise

  const allItems: TextItem[] = []

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const viewport = page.getViewport({ scale: 1 })
    const pageHeight = viewport.height
    const pageOffset = (p - 1) * pageHeight * 1.5
    const tc = await page.getTextContent()

    for (const item of tc.items) {
      if (item.str && item.str.trim()) {
        allItems.push({
          text: item.str.trim(),
          x: Math.round(item.transform[4]),
          y: Math.round(pageOffset + (pageHeight - item.transform[5])),
        })
      }
    }
  }

  // Sort all items top-to-bottom, left-to-right
  allItems.sort((a, b) => a.y - b.y || a.x - b.x)

  // Group into rows by Y proximity (< 4px = same row)
  const rows: TextItem[][] = []
  for (const item of allItems) {
    const last = rows[rows.length - 1]
    if (last && Math.abs(item.y - last[0].y) < 4) {
      last.push(item)
    } else {
      rows.push([item])
    }
  }

  // Sort each row by X position and return text values
  return rows.map((row) =>
    row.sort((a, b) => a.x - b.x).map((i) => i.text)
  )
}
