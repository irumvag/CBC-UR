import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-pampas-warm dark:border-dark-border bg-surface dark:bg-dark-bg transition-colors duration-300">
      <div className="container-main py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-3">
              {/* Claude Starburst Icon */}
              <div className="w-8 h-8 relative flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                  <circle cx="18" cy="6" r="3" className="fill-claude-terracotta" />
                  <circle cx="26.5" cy="9.5" r="3" className="fill-claude-terracotta" />
                  <circle cx="30" cy="18" r="3" className="fill-claude-terracotta" />
                  <circle cx="26.5" cy="26.5" r="3" className="fill-claude-terracotta" />
                  <circle cx="18" cy="30" r="3" className="fill-claude-terracotta" />
                  <circle cx="9.5" cy="26.5" r="3" className="fill-claude-terracotta" />
                  <circle cx="6" cy="18" r="3" className="fill-claude-terracotta" />
                  <circle cx="9.5" cy="9.5" r="3" className="fill-claude-terracotta" />
                  <circle cx="18" cy="18" r="4" className="fill-claude-terracotta" />
                </svg>
              </div>
              <span className="font-serif font-semibold">
                <span className="text-claude-terracotta">Claude Builder Club</span>
              </span>
            </Link>
            <p className="text-stone dark:text-dark-muted text-sm max-w-xs">
              {t('footer.universityOf')}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <a
              href="https://www.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone dark:text-dark-muted hover:text-claude-terracotta transition-colors text-sm font-medium"
            >
              Anthropic
            </a>
            <a
              href="https://docs.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone dark:text-dark-muted hover:text-claude-terracotta transition-colors text-sm font-medium"
            >
              Claude Docs
            </a>
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone dark:text-dark-muted hover:text-claude-terracotta transition-colors text-sm font-medium"
            >
              Try Claude
            </a>
            <Link
              to="/join"
              className="text-stone dark:text-dark-muted hover:text-claude-terracotta transition-colors text-sm font-medium"
            >
              {t('nav.community')}
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-pampas-warm dark:border-dark-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-cloudy dark:text-dark-muted text-sm">
            {t('footer.copyright')}
          </p>
          <p className="text-cloudy dark:text-dark-muted text-sm">
            {t('footer.builtWith')}
          </p>
        </div>
      </div>
    </footer>
  )
}
