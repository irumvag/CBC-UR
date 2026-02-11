import { Link } from 'react-router-dom'
import { ArrowRight, Target, Eye, BookOpen, Wrench, Users, Globe, MessageSquare, Sprout, Scale } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CTA } from '@/components/sections/CTA'

const values = [
  { icon: Users, title: 'Inclusivity', desc: 'Everyone belongs here. All backgrounds, disciplines, and skill levels welcome.' },
  { icon: Wrench, title: 'Learning by Doing', desc: 'Hands-on projects over passive learning. Build to understand.' },
  { icon: Globe, title: 'Local Impact', desc: 'Solutions relevant to Rwanda and Africa. Technology serving communities.' },
  { icon: MessageSquare, title: 'Open Knowledge', desc: 'Share what we learn. Resources freely available to all.' },
  { icon: Sprout, title: 'Growth Mindset', desc: 'Mistakes are opportunities. Celebrate experimentation.' },
  { icon: Scale, title: 'Responsible AI', desc: 'Ethical, safe, and beneficial applications. Think critically.' },
]

const team = [
  { initials: 'KM', name: 'Kaio Mugisha', role: 'Club President', bio: 'Computer Science, Year 4' },
  { initials: 'SN', name: 'Sandrine N.', role: 'Vice President', bio: 'Information Technology, Year 3' },
  { initials: 'JB', name: 'Jean Baptiste K.', role: 'Technical Lead', bio: 'Software Engineering, Year 4' },
  { initials: 'GU', name: 'Grace U.', role: 'Outreach Lead', bio: 'Business Administration, Year 3' },
]

const timeline = [
  { date: 'January 2026', title: 'Club Founded', desc: 'Initial planning and founding team formation.' },
  { date: 'Feb 9, 2026', title: 'Program Kickoff', desc: 'Week 1 begins with tabling and social media launch.' },
  { date: 'Feb 16, 2026', title: 'First Meeting', desc: 'First official CBC meeting with mini demo.' },
  { date: 'April 2026', title: 'Hackathon', desc: 'Week 10 — Build for Rwanda hackathon.' },
]

export default function About() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-pampas py-16 md:py-24">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-stone mb-6">
            <Link to="/" className="hover:text-claude-terracotta transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink">About</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="font-serif font-semibold text-ink mb-6">
              About Claude Builder Club
            </h1>
            <p className="text-stone text-xl leading-relaxed">
              Empowering University of Rwanda students to shape the future with AI
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow="Our Story"
                title="Where It All Began"
                align="left"
              />
              <div className="space-y-4 text-stone leading-relaxed">
                <p>
                  Claude Builder Club was founded in early 2026 when a group of curious
                  students at University of Rwanda came together with a shared vision:
                  making AI accessible to everyone.
                </p>
                <p>
                  We noticed that while AI was transforming industries worldwide, many
                  students felt intimidated or didn't know where to start. We believed
                  that hands-on learning and community support could change that.
                </p>
                <p>
                  Starting February 9, 2026, we're embarking on a 10-week program to
                  drive awareness and adoption of Claude AI on our campus.
                </p>
              </div>
            </div>
            <Card hover={false} className="bg-pampas border-pampas-warm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-claude-terracotta/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-claude-terracotta" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-ink">Our Belief</h3>
              </div>
              <p className="text-stone italic text-lg leading-relaxed">
                "The best way to learn AI is to build with it. Everyone can be a
                builder — you just need to start somewhere."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-pampas">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-white">
              <div className="w-12 h-12 rounded-xl bg-claude-terracotta/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-claude-terracotta" />
              </div>
              <CardTitle className="text-2xl mb-3">Our Mission</CardTitle>
              <CardDescription className="text-base">
                To democratize AI literacy at University of Rwanda by providing hands-on
                learning experiences that empower students from all disciplines to build
                practical solutions using Claude AI.
              </CardDescription>
            </Card>
            <Card className="bg-white">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-teal" />
              </div>
              <CardTitle className="text-2xl mb-3">Our Vision</CardTitle>
              <CardDescription className="text-base">
                A future where every Rwandan student has the skills and confidence to
                leverage AI as a tool for innovation, problem-solving, and positive
                impact in their communities.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <SectionHeader
            eyebrow="Our Values"
            title="What We Stand For"
            subtitle="The principles that guide everything we do"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card key={value.title}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-pampas flex items-center justify-center">
                    <value.icon className="w-5 h-5 text-claude-terracotta" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </div>
                <CardDescription>{value.desc}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-pampas">
        <div className="container-main">
          <SectionHeader
            eyebrow="Leadership"
            title="Meet the Team"
            subtitle="The students driving our mission forward"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="text-center bg-white">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-semibold text-white">
                    {member.initials}
                  </span>
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <p className="text-claude-terracotta font-medium text-sm mb-1">{member.role}</p>
                <CardDescription className="text-sm">{member.bio}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <SectionHeader
            eyebrow="Our Journey"
            title="Key Milestones"
          />
          <div className="max-w-2xl mx-auto">
            <div className="relative pl-8 border-l-2 border-pampas-warm">
              {timeline.map((item, index) => (
                <div key={item.date} className={`relative pb-8 ${index === timeline.length - 1 ? 'pb-0' : ''}`}>
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-claude-terracotta rounded-full" />
                  <div className="ml-6">
                    <span className="text-claude-terracotta font-sans font-semibold text-sm">
                      {item.date}
                    </span>
                    <h4 className="font-serif font-semibold text-ink mt-1">{item.title}</h4>
                    <p className="text-stone text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
