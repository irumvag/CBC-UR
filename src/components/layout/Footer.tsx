export function Footer() {
  return (
    <footer className="bg-claude-terracotta">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-8 md:px-12">
        <p className="text-sm text-white/90">
          &copy; {new Date().getFullYear()} Claude Builder Club &mdash; University of Rwanda
        </p>
        <p className="text-sm text-white/70">
          Backed by{' '}
          <a
            href="https://www.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-white"
          >
            Anthropic
          </a>
        </p>
      </div>
    </footer>
  )
}
