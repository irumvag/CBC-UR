const cards = [
  { icon: "/images/claude-icons/grid.png", title: "FREE Claude", desc: "Access to Claude Pro, API Credits, and merch" },
  { icon: "/images/claude-icons/lightning.png", title: "Hackathons", desc: "Compete & win tons of amazing prizes" },
  { icon: "/images/claude-icons/flowers.png", title: "Community", desc: "Connect with students passionate about AI" },
  { icon: "/images/claude-icons/lightbulb.png", title: "Learn", desc: "Hands-on tutorials for all skill-levels" },
]

export function Benefits() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-12 md:py-16">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-16">
        <div className="flex-1">
          <h2 className="mb-3 text-lg font-bold text-ink sm:mb-4 sm:text-xl md:text-3xl">
            Fill out this form to join!
          </h2>
          <div className="overflow-hidden rounded-lg border border-cloudy/20">
            <iframe
              id="JotFormIFrame-CBC-UR"
              title="Registration Form"
              src="https://www.jotform.com/253555944387168"
              style={{
                minWidth: "100%",
                maxWidth: "100%",
                height: 450,
                border: "none",
              }}
              scrolling="yes"
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-ink sm:text-2xl md:text-2xl">
            What&apos;s in it for you?
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 md:flex md:flex-col md:items-start">
            {cards.map((item, i) => (
              <div key={item.title} className={`flex items-start gap-2.5 rounded-lg border border-cloudy/20 bg-pampas/30 p-3 sm:gap-3 sm:p-4 md:w-[80%] ${i % 2 === 1 ? "md:self-end" : ""}`}>
                <img src={item.icon} alt="" className="h-12 w-12 flex-shrink-0 sm:h-12 sm:w-12" />
                <div>
                  <p className="text-sm font-semibold text-ink sm:text-base">{item.title}</p>
                  <p className="text-xs text-stone sm:text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
