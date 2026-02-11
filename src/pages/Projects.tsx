import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

type Category = 'All' | 'Web Apps' | 'Chatbots' | 'Data Analysis' | 'Education' | 'Healthcare'

interface Project {
  id: string
  title: string
  description: string
  category: Category
  gradient: string
  team: { initials: string; name: string }[]
  tags: string[]
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Kigali Health Assistant',
    description: 'AI-powered health Q&A system designed for rural clinics in Rwanda, providing accessible medical information in Kinyarwanda and English.',
    category: 'Healthcare',
    gradient: 'from-claude-terracotta to-claude-terracotta-light',
    team: [
      { initials: 'PM', name: 'Patrick M.' },
      { initials: 'SN', name: 'Sandrine N.' },
    ],
    tags: ['Claude API', 'Healthcare', 'Bilingual'],
  },
  {
    id: '2',
    title: 'Inyarwanda Tutor',
    description: 'Interactive Kinyarwanda language learning platform that uses Claude to provide personalized lessons, pronunciation feedback, and cultural context.',
    category: 'Education',
    gradient: 'from-sage to-teal',
    team: [
      { initials: 'JB', name: 'Jean Baptiste' },
      { initials: 'AN', name: 'Alice N.' },
      { initials: 'EM', name: 'Emmanuel M.' },
    ],
    tags: ['Language Learning', 'Claude API', 'Education'],
  },
  {
    id: '3',
    title: 'AgriSmart Rwanda',
    description: 'Farming advice chatbot tailored for local farmers, providing guidance on crop selection, pest management, and weather-based recommendations.',
    category: 'Chatbots',
    gradient: 'from-teal to-sage',
    team: [
      { initials: 'GU', name: 'Grace U.' },
      { initials: 'DM', name: 'David M.' },
    ],
    tags: ['Agriculture', 'Chatbot', 'SMS Integration'],
  },
  {
    id: '4',
    title: 'StudyBuddy UR',
    description: 'AI study companion for University of Rwanda students, offering course-specific help, exam preparation, and collaborative learning features.',
    category: 'Education',
    gradient: 'from-stone to-charcoal',
    team: [
      { initials: 'KM', name: 'Kaio M.' },
      { initials: 'JN', name: 'Justine N.' },
    ],
    tags: ['Education', 'Web App', 'Study Tools'],
  },
  {
    id: '5',
    title: 'Rwanda Heritage Guide',
    description: 'Cultural tourism assistant that helps visitors explore Rwanda\'s rich heritage, traditions, and historical sites with AI-powered storytelling.',
    category: 'Web Apps',
    gradient: 'from-claude-terracotta-light to-sage',
    team: [
      { initials: 'IM', name: 'Irene M.' },
      { initials: 'CB', name: 'Claude B.' },
      { initials: 'NJ', name: 'Nadine J.' },
    ],
    tags: ['Tourism', 'Culture', 'Web App'],
  },
  {
    id: '6',
    title: 'CodeMentor',
    description: 'Programming tutor powered by Claude API, providing personalized coding lessons, code reviews, and debugging help for aspiring developers.',
    category: 'Education',
    gradient: 'from-teal to-claude-terracotta',
    team: [
      { initials: 'PN', name: 'Patrick N.' },
    ],
    tags: ['Programming', 'Claude API', 'Learning'],
  },
]

const categories: Category[] = ['All', 'Web Apps', 'Chatbots', 'Data Analysis', 'Education', 'Healthcare']

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const { ref: projectsRef, isVisible: projectsVisible } = useScrollReveal()

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory)

  return (
    <>
      {/* Page Header */}
      <section className="bg-pampas-warm py-16 md:py-20">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-stone mb-6">
            <Link to="/" className="hover:text-claude-terracotta transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink">Projects</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-claude-terracotta font-sans font-bold text-xs uppercase tracking-widest mb-3">
              Project Showcase
            </p>
            <h1 className="font-serif font-semibold text-ink text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              See What We're Building
            </h1>
            <p className="text-stone text-lg md:text-xl leading-relaxed">
              Explore projects created by CBC-UR members using Claude AI. From healthcare solutions to
              educational tools — our community is building for Rwanda.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar & Projects Grid */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="container-main">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedCategory === category
                    ? 'bg-claude-terracotta text-white shadow-sm'
                    : 'bg-pampas text-stone hover:text-ink hover:bg-pampas-warm'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div ref={projectsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={cn(
                  'group bg-white rounded-2xl border border-pampas-warm overflow-hidden',
                  'transition-all duration-500 ease-out',
                  'hover:shadow-xl hover:-translate-y-2',
                  'opacity-0 translate-y-4',
                  projectsVisible && 'opacity-100 translate-y-0'
                )}
                style={{ transitionDelay: projectsVisible ? `${index * 100}ms` : '0ms' }}
              >
                {/* Gradient Image Placeholder */}
                <div
                  className={cn(
                    'h-40 bg-gradient-to-br transition-transform duration-500',
                    'group-hover:scale-105',
                    project.gradient
                  )}
                >
                  <div className="w-full h-full flex items-center justify-center bg-black/10">
                    <span className="text-white/80 font-serif text-xl font-semibold">
                      {project.title.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <Badge className="bg-pampas text-stone mb-3">
                    {project.category}
                  </Badge>
                  <h3 className="font-serif font-semibold text-ink text-lg mb-2">
                    {project.title}
                  </h3>
                  <p className="text-stone text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-claude-terracotta bg-claude-terracotta/10 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Team & Links */}
                  <div className="flex items-center justify-between pt-4 border-t border-pampas">
                    {/* Team Avatars */}
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member) => (
                        <div
                          key={member.initials}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light flex items-center justify-center ring-2 ring-white"
                          title={member.name}
                        >
                          <span className="text-xs font-semibold text-white">
                            {member.initials}
                          </span>
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-pampas flex items-center justify-center ring-2 ring-white">
                          <span className="text-xs font-semibold text-stone">
                            +{project.team.length - 3}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3">
                      <button className="text-stone hover:text-claude-terracotta transition-colors">
                        <ExternalLink size={18} />
                      </button>
                      <button className="text-stone hover:text-claude-terracotta transition-colors">
                        <Github size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Submit Project CTA */}
      <section className="py-16 md:py-20 bg-pampas">
        <div className="container-main">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader
              eyebrow="Get Featured"
              title="Submit Your Project"
              subtitle="Built something with Claude? We'd love to showcase it. Share your work with the community and inspire other builders."
            />
            <Link to="/join">
              <Button variant="primary" size="lg">
                Submit Your Project
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
