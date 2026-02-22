import { Mail } from 'lucide-react'
import { SEO } from '@/components/SEO'

const teamMembers = [
  {
    name: 'Kaio Mugisha',
    role: 'Club President',
    bio: 'Computer Science, Year 4. Passionate about making AI accessible to all Rwandan students.',
    initials: 'KM',
  },
  {
    name: 'Sandrine Niyonzima',
    role: 'Vice President',
    bio: 'Information Technology, Year 3. Organizes workshops and community events.',
    initials: 'SN',
  },
  {
    name: 'Jean Baptiste K.',
    role: 'Technical Lead',
    bio: 'Software Engineering, Year 4. Leads hackathon planning and technical mentorship.',
    initials: 'JB',
  },
  {
    name: 'Grace Uwimana',
    role: 'Outreach Lead',
    bio: 'Business Administration, Year 3. Builds partnerships and handles communications.',
    initials: 'GU',
  },
  {
    name: 'Patrick Mugabo',
    role: 'Events Coordinator',
    bio: 'Computer Engineering, Year 2. Manages logistics and venue arrangements.',
    initials: 'PM',
  },
  {
    name: 'Alice Nyirahabimana',
    role: 'Content Lead',
    bio: 'Digital Media, Year 3. Creates educational content and social media strategy.',
    initials: 'AN',
  },
]

export default function Team() {
  return (
    <>
      <SEO
        title="Team"
        description="Meet the leadership team behind Claude Builder Club at University of Rwanda."
        url="/team"
      />

      {/* Header */}
      <section className="bg-surface dark:bg-dark-bg py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-claude-terracotta">
            Our Team
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-ink dark:text-dark-text sm:text-4xl md:text-5xl">
            Meet the Team
          </h1>
          <p className="mt-4 max-w-2xl text-base text-stone dark:text-dark-muted sm:text-lg">
            The students driving the Claude Builder Club at University of Rwanda forward.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="bg-pampas dark:bg-dark-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-pampas-warm dark:border-dark-border bg-white dark:bg-dark-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Avatar */}
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light shadow-md">
                  <span className="font-serif text-2xl font-semibold text-white">
                    {member.initials}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-semibold text-ink dark:text-dark-text">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-claude-terracotta">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone dark:text-dark-muted">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-surface dark:bg-dark-bg py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-8 md:px-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-claude-terracotta/10">
            <Mail className="h-7 w-7 text-claude-terracotta" />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold text-ink dark:text-dark-text sm:text-3xl">
            Want to Get Involved?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-stone dark:text-dark-muted">
            Reach out to us if you&apos;re interested in joining the team, mentoring, or partnering with the club.
          </p>
          <a
            href="mailto:claudebuilderclub.ur@gmail.com"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-claude-terracotta px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-claude-terracotta-deep sm:text-base"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  )
}
