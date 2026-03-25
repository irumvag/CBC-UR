import { useState } from 'react'
import { MapPin, Calendar, Trophy, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { useHackathon } from '@/hooks/useHackathon'
import { Skeleton } from '@/components/ui/Skeleton'
import { SEO } from '@/components/SEO'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function FaqAccordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-muted/20 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-semibold text-foreground">{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-foreground/40" />
        )}
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed text-foreground/70">{answer}</div>
      )}
    </div>
  )
}

export default function Hackathon() {
  const { hackathon, loading } = useHackathon()

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <Skeleton className="mx-auto mb-4 h-10 w-2/3" />
        <Skeleton className="mx-auto mb-8 h-6 w-1/2" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (!hackathon) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Trophy className="mb-4 h-12 w-12 text-muted/40" />
        <h1 className="text-2xl font-bold text-foreground">No Hackathon Announced Yet</h1>
        <p className="mt-3 max-w-md text-foreground/60">
          We're planning something exciting! Check back soon or follow our events page for announcements.
        </p>
        <a
          href="/events"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
        >
          View All Events →
        </a>
      </div>
    )
  }

  const dateStr =
    hackathon.date_start && hackathon.date_end
      ? `${formatDate(hackathon.date_start)} – ${formatDate(hackathon.date_end)}`
      : hackathon.date_start
        ? formatDate(hackathon.date_start)
        : null

  return (
    <>
      <SEO
        title={`${hackathon.title} | CBC-UR`}
        description={hackathon.tagline || hackathon.description || 'Claude Builder Club Hackathon at University of Rwanda'}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-muted/20 bg-foreground px-4 py-20 text-center sm:px-8 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-foreground to-foreground" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Trophy className="h-3.5 w-3.5" />
            Hackathon
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {hackathon.title}
          </h1>
          {hackathon.tagline && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70 sm:text-xl">
              {hackathon.tagline}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
            {dateStr && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{dateStr}</span>
              </div>
            )}
            {hackathon.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{hackathon.location}</span>
              </div>
            )}
          </div>

          {hackathon.registration_url && (
            <a
              href={hackathon.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl"
            >
              Register Now
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        {/* Description */}
        {hackathon.description && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">About the Hackathon</h2>
            <div className="prose max-w-none text-foreground/70">
              {hackathon.description.split('\n').map((para, i) => (
                <p key={i} className="mb-3 leading-relaxed">{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Prizes */}
        {hackathon.prizes.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Prizes</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {hackathon.prizes.map((prize, i) => {
                const colors = [
                  'border-amber-300 bg-amber-50',
                  'border-slate-300 bg-slate-50',
                  'border-orange-300 bg-orange-50',
                ]
                return (
                  <div
                    key={i}
                    className={`rounded-xl border-2 p-5 text-center ${colors[i] || 'border-muted/30 bg-surface'}`}
                  >
                    <div className="mb-2 text-3xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                    <div className="text-sm font-semibold uppercase tracking-wide text-foreground/60">{prize.place}</div>
                    <div className="mt-1 text-2xl font-bold text-foreground">{prize.amount}</div>
                    {prize.description && (
                      <div className="mt-2 text-xs text-foreground/60">{prize.description}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Schedule */}
        {hackathon.schedule.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Schedule</h2>
            <div className="relative border-l-2 border-primary/20 pl-8">
              {hackathon.schedule.map((item, i) => (
                <div key={i} className="relative mb-6 last:mb-0">
                  <div className="absolute -left-[2.65rem] flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-surface">
                    <Clock className="h-3 w-3 text-primary" />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary">{item.time}</div>
                  <div className="text-base font-bold text-foreground">{item.title}</div>
                  {item.description && (
                    <div className="mt-1 text-sm text-foreground/60">{item.description}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {hackathon.faq.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="rounded-xl border border-muted/20 bg-surface px-6 shadow-sm">
              {hackathon.faq.map((item, i) => (
                <FaqAccordion key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </section>
        )}

        {/* Registration CTA */}
        {hackathon.registration_url && (
          <section className="rounded-2xl bg-foreground px-8 py-12 text-center">
            <h2 className="text-2xl font-bold text-white">Ready to Build?</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/60">
              Join us at the {hackathon.title} and build something amazing with Claude.
            </p>
            <a
              href={hackathon.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-primary-dark"
            >
              Register Now
              <ExternalLink className="h-4 w-4" />
            </a>
          </section>
        )}
      </div>
    </>
  )
}
