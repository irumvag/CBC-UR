import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import type {
  Feature,
  FeatureInput,
  TeamMember,
  TeamMemberInput,
  Partner,
  PartnerInput,
  Milestone,
  SiteStat,
  SiteStatInput,
  SiteContent,
  SiteContentInput,
} from '@/types/database'

// ============================================
// Mock Data (fallback when Supabase is unavailable)
// ============================================

const mockFeatures: Feature[] = [
  {
    id: '1',
    icon: 'book-open',
    title_en: 'Learn AI Development',
    title_rw: 'Wige Iterambere rya AI',
    description_en: 'Master prompt engineering, Claude API integration, and build intelligent applications through hands-on workshops.',
    description_rw: 'Menya ubuhanga bwo gukoresha prompt, gukoresha Claude API, no kubaka porogaramu zifite ubwenge binyuze mu mahugurwa akora ku buryo nyabwo.',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    icon: 'code',
    title_en: 'Build Real Projects',
    title_rw: 'Kora Imishinga Nyayo',
    description_en: 'Work on meaningful projects that solve local challenges in healthcare, education, agriculture, and more.',
    description_rw: "Kora ku mishinga ifite intego ikemura ibibazo by'aho uri mu buzima busanzwe, uburezi, ubuhinzi, n'ibindi.",
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    icon: 'users',
    title_en: 'Connect & Grow',
    title_rw: 'Huza & Kura',
    description_en: "Network with fellow builders, industry professionals, and Anthropic's global community of developers.",
    description_rw: "Huza n'abandi bubatsi, abakozi b'inganda, n'umuryango mpuzamahanga wa Anthropic w'abahanga mu iterambere.",
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    icon: 'presentation',
    title_en: 'Showcase Your Work',
    title_rw: 'Erekana Akazi Kawe',
    description_en: 'Present your projects at demo days, hackathons, and gain recognition for your innovative solutions.',
    description_rw: 'Tanga imishinga yawe mu minsi yo kwerekana, amarushanwa, kandi uhabwe icyubahiro ku bisubizo byawe bishya.',
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jean Paul Mugisha',
    role_en: 'Club President',
    role_rw: "Perezida w'Ishyirahamwe",
    bio_en: 'Computer Science student passionate about AI and its potential to transform Rwanda.',
    bio_rw: "Umunyeshuri wa Computer Science ukunda AI n'ubushobozi bwayo bwo guhindura u Rwanda.",
    image_url: null,
    linkedin_url: null,
    twitter_url: null,
    github_url: null,
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Marie Claire Uwimana',
    role_en: 'Vice President',
    role_rw: 'Visi Perezida',
    bio_en: 'Software Engineering student focused on building AI solutions for healthcare.',
    bio_rw: "Umunyeshuri wa Software Engineering yibanda ku kubaka ibisubizo bya AI mu buzima.",
    image_url: null,
    linkedin_url: null,
    twitter_url: null,
    github_url: null,
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Eric Habimana',
    role_en: 'Technical Lead',
    role_rw: "Umuyobozi w'Ikoranabuhanga",
    bio_en: 'Full-stack developer with experience in machine learning and Claude API integration.',
    bio_rw: "Umunyamwuga wa full-stack ufite uburambe mu kwiga imashini no guhuza Claude API.",
    image_url: null,
    linkedin_url: null,
    twitter_url: null,
    github_url: null,
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Alice Mukamana',
    role_en: 'Events Coordinator',
    role_rw: 'Uhuzabikorwa',
    bio_en: 'Business Administration student managing club activities and community engagement.',
    bio_rw: "Umunyeshuri wa Business Administration uyobora ibikorwa by'ishyirahamwe n'ubufatanye n'abaturage.",
    image_url: null,
    linkedin_url: null,
    twitter_url: null,
    github_url: null,
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Anthropic',
    logo_url: null,
    website_url: 'https://www.anthropic.com',
    description_en: 'AI safety company and creator of Claude, our primary technology partner.',
    description_rw: "Sosiyete y'umutekano wa AI n'uwahanze Claude, umufatanyabikorwa wacu w'ibanze mu ikoranabuhanga.",
    tier: 'platinum',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'University of Rwanda',
    logo_url: null,
    website_url: 'https://ur.ac.rw',
    description_en: 'Our home institution providing space, support, and academic guidance.',
    description_rw: "Kaminuza yacu itanga umwanya, ubufasha, n'ubuyobozi bw'amasomo.",
    tier: 'platinum',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Rwanda ICT Chamber',
    logo_url: null,
    website_url: 'https://ictchamber.rw',
    description_en: 'Supporting tech ecosystem development and connecting us with industry.',
    description_rw: "Gushyigikira iterambere ry'ikoranabuhanga no kuduhuza n'inganda.",
    tier: 'gold',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockMilestones: Milestone[] = [
  {
    id: '1',
    date: '2024-09-01',
    title_en: 'Club Founded',
    title_rw: 'Ishyirahamwe Ryashinzwe',
    description_en: 'CBC-UR was officially established at University of Rwanda.',
    description_rw: "CBC-UR yashinzwe mu buryo bwemewe muri Kaminuza y'u Rwanda.",
    icon: 'flag',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    date: '2024-10-15',
    title_en: 'First Workshop',
    title_rw: 'Ihugurwa rya Mbere',
    description_en: 'Hosted our first Claude API workshop with 50+ attendees.',
    description_rw: 'Twakoreye ihugurwa ryacu rya mbere rya Claude API ririmo abantu 50+.',
    icon: 'users',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    date: '2024-11-20',
    title_en: 'Hackathon Launch',
    title_rw: 'Gutangiza Amarushanwa',
    description_en: 'Organized our first AI hackathon focused on local challenges.',
    description_rw: "Twateguye amarushanwa yacu ya mbere ya AI yibanda ku bibazo by'aho.",
    icon: 'trophy',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    date: '2025-01-10',
    title_en: '100 Members',
    title_rw: 'Abanyamuryango 100',
    description_en: 'Reached 100 active members milestone.',
    description_rw: "Twageze ku ntego y'abanyamuryango 100 bakora.",
    icon: 'star',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockStats: SiteStat[] = [
  { id: '1', key: 'members', value: 120, label_en: 'Active Members', label_rw: 'Abanyamuryango Bakora', icon: 'users', sort_order: 1, is_active: true, updated_at: new Date().toISOString() },
  { id: '2', key: 'projects', value: 25, label_en: 'Projects Built', label_rw: 'Imishinga Yakozwe', icon: 'folder-kanban', sort_order: 2, is_active: true, updated_at: new Date().toISOString() },
  { id: '3', key: 'workshops', value: 15, label_en: 'Workshops Held', label_rw: 'Amahugurwa Yakorewe', icon: 'presentation', sort_order: 3, is_active: true, updated_at: new Date().toISOString() },
  { id: '4', key: 'partners', value: 8, label_en: 'Industry Partners', label_rw: 'Abo Dufatanya', icon: 'handshake', sort_order: 4, is_active: true, updated_at: new Date().toISOString() },
]

// ============================================
// Features Hook
// ============================================
export function useFeatures() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)
  const { i18n } = useTranslation()

  const fetchFeatures = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('features')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (fetchError) throw fetchError
      setFeatures(data || mockFeatures)
    } catch {
      console.warn('Using mock features data')
      setFeatures(mockFeatures)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeatures()
  }, [fetchFeatures])

  // Get localized feature data
  const getLocalizedFeatures = useCallback(() => {
    const lang = i18n.language
    return features.map((f) => ({
      ...f,
      title: lang === 'rw' && f.title_rw ? f.title_rw : f.title_en,
      description: lang === 'rw' && f.description_rw ? f.description_rw : f.description_en,
    }))
  }, [features, i18n.language])

  return { features, localizedFeatures: getLocalizedFeatures(), loading, error, refetch: fetchFeatures }
}

