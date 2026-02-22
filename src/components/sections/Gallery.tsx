const galleryImages = [
  { alt: 'Workshop session', gradient: 'from-claude-terracotta/30 to-claude-terracotta-light/20' },
  { alt: 'Team collaboration', gradient: 'from-sage/30 to-teal/20' },
  { alt: 'Hackathon event', gradient: 'from-teal/30 to-claude-terracotta/20' },
  { alt: 'Presentation day', gradient: 'from-stone/20 to-pampas-warm' },
  { alt: 'Coding session', gradient: 'from-claude-terracotta-light/30 to-sage/20' },
  { alt: 'Community meetup', gradient: 'from-claude-terracotta/20 to-teal/30' },
]

export function Gallery() {
  const items = [...galleryImages, ...galleryImages]

  return (
    <section className="overflow-hidden bg-surface dark:bg-dark-bg py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-12">
        <h2 className="mb-10 text-center font-serif text-2xl font-bold tracking-tight text-ink dark:text-dark-text sm:mb-14 sm:text-3xl md:text-4xl">
          Our Community in Action
        </h2>
      </div>

      <div className="relative">
        <div className="flex animate-scroll gap-4">
          {items.map((img, i) => (
            <div
              key={i}
              className={`h-48 w-72 flex-shrink-0 rounded-2xl bg-gradient-to-br ${img.gradient} sm:h-56 sm:w-80 md:h-64 md:w-96`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-2xl">
                <span className="text-sm font-medium text-stone/60 dark:text-dark-muted/60">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
