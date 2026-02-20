-- ============================================
-- CBC-UR Complete Database Setup
-- Run this in Supabase SQL Editor to set up everything
-- ============================================

-- ============================================
-- PART 1: DROP EXISTING POLICIES (to avoid conflicts)
-- ============================================

-- Members policies
DROP POLICY IF EXISTS "Public can view approved members" ON members;
DROP POLICY IF EXISTS "Users can view own profile" ON members;
DROP POLICY IF EXISTS "Users can create own profile" ON members;
DROP POLICY IF EXISTS "Users can update own profile" ON members;
DROP POLICY IF EXISTS "Users can delete own profile" ON members;
DROP POLICY IF EXISTS "Admins can manage all members" ON members;
DROP POLICY IF EXISTS "Allow new member signup" ON members;

-- Events policies
DROP POLICY IF EXISTS "Public can view published events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Admins and leads can manage all events" ON events;

-- Event RSVPs policies
DROP POLICY IF EXISTS "Users can view own RSVPs" ON event_rsvps;
DROP POLICY IF EXISTS "Users can RSVP to events" ON event_rsvps;
DROP POLICY IF EXISTS "Users can update own RSVPs" ON event_rsvps;
DROP POLICY IF EXISTS "Users can delete own RSVPs" ON event_rsvps;
DROP POLICY IF EXISTS "Admins can view all RSVPs" ON event_rsvps;

-- Projects policies
DROP POLICY IF EXISTS "Public can view projects" ON projects;
DROP POLICY IF EXISTS "Project owners can update" ON projects;
DROP POLICY IF EXISTS "Project owners can delete" ON projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage all projects" ON projects;

-- Project members policies
DROP POLICY IF EXISTS "Public can view project members" ON project_members;
DROP POLICY IF EXISTS "Project owners can manage members" ON project_members;

-- Subscribers policies
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON subscribers;

-- Site content policies
DROP POLICY IF EXISTS "Anyone can view site content" ON site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON site_content;

-- Features policies
DROP POLICY IF EXISTS "Anyone can view active features" ON features;
DROP POLICY IF EXISTS "Admins can manage features" ON features;

-- Team members policies
DROP POLICY IF EXISTS "Anyone can view active team members" ON team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;

-- Partners policies
DROP POLICY IF EXISTS "Anyone can view active partners" ON partners;
DROP POLICY IF EXISTS "Admins can manage partners" ON partners;

-- Milestones policies
DROP POLICY IF EXISTS "Anyone can view active milestones" ON milestones;
DROP POLICY IF EXISTS "Admins can manage milestones" ON milestones;

-- Site stats policies
DROP POLICY IF EXISTS "Anyone can view site stats" ON site_stats;
DROP POLICY IF EXISTS "Admins can manage site stats" ON site_stats;

-- ============================================
-- PART 2: CREATE NEW RLS POLICIES
-- ============================================

-- MEMBERS POLICIES --

-- Anyone can view approved members (for public team displays)
CREATE POLICY "Public can view approved members" ON members
  FOR SELECT USING (status = 'approved');

-- Users can view their own profile regardless of status
CREATE POLICY "Users can view own profile" ON members
  FOR SELECT USING (auth.uid() = id);

-- Allow new user signup (member id = auth user id)
CREATE POLICY "Allow new member signup" ON members
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON members
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM members WHERE id = auth.uid())  -- Can't change own role
    AND status = (SELECT status FROM members WHERE id = auth.uid())  -- Can't change own status
  );

-- Admins and leads can view and manage ALL members
CREATE POLICY "Admins can manage all members" ON members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members m
      WHERE m.id = auth.uid()
      AND m.role IN ('admin', 'lead')
    )
  );

-- EVENTS POLICIES --

-- Public can view published events
CREATE POLICY "Public can view published events" ON events
  FOR SELECT USING (is_published = true);

-- Admins and leads can manage ALL events (including unpublished)
CREATE POLICY "Admins and leads can manage all events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- EVENT RSVPS POLICIES --