// Admin hook with CRUD operations
export function useAdminFeatures() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeatures = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('features')
        .select('*')
        .order('sort_order')

      if (fetchError) throw fetchError
      setFeatures(data || [])
    } catch {
      console.warn('Using mock features data for admin')
      setFeatures(mockFeatures)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeatures()
  }, [fetchFeatures])

  const createFeature = async (input: FeatureInput) => {
    try {
      const { data, error: createError } = await (supabase
        .from('features') as any)
        .insert(input)
        .select()
        .single()

      if (createError) throw createError
      setFeatures((prev) => [...prev, data])
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create feature'
      setError(message)
      return { success: false, error: message }
    }
  }

  const updateFeature = async (id: string, input: Partial<FeatureInput>) => {
    try {
      const { data, error: updateError } = await (supabase
        .from('features') as any)
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      setFeatures((prev) => prev.map((f) => (f.id === id ? data : f)))
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update feature'
      setError(message)
      return { success: false, error: message }
    }
  }

  const deleteFeature = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('features').delete().eq('id', id)

      if (deleteError) throw deleteError
      setFeatures((prev) => prev.filter((f) => f.id !== id))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete feature'
      setError(message)
      return { success: false, error: message }
    }
  }

  return { features, loading, error, refetch: fetchFeatures, createFeature, updateFeature, deleteFeature }
}

