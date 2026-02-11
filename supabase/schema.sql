-- Claude Builder Club - University of Rwanda
-- Supabase Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Members table
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  student_id TEXT,
  year_of_study TEXT,
  department TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'lead', 'admin')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('workshop', 'hackathon', 'meetup', 'demo_day')),
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  max_attendees INTEGER,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  category TEXT,
  image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  tech_stack TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project members (many-to-many)
CREATE TABLE project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'contributor',
  PRIMARY KEY (project_id, member_id)
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_is_published ON events(is_published);
CREATE INDEX idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_member_id ON event_rsvps(member_id);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_subscribers_email ON subscribers(email);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access for published events
CREATE POLICY "Public can view published events" ON events
  FOR SELECT USING (is_published = true);

-- Public read access for projects
CREATE POLICY "Public can view projects" ON projects
  FOR SELECT USING (true);

-- Public read access for project members
CREATE POLICY "Public can view project members" ON project_members
  FOR SELECT USING (true);

-- Public read access for approved members (for team displays)
CREATE POLICY "Public can view approved members" ON members
  FOR SELECT USING (status = 'approved');

-- Allow public to insert new members (applications)
CREATE POLICY "Anyone can submit membership application" ON members
  FOR INSERT WITH CHECK (role = 'member' AND status = 'pending');

-- Allow public to subscribe to newsletter
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Allow public to RSVP to events (would need auth in production)
CREATE POLICY "Public can RSVP to events" ON event_rsvps
  FOR INSERT WITH CHECK (true);

-- Sample data for development
-- Uncomment and run if you want sample data

/*
-- Sample members
INSERT INTO members (email, full_name, student_id, year_of_study, department, role, status) VALUES
  ('kaio@ur.ac.rw', 'Kaio Mugisha', '220001234', 'Year 4', 'Computer Science', 'admin', 'approved'),
  ('sandrine@ur.ac.rw', 'Sandrine Niyonzima', '220001235', 'Year 3', 'Information Technology', 'lead', 'approved'),
  ('jean@ur.ac.rw', 'Jean Baptiste K.', '220001236', 'Year 4', 'Software Engineering', 'lead', 'approved'),
  ('grace@ur.ac.rw', 'Grace Uwimana', '220001237', 'Year 3', 'Business Administration', 'lead', 'approved');

-- Sample events
INSERT INTO events (title, description, event_type, date, location, is_published) VALUES
  ('Introduction to Claude AI', 'Learn the fundamentals of Claude AI and discover what makes it unique.', 'workshop', '2026-02-16 14:00:00+02', 'CST Building, Room 201', true),
  ('Prompt Engineering Masterclass', 'Deep dive into advanced prompting techniques to get the best results.', 'workshop', '2026-02-23 14:00:00+02', 'CST Building, Room 201', true),
  ('Build for Rwanda Hackathon', 'Our flagship 24-hour hackathon building AI solutions for Rwanda.', 'hackathon', '2026-04-13 09:00:00+02', 'University Main Hall', true);

-- Sample projects
INSERT INTO projects (title, description, category, tech_stack, is_featured) VALUES
  ('Kigali Health Assistant', 'AI-powered health Q&A for rural clinics in Rwanda.', 'Healthcare', ARRAY['Claude API', 'React', 'Node.js'], true),
  ('Inyarwanda Tutor', 'Interactive Kinyarwanda language learning with Claude.', 'Education', ARRAY['Claude API', 'React', 'Supabase'], true),
  ('AgriSmart Rwanda', 'Farming advice chatbot for local farmers.', 'Chatbots', ARRAY['Claude API', 'WhatsApp API', 'Node.js'], false);
*/
