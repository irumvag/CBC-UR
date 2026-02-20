import { Link } from 'react-router-dom'
import { Target, Eye, Lightbulb, Shield, Users, Zap } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CTA } from '@/components/sections/CTA'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { AboutSEO } from '@/components/SEO'
import { cn } from '@/lib/utils'

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Push boundaries and explore new possibilities. Embrace experimentation and creative problem-solving.',
    color: 'bg-claude-terracotta'
  },
  {
    icon: Shield,
    title: 'Safety',
    desc: 'Build responsibly. Prioritize ethical AI development and consider the impact of our creations.',
    color: 'bg-sage'
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Learn together, grow together. Support each other and share knowledge openly.',
    color: 'bg-teal'
  },
  {
    icon: Zap,
    title: 'Impact',
    desc: 'Create solutions that matter. Focus on real problems facing our communities.',
    color: 'bg-stone'
  },
]

const team = [
  { initials: 'KM', name: 'Kaio Mugisha', role: 'Club President', bio: 'Computer Science, Year 4. Passionate about making AI accessible to all Rwandan students.' },
  { initials: 'SN', name: 'Sandrine Niyonzima', role: 'Vice President', bio: 'Information Technology, Year 3. Organizes workshops and community events.' },
  { initials: 'JB', name: 'Jean Baptiste K.', role: 'Technical Lead', bio: 'Software Engineering, Year 4. Leads hackathon planning and technical mentorship.' },
  { initials: 'GU', name: 'Grace Uwimana', role: 'Outreach Lead', bio: 'Business Administration, Year 3. Builds partnerships and handles communications.' },
  { initials: 'PM', name: 'Patrick Mugabo', role: 'Events Coordinator', bio: 'Computer Engineering, Year 2. Manages logistics and venue arrangements.' },
  { initials: 'AN', name: 'Alice Nyirahabimana', role: 'Content Lead', bio: 'Digital Media, Year 3. Creates educational content and social media strategy.' },
]

const timeline = [
  { date: 'January 2026', title: 'Club Founded', desc: 'Initial planning meetings and founding team formation at University of Rwanda.', side: 'left' },
  { date: 'Feb 9, 2026', title: 'Program Kickoff', desc: 'Week 1 begins with campus tabling and social media launch.', side: 'right' },
  { date: 'February 2026', title: 'First Workshop', desc: 'Introduction to Claude AI — first hands-on workshop for members.', side: 'left' },
  { date: 'March 2026', title: '100 Members', desc: 'Community grows to 100 active members across multiple faculties.', side: 'right' },
  { date: 'April 2026', title: 'First Hackathon', desc: 'Week 10 culminates in "Build for Rwanda" hackathon showcase.', side: 'left' },
  { date: 'May 2026', title: 'Anthropic Partnership', desc: 'Official recognition as an Anthropic-supported Claude Builder Club.', side: 'right' },
]

