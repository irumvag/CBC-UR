// Face verification utility
// Primary: @vladmandic/face-api (client-side, free)
// Fallback: Gemini 2.0 Flash API

import type { VerificationResult } from '@/lib/types'

declare global {
  interface Window {
    faceapi: any
  }
}

// ── face-api.js CDN loading (mirrors pdf-extract.ts pattern) ──

let loadingPromise: Promise<any> | null = null
let modelsLoaded = false

function loadFaceAPI(): Promise<any> {
  if (window.faceapi) return Promise.resolve(window.faceapi)
  if (loadingPromise) return loadingPromise

  loadingPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js'
    s.onload = () => resolve(window.faceapi)
    s.onerror = () => {
      loadingPromise = null
      reject(new Error('Failed to load face-api.js'))
    }
    document.head.appendChild(s)
  })

  return loadingPromise
}

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'

async function loadModels(): Promise<void> {
  if (modelsLoaded) return
  const faceapi = await loadFaceAPI()
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ])
  modelsLoaded = true
}

// ── Helpers ──

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
    img.src = url
  })
}

/**
 * Prepare a canvas from an image at a given scale, with optional contrast enhancement.
 * Returns an HTMLCanvasElement that face-api.js can process.
 */
function prepareCanvas(
  img: HTMLImageElement,
  scale: number,
  enhanceContrast = false
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * scale)
  canvas.height = Math.round(img.naturalHeight * scale)
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  if (enhanceContrast) {
    ctx.filter = 'contrast(1.4) brightness(1.1) saturate(0)'
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas
}

/** Convert a canvas to an HTMLImageElement (more reliable input for face-api) */
function canvasToImage(canvas: HTMLCanvasElement): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = canvas.toDataURL('image/jpeg', 0.95)
  })
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// ── Primary: face-api.js comparison ──

/** Try all detector strategies on a single input */
async function tryDetect(faceapi: any, input: HTMLImageElement | HTMLCanvasElement) {
  // Strategy 1: SSD MobileNet
  const ssd = await faceapi
    .detectSingleFace(input, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 }))
    .withFaceLandmarks()
    .withFaceDescriptor()
  if (ssd) return ssd

  // Strategy 2: TinyFaceDetector
  const tiny = await faceapi
    .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.15 }))
    .withFaceLandmarks()
    .withFaceDescriptor()
  if (tiny) return tiny

  // Strategy 3: detectAllFaces — pick the one with the highest score
  const all = await faceapi
    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.1 }))
    .withFaceLandmarks()
    .withFaceDescriptors()
  if (all && all.length > 0) {
    // Return the detection with the highest score
    return all.reduce((best: any, curr: any) =>
      (curr.detection.score > best.detection.score) ? curr : best
    )
  }

  return null
}

/**
 * Detect a face in an image. Uses progressive upscaling + contrast enhancement
 * to handle tiny printed passport photos on ID cards held in hand.
 */
async function detectFace(faceapi: any, img: HTMLImageElement) {
  // Try original size
  const original = await tryDetect(faceapi, img)
  if (original) return original

  // Calculate scale needed to make the longest side at least 2000px
  const maxDim = Math.max(img.naturalWidth, img.naturalHeight)
  const scales = [2, 3, 4, 5].filter(s => maxDim * s <= 6000)
  if (scales.length === 0) scales.push(2)

  // Try upscaled versions (normal + contrast enhanced)
  for (const scale of scales) {
    // Normal upscale
    const canvas = prepareCanvas(img, scale)
    const asImg = await canvasToImage(canvas)
    const result = await tryDetect(faceapi, asImg)
    if (result) return result

    // Contrast-enhanced upscale (helps with printed photos)
    const enhanced = prepareCanvas(img, scale, true)
    const enhancedImg = await canvasToImage(enhanced)
    const enhResult = await tryDetect(faceapi, enhancedImg)
    if (enhResult) return enhResult
  }

  return null
}

async function compareFacesLocal(
  selfieBlob: Blob,
  idCardBlob: Blob
): Promise<VerificationResult> {
  await loadModels()
  const faceapi = window.faceapi

  const [selfieImg, idCardImg] = await Promise.all([
    blobToImage(selfieBlob),
    blobToImage(idCardBlob),
  ])

  const [selfieDetection, idCardDetection] = await Promise.all([
    detectFace(faceapi, selfieImg),
    detectFace(faceapi, idCardImg),
  ])

  if (!selfieDetection) throw new Error('No face detected in selfie. Please retake with good lighting and face the camera directly.')
  if (!idCardDetection) throw new Error('No face detected in ID card. Try taking the photo closer to just the face on your ID, or use a well-lit area.')

  const distance = faceapi.euclideanDistance(
    selfieDetection.descriptor,
    idCardDetection.descriptor
  )

  // Threshold 0.65 — slightly relaxed for ID card photos (low quality, different lighting/angle)
  const match = distance < 0.65
  const confidence = Math.round(Math.max(0, Math.min(100, (1 - distance) * 100)))

  return { match, confidence, method: 'faceapi' }
}

// ── Fallback: Gemini API comparison ──

async function compareFacesWithGemini(
  selfieBlob: Blob,
  idCardBlob: Blob
): Promise<VerificationResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    return { match: false, confidence: 0, method: 'none', error: 'No Gemini API key configured' }
  }

  const [selfieB64, idCardB64] = await Promise.all([
    blobToBase64(selfieBlob),
    blobToBase64(idCardBlob),
  ])

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: selfieB64,
              },
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: idCardB64,
              },
            },
            {
              text: 'Compare these two photos. The first is a selfie and the second is a student ID card. Do they show the same person? Analyze facial features carefully. Respond ONLY with: MATCH <confidence 0-100> or NO_MATCH <confidence 0-100>. Example: MATCH 85',
            },
          ],
        }],
      }),
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Gemini API error: ${response.status} ${text.slice(0, 200)}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  const matchResult = text.toUpperCase().includes('MATCH') && !text.toUpperCase().startsWith('NO_MATCH')
  const noMatchResult = text.toUpperCase().includes('NO_MATCH')

  const confidenceMatch = text.match(/(\d{1,3})/)
  const confidence = confidenceMatch ? Math.min(100, parseInt(confidenceMatch[1])) : 50

  const match = matchResult && !noMatchResult

  return { match, confidence, method: 'gemini' }
}

// ── Main entry point ──

export async function compareFaces(
  selfieBlob: Blob,
  idCardBlob: Blob
): Promise<VerificationResult> {
  // Try face-api.js first (free, client-side)
  try {
    return await compareFacesLocal(selfieBlob, idCardBlob)
  } catch (faceApiError) {
    console.warn('face-api.js failed, trying Gemini fallback:', faceApiError)
  }

  // Fallback to Gemini API
  try {
    return await compareFacesWithGemini(selfieBlob, idCardBlob)
  } catch (geminiError) {
    console.warn('Gemini fallback also failed:', geminiError)
  }

  // Both failed
  return {
    match: false,
    confidence: 0,
    method: 'none',
    error: 'Both face-api.js and Gemini verification failed. Please contact administration.',
  }
}

// Pre-load face-api models (call early to reduce wait time during verification)
export function preloadFaceModels(): void {
  loadModels().catch(() => { /* silent preload failure is ok */ })
}
