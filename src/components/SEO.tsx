import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'event'
  structuredData?: object
  noIndex?: boolean
}

const defaultMeta = {
  siteName: 'Claude Builder Club - University of Rwanda',
  title: 'Claude Builder Club UR',
  description: 'Join the Claude Builder Club at University of Rwanda. Build innovative AI solutions, learn from workshops, and connect with fellow developers passionate about AI technology.',
  image: '/og-image.png',
  url: 'https://cbc-ur.vercel.app',
  twitterHandle: '@ClaudeBuilderUR',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Claude Builder Club - University of Rwanda',
  alternateName: 'CBC-UR',
  url: defaultMeta.url,
  logo: `${defaultMeta.url}/logo.png`,
  description: defaultMeta.description,
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kigali',
    addressCountry: 'RW',
  },
  parentOrganization: {
    '@type': 'EducationalOrganization',
    name: 'University of Rwanda',
  },
  sameAs: [
    'https://github.com/claude-builder-club-ur',
    'https://twitter.com/ClaudeBuilderUR',
    'https://linkedin.com/company/claude-builder-club-ur',
  ],
}

export function SEO({
  title,
  description = defaultMeta.description,
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = 'website',
  structuredData,
  noIndex = false,
}: SEOProps) {
  const pageTitle = title
    ? `${title} | ${defaultMeta.siteName}`
    : defaultMeta.title

  const fullImageUrl = image.startsWith('http') ? image : `${defaultMeta.url}${image}`
  const fullUrl = url.startsWith('http') ? url : `${defaultMeta.url}${url}`

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={defaultMeta.siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={defaultMeta.twitterHandle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || organizationSchema)}
      </script>
    </Helmet>
  )
}

// Pre-configured SEO for specific pages
export function HomeSEO() {
  return (
    <SEO
      description="Join the Claude Builder Club at University of Rwanda. Build innovative AI solutions, attend workshops, and connect with fellow developers."
      structuredData={organizationSchema}
    />
  )
}

export function AboutSEO() {
  return (
    <SEO
      title="About Us"
      description="Learn about Claude Builder Club at University of Rwanda - our mission, leadership team, and how we're empowering the next generation of AI builders in Rwanda."
      url="/about"
    />
  )
}

export function EventsSEO() {
  return (
    <SEO
      title="Events"
      description="Discover upcoming workshops, hackathons, and meetups hosted by Claude Builder Club UR. Learn AI development, network with peers, and build innovative projects."
      url="/events"
    />
  )
}

export function ProjectsSEO() {
  return (
    <SEO
      title="Projects"
      description="Explore innovative AI projects built by Claude Builder Club UR members. From healthcare to education, see how we're solving real problems with Claude."
      url="/projects"
    />
  )
}

export function JoinSEO() {
  return (
    <SEO
      title="Join the Club"
      description="Apply to become a member of Claude Builder Club at University of Rwanda. Get access to resources, mentorship, and a community of AI enthusiasts."
      url="/join"
    />
  )
}

export function DashboardSEO() {
  return (
    <SEO
      title="Dashboard"
      description="Your member dashboard at Claude Builder Club UR."
      url="/dashboard"
      noIndex
    />
  )
}

export function AdminSEO() {
  return (
    <SEO
      title="Admin"
      description="Admin dashboard for Claude Builder Club UR."
      url="/admin"
      noIndex
    />
  )
}
