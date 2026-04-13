// CBC-UR Database Types

export type EventType = 'meetup' | 'hackathon' | 'workshop' | 'demo_day'

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  linkedin_url: string | null
  email: string | null
  image_path: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  date: string
  end_date: string | null
  location: string | null
  event_type: EventType
  registration_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  author_name: string | null
  tags: string[]
  github_url: string | null
  demo_url: string | null
  image_path: string | null
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface PrizeItem {
  place: string
  amount: string
  description?: string
}

export interface ScheduleItem {
  time: string
  title: string
  description?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface Hackathon {
  id: string
  title: string
  tagline: string | null
  description: string | null
  date_start: string | null
  date_end: string | null
  location: string | null
  registration_url: string | null
  prizes: PrizeItem[]
  schedule: ScheduleItem[]
  faq: FaqItem[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SiteContent {
  id: string
  key: string
  value: string | null
  value_json: Record<string, unknown> | null
  section: string
  updated_at: string
}

export interface Link {
  id: string
  title: string
  url: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CredentialFile {
  id: string
  filename: string
  display_name: string
  row_count: number
  priority: number
  created_at: string
  updated_at: string
}

export interface EmailCredential {
  id: string
  file_id: string
  name: string
  email: string
  password: string
  claimed_at: string | null
  created_at: string
  updated_at: string
}

export interface CredentialWithSource extends EmailCredential {
  credential_file: Pick<CredentialFile, 'display_name' | 'priority'>
}

export interface VerificationResult {
  match: boolean
  confidence: number
  method: 'faceapi' | 'gemini' | 'none'
  error?: string
}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      team_members: {
        Row: TeamMember
        Insert: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      hackathons: {
        Row: Hackathon
        Insert: Omit<Hackathon, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Hackathon, 'id' | 'created_at' | 'updated_at'>>
      }
      site_content: {
        Row: SiteContent
        Insert: Omit<SiteContent, 'id' | 'updated_at'>
        Update: Partial<Omit<SiteContent, 'id' | 'updated_at'>>
      }
      links: {
        Row: Link
        Insert: Omit<Link, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Link, 'id' | 'created_at' | 'updated_at'>>
      }
      credential_files: {
        Row: CredentialFile
        Insert: Omit<CredentialFile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CredentialFile, 'id' | 'created_at' | 'updated_at'>>
      }
      email_credentials: {
        Row: EmailCredential
        Insert: Omit<EmailCredential, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<EmailCredential, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
