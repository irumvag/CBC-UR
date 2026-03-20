-- CBC-UR Supabase Schema
-- Migration 001: Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  linkedin_url text,
  email text,
  image_path text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TYPE event_type AS ENUM ('meetup', 'hackathon', 'workshop', 'demo_day');

CREATE TABLE IF NOT EXISTS events (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  event_type event_type NOT NULL DEFAULT 'meetup',
  registration_url text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- PROJECTS (Showcase)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  author_name text,
  tags text[] DEFAULT '{}',
  github_url text,
  demo_url text,
  image_path text,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- HACKATHONS
-- ============================================================
CREATE TABLE IF NOT EXISTS hackathons (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  tagline text,
  description text,
  date_start date,
  date_end date,
  location text,
  registration_url text,
  prizes jsonb DEFAULT '[]',
  schedule jsonb DEFAULT '[]',
  faq jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- SITE CONTENT (key-value store for dynamic text)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text,
  value_json jsonb,
  section text NOT NULL DEFAULT 'general',
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS links (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  description text,
  icon text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER hackathons_updated_at BEFORE UPDATE ON hackathons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER links_updated_at BEFORE UPDATE ON links FOR EACH ROW EXECUTE FUNCTION update_updated_at();