// ============================================
// Team Members Hook
// ============================================
export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error
      setTeamMembers(data || mockTeamMembers)
    } catch {
      setTeamMembers(mockTeamMembers)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  const getLocalizedTeamMembers = useCallback(() => {
    const lang = i18n.language
    return teamMembers.map((m) => ({
      ...m,
      role: lang === 'rw' && m.role_rw ? m.role_rw : m.role_en,
      bio: lang === 'rw' && m.bio_rw ? m.bio_rw : m.bio_en,
    }))
  }, [teamMembers, i18n.language])

  return { teamMembers, localizedTeamMembers: getLocalizedTeamMembers(), loading, refetch: fetchTeamMembers }
}

export function useAdminTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order')

      if (fetchError) throw fetchError
      setTeamMembers(data || [])
    } catch {
      setTeamMembers(mockTeamMembers)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  const createTeamMember = async (input: TeamMemberInput) => {
    try {
      const { data, error: createError } = await (supabase
        .from('team_members') as any)
        .insert(input)
        .select()
        .single()

      if (createError) throw createError
      setTeamMembers((prev) => [...prev, data])
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create team member'
      setError(message)
      return { success: false, error: message }
    }
  }

  const updateTeamMember = async (id: string, input: Partial<TeamMemberInput>) => {
    try {
      const { data, error: updateError } = await (supabase
        .from('team_members') as any)
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      setTeamMembers((prev) => prev.map((m) => (m.id === id ? data : m)))
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update team member'
      setError(message)
      return { success: false, error: message }
    }
  }

  const deleteTeamMember = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('team_members').delete().eq('id', id)

      if (deleteError) throw deleteError
      setTeamMembers((prev) => prev.filter((m) => m.id !== id))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete team member'
      setError(message)
      return { success: false, error: message }
    }
  }

  return { teamMembers, loading, error, refetch: fetchTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember }
}

// ============================================
// Partners Hook
// ============================================
export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()

  const fetchPartners = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('tier')
        .order('sort_order')

      if (error) throw error
      setPartners(data || mockPartners)
    } catch {
      setPartners(mockPartners)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  const getLocalizedPartners = useCallback(() => {
    const lang = i18n.language
    return partners.map((p) => ({
      ...p,
      description: lang === 'rw' && p.description_rw ? p.description_rw : p.description_en,
    }))
  }, [partners, i18n.language])

  return { partners, localizedPartners: getLocalizedPartners(), loading, refetch: fetchPartners }
}

export function useAdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartners = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('partners')
        .select('*')
        .order('tier')
        .order('sort_order')

      if (fetchError) throw fetchError
      setPartners(data || [])
    } catch {
      setPartners(mockPartners)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  const createPartner = async (input: PartnerInput) => {
    try {
      const { data, error: createError } = await (supabase
        .from('partners') as any)
        .insert(input)
        .select()
        .single()

      if (createError) throw createError
      setPartners((prev) => [...prev, data])
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create partner'
      setError(message)
      return { success: false, error: message }
    }
  }

  const updatePartner = async (id: string, input: Partial<PartnerInput>) => {
    try {
      const { data, error: updateError } = await (supabase
        .from('partners') as any)
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      setPartners((prev) => prev.map((p) => (p.id === id ? data : p)))
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update partner'
      setError(message)
      return { success: false, error: message }
    }
  }

  const deletePartner = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('partners').delete().eq('id', id)

      if (deleteError) throw deleteError
      setPartners((prev) => prev.filter((p) => p.id !== id))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete partner'
      setError(message)
      return { success: false, error: message }
    }
  }

  return { partners, loading, error, refetch: fetchPartners, createPartner, updatePartner, deletePartner }
}

