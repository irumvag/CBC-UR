import { Link, useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useArticle } from '@/hooks/useArticles'
import { SEO } from '@/components/SEO'
import { cn } from '@/lib/utils'
import type { ArticleCategory } from '@/types/database'

const categoryColors: Record<ArticleCategory, string> = {
  tutorial: 'bg-teal/10 text-teal',
  project: 'bg-claude-terracotta/10 text-claude-terracotta',
  news: 'bg-sage/10 text-sage',
  event: 'bg-purple-100 text-purple-700',
  general: 'bg-stone/10 text-stone',
}

function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header Skeleton */}
      <div className="bg-pampas-warm py-12 md:py-16">
        <div className="container-main">
          <Skeleton className="h-4 w-48 mb-8" />
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-6 w-24 mb-4 rounded-full" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container-main py-12">
        <div className="max-w-prose mx-auto">
          <Skeleton className="w-full aspect-video rounded-2xl mb-8" />
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full mb-4" />
          ))}
        </div>
      </div>
    </div>
  )
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { article, isLoading, error } = useArticle(slug || '')

  if (isLoading) {
    return <ArticleSkeleton />
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-ink mb-4">
            {error || 'Article not found'}
          </h1>
          <p className="text-stone mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Button variant="primary">
              <ArrowLeft size={16} />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const readTime = estimateReadTime(article.content)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.excerpt || '',
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      // Could add a toast here
    }
  }

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt || `Read ${article.title} on Claude Builder Club blog.`}
        image={article.cover_image_url || undefined}
        url={`/blog/${article.slug}`}
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          image: article.cover_image_url,
          datePublished: article.created_at,
          dateModified: article.updated_at,
          author: {
            '@type': 'Person',
            name: article.author?.full_name,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Claude Builder Club - University of Rwanda',
          },
        }}
      />

      {/* Article Header */}
      <header className="bg-pampas-warm py-12 md:py-16">
        <div className="container-main">
          {/* Back Link */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-stone hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="max-w-3xl mx-auto text-center">
            {/* Category */}
            <Badge className={cn('mb-4', categoryColors[article.category])}>
              {article.category}
            </Badge>

            {/* Title */}
            <h1 className="font-serif font-semibold text-ink text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-stone">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-claude-terracotta/10 flex items-center justify-center">
                  {article.author?.avatar_url ? (
                    <img
                      src={article.author.avatar_url}
                      alt={article.author.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-claude-terracotta" />
                  )}
                </div>
                <span className="font-medium text-ink">{article.author?.full_name}</span>
              </div>

              <span className="text-pampas-warm">•</span>

              {/* Date */}
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {formattedDate}
              </div>

              <span className="text-pampas-warm">•</span>

              {/* Read time */}
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {readTime} min read
              </div>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-claude-terracotta transition-colors"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12 md:py-16 bg-surface">
        <div className="container-main">
          <div className="max-w-prose mx-auto">
            {/* Cover Image */}
            {article.cover_image_url && (
              <figure className="mb-10 -mx-4 md:mx-0">
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full rounded-2xl shadow-lg"
                />
              </figure>
            )}

            {/* Markdown Content */}
            <div className="prose prose-lg prose-ink max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Style headings
                  h1: ({ children }) => (
                    <h1 className="font-serif font-semibold text-ink text-3xl mt-12 mb-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-serif font-semibold text-ink text-2xl mt-10 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-serif font-semibold text-ink text-xl mt-8 mb-3">
                      {children}
                    </h3>
                  ),
                  // Style paragraphs with comfortable reading
                  p: ({ children }) => (
                    <p className="text-ink leading-relaxed mb-6 text-lg">
                      {children}
                    </p>
                  ),
                  // Style links
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-claude-terracotta hover:underline"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  // Style code blocks
                  pre: ({ children }) => (
                    <pre className="bg-ink text-pampas rounded-xl p-4 overflow-x-auto my-6 text-sm">
                      {children}
                    </pre>
                  ),
                  code: ({ className, children }) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-pampas-warm text-claude-terracotta px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className="font-mono">{children}</code>
                    )
                  },
                  // Style blockquotes
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-claude-terracotta pl-4 my-6 italic text-stone">
                      {children}
                    </blockquote>
                  ),
                  // Style lists
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-6 text-ink">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 mb-6 text-ink">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-lg leading-relaxed">{children}</li>
                  ),
                  // Style images
                  img: ({ src, alt }) => (
                    <figure className="my-8">
                      <img
                        src={src}
                        alt={alt}
                        className="w-full rounded-xl"
                      />
                      {alt && (
                        <figcaption className="text-center text-stone text-sm mt-2">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  ),
                  // Style horizontal rules
                  hr: () => <hr className="my-10 border-t border-pampas-warm" />,
                  // Style tables
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full border-collapse">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-pampas-warm bg-pampas p-3 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-pampas-warm p-3">{children}</td>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Author Card */}
            <div className="mt-12 pt-8 border-t border-pampas-warm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-claude-terracotta/10 flex items-center justify-center flex-shrink-0">
                  {article.author?.avatar_url ? (
                    <img
                      src={article.author.avatar_url}
                      alt={article.author.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-claude-terracotta" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-stone uppercase tracking-wider mb-1">Written by</p>
                  <p className="font-serif font-semibold text-ink text-lg">
                    {article.author?.full_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-12 text-center">
              <Link to="/blog">
                <Button variant="secondary" size="lg">
                  <ArrowLeft size={16} />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
