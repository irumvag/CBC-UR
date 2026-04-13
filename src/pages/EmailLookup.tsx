import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Search, KeyRound, Copy, Check, Mail, ArrowLeft, ChevronRight, CheckCircle, ShieldCheck, AlertTriangle
} from 'lucide-react'
import { useCredentialLookup } from '@/hooks/useCredentialLookup'
import { supabase } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/Skeleton'
import type { CredentialWithSource } from '@/lib/types'
import { cn, extractRegNumber } from '@/lib/utils'

type Step = 'search' | 'verify' | 'acknowledge' | 'result'

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-2 rounded-full transition-all',
            i + 1 === current ? 'w-8 bg-primary' : i + 1 < current ? 'w-2 bg-primary/60' : 'w-2 bg-muted/30'
          )}
        />
      ))}
      <span className="ml-2 text-xs text-foreground/40">Step {current} of {total}</span>
    </div>
  )
}

export default function EmailLookup() {
  // ── Wizard state ──
  const [step, setStep] = useState<Step>('search')
  const [selectedCredential, setSelectedCredential] = useState<CredentialWithSource | null>(null)
  const [regNumber, setRegNumber] = useState('')
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)

  // ── Search state ──
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const { results, loading, error, search } = useCredentialLookup()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    search(debouncedQuery)
  }, [debouncedQuery, search])

  // ── Actions ──
  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const handleSelectCredential = (cred: CredentialWithSource) => {
    setSelectedCredential(cred)
    setRegNumber('')
    setVerifyError(null)
    setStep('verify')
  }

  const claimAndShow = () => {
    // Go to acknowledgement step first — credentials are NOT claimed yet
    setVerified(true)
    setVerifyError(null)
    setStep('acknowledge')
  }

  const handleAcknowledgeAndReveal = () => {
    // NOW mark as claimed in Supabase and show credentials
    supabase
      .from('email_credentials')
      .update({ claimed_at: new Date().toISOString() })
      .eq('id', selectedCredential!.id)
      .then(() => {})
    setStep('result')
  }

  const handleVerifyRegNumber = () => {
    if (!selectedCredential) return

    const inputReg = regNumber.trim().replace(/\s+/g, '')
    const storedReg = extractRegNumber(selectedCredential.email)

    if (storedReg === null) {
      // Fallback: email doesn't have _DIGITS@ pattern (e.g. alice.m@ur.ac.rw)
      const storedUsername = selectedCredential.email.split('@')[0].toLowerCase()
      if (inputReg.toLowerCase() === storedUsername) {
        claimAndShow()
      } else {
        setVerified(false)
        setVerifyError(
          'Could not match your input. Try entering the part before the @ symbol from your email address.'
        )
      }
      return
    }

    // Standard path: compare extracted reg number
    if (inputReg === storedReg) {
      claimAndShow()
    } else {
      setVerified(false)
      setVerifyError('Registration number does not match. Please check and try again.')
    }
  }

  const handleStartOver = () => {
    setStep('search')
    setSelectedCredential(null)
    setRegNumber('')
    setVerifyError(null)
    setVerified(false)
    setQuery('')
    setDebouncedQuery('')
  }

  return (
    <>
      <Helmet>
        <title>Email Credentials | Claude Builder Club UR</title>
        <meta name="description" content="Find your University of Rwanda email credentials. Search by name or email address." />
      </Helmet>

      {/* Hero — search step only */}
      {step === 'search' && (
        <section className="border-b border-muted/20 bg-surface">
          <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Find Your Email Credentials
            </h1>
            <p className="mt-3 text-base text-foreground/60">
              Search by your name or email address, then verify with your registration number.
            </p>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="mx-auto max-w-2xl px-4 py-8">

        {/* ═══ SEARCH STEP ═══ */}
        {step === 'search' && (
          <>
            {/* Search input */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/30" />
              <input
                type="text"
                autoFocus
                placeholder="Enter your name or email address..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full rounded-2xl border border-muted/20 bg-surface py-4 pl-12 pr-4 text-base text-foreground shadow-sm placeholder-foreground/40 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Loading */}
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-muted/20 bg-surface p-5">
                    <Skeleton className="mb-2 h-5 w-1/3" />
                    <Skeleton className="h-3 w-1/5" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Results — name only */}
            {!loading && !error && debouncedQuery && results.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-foreground/50">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} — select your name to verify
                </p>
                {results.map((cred, i) => {
                  const isClaimed = !!cred.claimed_at
                  return (
                    <button
                      key={cred.id || i}
                      onClick={() => !isClaimed && handleSelectCredential(cred)}
                      disabled={isClaimed}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border p-5 text-left shadow-sm transition-all',
                        isClaimed
                          ? 'cursor-not-allowed border-muted/10 bg-cream/50 opacity-70'
                          : 'border-muted/20 bg-surface hover:border-primary/30 hover:shadow-md'
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-foreground">{cred.name}</h3>
                          {isClaimed && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                              <ShieldCheck className="h-3 w-3" /> Claimed
                            </span>
                          )}
                        </div>
                        {isClaimed ? (
                          <p className="mt-0.5 text-xs text-foreground/40">
                            This credential has already been claimed and cannot be shown again.
                          </p>
                        ) : cred.credential_file?.display_name ? (
                          <p className="mt-0.5 text-xs text-foreground/40">
                            Source: {cred.credential_file.display_name}
                          </p>
                        ) : null}
                      </div>
                      {!isClaimed && <ChevronRight className="h-5 w-5 shrink-0 text-foreground/30" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* No results */}
            {!loading && !error && debouncedQuery && results.length === 0 && (
              <div className="rounded-xl border border-muted/20 bg-surface px-6 py-10 text-center">
                <Search className="mx-auto mb-3 h-8 w-8 text-muted/40" />
                <p className="text-sm font-medium text-foreground/60">
                  No credentials found for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="mt-1 text-xs text-foreground/40">
                  Make sure you're searching with the name or email used during registration.
                </p>
              </div>
            )}

            {/* Empty state */}
            {!debouncedQuery && (
              <div className="rounded-xl border border-muted/10 bg-cream/30 px-6 py-10 text-center">
                <Mail className="mx-auto mb-3 h-8 w-8 text-muted/40" />
                <p className="text-sm text-foreground/50">
                  Enter your name or email to find your credentials.
                </p>
              </div>
            )}
          </>
        )}

        {/* ═══ VERIFY STEP ═══ */}
        {step === 'verify' && (
          <div className="mx-auto max-w-md">
            <button
              onClick={() => { setSelectedCredential(null); setVerifyError(null); setStep('search') }}
              className="mb-4 flex items-center gap-1 text-sm text-foreground/50 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to search
            </button>

            <StepIndicator current={2} total={4} />

            <div className="rounded-xl border border-muted/20 bg-surface p-6 text-center">
              <h2 className="text-xl font-bold text-foreground">Verify Your Identity</h2>
              <p className="mt-1 mb-6 text-sm text-foreground/60">
                Hi <span className="font-semibold text-primary">{selectedCredential?.name}</span>! Enter your registration number to access your credentials.
              </p>

              <input
                type="text"
                autoFocus
                placeholder="Enter your registration number"
                value={regNumber}
                onChange={e => { setRegNumber(e.target.value); setVerifyError(null) }}
                onKeyDown={e => { if (e.key === 'Enter' && regNumber.trim()) handleVerifyRegNumber() }}
                className="w-full rounded-xl border border-muted/20 bg-cream py-3 px-4 text-center text-base font-medium text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              <button
                onClick={handleVerifyRegNumber}
                disabled={!regNumber.trim()}
                className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-50"
              >
                Verify
              </button>

              {verifyError && (
                <p className="mt-3 text-sm text-red-600">{verifyError}</p>
              )}

              <p className="mt-5 text-xs text-foreground/40">
                Your registration number is the numeric part of your student email address, found after the underscore.
              </p>
            </div>
          </div>
        )}

        {/* ═══ ACKNOWLEDGE STEP ═══ */}
        {step === 'acknowledge' && verified && selectedCredential && (
          <div className="mx-auto max-w-md">
            <StepIndicator current={3} total={4} />

            <div className="rounded-xl border border-amber-200 bg-surface p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Before you continue</h2>
              <p className="mt-3 text-sm text-foreground/60">
                You are about to view your credentials for <span className="font-semibold text-primary">{selectedCredential.name}</span>.
              </p>

              <div className="mt-4 space-y-2 text-left">
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3">
                  <span className="mt-0.5 text-amber-600 font-bold">1.</span>
                  <p className="text-sm text-amber-900">Your password will only be shown <span className="font-bold">once</span>. After you leave this page, it cannot be viewed again.</p>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3">
                  <span className="mt-0.5 text-amber-600 font-bold">2.</span>
                  <p className="text-sm text-amber-900">Copy and save your credentials immediately — write them down or save them somewhere safe.</p>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3">
                  <span className="mt-0.5 text-amber-600 font-bold">3.</span>
                  <p className="text-sm text-amber-900">If you lose your credentials, you will need to contact the club administration to have them reset.</p>
                </div>
              </div>

              <button
                onClick={handleAcknowledgeAndReveal}
                className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
              >
                I understand — show my credentials
              </button>
              <button
                onClick={handleStartOver}
                className="mt-2 w-full rounded-lg border border-muted/30 px-4 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-cream"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ═══ RESULT STEP ═══ */}
        {step === 'result' && verified && selectedCredential && (
          <div className="mx-auto max-w-md">
            <StepIndicator current={4} total={4} />

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Here are your credentials</h2>
              <p className="mt-1 text-sm text-foreground/50">
                Copy and save them now — this is the only time they will be shown.
              </p>

              {/* Credential card */}
              <div className="mt-6 rounded-xl border border-emerald-200 bg-surface p-5 text-left shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-foreground">{selectedCredential.name}</h3>

                {/* Email */}
                <div className="mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary/60" />
                  <span className="text-sm font-medium text-foreground/70">Email</span>
                  <span className="flex-1 truncate font-mono text-sm text-primary">{selectedCredential.email}</span>
                  <button
                    onClick={() => copyToClipboard(selectedCredential.email, 'email')}
                    className="shrink-0 rounded-md p-1.5 text-foreground/30 transition-colors hover:bg-cream hover:text-foreground"
                  >
                    {copiedField === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Password */}
                <div className="mb-3 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 shrink-0 text-primary/60" />
                  <span className="text-sm font-medium text-foreground/70">Password</span>
                  <span className="flex-1 truncate font-mono text-sm text-foreground">{selectedCredential.password}</span>
                  <button
                    onClick={() => copyToClipboard(selectedCredential.password, 'pass')}
                    className="shrink-0 rounded-md p-1.5 text-foreground/30 transition-colors hover:bg-cream hover:text-foreground"
                  >
                    {copiedField === 'pass' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {selectedCredential.credential_file?.display_name && (
                  <p className="text-xs text-foreground/40">
                    Source: {selectedCredential.credential_file.display_name}
                  </p>
                )}
              </div>

              <button
                onClick={handleStartOver}
                className="mt-6 rounded-lg border border-muted/30 px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-cream"
              >
                Search Again
              </button>
            </div>
          </div>
        )}

        {/* Disclaimer — all steps */}
        <div className="mt-8 text-center">
          <p className="text-xs text-foreground/30">
            If you can't find your credentials, contact the club administration at{' '}
            <a href="mailto:claudebuilderclub.urcst@gmail.com" className="text-primary hover:underline">
              claudebuilderclub.urcst@gmail.com
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