-- Users can view their own RSVPs
CREATE POLICY "Users can view own RSVPs" ON event_rsvps
  FOR SELECT USING (auth.uid() = member_id);

-- Users can RSVP to events
CREATE POLICY "Users can RSVP to events" ON event_rsvps
  FOR INSERT WITH CHECK (auth.uid() = member_id);

-- Users can update their own RSVPs
CREATE POLICY "Users can update own RSVPs" ON event_rsvps
  FOR UPDATE USING (auth.uid() = member_id);

-- Users can cancel their own RSVPs
CREATE POLICY "Users can delete own RSVPs" ON event_rsvps
  FOR DELETE USING (auth.uid() = member_id);

-- Admins can view all RSVPs for event management
CREATE POLICY "Admins can view all RSVPs" ON event_rsvps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- PROJECTS POLICIES --

-- Public can view all projects
CREATE POLICY "Public can view projects" ON projects
  FOR SELECT USING (true);

-- Authenticated users can create projects
CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Project owners can update their projects
CREATE POLICY "Project owners can update" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.member_id = auth.uid()
      AND project_members.role = 'owner'
    )
  );

-- Project owners can delete their projects
CREATE POLICY "Project owners can delete" ON projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.member_id = auth.uid()
      AND project_members.role = 'owner'
    )
  );

-- Admins can manage all projects
CREATE POLICY "Admins can manage all projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- PROJECT MEMBERS POLICIES --

-- Public can view project members
CREATE POLICY "Public can view project members" ON project_members
  FOR SELECT USING (true);

-- Project owners can manage members
CREATE POLICY "Project owners can manage members" ON project_members
  FOR ALL USING (
    member_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.member_id = auth.uid()
      AND pm.role = 'owner'
    )
  );

-- SUBSCRIBERS POLICIES --

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Admins can view all subscribers
CREATE POLICY "Admins can view subscribers" ON subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- SITE CONTENT POLICIES --

-- Anyone can read site content
CREATE POLICY "Anyone can view site content" ON site_content
  FOR SELECT USING (true);

-- Admins can manage site content
CREATE POLICY "Admins can manage site content" ON site_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- FEATURES POLICIES --

-- Anyone can view active features
CREATE POLICY "Anyone can view active features" ON features
  FOR SELECT USING (is_active = true);

-- Admins can manage features
CREATE POLICY "Admins can manage features" ON features
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- TEAM MEMBERS POLICIES --

-- Anyone can view active team members
CREATE POLICY "Anyone can view active team members" ON team_members
  FOR SELECT USING (is_active = true);

-- Admins can manage team members
CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- PARTNERS POLICIES --

-- Anyone can view active partners
CREATE POLICY "Anyone can view active partners" ON partners
  FOR SELECT USING (is_active = true);

-- Admins can manage partners
CREATE POLICY "Admins can manage partners" ON partners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- MILESTONES POLICIES --

-- Anyone can view active milestones
CREATE POLICY "Anyone can view active milestones" ON milestones
  FOR SELECT USING (is_active = true);

-- Admins can manage milestones
CREATE POLICY "Admins can manage milestones" ON milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- SITE STATS POLICIES --

-- Anyone can view site stats
CREATE POLICY "Anyone can view site stats" ON site_stats
  FOR SELECT USING (is_active = true);

-- Admins can manage site stats
CREATE POLICY "Admins can manage site stats" ON site_stats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role IN ('admin', 'lead')
    )
  );

-- ============================================
-- PART 3: SEED DATA - Features
-- ============================================