// ============================================
// Milestones Hook
// ============================================
export function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()

  const fetchMilestones = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true })

      if (error) throw error
      setMilestones(data || mockMilestones)
    } catch {
      setMilestones(mockMilestones)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMilestones()
  }, [fetchMilestones])

  const getLocalizedMilestones = useCallback(() => {
    const lang = i18n.language
    return milestones.map((m) => ({
      ...m,
      title: lang === 'rw' && m.title_rw ? m.title_rw : m.title_en,
      description: lang === 'rw' && m.description_rw ? m.description_rw : m.description_en,
    }))
  }, [milestones, i18n.language])

  return { milestones, localizedMilestones: getLocalizedMilestones(), loading, refetch: fetchMilestones }
}

// ============================================
// Site Stats Hook
// ============================================
export function useSiteStats() {
  const [stats, setStats] = useState<SiteStat[]>([])
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error
      setStats(data || mockStats)
    } catch {
      setStats(mockStats)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const getLocalizedStats = useCallback(() => {
    const lang = i18n.language
    return stats.map((s) => ({
      ...s,
      label: lang === 'rw' && s.label_rw ? s.label_rw : s.label_en,
    }))
  }, [stats, i18n.language])

  return { stats, localizedStats: getLocalizedStats(), loading, refetch: fetchStats }
}

export function useAdminStats() {
  const [stats, setStats] = useState<SiteStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('site_stats')
        .select('*')
        .order('sort_order')

      if (fetchError) throw fetchError
      setStats(data || [])
    } catch {
      setStats(mockStats)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const updateStat = async (id: string, input: Partial<SiteStatInput>) => {
    try {
      const { data, error: updateError } = await (supabase
        .from('site_stats') as any)
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      setStats((prev) => prev.map((s) => (s.id === id ? data : s)))
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update stat'
      setError(message)
      return { success: false, error: message }
    }
  }

  return { stats, loading, error, refetch: fetchStats, updateStat }
}

// ============================================
// Site Content Hook (for translations)
// ============================================
export function useSiteContent(category?: string) {
  const [content, setContent] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()

  const fetchContent = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase.from('site_content').select('*')
      if (category) {
        query = query.eq('category', category)
      }
      const { data, error } = await query

      if (error) throw error
      setContent(data || [])
    } catch {
      setContent([])
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  // Get content value by key for current language
  const getContent = useCallback(
    (key: string, fallback?: string) => {
      const lang = i18n.language
      const item = content.find((c) => c.key === key && c.language === lang)
      if (item) return item.value
      // Fallback to English
      const enItem = content.find((c) => c.key === key && c.language === 'en')
      return enItem?.value || fallback || key
    },
    [content, i18n.language]
  )

  return { content, loading, getContent, refetch: fetchContent }
}

export function useAdminSiteContent() {
  const [content, setContent] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('site_content')
        .select('*')
        .order('category')
        .order('key')

      if (fetchError) throw fetchError
      setContent(data || [])
    } catch {
      setContent([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const upsertContent = async (input: SiteContentInput) => {
    try {
      const { data, error: upsertError } = await (supabase
        .from('site_content') as any)
        .upsert(input, { onConflict: 'key,language' })
        .select()
        .single()

      if (upsertError) throw upsertError
      setContent((prev) => {
        const exists = prev.find((c) => c.key === input.key && c.language === input.language)
        if (exists) {
          return prev.map((c) => (c.key === input.key && c.language === input.language ? data : c))
        }
        return [...prev, data]
      })
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save content'
      setError(message)
      return { success: false, error: message }
    }
  }

  const deleteContent = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('site_content').delete().eq('id', id)

      if (deleteError) throw deleteError
      setContent((prev) => prev.filter((c) => c.id !== id))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete content'
      setError(message)
      return { success: false, error: message }
    }
  }

  return { content, loading, error, refetch: fetchContent, upsertContent, deleteContent }
}
