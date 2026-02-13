-- Migration: Site Content Tables
-- Description: Tables for storing translatable site content, features, team members, and partners

-- ============================================
-- Site Content (Translations/CMS)
-- ============================================
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  value TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(key, language)
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view site content"
  ON site_content FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admins can manage site content"
  ON site_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- ============================================
-- Features Section
-- ============================================
CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'star',
  title_en TEXT NOT NULL,
  title_rw TEXT,
  description_en TEXT NOT NULL,
  description_rw TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

-- Public read access for active features
CREATE POLICY "Anyone can view active features"
  ON features FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage features"
  ON features FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- ============================================
-- Team Members
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_rw TEXT,
  bio_en TEXT,
  bio_rw TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  github_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Public read access for active team members
CREATE POLICY "Anyone can view active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- ============================================
-- Partners
-- ============================================
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description_en TEXT,
  description_rw TEXT,
  tier TEXT DEFAULT 'partner' CHECK (tier IN ('platinum', 'gold', 'silver', 'partner')),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public read access for active partners
CREATE POLICY "Anyone can view active partners"
  ON partners FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage partners"
  ON partners FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- ============================================
-- Timeline/Milestones
-- ============================================
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  title_en TEXT NOT NULL,
  title_rw TEXT,
  description_en TEXT,
  description_rw TEXT,
  icon TEXT DEFAULT 'star',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view active milestones"
  ON milestones FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage milestones"
  ON milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- ============================================
-- Stats/Counters
-- ============================================
CREATE TABLE IF NOT EXISTS site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value INTEGER DEFAULT 0,
  label_en TEXT NOT NULL,
  label_rw TEXT,
  icon TEXT DEFAULT 'activity',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view site stats"
  ON site_stats FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage site stats"
  ON site_stats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_site_content_key_lang ON site_content(key, language);
CREATE INDEX IF NOT EXISTS idx_site_content_category ON site_content(category);
CREATE INDEX IF NOT EXISTS idx_features_sort ON features(sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_team_members_sort ON team_members(sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_partners_tier ON partners(tier, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_milestones_date ON milestones(date) WHERE is_active = true;

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_features_updated_at ON features;
CREATE TRIGGER update_features_updated_at
  BEFORE UPDATE ON features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_milestones_updated_at ON milestones;
CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_stats_updated_at ON site_stats;
CREATE TRIGGER update_site_stats_updated_at
  BEFORE UPDATE ON site_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
