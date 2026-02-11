import { Users, Calendar, Presentation, Table2, Code, Megaphone } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card, CardTitle, CardDescription } from '@/components/ui/Card'

const activities = [
  {
    icon: Users,
    title: 'CBC Meetings',
    description: 'Regular club gatherings to learn, share, and collaborate with fellow builders.',
  },
  {
    icon: Code,
    title: 'Hackathon',
    description: 'Week 10 grand finale — build AI projects solving real challenges for Rwanda.',
  },
  {
    icon: Presentation,
    title: 'Mini Demos',
    description: 'Short 5-10 minute demonstrations showcasing Claude in various applications.',
  },
  {
    icon: Table2,
    title: 'Tabling',
    description: 'Campus outreach to spread awareness and engage curious students.',
  },
  {
    icon: Calendar,
    title: 'Workshops',
    description: 'Hands-on sessions with resources from Anthropic for practical learning.',
  },
  {
    icon: Megaphone,
    title: 'Social Media',
    description: 'Regular posts sharing insights, updates, and community highlights.',
  },
]

export function Features() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-main">
        <SectionHeader
          eyebrow="Program Deliverables"
          title="What We Do"
          subtitle="Our 10-week program includes a variety of activities designed to build awareness, foster learning, and encourage hands-on experimentation with Claude."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card key={activity.title} className="group">
              <div className="w-14 h-14 rounded-2xl bg-pampas flex items-center justify-center mb-4 group-hover:bg-claude-terracotta/10 transition-colors">
                <activity.icon className="w-7 h-7 text-stone group-hover:text-claude-terracotta transition-colors" />
              </div>
              <CardTitle>{activity.title}</CardTitle>
              <CardDescription className="mt-2">{activity.description}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
