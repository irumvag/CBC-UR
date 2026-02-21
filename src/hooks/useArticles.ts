import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Article, ArticleWithAuthor, ArticleInput, ArticleCategory } from '@/types/database'

// Mock articles for development
const mockArticles: ArticleWithAuthor[] = [
  {
    id: '1',
    title: 'Getting Started with Claude API',
    slug: 'getting-started-with-claude-api',
    content: `# Getting Started with Claude API

Welcome to this comprehensive guide on getting started with the Claude API! Whether you're building a chatbot, content generator, or AI-powered application, this tutorial will help you take your first steps.

## Prerequisites

Before we begin, make sure you have:
- A valid Anthropic API key
- Node.js 18+ installed
- Basic JavaScript/TypeScript knowledge

## Installation

First, install the Anthropic SDK:

\`\`\`bash
npm install @anthropic-ai/sdk
\`\`\`

## Your First API Call

Here's a simple example to get you started:

\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function chat() {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      { role: "user", content: "Hello, Claude!" }
    ]
  });

  console.log(message.content);
}

chat();
\`\`\`

## Best Practices

1. **Always handle errors gracefully** - The API can return various error codes
2. **Use streaming for long responses** - Better user experience
3. **Implement rate limiting** - Respect API limits
4. **Store your API key securely** - Never commit it to version control

## Next Steps

Now that you've made your first API call, explore:
- Multi-turn conversations
- System prompts for persona customization
- Tool use and function calling

Happy building! 🚀`,
    excerpt: 'Learn how to make your first API call to Claude and build AI-powered applications.',
    author_id: '1',
    category: 'tutorial',
    cover_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    published: true,
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
    author: {
      id: '1',
      full_name: 'Jean-Pierre Habimana',
      avatar_url: null,
    },
  },
  {
    id: '2',
    title: 'Building a Smart Study Assistant with Claude',
    slug: 'building-smart-study-assistant',
    content: `# Building a Smart Study Assistant with Claude

In this project walkthrough, we'll build a study assistant that helps students learn more effectively using Claude's capabilities.

## Project Overview

Our study assistant will:
- Summarize lecture notes
- Generate practice questions
- Explain complex concepts in simple terms
- Create study schedules

## The Architecture

We'll use a simple React frontend with Claude handling the AI logic:

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React UI  │────▶│  Backend    │────▶│  Claude API │
└─────────────┘     └─────────────┘     └─────────────┘
\`\`\`

## Key Features

### 1. Note Summarization

Upload your notes and get concise summaries:

\`\`\`typescript
const summarizeNotes = async (notes: string) => {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: "You are a helpful study assistant. Summarize the following notes clearly and concisely.",
    messages: [{ role: "user", content: notes }]
  });
  return response.content[0].text;
};
\`\`\`

### 2. Practice Question Generation

Generate questions based on your study material to test your understanding.

### 3. Concept Explanation

Don't understand something? Ask Claude to explain it like you're five!

## Lessons Learned

Building this project taught us:
- How to structure prompts for educational content
- The importance of context windows
- Techniques for maintaining conversation history

## Try It Yourself

Clone our repository and start building your own study tools!`,
    excerpt: 'A step-by-step guide to creating an AI-powered study companion for students.',
    author_id: '2',
    category: 'project',
    cover_image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    published: true,
    created_at: '2026-02-08T14:30:00Z',
    updated_at: '2026-02-08T14:30:00Z',
    author: {
      id: '2',
      full_name: 'Marie Uwase',
      avatar_url: null,
    },
  },
  {
    id: '3',
    title: 'CBC-UR Launches First AI Hackathon',
    slug: 'cbc-ur-launches-first-hackathon',
    content: `# CBC-UR Launches First AI Hackathon

We're thrilled to announce that Claude Builder Club at University of Rwanda will be hosting its inaugural AI Hackathon on **April 20-21, 2026**!

## Event Details

**Theme:** AI for Rwandan Communities

**Date:** April 20-21, 2026

**Location:** University of Rwanda, Kigali Campus

**Prizes:**
- 1st Place: $500 + Claude API credits
- 2nd Place: $300 + Claude API credits
- 3rd Place: $200 + Claude API credits

## What to Expect

Over 48 hours, teams of 3-5 students will:
- Build innovative AI solutions for local challenges
- Get mentorship from experienced developers
- Learn from workshops on Claude API and prompt engineering
- Network with fellow AI enthusiasts

## Track Categories

1. **Healthcare** - Solutions for improving healthcare access
2. **Education** - Tools for enhancing learning experiences
3. **Agriculture** - AI applications for farmers
4. **Civic Tech** - Solutions for government and community services

## How to Register

Registration opens on March 1st, 2026. Stay tuned to our social media channels for the registration link!

## Sponsors

We're grateful to Anthropic and our university partners for making this event possible.

See you at the hackathon! 🎉`,
    excerpt: 'Join us for 48 hours of building, learning, and competing with Claude API.',
    author_id: '1',
    category: 'news',
    cover_image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    published: true,
    created_at: '2026-02-05T09:00:00Z',
    updated_at: '2026-02-05T09:00:00Z',
    author: {
      id: '1',
      full_name: 'Jean-Pierre Habimana',
      avatar_url: null,
    },
  },
  {
    id: '4',
    title: 'Understanding Prompt Engineering Fundamentals',
    slug: 'prompt-engineering-fundamentals',
    content: `# Understanding Prompt Engineering Fundamentals

Prompt engineering is the art and science of crafting effective inputs for large language models. In this article, we'll explore the fundamentals that every AI builder should know.

## What is Prompt Engineering?

Prompt engineering involves designing and optimizing the text inputs (prompts) given to AI models to achieve desired outputs. It's a crucial skill for anyone working with Claude or other LLMs.

## Core Principles

### 1. Be Specific and Clear

Bad prompt:
> Write about AI

Good prompt:
> Write a 300-word introduction explaining what artificial intelligence is for high school students, avoiding technical jargon.

### 2. Provide Context

Claude performs better when it understands the situation:

\`\`\`
You are a helpful tutor for computer science students at the University of Rwanda.
Your student is struggling with understanding recursion.
Explain recursion using examples relevant to their background.
\`\`\`

### 3. Use Examples (Few-Shot Learning)

Show Claude what you want:

\`\`\`
Convert the following sentences to formal academic language:

Input: "This stuff is really cool"
Output: "This subject matter is particularly noteworthy"

Input: "The data shows something weird"
Output: [Claude completes this]
\`\`\`

### 4. Structure Your Prompts

Use clear formatting:
- Numbered lists for steps
- Headers for sections
- XML tags for complex inputs

## Advanced Techniques

### Chain of Thought

Ask Claude to think step-by-step:
> "Think through this problem step by step before giving your final answer..."

### Role Assignment

Give Claude a specific persona:
> "You are a senior software engineer reviewing code for security vulnerabilities..."

## Practice Makes Perfect

The best way to improve your prompt engineering skills is through experimentation. Try different approaches and observe what works best for your use cases.

Happy prompting! 📝`,
    excerpt: 'Master the essential techniques for crafting effective prompts for Claude and other LLMs.',
    author_id: '2',
    category: 'tutorial',
    cover_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    published: true,
    created_at: '2026-02-01T16:00:00Z',
    updated_at: '2026-02-01T16:00:00Z',
    author: {
      id: '2',
      full_name: 'Marie Uwase',
      avatar_url: null,
    },
  },
]