INSERT INTO features (icon, title_en, title_rw, description_en, description_rw, sort_order, is_active) VALUES
('book-open', 'Learn AI Development', 'Wige Iterambere rya AI', 'Master prompt engineering, Claude API integration, and build intelligent applications through hands-on workshops.', 'Menya ubuhanga bwo gukoresha prompt, gukoresha Claude API, no kubaka porogaramu zifite ubwenge binyuze mu mahugurwa akora ku buryo nyabwo.', 1, true),
('code', 'Build Real Projects', 'Kora Imishinga Nyayo', 'Work on meaningful projects that solve local challenges in healthcare, education, agriculture, and more.', 'Kora ku mishinga ifite intego ikemura ibibazo by''aho uri mu buzima busanzwe, uburezi, ubuhinzi, n''ibindi.', 2, true),
('users', 'Connect & Grow', 'Huza & Kura', 'Network with fellow builders, industry professionals, and Anthropic''s global community of developers.', 'Huza n''abandi bubatsi, abakozi b''inganda, n''umuryango mpuzamahanga wa Anthropic w''abahanga mu iterambere.', 3, true),
('presentation', 'Showcase Your Work', 'Erekana Akazi Kawe', 'Present your projects at demo days, hackathons, and gain recognition for your innovative solutions.', 'Tanga imishinga yawe mu minsi yo kwerekana, amarushanwa, kandi uhabwe icyubahiro ku bisubizo byawe bishya.', 4, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 4: SEED DATA - Team Members
-- ============================================

INSERT INTO team_members (name, role_en, role_rw, bio_en, bio_rw, image_url, linkedin_url, github_url, sort_order, is_active) VALUES
('Jean Paul Mugisha', 'Club President', 'Perezida w''Ishyirahamwe', 'Computer Science student passionate about AI and its potential to transform Rwanda.', 'Umunyeshuri wa Computer Science ukunda AI n''ubushobozi bwayo bwo guhindura u Rwanda.', NULL, NULL, NULL, 1, true),
('Marie Claire Uwimana', 'Vice President', 'Visi Perezida', 'Software Engineering student focused on building AI solutions for healthcare.', 'Umunyeshuri wa Software Engineering yibanda ku kubaka ibisubizo bya AI mu buzima.', NULL, NULL, NULL, 2, true),
('Eric Habimana', 'Technical Lead', 'Umuyobozi w''Ikoranabuhanga', 'Full-stack developer with experience in machine learning and Claude API integration.', 'Umunyamwuga wa full-stack ufite uburambe mu kwiga imashini no guhuza Claude API.', NULL, NULL, NULL, 3, true),
('Alice Mukamana', 'Events Coordinator', 'Uhuzabikorwa', 'Business Administration student managing club activities and community engagement.', 'Umunyeshuri wa Business Administration uyobora ibikorwa by''ishyirahamwe n''ubufatanye n''abaturage.', NULL, NULL, NULL, 4, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 5: SEED DATA - Partners
-- ============================================

INSERT INTO partners (name, logo_url, website_url, description_en, description_rw, tier, sort_order, is_active) VALUES
('Anthropic', 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg', 'https://www.anthropic.com', 'AI safety company and creator of Claude, our primary technology partner.', 'Sosiyete y''umutekano wa AI n''uwahanze Claude, umufatanyabikorwa wacu w''ibanze mu ikoranabuhanga.', 'platinum', 1, true),
('University of Rwanda', 'https://ur.ac.rw/spip/sites/default/files/ur_logo_0.png', 'https://ur.ac.rw', 'Our home institution providing space, support, and academic guidance.', 'Kaminuza yacu itanga umwanya, ubufasha, n''ubuyobozi bw''amasomo.', 'platinum', 2, true),
('Rwanda ICT Chamber', NULL, 'https://ictchamber.rw', 'Supporting tech ecosystem development and connecting us with industry.', 'Gushyigikira iterambere ry''ikoranabuhanga no kuduhuza n''inganda.', 'gold', 3, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 6: SEED DATA - Milestones
-- ============================================

INSERT INTO milestones (date, title_en, title_rw, description_en, description_rw, icon, is_active) VALUES
('2024-09-01', 'Club Founded', 'Ishyirahamwe Ryashinzwe', 'CBC-UR was officially established at University of Rwanda.', 'CBC-UR yashinzwe mu buryo bwemewe muri Kaminuza y''u Rwanda.', 'flag', true),
('2024-10-15', 'First Workshop', 'Ihugurwa rya Mbere', 'Hosted our first Claude API workshop with 50+ attendees.', 'Twakoreye ihugurwa ryacu rya mbere rya Claude API ririmo abantu 50+.', 'users', true),
('2024-11-20', 'Hackathon Launch', 'Gutangiza Amarushanwa', 'Organized our first AI hackathon focused on local challenges.', 'Twateguye amarushanwa yacu ya mbere ya AI yibanda ku bibazo by''aho.', 'trophy', true),
('2025-01-10', '100 Members', 'Abanyamuryango 100', 'Reached 100 active members milestone.', 'Twageze ku ntego y''abanyamuryango 100 bakora.', 'star', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 7: SEED DATA - Site Stats
-- ============================================

INSERT INTO site_stats (key, value, label_en, label_rw, icon, sort_order, is_active) VALUES
('members', 120, 'Active Members', 'Abanyamuryango Bakora', 'users', 1, true),
('projects', 25, 'Projects Built', 'Imishinga Yakozwe', 'folder-kanban', 2, true),
('workshops', 15, 'Workshops Held', 'Amahugurwa Yakorewe', 'presentation', 3, true),
('partners', 8, 'Industry Partners', 'Abo Dufatanya', 'handshake', 4, true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  label_en = EXCLUDED.label_en,
  label_rw = EXCLUDED.label_rw,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- ============================================
-- PART 8: SEED DATA - Site Content (Translations)
-- ============================================

INSERT INTO site_content (key, language, value, category) VALUES
-- Hero Section
('hero.tagline', 'en', 'AI Builders Community', 'home'),
('hero.tagline', 'rw', 'Umuryango w''Abubatsi ba AI', 'home'),
('hero.title', 'en', 'Build the future with Claude AI', 'home'),
('hero.title', 'rw', 'Kubaka ejo hazaza na Claude AI', 'home'),
('hero.subtitle', 'en', 'Join Rwanda''s first Claude Builder Club. Learn AI development, collaborate on impactful projects, and be part of a vibrant community of innovators at University of Rwanda.', 'home'),
('hero.subtitle', 'rw', 'Injira muri Claude Builder Club ya mbere mu Rwanda. Wige iterambere rya AI, ufatanye ku mishinga ifite akamaro, kandi ube igice cy''umuryango w''abahinduye ibintu muri Kaminuza y''u Rwanda.', 'home'),
('hero.cta', 'en', 'Join Now', 'home'),
('hero.cta', 'rw', 'Injira Nonaha', 'home'),
('hero.secondaryCta', 'en', 'Learn More', 'home'),
('hero.secondaryCta', 'rw', 'Menya Byinshi', 'home'),

-- CTA Section
('cta.title', 'en', 'Ready to Start Building?', 'home'),
('cta.title', 'rw', 'Witeguye Gutangira Kubaka?', 'home'),
('cta.subtitle', 'en', 'Join Claude Builder Club and be part of Rwanda''s AI innovation community. Whether you''re a beginner or experienced developer, there''s a place for you.', 'home'),
('cta.subtitle', 'rw', 'Injira muri Claude Builder Club ube igice cy''umuryango w''ibishya bya AI mu Rwanda. Niba uri umutangizi cyangwa umuhanga mu iterambere, hari umwanya wawe.', 'home'),
('cta.button', 'en', 'Apply for Membership', 'home'),
('cta.button', 'rw', 'Saba Kuba Umunyamuryango', 'home'),

-- About Section Headers
('about.tagline', 'en', 'About Us', 'about'),
('about.tagline', 'rw', 'Ibyerekeye', 'about'),
('about.title', 'en', 'Empowering Rwanda''s AI Builders', 'about'),
('about.title', 'rw', 'Guha Imbaraga Abubatsi ba AI mu Rwanda', 'about'),
('about.subtitle', 'en', 'Claude Builder Club at University of Rwanda is a student-led community dedicated to learning, building, and innovating with AI technology.', 'about'),
('about.subtitle', 'rw', 'Claude Builder Club muri Kaminuza y''u Rwanda ni umuryango uyobowe n''abanyeshuri wiyemeje kwiga, kubaka, no guhindura ibintu ukoresheje ikoranabuhanga rya AI.', 'about'),

-- Mission
('mission.tagline', 'en', 'Our Mission', 'about'),
('mission.tagline', 'rw', 'Intego Yacu', 'about'),
('mission.title', 'en', 'Why We Exist', 'about'),
('mission.title', 'rw', 'Impamvu Turiho', 'about'),
('mission.description', 'en', 'We believe every student deserves access to cutting-edge AI education and the opportunity to build solutions that matter. Our mission is to create a supportive environment where curious minds can explore AI technology, develop practical skills, and create impact in their communities.', 'about'),
('mission.description', 'rw', 'Twizera ko buri munyeshuri akwiye kubona uburezi bwa AI bugezweho n''amahirwe yo kubaka ibisubizo bifite akamaro. Intego yacu ni ugushiraho ibidukikije bishyigikira aho ubwenge bushakashaka bushobora gushakisha ikoranabuhanga rya AI, gukura ubuhanga nyabwo, no guhanga ingaruka mu miryango yabo.', 'about'),

-- Vision
('vision.title', 'en', 'Our Vision', 'about'),
('vision.title', 'rw', 'Icyerekezo Cyacu', 'about'),
('vision.description', 'en', 'To be the leading student AI community in East Africa, producing innovative solutions and skilled AI practitioners who drive positive change.', 'about'),
('vision.description', 'rw', 'Kuba umuryango w''abanyeshuri ba AI uyobora muri Afurika y''Iburasirazuba, utanga ibisubizo bishya n''abahanga ba AI bakora impinduka nziza.', 'about'),

-- Footer
('footer.copyright', 'en', '© 2026 Claude Builder Club — University of Rwanda', 'footer'),
('footer.copyright', 'rw', '© 2026 Claude Builder Club — Kaminuza y''u Rwanda', 'footer'),
('footer.builtWith', 'en', 'Built with curiosity and Claude', 'footer'),
('footer.builtWith', 'rw', 'Byubatswe n''ubushakashaka na Claude', 'footer')
ON CONFLICT (key, language) DO UPDATE SET
  value = EXCLUDED.value,
  category = EXCLUDED.category;

-- ============================================
-- PART 9: SEED DATA - Events
-- ============================================

INSERT INTO events (title, description, event_type, date, end_date, location, max_attendees, image_url, is_published) VALUES
('Introduction to Claude AI', 'Learn the fundamentals of Claude AI and discover what makes it unique. This hands-on workshop will cover prompt engineering basics and your first API calls.', 'workshop', '2026-02-25 14:00:00+02', '2026-02-25 17:00:00+02', 'CST Building, Room 201', 30, NULL, true),
('Prompt Engineering Masterclass', 'Deep dive into advanced prompting techniques. Learn chain-of-thought prompting, few-shot learning, and how to get consistent, high-quality outputs.', 'workshop', '2026-03-05 14:00:00+02', '2026-03-05 17:00:00+02', 'CST Building, Room 201', 25, NULL, true),
('Build for Rwanda Hackathon', 'Our flagship 24-hour hackathon building AI solutions for Rwanda. Form teams, build prototypes, and compete for prizes!', 'hackathon', '2026-04-15 09:00:00+02', '2026-04-16 18:00:00+02', 'University Main Hall', 100, NULL, true),
('Monthly Meetup: AI in Healthcare', 'Join us for our monthly meetup where we discuss AI applications in healthcare. Network with fellow builders and share your projects.', 'meetup', '2026-03-20 17:00:00+02', '2026-03-20 19:00:00+02', 'Student Center', 50, NULL, true),
('Project Demo Day', 'Showcase your AI projects to the community, industry professionals, and potential partners. Get feedback and recognition for your work.', 'demo_day', '2026-05-10 14:00:00+02', '2026-05-10 18:00:00+02', 'Conference Hall', 75, NULL, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 10: SEED DATA - Projects
-- ============================================

INSERT INTO projects (title, description, long_description, category, image_url, github_url, demo_url, tech_stack, is_featured) VALUES
('Kigali Health Assistant', 'AI-powered health Q&A system designed for rural clinics in Rwanda', 'A comprehensive health assistant that helps rural healthcare workers provide better care. It can answer medical questions, suggest treatment protocols, and help with patient triage - all in Kinyarwanda and English.', 'Healthcare', NULL, 'https://github.com/cbc-ur/kigali-health', 'https://kigali-health.demo.com', ARRAY['Claude API', 'React', 'Node.js', 'Supabase'], true),
('Inyarwanda Tutor', 'Interactive Kinyarwanda language learning powered by Claude AI', 'An AI-powered language learning platform that helps users learn Kinyarwanda through conversation, grammar exercises, and cultural context. Features voice input and personalized learning paths.', 'Education', NULL, 'https://github.com/cbc-ur/inyarwanda-tutor', 'https://inyarwanda.demo.com', ARRAY['Claude API', 'Next.js', 'Supabase', 'Web Speech API'], true),
('AgriSmart Rwanda', 'AI chatbot providing farming advice to local farmers', 'A WhatsApp-based chatbot that provides agricultural advice to farmers. It can identify plant diseases from photos, suggest crop rotation, and provide weather-based farming tips.', 'Agriculture', NULL, 'https://github.com/cbc-ur/agrismart', NULL, ARRAY['Claude API', 'WhatsApp API', 'Node.js', 'Python'], true),
('StudyBuddy UR', 'AI study companion for University of Rwanda students', 'A study assistant that helps UR students with coursework. It can explain concepts, generate practice questions, and create study schedules based on exam dates.', 'Education', NULL, 'https://github.com/cbc-ur/studybuddy', 'https://studybuddy-ur.demo.com', ARRAY['Claude API', 'React', 'Supabase', 'TailwindCSS'], false),
('RwandaJobs AI', 'AI-powered job matching for Rwandan graduates', 'A platform that uses AI to match recent graduates with job opportunities based on their skills, education, and career goals. Features resume analysis and interview preparation.', 'Employment', NULL, 'https://github.com/cbc-ur/rwanda-jobs', NULL, ARRAY['Claude API', 'Python', 'FastAPI', 'PostgreSQL'], false),
('Traffic Flow Kigali', 'AI analysis of traffic patterns in Kigali', 'Analyzes traffic camera data and social media reports to predict traffic congestion and suggest optimal routes. Helps city planners make data-driven decisions.', 'Smart City', NULL, 'https://github.com/cbc-ur/traffic-flow', NULL, ARRAY['Claude API', 'Python', 'Computer Vision', 'React'], false)
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
-- Your database is now set up with:
-- ✓ Proper RLS policies for all tables
-- ✓ Features section content
-- ✓ Team members
-- ✓ Partners
-- ✓ Milestones/Timeline
-- ✓ Site statistics
-- ✓ Site content translations (EN/RW)
-- ✓ Sample events
-- ✓ Sample projects
--
-- NEXT STEPS:
-- 1. Go to Authentication > Users and create your admin account
-- 2. Copy the user's UUID from the Supabase dashboard
-- 3. Run this SQL to create your admin member record:
--
-- INSERT INTO members (id, email, full_name, role, status)
-- VALUES (
--   'YOUR-USER-UUID-HERE',  -- Replace with actual UUID
--   'your-email@example.com',
--   'Your Name',
--   'admin',
--   'approved'
-- );
