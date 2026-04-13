import { Link } from 'react-router-dom'
import { Github, Mail, Instagram, Linkedin } from 'lucide-react'

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Events', href: '/events' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Hackathon', href: '/hackathon' },
  { label: 'Links', href: '/links' },
  { label: 'Credentials', href: '/credentials' },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 md:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src="/images/claude_logo.svg" alt="Claude" className="h-6 w-6 invert" />
              <div className="leading-tight">
                <div className="text-sm font-bold text-white">Claude Builder Club</div>
                <div className="text-xs text-white/50">University of Rwanda</div>
              </div>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-white/50">
              A student-led AI club building with Claude at the University of Rwanda, supported by Anthropic.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/claudebuilderclub.urcst/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-[#E1306C]/80 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/cbc-ur-cst/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-[#0077B5]/80 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/irumvag/CBC-UR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="mailto:claudebuilderclub.urcst@gmail.com"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/40">Pages</p>
            <nav className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Anthropic badge */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Official Partner</p>
            <a
              href="https://www.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="brightness-0 invert transition-all hover:opacity-80"
              aria-label="Anthropic"
            >
              <img src="/images/Anthropic_Logo.svg" alt="Anthropic" className="h-4 w-auto" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} Rwanda Claude Builder Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