export function useArticles(category?: ArticleCategory) {
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchArticles = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    if (!isSupabaseConfigured) {
      let filtered = mockArticles.filter(a => a.published)
      if (category) {
        filtered = filtered.filter(a => a.category === category)
      }
      setArticles(filtered.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ))
      setIsLoading(false)
      return
    }

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          author:members!author_id(id, full_name, avatar_url)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error: fetchError } = await query.abortSignal(abortRef.current.signal)

      if (fetchError) throw fetchError
      setArticles((data as unknown as ArticleWithAuthor[]) || [])
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return
      console.error('Error fetching articles:', err)
      setError('Failed to load articles')
      setArticles(mockArticles.filter(a => a.published))
    } finally {
      setIsLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchArticles()
    return () => { abortRef.current?.abort() }
  }, [fetchArticles])

  return { articles, isLoading, error, refetch: fetchArticles }
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<ArticleWithAuthor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true)
      setError(null)

      if (!isSupabaseConfigured) {
        // Use mock data
        const found = mockArticles.find(a => a.slug === slug && a.published)
        if (found) {
          setArticle(found)
        } else {
          setError('Article not found')
        }
        setIsLoading(false)
        return
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select(`
            *,
            author:members!author_id(id, full_name, avatar_url)
          `)
          .eq('slug', slug)
          .eq('published', true)
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Article not found')
          } else {
            throw fetchError
          }
        } else {
          setArticle(data as unknown as ArticleWithAuthor)
        }
      } catch (err) {
        console.error('Error fetching article:', err)
        setError('Failed to load article')
        // Try mock data fallback
        const found = mockArticles.find(a => a.slug === slug)
        if (found) {
          setArticle(found)
          setError(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug])

  return { article, isLoading, error }
}

