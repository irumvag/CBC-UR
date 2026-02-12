import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Eye, Edit3, Save, Image, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useUserArticles, generateSlug } from '@/hooks/useArticles'
import { useToast } from '@/components/ui/Toast'
import { SEO } from '@/components/SEO'
import { cn } from '@/lib/utils'
import type { ArticleCategory } from '@/types/database'

const categories: { value: ArticleCategory; label: string }[] = [
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'project', label: 'Project' },
  { value: 'news', label: 'News' },
  { value: 'event', label: 'Event' },
  { value: 'general', label: 'General' },
]

export default function ArticleEditor() {
  const { slug } = useParams<{ slug: string }>()
  const isEditing = slug && slug !== 'new'
  const navigate = useNavigate()
  const { member } = useAuth()
  const { articles, createArticle, updateArticle, isLoading: articlesLoading } = useUserArticles(member?.id)
  const { showToast } = useToast()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState<ArticleCategory>('general')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load existing article if editing
  useEffect(() => {
    if (isEditing && !articlesLoading) {
      const existingArticle = articles.find(a => a.slug === slug)
      if (existingArticle) {
        setTitle(existingArticle.title)
        setContent(existingArticle.content)
        setExcerpt(existingArticle.excerpt || '')
        setCategory(existingArticle.category)
        setCoverImageUrl(existingArticle.cover_image_url || '')
      }
    }
  }, [isEditing, slug, articles, articlesLoading])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required'
    }
    if (content.trim().length < 100) {
      newErrors.content = 'Content must be at least 100 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (publish: boolean) => {
    if (!validate()) return

    setIsSaving(true)

    const articleSlug = generateSlug(title)
    const articleData = {
      title: title.trim(),
      slug: articleSlug,
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      category,
      cover_image_url: coverImageUrl.trim() || undefined,
      published: publish,
    }

    let result
    if (isEditing) {
      const existingArticle = articles.find(a => a.slug === slug)
      if (existingArticle) {
        result = await updateArticle(existingArticle.id, articleData)
      } else {
        result = { success: false, error: 'Article not found' }
      }
    } else {
      result = await createArticle(articleData)
    }

    setIsSaving(false)

    if (result.success) {
      showToast(
        publish
          ? 'Article published successfully!'
          : isEditing
          ? 'Article updated!'
          : 'Draft saved!',
        'success'
      )
      navigate(publish ? `/blog/${articleSlug}` : '/dashboard/articles')
    } else {
      showToast(result.error || 'Failed to save article', 'error')
    }
  }

  if (!member) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface">
        <div className="text-center">
          <AlertCircle size={48} className="text-stone mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-semibold text-ink mb-4">
            Sign in required
          </h1>
          <p className="text-stone mb-6">
            You need to be signed in to write articles.
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

  return (
    <>
      <SEO
        title={isEditing ? 'Edit Article' : 'Write Article'}
        description="Create a new article for the Claude Builder Club blog."
        noIndex
      />

      <div className="min-h-screen bg-surface">
        {/* Header */}
        <header className="bg-white border-b border-pampas-warm sticky top-0 z-40">
          <div className="container-main py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/blog"
                  className="text-stone hover:text-ink transition-colors"
                >
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="font-serif font-semibold text-ink text-lg">
                  {isEditing ? 'Edit Article' : 'Write Article'}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Preview Toggle */}
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isPreview
                      ? 'bg-claude-terracotta text-white'
                      : 'bg-pampas text-stone hover:bg-pampas-warm'
                  )}
                >
                  {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                  {isPreview ? 'Edit' : 'Preview'}
                </button>

                {/* Save Draft */}
                <Button
                  variant="secondary"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                >
                  <Save size={16} />
                  Save Draft
                </Button>

                {/* Publish */}
                <Button
                  variant="primary"
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Publish'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container-main py-8">
          <div className="max-w-4xl mx-auto">
            {isPreview ? (
              /* Preview Mode */
              <div className="bg-white rounded-2xl border border-pampas-warm p-8">
                {coverImageUrl && (
                  <img
                    src={coverImageUrl}
                    alt="Cover"
                    className="w-full aspect-video object-cover rounded-xl mb-8"
                  />
                )}
                <h1 className="font-serif font-semibold text-ink text-3xl md:text-4xl mb-6">
                  {title || 'Untitled Article'}
                </h1>
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || '*Start writing your article...*'}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article title..."
                    className={cn(
                      'w-full font-serif text-3xl md:text-4xl font-semibold text-ink',
                      'bg-transparent border-0 focus:outline-none focus:ring-0',
                      'placeholder:text-stone/50',
                      errors.title && 'border-b-2 border-red-400'
                    )}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Meta Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white focus:outline-none focus:border-claude-terracotta transition-colors"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Cover Image URL
                    </label>
                    <div className="relative">
                      <Image
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone"
                      />
                      <input
                        type="url"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white focus:outline-none focus:border-claude-terracotta transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Excerpt (optional)
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A brief summary of your article..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white resize-none focus:outline-none focus:border-claude-terracotta transition-colors"
                  />
                  <p className="text-stone text-xs mt-1">
                    This will appear on the blog listing page
                  </p>
                </div>

                {/* Content Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-ink">
                      Content (Markdown)
                    </label>
                    <a
                      href="https://www.markdownguide.org/basic-syntax/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-claude-terracotta hover:underline"
                    >
                      Markdown guide
                    </a>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article in Markdown...

# Heading 1
## Heading 2

Regular paragraph text with **bold** and *italic*.

- List item 1
- List item 2

```javascript
// Code block
const hello = 'world';
```"
                    rows={20}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 bg-white font-mono text-sm',
                      'focus:outline-none focus:border-claude-terracotta transition-colors',
                      'resize-y min-h-[400px]',
                      errors.content ? 'border-red-400' : 'border-pampas-warm'
                    )}
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                  )}
                </div>

                {/* Tips */}
                <div className="bg-pampas rounded-xl p-4">
                  <h4 className="font-semibold text-ink text-sm mb-2">Writing Tips</h4>
                  <ul className="text-stone text-sm space-y-1">
                    <li>• Use headings (## and ###) to structure your article</li>
                    <li>• Add code blocks with triple backticks (```)</li>
                    <li>• Include images with ![alt text](url)</li>
                    <li>• Create links with [text](url)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
