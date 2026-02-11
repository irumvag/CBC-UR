import { SectionHeader } from '@/components/ui/SectionHeader'

const stats = [
  { value: '10', label: 'Weeks of Learning', description: 'Comprehensive program' },
  { value: '5+', label: 'Club Meetings', description: 'Regular gatherings' },
  { value: '6', label: 'Mini Demos', description: 'Hands-on sessions' },
  { value: '1', label: 'Grand Hackathon', description: 'Build for Rwanda' },
]

export function Stats() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-main">
        <SectionHeader
          eyebrow="By the Numbers"
          title="A 10-Week Journey"
          subtitle="From introduction to innovation — our program is designed to take you from curious beginner to confident builder."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 md:p-8 rounded-2xl bg-pampas border border-pampas-warm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="font-serif text-4xl md:text-5xl font-semibold text-claude-terracotta mb-2">
                {stat.value}
              </p>
              <p className="font-sans font-semibold text-ink mb-1">{stat.label}</p>
              <p className="text-stone text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
