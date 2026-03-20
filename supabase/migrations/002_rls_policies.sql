-- CBC-UR Supabase RLS Policies
-- Migration 002: Row Level Security

-- Enable RLS on all tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TEAM MEMBERS: Public read (active only), authenticated write
-- ============================================================
CREATE POLICY "Public can read active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- EVENTS: Public read (published only), authenticated write
-- ============================================================
CREATE POLICY "Public can read published events"
  ON events FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated can manage events"
  ON events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- PROJECTS: Public read (published only), authenticated write
-- ============================================================
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- HACKATHONS: Public read (active only), authenticated write
-- ============================================================
CREATE POLICY "Public can read active hackathons"
  ON hackathons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can manage hackathons"
  ON hackathons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- SITE CONTENT: Public read all, authenticated write
-- ============================================================
CREATE POLICY "Public can read site content"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can manage site content"
  ON site_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- LINKS: Public read (active only), authenticated write
-- ============================================================
CREATE POLICY "Public can read active links"
  ON links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can manage links"
  ON links FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
