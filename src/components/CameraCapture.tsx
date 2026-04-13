import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, RotateCcw, ArrowRight, Upload, AlertTriangle } from 'lucide-react'

interface CameraCaptureProps {
  mode: 'selfie' | 'id-card'
  title: string
  subtitle: string
  onCapture: (blob: Blob) => void
  onCancel: () => void
}

export function CameraCapture({ mode, title, subtitle, onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [, setStream] = useState<MediaStream | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const isSelfie = mode === 'selfie'

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  const attachStream = useCallback(async (s: MediaStream) => {
    streamRef.current = s
    setStream(s)
    // Wait a tick for React to render the video element
    await new Promise(r => setTimeout(r, 100))
    if (videoRef.current) {
      videoRef.current.srcObject = s
      try {
        await videoRef.current.play()
      } catch {
        // play() can fail if user hasn't interacted — ignore, autoPlay handles it
      }
    }
  }, [])

  const startCamera = useCallback(async () => {
    setIsInitializing(true)
    setCameraError(null)

    // Try with preferred facingMode first, then fallback to any camera
    const constraints = [
      { facingMode: isSelfie ? 'user' as const : 'environment' as const, width: { ideal: 1280 }, height: { ideal: 720 } },
      { width: { ideal: 1280 }, height: { ideal: 720 } },
      true, // bare minimum — any camera
    ]

    for (const videoConstraint of constraints) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: videoConstraint })
        await attachStream(s)
        setIsInitializing(false)
        return
      } catch (err: any) {
        // NotAllowedError means user denied — don't retry
        if (err.name === 'NotAllowedError') {
          setCameraError('Camera access denied. Please allow camera access in your browser settings.')
          setIsInitializing(false)
          return
        }
        // NotFoundError means no camera — don't retry
        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera found on this device. Use the upload option instead.')
          setIsInitializing(false)
          return
        }
        // OverconstrainedError or other — try next constraint
      }
    }

    // All constraints failed
    setCameraError('Could not access camera. Please try uploading a photo instead.')
    setIsInitializing(false)
  }, [isSelfie, attachStream])

  useEffect(() => {
    startCamera()
    return () => stopStream()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!

    // Mirror selfie to match what user sees
    if (isSelfie) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        setCapturedBlob(blob)
        setPreviewUrl(URL.createObjectURL(blob))
        // Stop camera after capture
        stopStream()
      },
      'image/jpeg',
      0.85
    )
  }

  const handleRetake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setCapturedBlob(null)
    setPreviewUrl(null)
    startCamera()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCapturedBlob(file)
    setPreviewUrl(URL.createObjectURL(file))
    stopStream()
  }

  return (
    <div>
      <h3 className="mb-1 text-lg font-bold text-foreground">{title}</h3>
      <p className="mb-4 text-sm text-foreground/60">{subtitle}</p>

      {/* Camera / Preview area */}
      <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-xl bg-foreground/5">
        {!capturedBlob ? (
          <>
            {/* Live camera */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ transform: isSelfie ? 'scaleX(-1)' : 'none' }}
            />

            {/* Loading state */}
            {isInitializing && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}

            {/* Face guide overlay */}
            {!cameraError && !isInitializing && (
              <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 300 400">
                <defs>
                  <mask id="guide-mask">
                    <rect width="300" height="400" fill="white" />
                    {isSelfie ? (
                      <ellipse cx="150" cy="175" rx="85" ry="110" fill="black" />
                    ) : (
                      /* ID card mode: circle for face close-up, not full card rectangle */
                      <ellipse cx="150" cy="180" rx="90" ry="115" fill="black" />
                    )}
                  </mask>
                </defs>
                <rect width="300" height="400" fill="rgba(0,0,0,0.4)" mask="url(#guide-mask)" />
                {isSelfie ? (
                  <ellipse cx="150" cy="175" rx="85" ry="110" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 4" opacity="0.7" />
                ) : (
                  <ellipse cx="150" cy="180" rx="90" ry="115" fill="none" stroke="#c15f3c" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.9" />
                )}
                <text x="150" y={isSelfie ? '320' : '330'} textAnchor="middle" fill="white" fontSize="12" opacity="0.9">
                  {isSelfie ? 'Position your face in the circle' : 'Zoom in — fill this circle with the ID face'}
                </text>
              </svg>
            )}
          </>
        ) : (
          /* Captured preview */
          <img src={previewUrl!} alt="Captured" className="h-full w-full object-cover" />
        )}

        {/* Camera error */}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/5 p-6 text-center">
            <AlertTriangle className="mb-3 h-8 w-8 text-amber-500" />
            <p className="text-sm text-foreground/70">{cameraError}</p>
          </div>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture={isSelfie ? 'user' : 'environment'}
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Action buttons */}
      <div className="mt-4 flex flex-col items-center gap-3">
        {!capturedBlob ? (
          <>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="rounded-lg border border-muted/30 px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-cream"
              >
                Cancel
              </button>
              <button
                onClick={handleCapture}
                disabled={!!cameraError || isInitializing}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-50"
              >
                <Camera className="h-4 w-4" /> Capture
              </button>
            </div>
            {/* File upload fallback */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-foreground/40 transition-colors hover:text-primary"
            >
              <Upload className="h-3.5 w-3.5" /> Or upload a photo
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 rounded-lg border border-muted/30 px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-cream"
            >
              <RotateCcw className="h-4 w-4" /> Retake
            </button>
            <button
              onClick={() => onCapture(capturedBlob!)}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
