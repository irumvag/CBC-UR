import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, PenSquare, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useArticles } from '@/hooks/useArticles'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/SEO'
import { cn } from '@/lib/utils'
import type { ArticleCategory, ArticleWithAuthor } from '@/types/database'

const categories: { value: ArticleCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Posts' },
  { value: 'tutorial', label: 'Tutorials' },
  { value: 'project', label: 'Projects' },
  { value: 'news', label: 'News' },
  { value: 'event', label: 'Events' },
  { value: 'general', label: 'General' },
]

const categoryColors: Record<ArticleCategory, string> = {
  tutorial: 'bg-teal/10 text-teal',
  project: 'bg-claude-terracotta/10 text-claude-terracotta',
  news: 'bg-sage/10 text-sage',
  event: 'bg-purple-100 text-purple-700',
  general: 'bg-stone/10 text-stone',
}

function ArticleCard({ article }: { article: ArticleWithAuthor }) {
  const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border overflow-hidden card-lift"
    >
      {/* Cover Image */}
      {article.cover_image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <Badge className={cn('mb-3', categoryColors[article.category])}>
          {article.category}
        </Badge>

        {/* Title */}
        <h3 className="font-serif font-semibold text-ink dark:text-dark-text text-xl mb-2 group-hover:text-claude-terracotta transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-stone dark:text-dark-muted text-sm leading-relaxed mb-4 line-clamp-2">
            {article.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-pampas dark:border-dark-border">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="w-8 h-8 rounded-full bg-claude-terracotta/10 flex items-center justify-center">
              {article.author?.avatar_url ? (
                <img
                  src={article.author.avatar_url}
                  alt={article.author.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={14} className="text-claude-terracotta" />
              )}
            </div>
            <div className="text-sm">
              <p className="text-ink dark:text-dark-text font-medium">{article.author?.full_name}</p>
              <div className="flex items-center gap-1 text-stone dark:text-dark-muted text-xs">
                <Calendar size={12} />
                {formattedDate}
              </div>
            </div>
          </div>

          <ArrowRight
            size={18}
            className="text-stone dark:text-dark-muted group-hover:text-claude-terracotta group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </Link>
  )
}

function ArticleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border overflow-hidden">
      <Skeleton className="aspect-video" />
      <div className="p-6">
        <Skeleton className="h-5 w-20 mb-3 rounded-full" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex items-center gap-3 pt-4 border-t border-pampas dark:border-dark-border">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all')
  const { articles, isLoading } = useArticles(
    selectedCategory === 'all' ? undefined : selectedCategory
  )
  const { user } = useAuth()

  return (
    <>
      <SEO
        title="Blog"
        description="Read tutorials, project showcases, and news from the Claude Builder Club at University of Rwanda community."
        url="/blog"
      />

      {/* Page Header */}
      <section className="bg-pampas-warm dark:bg-dark-surface py-16 md:py-20">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-stone dark:text-dark-muted mb-6">
            <Link to="/" className="hover:text-claude-terracotta transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink dark:text-dark-text">Blog</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-claude-terracotta font-sans font-bold text-xs uppercase tracking-widest mb-3">
                Community Blog
              </p>
              <h1 className="font-serif font-semibold text-ink dark:text-dark-text text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
                Articles & Tutorials
              </h1>
              <p className="text-stone dark:text-dark-muted text-lg leading-relaxed">
                Learn from our community. Tutorials, project showcases, and the latest news from
                Claude Builder Club.
              </p>
            </div>

            {user && (
              <Link to="/blog/new">
                <Button variant="primary" size="lg">
                  <PenSquare size={18} />
                  Write Article
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-surface dark:bg-dark-bg border-b border-pampas-warm dark:border-dark-border sticky top-16 z-30">
        <div className="container-main py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Filter size={16} className="text-stone dark:text-dark-muted flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  selectedCategory === cat.value
                    ? 'bg-claude-terracotta text-white'
                    : 'bg-white dark:bg-dark-card text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text hover:bg-pampas-warm dark:hover:bg-dark-surface border border-pampas-warm dark:border-dark-border'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16 bg-surface dark:bg-dark-bg">
        <div className="container-main">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-pampas-warm dark:bg-dark-surface flex items-center justify-center mx-auto mb-4">
                <PenSquare size={24} className="text-stone dark:text-dark-muted" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink dark:text-dark-text mb-2">No articles yet</h3>
              <p className="text-stone dark:text-dark-muted mb-6">
                {selectedCategory !== 'all'
                  ? `No ${selectedCategory} articles have been published yet.`
                  : 'Be the first to share your knowledge with the community!'}
              </p>
              {user && (
                <Link to="/blog/new">
                  <Button variant="primary">
                    <PenSquare size={16} />
                    Write the first article
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
