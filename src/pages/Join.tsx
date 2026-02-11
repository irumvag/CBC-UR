import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Users, Wrench, Trophy, Briefcase, Globe, Mail, Phone, MapPin } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const benefits = [
  { icon: Users, title: 'Free Learning', desc: 'Access all workshops, tutorials, and resources at no cost.' },
  { icon: Wrench, title: 'Hands-On Projects', desc: 'Build real applications with guidance from peers.' },
  { icon: Trophy, title: 'Recognition', desc: 'Showcase projects at Demo Days and compete in hackathons.' },
  { icon: Briefcase, title: 'Career Opportunities', desc: 'Connect with tech companies and access internships.' },
  { icon: Globe, title: 'Global Network', desc: 'Connect with other Claude Builder Clubs worldwide.' },
  { icon: CheckCircle, title: 'Community Support', desc: 'Join 150+ members ready to help you learn and grow.' },
]

export default function Join() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* Page Header */}
      <section className="bg-pampas py-16 md:py-24">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-stone mb-6">
            <Link to="/" className="hover:text-claude-terracotta transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink">Join</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="font-serif font-semibold text-ink mb-6">
              Join Claude Builder Club
            </h1>
            <p className="text-stone text-xl leading-relaxed">
              Start your AI journey with a community that supports you
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <SectionHeader
            eyebrow="Why Join"
            title="Member Benefits"
            subtitle="Everything you need to learn, build, and grow"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <div className="w-12 h-12 rounded-xl bg-pampas flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-claude-terracotta" />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
                <CardDescription className="mt-2">{benefit.desc}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section-padding bg-pampas">
        <div className="container-main">
          <div className="max-w-2xl mx-auto">
            <SectionHeader
              eyebrow="Register"
              title="Join the Club"
              subtitle="Fill out the form below and we'll add you to the community"
            />

            <Card hover={false} className="bg-white">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-ink mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-stone">
                    Thank you for joining Claude Builder Club! You'll receive a WhatsApp
                    message within 24 hours with next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-sans font-semibold text-ink mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                          'focus:border-claude-terracotta focus:outline-none transition-colors'
                        )}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block font-sans font-semibold text-ink mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                          'focus:border-claude-terracotta focus:outline-none transition-colors'
                        )}
                        placeholder="your.email@ur.ac.rw"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-sans font-semibold text-ink mb-2">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                          'focus:border-claude-terracotta focus:outline-none transition-colors'
                        )}
                        placeholder="+250 7XX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block font-sans font-semibold text-ink mb-2">
                        Faculty *
                      </label>
                      <select
                        required
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                          'focus:border-claude-terracotta focus:outline-none transition-colors'
                        )}
                      >
                        <option value="">Select faculty</option>
                        <option value="cst">College of Science and Technology</option>
                        <option value="cbe">College of Business and Economics</option>
                        <option value="cavm">College of Agriculture</option>
                        <option value="cmhs">College of Medicine</option>
                        <option value="cass">College of Arts and Social Sciences</option>
                        <option value="ce">College of Education</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-sans font-semibold text-ink mb-2">
                        Year of Study *
                      </label>
                      <select
                        required
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                          'focus:border-claude-terracotta focus:outline-none transition-colors'
                        )}
                      >
                        <option value="">Select year</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                        <option value="5+">Year 5+</option>
                        <option value="postgrad">Postgraduate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-sans font-semibold text-ink mb-2">
                        Experience Level
                      </label>
                      <select
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                          'focus:border-claude-terracotta focus:outline-none transition-colors'
                        )}
                      >
                        <option value="">Select level</option>
                        <option value="none">Complete Beginner</option>
                        <option value="beginner">Some Basic Knowledge</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans font-semibold text-ink mb-2">
                      Why do you want to join? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white resize-none',
                        'focus:border-claude-terracotta focus:outline-none transition-colors'
                      )}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 w-4 h-4 rounded border-stone text-claude-terracotta focus:ring-claude-terracotta"
                    />
                    <span className="text-stone text-sm">
                      I agree to be added to the Claude Builder Club WhatsApp group and
                      email list for updates about events and resources.
                    </span>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Submit Registration
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <SectionHeader
            eyebrow="Get in Touch"
            title="Contact Us"
            subtitle="Have questions? Reach out!"
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-lg">WhatsApp</CardTitle>
              <a href="https://wa.me/250780000000" className="text-stone hover:text-claude-terracotta transition-colors text-sm">
                +250 780 000 000
              </a>
            </Card>
            <Card className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-claude-terracotta flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-lg">Email</CardTitle>
              <a href="mailto:claude.builders@ur.ac.rw" className="text-stone hover:text-claude-terracotta transition-colors text-sm">
                claude.builders@ur.ac.rw
              </a>
            </Card>
            <Card className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-teal flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-lg">Location</CardTitle>
              <p className="text-stone text-sm">
                CST Building, Room 201<br />
                University of Rwanda
              </p>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
