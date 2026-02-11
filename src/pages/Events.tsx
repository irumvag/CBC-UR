import { Link } from 'react-router-dom'
import { Calendar, Users, Presentation, Table2, Code, MessageCircle } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CTA } from '@/components/sections/CTA'
import { cn } from '@/lib/utils'

const schedule = [
  { week: 1, date: 'Feb 9', activities: [{ type: 'Tabling', icon: Table2 }, { type: 'Social Post', icon: MessageCircle }] },
  { week: 2, date: 'Feb 16', activities: [{ type: 'CBC Meeting #1', icon: Users }, { type: 'Mini Demo', icon: Presentation }] },
  { week: 3, date: 'Feb 23', activities: [{ type: 'Hackathon Planning #1', icon: Calendar }, { type: 'Mini Demo', icon: Presentation }] },
  { week: 4, date: 'Mar 2', activities: [{ type: 'CBC Meeting #2', icon: Users }, { type: 'Tabling', icon: Table2 }] },
  { week: 5, date: 'Mar 9', activities: [{ type: 'Social Post', icon: MessageCircle }, { type: '2 Mini Demos', icon: Presentation }] },
  { week: 6, date: 'Mar 16', activities: [{ type: 'CBC Meeting #3', icon: Users }, { type: 'Hackathon Planning #2', icon: Calendar }] },
  { week: 7, date: 'Mar 23', activities: [{ type: 'Tabling', icon: Table2 }, { type: 'Mini Demo', icon: Presentation }] },
  { week: 8, date: 'Mar 30', activities: [{ type: 'CBC Meeting #4', icon: Users }, { type: 'Social Post', icon: MessageCircle }] },
  { week: 9, date: 'Apr 6', activities: [{ type: 'CBC Meeting #5', icon: Users }, { type: 'Hackathon Planning #3', icon: Calendar }] },
  { week: 10, date: 'Apr 13', activities: [{ type: 'HACKATHON', icon: Code, highlight: true }, { type: 'Social Post', icon: MessageCircle }], highlight: true },
]

export default function Events() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-pampas py-16 md:py-24">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-stone mb-6">
            <Link to="/" className="hover:text-claude-terracotta transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink">Events</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="font-serif font-semibold text-ink mb-6">
              Events & Schedule
            </h1>
            <p className="text-stone text-xl leading-relaxed">
              10-week program starting February 9, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Activity Types */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <SectionHeader
            eyebrow="What We Do"
            title="Activity Types"
            subtitle="Different formats for different learning styles"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'CBC Meetings', desc: 'Regular club gatherings for learning and collaboration.' },
              { icon: Code, title: 'Hackathon', desc: 'Build projects using Claude in Week 10.' },
              { icon: Presentation, title: 'Mini Demos', desc: '5-10 minute Claude demonstrations.' },
              { icon: Table2, title: 'Tabling', desc: 'Campus outreach and engagement.' },
            ].map((item) => (
              <Card key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-pampas flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-claude-terracotta" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="mt-2 text-sm">{item.desc}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 10-Week Schedule */}
      <section className="section-padding bg-pampas">
        <div className="container-main">
          <SectionHeader
            eyebrow="Full Schedule"
            title="10-Week Program"
            subtitle="From kickoff to hackathon — mark your calendar"
          />

          <div className="max-w-4xl mx-auto space-y-3">
            {schedule.map((week) => (
              <div
                key={week.week}
                className={cn(
                  'rounded-2xl overflow-hidden',
                  week.highlight && 'ring-2 ring-claude-terracotta'
                )}
              >
                <div className={cn(
                  'flex items-center justify-between px-6 py-4',
                  week.highlight ? 'bg-claude-terracotta text-white' : 'bg-white border border-pampas-warm'
                )}>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-serif font-semibold',
                      week.highlight ? 'bg-white text-claude-terracotta' : 'bg-pampas text-ink'
                    )}>
                      {week.week}
                    </span>
                    <div>
                      <span className="font-sans font-semibold">Week {week.week}</span>
                      <span className={cn(
                        'ml-2 text-sm',
                        week.highlight ? 'text-white/80' : 'text-stone'
                      )}>
                        {week.date}, 2026
                      </span>
                    </div>
                  </div>
                  {week.highlight && (
                    <Badge className="bg-white/20 text-white border-0">
                      Grand Finale
                    </Badge>
                  )}
                </div>
                <div className="bg-white p-4 border border-t-0 border-pampas-warm rounded-b-2xl">
                  <div className="flex flex-wrap gap-3">
                    {week.activities.map((activity, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                          activity.highlight
                            ? 'bg-claude-terracotta/10 text-claude-terracotta'
                            : 'bg-pampas text-charcoal'
                        )}
                      >
                        <activity.icon size={16} />
                        {activity.type}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Schedule */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <SectionHeader
            eyebrow="Recurring"
            title="Regular Schedule"
            subtitle="Weekly activities throughout the program"
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-claude-terracotta flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Weekly Meetings</CardTitle>
              </div>
              <p className="text-stone">
                <strong className="text-ink">Every Saturday</strong><br />
                2:00 PM - 5:00 PM<br />
                <span className="text-sm">CST Building, Room 201</span>
              </p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-teal flex items-center justify-center">
                  <Presentation className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Mini Demos</CardTitle>
              </div>
              <p className="text-stone">
                <strong className="text-ink">Various Times</strong><br />
                5-10 minutes each<br />
                <span className="text-sm">Multiple campus locations</span>
              </p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center">
                  <Table2 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Tabling</CardTitle>
              </div>
              <p className="text-stone">
                <strong className="text-ink">Weekdays</strong><br />
                10:00 AM - 2:00 PM<br />
                <span className="text-sm">High-traffic campus areas</span>
              </p>
            </Card>
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