export default function About() {
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollReveal()
  const { ref: teamRef, isVisible: teamVisible } = useScrollReveal()
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollReveal()

  return (
    <>
      <AboutSEO />
      {/* Page Header */}
      <section className="bg-pampas-warm dark:bg-dark-surface py-16 md:py-20 transition-colors">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-stone dark:text-dark-muted mb-6">
            <Link to="/" className="hover:text-claude-terracotta transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink dark:text-dark-text">About</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-claude-terracotta font-sans font-bold text-xs uppercase tracking-widest mb-3">
              Our Story
            </p>
            <h1 className="font-serif font-semibold text-ink dark:text-dark-text text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              Empowering the next generation of AI builders in Rwanda
            </h1>
            <p className="text-stone dark:text-dark-muted text-lg md:text-xl leading-relaxed">
              Claude Builder Club was founded with a simple belief: the best way to learn AI is to build with it.
              We're creating a community where curiosity meets creation, and where every student can become an AI builder.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 bg-surface dark:bg-dark-bg transition-colors">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Mission Card */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border p-6 md:p-8 flex gap-4 md:gap-6">
              <div className="w-1 bg-claude-terracotta rounded-full flex-shrink-0" />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-claude-terracotta/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-claude-terracotta" />
                  </div>
                  <h3 className="font-serif font-semibold text-ink dark:text-dark-text text-xl md:text-2xl">Our Mission</h3>
                </div>
                <p className="text-stone dark:text-dark-muted leading-relaxed">
                  To democratize AI literacy at University of Rwanda by providing hands-on learning experiences
                  that empower students from all disciplines to build practical solutions using Claude AI.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border p-6 md:p-8 flex gap-4 md:gap-6">
              <div className="w-1 bg-sage rounded-full flex-shrink-0" />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-sage" />
                  </div>
                  <h3 className="font-serif font-semibold text-ink dark:text-dark-text text-xl md:text-2xl">Our Vision</h3>
                </div>
                <p className="text-stone dark:text-dark-muted leading-relaxed">
                  A future where every Rwandan student has the skills and confidence to leverage AI as a tool
                  for innovation, problem-solving, and positive impact in their communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-pampas dark:bg-dark-surface transition-colors">
        <div className="container-main">
          <SectionHeader
            eyebrow="Our Values"
            title="What We Stand For"
            subtitle="The principles that guide everything we do"
          />
          <div ref={valuesRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className={cn(
                    'bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border p-6',
                    'transition-all duration-500 ease-out',
                    'hover:shadow-lg hover:-translate-y-1',
                    'opacity-0 translate-y-4',
                    valuesVisible && 'opacity-100 translate-y-0'
                  )}
                  style={{ transitionDelay: valuesVisible ? `${index * 100}ms` : '0ms' }}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                    value.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-serif font-semibold text-ink dark:text-dark-text text-lg mb-2">{value.title}</h4>
                  <p className="text-stone dark:text-dark-muted text-sm leading-relaxed">{value.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-20 bg-surface dark:bg-dark-bg transition-colors">
        <div className="container-main">
          <SectionHeader
            eyebrow="Leadership"
            title="Club Leadership"
            subtitle="The students driving our mission forward"
          />
          <div ref={teamRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {team.map((member, index) => (
              <div
                key={member.name}
                className={cn(
                  'bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border p-6 text-center',
                  'transition-all duration-500 ease-out',
                  'hover:shadow-lg hover:-translate-y-1',
                  'opacity-0 translate-y-4',
                  teamVisible && 'opacity-100 translate-y-0'
                )}
                style={{ transitionDelay: teamVisible ? `${index * 100}ms` : '0ms' }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-serif font-semibold text-white">
                    {member.initials}
                  </span>
                </div>
                <h4 className="font-serif font-semibold text-ink dark:text-dark-text text-lg">{member.name}</h4>
                <p className="text-claude-terracotta font-medium text-sm mb-2">{member.role}</p>
                <p className="text-stone dark:text-dark-muted text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-20 bg-pampas dark:bg-dark-surface transition-colors">
        <div className="container-main">
          <SectionHeader
            eyebrow="Our Journey"
            title="Key Milestones"
            subtitle="From idea to impact — our story unfolds"
          />
          <div ref={timelineRef} className="max-w-4xl mx-auto relative">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-pampas-warm dark:bg-dark-border md:-translate-x-0.5" />

            {timeline.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  'relative mb-8 last:mb-0',
                  'opacity-0 translate-y-4 transition-all duration-500',
                  timelineVisible && 'opacity-100 translate-y-0'
                )}
                style={{ transitionDelay: timelineVisible ? `${index * 150}ms` : '0ms' }}
              >
                {/* Dot */}
                <div className={cn(
                  'absolute w-4 h-4 bg-claude-terracotta rounded-full',
                  'left-2 md:left-1/2 top-6 md:-translate-x-1/2',
                  'ring-4 ring-pampas dark:ring-dark-surface'
                )} />

                {/* Content */}
                <div className={cn(
                  'ml-12 md:ml-0',
                  'md:w-[calc(50%-2rem)]',
                  item.side === 'left' ? 'md:mr-auto md:pr-8 md:text-right' : 'md:ml-auto md:pl-8'
                )}>
                  <div className="bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border p-5">
                    <span className="text-claude-terracotta font-sans font-semibold text-sm">
                      {item.date}
                    </span>
                    <h4 className="font-serif font-semibold text-ink dark:text-dark-text text-lg mt-1 mb-2">{item.title}</h4>
                    <p className="text-stone dark:text-dark-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
