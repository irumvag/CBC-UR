import { Link } from 'react-router-dom'
import { ExternalLink, Github } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CTA } from '@/components/sections/CTA'

const projects = [
  {
    title: 'Kinyarwanda Study Buddy',
    description: 'An AI-powered tutor that helps students learn Kinyarwanda through interactive conversation practice.',
    author: 'Jean Marie N.',
    initials: 'JM',
    category: 'Education',
    tags: ['Language', 'Chatbot'],
    status: 'Active',
  },
  {
    title: 'AgriAssist Rwanda',
    description: 'Chatbot providing farming advice tailored to Rwanda\'s climate, seasons, and common crops.',
    author: 'Alice M.',
    initials: 'AM',
    category: 'Agriculture',
    tags: ['Farming', 'Advisory'],
    status: 'Active',
  },
  {
    title: 'Health Info Assistant',
    description: 'Accessible health information chatbot in both English and Kinyarwanda.',
    author: 'Patrick U.',
    initials: 'PU',
    category: 'Healthcare',
    tags: ['Health', 'Bilingual'],
    status: 'Completed',
  },
  {
    title: 'Essay Writing Coach',
    description: 'AI assistant that helps students improve academic writing with feedback on structure and clarity.',
    author: 'Emile N.',
    initials: 'EN',
    category: 'Education',
    tags: ['Writing', 'Academic'],
    status: 'Completed',
  },
  {
    title: 'SME Business Advisor',
    description: 'Business planning assistant for small enterprises, offering guidance on registration and finance.',
    author: 'Grace K.',
    initials: 'GK',
    category: 'Business',
    tags: ['SME', 'Planning'],
    status: 'In Development',
  },
  {
    title: 'Budget Buddy',
    description: 'Personal finance assistant helping students manage budgets and develop good financial habits.',
    author: 'Joseph K.',
    initials: 'JK',
    category: 'Finance',
    tags: ['Personal', 'Budgeting'],
    status: 'Completed',
  },
]

const statusColors = {
  'Active': 'terracotta',
  'Completed': 'sage',
  'In Development': 'teal',
} as const

export default function Projects() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-pampas py-16 md:py-24">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-stone mb-6">
            <Link to="/" className="hover:text-claude-terracotta transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink">Projects</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="font-serif font-semibold text-ink mb-6">
              Project Showcase
            </h1>
            <p className="text-stone text-xl leading-relaxed">
              Real solutions built by our members using Claude AI
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-surface border-b border-pampas-warm">
        <div className="container-main">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="font-serif text-3xl font-semibold text-claude-terracotta">25+</p>
              <p className="text-stone text-sm">Projects Built</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl font-semibold text-claude-terracotta">8</p>
              <p className="text-stone text-sm">Active Projects</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl font-semibold text-claude-terracotta">60+</p>
              <p className="text-stone text-sm">Students Involved</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl font-semibold text-claude-terracotta">5</p>
              <p className="text-stone text-sm">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <SectionHeader
            eyebrow="Gallery"
            title="Member Projects"
            subtitle="See what our community is building with Claude"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.title} className="flex flex-col">
                {/* Category & Status */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">{project.category}</Badge>
                  <Badge variant={statusColors[project.status as keyof typeof statusColors]}>
                    {project.status}
                  </Badge>
                </div>

                {/* Content */}
                <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                <CardDescription className="flex-1">{project.description}</CardDescription>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs text-stone bg-pampas px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-pampas-warm">
                  <div className="w-8 h-8 rounded-full bg-claude-terracotta/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-claude-terracotta">{project.initials}</span>
                  </div>
                  <span className="text-sm text-stone">{project.author}</span>
                </div>

                {/* Links */}
                <div className="flex gap-4 mt-4">
                  <button className="text-sm text-stone hover:text-claude-terracotta transition-colors flex items-center gap-1">
                    <ExternalLink size={14} />
                    Demo
                  </button>
                  <button className="text-sm text-stone hover:text-claude-terracotta transition-colors flex items-center gap-1">
                    <Github size={14} />
                    Code
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Project */}
      <section className="section-padding bg-pampas">
        <div className="container-main">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader
              eyebrow="Get Featured"
              title="Submit Your Project"
              subtitle="Built something with Claude? We'd love to showcase it. Share your work with the community."
            />
            <Link to="/join">
              <Button variant="primary" size="lg">
                Submit Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
