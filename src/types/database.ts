// Database types for Supabase tables

export type MemberRole = 'member' | 'lead' | 'admin'
export type MemberStatus = 'pending' | 'approved' | 'rejected'
export type EventType = 'workshop' | 'hackathon' | 'meetup' | 'demo_day'
export type RSVPStatus = 'registered' | 'attended' | 'cancelled'

export interface Member {
  id: string
  email: string
  full_name: string
  student_id: string | null
  year_of_study: string | null
  department: string | null
  bio: string | null
  avatar_url: string | null
  role: MemberRole
  status: MemberStatus
  joined_at: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_type: EventType | null
  date: string
  end_date: string | null
  location: string | null
  max_attendees: number | null
  image_url: string | null
  is_published: boolean
  created_at: string
}

export interface EventRSVP {
  id: string
  event_id: string
  member_id: string
  status: RSVPStatus
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  long_description: string | null
  category: string | null
  image_url: string | null
  github_url: string | null
  demo_url: string | null
  tech_stack: string[] | null
  is_featured: boolean
  created_at: string
}

export interface ProjectMember {
  project_id: string
  member_id: string
  role: string
}

export interface Subscriber {
  id: string
  email: string
  subscribed_at: string
}

// Join types for queries with relations
export interface ProjectWithMembers extends Project {
  project_members: (ProjectMember & { member: Member })[]
}

export interface EventWithRSVPs extends Event {
  event_rsvps: EventRSVP[]
  rsvp_count?: number
}

// Input types for mutations
export interface MemberApplicationInput {
  email: string
  full_name: string
  student_id?: string
  year_of_study?: string
  department?: string
  bio?: string
}

export interface SubscriberInput {
  email: string
}

export interface EventRSVPInput {
  event_id: string
  member_id: string
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      members: {
        Row: Member
        Insert: Omit<Member, 'id' | 'created_at' | 'joined_at'> & {
          id?: string
          created_at?: string
          joined_at?: string
        }
        Update: Partial<Omit<Member, 'id'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Event, 'id'>>
      }
      event_rsvps: {
        Row: EventRSVP
        Insert: Omit<EventRSVP, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<EventRSVP, 'id'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Project, 'id'>>
      }
      project_members: {
        Row: ProjectMember
        Insert: ProjectMember
        Update: Partial<ProjectMember>
      }
      subscribers: {
        Row: Subscriber
        Insert: Omit<Subscriber, 'id' | 'subscribed_at'> & {
          id?: string
          subscribed_at?: string
        }
        Update: Partial<Omit<Subscriber, 'id'>>
      }
    }
  }
}
