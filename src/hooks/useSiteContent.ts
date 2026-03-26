import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { SiteContent } from '@/lib/types'

type ContentMap = Record<string, string>

export function useSiteContent(section: string) {
  const [content, setContent] = useState<ContentMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('key, value')
          .eq('section', section)

        if (data) {
          const map: ContentMap = {}
          data.forEach((item: Pick<SiteContent, 'key' | 'value'>) => {
            if (item.value !== null) map[item.key] = item.value
          })
          setContent(map)
        }
      } catch {
        // Silently fail — fallback to hardcoded defaults handled in components
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [section])

  return { content, loading }
}