export function useUserArticles(authorId: string | undefined) {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserArticles = async () => {
      if (!authorId) {
        setArticles([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      if (!isSupabaseConfigured) {
        // Use mock data filtered by author
        const userArticles = mockArticles
          .filter(a => a.author_id === authorId)
          .map(({ author, ...article }) => article)
        setArticles(userArticles)
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('author_id', authorId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setArticles(data || [])
      } catch (err) {
        console.error('Error fetching user articles:', err)
        setArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserArticles()
  }, [authorId])

  const createArticle = async (input: ArticleInput): Promise<{ success: boolean; error?: string; article?: Article }> => {
    if (!authorId) {
      return { success: false, error: 'Not authenticated' }
    }

    if (!isSupabaseConfigured) {
      // Mock creation
      const newArticle: Article = {
        id: Date.now().toString(),
        ...input,
        excerpt: input.excerpt || null,
        cover_image_url: input.cover_image_url || null,
        published: input.published ?? false,
        author_id: authorId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setArticles(prev => [newArticle, ...prev])
      return { success: true, article: newArticle }
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          ...input,
          author_id: authorId,
        } as any)
        .select()
        .single()

      if (error) throw error

      const article = data as Article
      setArticles(prev => [article, ...prev])
      return { success: true, article }
    } catch (err) {
      console.error('Error creating article:', err)
      return { success: false, error: 'Failed to create article' }
    }
  }

  const updateArticle = async (id: string, input: Partial<ArticleInput>): Promise<{ success: boolean; error?: string }> => {
    if (!authorId) {
      return { success: false, error: 'Not authenticated' }
    }

    if (!isSupabaseConfigured) {
      // Mock update
      setArticles(prev => prev.map(a =>
        a.id === id ? { ...a, ...input, updated_at: new Date().toISOString() } : a
      ))
      return { success: true }
    }

    try {
      const updateData = { ...input, updated_at: new Date().toISOString() }
      const { error } = await (supabase
        .from('articles') as any)
        .update(updateData)
        .eq('id', id)
        .eq('author_id', authorId)

      if (error) throw error

      setArticles(prev => prev.map(a =>
        a.id === id ? { ...a, ...input, updated_at: new Date().toISOString() } : a
      ))
      return { success: true }
    } catch (err) {
      console.error('Error updating article:', err)
      return { success: false, error: 'Failed to update article' }
    }
  }

  const deleteArticle = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!authorId) {
      return { success: false, error: 'Not authenticated' }
    }

    if (!isSupabaseConfigured) {
      // Mock delete
      setArticles(prev => prev.filter(a => a.id !== id))
      return { success: true }
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
        .eq('author_id', authorId)

      if (error) throw error

      setArticles(prev => prev.filter(a => a.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting article:', err)
      return { success: false, error: 'Failed to delete article' }
    }
  }

  return {
    articles,
    isLoading,
    createArticle,
    updateArticle,
    deleteArticle,
  }
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
