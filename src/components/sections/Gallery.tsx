const images = [
  { src: "/images/GM1.jpg", alt: "General meeting" },
  { src: "/images/hackathonwinners.jpg", alt: "Hackathon winners" },
  { src: "/images/tabling.jpg", alt: "Tabling" },
]

const scrollImages = [...images, ...images, ...images, ...images]

export function Gallery() {
  return (
    <section className="overflow-hidden bg-pampas pb-16 pt-10 sm:pb-20 sm:pt-14 md:pb-24 md:pt-16">
      <h2 className="mb-6 px-4 text-center text-xl font-bold text-ink sm:mb-8 sm:text-2xl md:text-3xl">
        What we&apos;ve been up to...
      </h2>
      <style>{`
        @keyframes gallery-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .gallery-track { animation: gallery-scroll 8s linear infinite; }
        @media (min-width: 640px) { .gallery-track { animation-duration: 25s; } }
        @media (min-width: 768px) { .gallery-track { animation-duration: 30s; } }
      `}</style>
      <div className="gallery-track flex gap-4 sm:gap-6">
        {scrollImages.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            style={{ height: "clamp(16rem, 30vw, 100rem)" }}
            className="w-auto flex-shrink-0 rounded-lg object-cover"
          />
        ))}
      </div>
    </section>
  )
}
